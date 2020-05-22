import {
  FeatureMap
} from './Map'
class Map {
  constructor() {
    this.view = null
    this.baseMap = {}
    this.layers = []
    this.scale = 12
    this.highlight = null
    this.currentBaseMap = "gaodemap"
    this.currentView = {
      MapView: null,
      sceneView: null,
      activeView: null,
      pattern: '2d' //用于底图切换
    }
    this.listener = {
      '2d': {
        'click': []
      },
      '3d': []
    }
  }
  static config = {
    url: "http://www.nylv.xyz:4000/4.15/init.js",
    css: "http://www.nylv.xyz:4000/4.15/esri/themes/light/main.css",
    MapServerUrl: "http://113.54.15.13:6080/arcgis/rest/services/huayan/yxq/MapServer"
  }
  //将map和view加入Map实例
  initMap(options) {
    //视窗
    this.view = options.view || null
    if (!this.view) {
      console.warn("在初始化的过程中未绑定view视窗")
    }
    this.modules = options.modules //将需要的模组引入
    this._initBaseMap()
    this._appendFeatureLayer()
    // this.currentView.activeView = this.baseMap['gaodemap'].map//默认为高德地图
    this._createView(this.baseMap['satellite3D'].map) //创建3D图层,不挂载
    this.currentView.MapView = this.view //绑定2D图层
    this.currentView.activeView = this.currentView.MapView
    this.currentView.activeView.map = this.baseMap['gaodemap'].map;
    this.scale = this.currentView.activeView.scale
    this.currentView.activeView.ui.remove("attribution") // 去掉右下角 powed by Esri 字样
  }
  //将所有底图预先加载到baseMap中
  _initBaseMap() {
    //加载自定义底图
    this._createGaodeMap() //初始化高德底图
    //加载官方底图
    //卫星底图,2D
    var satellite2D = new this.modules.WebMap({
      basemap: "hybrid"
    });
    var satellite3D = new this.modules.WebScene({
      basemap: "hybrid"
    })
    this._appendBaseMap(satellite2D, 'satellite2D', '卫星影像', '2d')
    this._appendBaseMap(satellite3D, 'satellite3D', '卫星影像', '3d')

  }
  //创建高德地图的底图
  _createGaodeMap() {
    const that = this
    var GaodeLayer = this.modules.BaseTileLayer.createSubclass({
      properties: {
        urlTemplate: null,
      },
      getTileUrl: function (level, row, col) {
        return 'http://webrd0' + (col % 4 + 1) + '.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x=' + col + '&y=' + row + '&z=' + level;
      },
      fetchTile: function (level, row, col) {
        var url = this.getTileUrl(level, row, col);
        return that.modules.esriRequest(url, {
            responseType: "image"
          })
          .then(function (response) {

            var image = response.data;
            var width = this.tileInfo.size[0];
            var height = this.tileInfo.size[0];

            var canvas = document.createElement("canvas");
            var context = canvas.getContext("2d");
            canvas.width = width;
            canvas.height = height;
            context.drawImage(image, 0, 0, width, height);
            return canvas;
          }.bind(this));
      }
    })
    //新建矢量图层
    var gaodeLayer = new GaodeLayer();

    let gaodemap = new this.modules.ArcGISMap({
      layers: [gaodeLayer]
    });
    this._appendBaseMap(gaodemap, 'gaodemap', '高德地图', '2d')
  }
  //创建3D图层
  _createView(map) {
    this.currentView.sceneView = new this.modules.SceneView({
      container: null,
      map: map
    })
  }
  //添加要素图层
  _appendFeatureLayer() {
    FeatureMap.map(item => {
      let layers = []
      item.layers.map(url => {
        let featureLayer = new this.modules.FeatureLayer({
          url: url.url,
          outFields: ["*"]
        })
        layers.push(featureLayer)
        this.layers.push({
          name: url.name,
          featureLayer,
          url: url.url,
          id: this._getId(url.url),
          belongs: item.map
        }) //将这些要素层挂载到map实例上
      })
      this.baseMap[item.map].map.addMany(layers)
    })
  }
  //获取图层id
  _getId(url) {
    let id = ''
    for (let i = url.length - 1; i > 0; i--) {
      if (url[i] === '/') {
        id = url.substring(i + 1);
        break
      }
    }
    // console.log(id);
    return parseInt(id)
  }
  //添加一个底图图层  只建议通过这个方法增加底图
  _appendBaseMap(map, field, name, type) {
    this.baseMap[field] = {
      map,
      field,
      name,
      type
    }
  }
  //获取所有的2D或3D底图    
  //pattern 支持2d 3d 两个参数,小写
  filterMap(pattern) {
    let mapList = Object.keys(this.baseMap).filter(key => {
      if (this.baseMap[key].type === pattern) {
        return this.baseMap[key]
      }
    })
    return mapList
  }
  //通过basemap的key获取具体信息
  getBaseMapInfo(key) {
    return this.baseMap[key]
  }
  //转换图层
  baseMapToggle(map, type) {
    //改变 pattern 
    //与当前的模式对比 如果不同则需要转换view 若相同则只需要改变底图
    const pattern = this.currentView.pattern
    if (pattern === '2d' && type === '2d') {
      //同为2D图层
      this.currentView.activeView.map = this.baseMap[map].map
    } else if (pattern === '3d' && type === '3d') {
      //同为3D图层
      this.currentView.activeView.map = this.baseMap[map].map
    } else {
      //不同图层之间切换
      var activeViewpoint = this.currentView.activeView.viewpoint.clone();
      const container = this.currentView.activeView.container
      this.currentView.activeView.container = null
      if (type === '2d') {
        this.currentView.pattern = '2d'
        //需要切换成2D图层,当前为3D图层
        this.currentView.activeView = this.currentView.MapView
      } else if (type === '3d') {
        //需要切换成3D图层,当前为2D图层
        this.currentView.pattern = '3d'
        this.currentView.activeView = this.currentView.sceneView
      }
      this.currentView.activeView.viewpoint = activeViewpoint
      this.currentView.activeView.map = this.baseMap[map].map
      this.currentView.activeView.container = container;
    }
    this.currentBaseMap = map;
  }
  //获取当前底图下的要素层
  getCurLayerFeature() {
    let arr = this.layers.filter(item => {
      return item.belongs === this.currentBaseMap
    })
    return arr
  }
  //隐藏一个图层并且返回当前该图层的状态
  featureHidden(featureLayer) {
    featureLayer.visible = !featureLayer.visible
    return featureLayer.visible
  }
  //利用findtask实现多图层查找
  queryFeature(map, query) {
    //获取当前显示的图层
    return new Promise((resolve, reject) => {
      let Features = this.layers.filter(item => {
        return item.belongs === map && item.featureLayer.visible
      })
      let allLayerIds = Features.map(item => {
        return item.id
      })
      var findTask = new this.modules.FindTask(Map.config.MapServerUrl);
      var findParameters = new this.modules.FindParameters({
        returnGeometry: true,
        contains: true,
        layerIds: allLayerIds,
        searchText: query
      }); //创建FindParameters
      findTask.execute(findParameters).then(res => {
        resolve(res)
      })
    })


  }
  //通过要素移动图层 (2D暂时)
  mapMoveByElement(element) {
    return new Promise((resolve, reject) => {
      //传入一个FeatureSet对象
      let feature = element.feature.geometry
      let primaryKey = Object.keys(element.feature.attributes)[0]
      let queryString = `${primaryKey} = ${element.feature.attributes[primaryKey]}`
      const view = this.currentView.MapView
      view.goTo({
        target: feature,
        zoom: 12
      })
      //找到被查询的图层
      let layer = this.layers.find((layer) => {
        return layer.id === element.layerId && layer.belongs === this.currentBaseMap;
      })['featureLayer']
      // console.log(layer);
      layer.queryFeatures({
        where: queryString,
        returnGeometry: true,
        outFields: ['*']
      }).then(res => {
        view.whenLayerView(layer).then(layerView => {
          if(this.highlight){
            this.highlight.remove()
          }
          this.highlight = this.hightLightFeature(res.features, layerView, 'uid')
          resolve(res)
        })
      })
      .catch(err=>{
        reject(err)
      })
    })
  }
  //高亮要素层
  hightLightFeature(element, target, type) {
    //type  可选字段:uid,target
    const view = this.currentView.MapView
    if (type === 'uid') {
      return target.highlight(element)
    } else if (type === 'graphic') {
      return target.highlight(element)
    } else {
      console.warn("please choose 'uid' or 'graphic' as your type field to highlight the view")
    }
    return null
  }
  //总监听
  listenView(Vue) {
    this.currentView.MapView.on("click", (event) => {
      this._2D_click_hight(event, Vue)
      this.listener['2d']['click'].map(item => {
        item(event, Vue)
      })
    })
  }
  _2D_click_hight(event, Vue) {
    this.currentView.MapView.hitTest(event).then((response) => {
      if (response.results[0]) {
        if (this.highlight) {
          this.highlight.remove()
        }
        var graphic = response.results[0].graphic
        // var graphic = response.results[0].graphic;
        this.currentView.MapView.whenLayerView(graphic.layer).then((lyrView) => {
          // this.highlight = lyrView.highlight(graphic);
          this.highlight = this.hightLightFeature(graphic, lyrView, 'graphic')
          Vue.$emit('click_highlight', graphic)
        })
      }
    })
  }
}
export default Map