import {
  FeatureMap
} from './Map'
class Map {
  constructor() {
    this.view = null
    this.baseMap = {}
    this.layers = []
    // this.gaodemap = null
  }
  static config = {
    url: "http://www.nylv.xyz:4000/4.15/init.js",
    css: "http://www.nylv.xyz:4000/4.15/esri/themes/light/main.css"
  }
  //将map和view加入Map实例
  initMap(options) {
    //视窗
    this.view = options.view || null
    if (!this.view) {
      console.warn("在初始化的过程中未绑定view视窗")
    }
    this.modules = options.modules //将需要的模组引入
    this._createGaodeMap()//初始化底图
    this._appendFeatureLayer()
    this.view.map = this.baseMap.gaodemap;
    this.view.ui.remove("attribution") // 去掉右下角 powed by Esri 字样
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

    this.baseMap.gaodemap = new this.modules.ArcGISMap({
      layers: [gaodeLayer]
    });
  }
  //添加图层
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
          name:url.name,
          featureLayer
        })//将这些要素层挂载到map实例上
      })
      this.baseMap[item.map].addMany(layers)
    })
  }
  //总监听
  listenView(){

  }
}

export default Map