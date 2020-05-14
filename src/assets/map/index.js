class Map {
  constructor() {
    this.config = {
      url: "http://www.nylv.xyz:4000/4.15/init.js",
      css: "http://www.nylv.xyz:4000/4.15/esri/themes/light/main.css"
    }
    this.map = null
    this.view = null
    this.gaodemap = null
  }
  //将map和view加入Map实例
  initMap(options) {
    this.view = options.view || null
    this.map = options.map || null
  }
  static test() {
    //静态方法 无法调用this中的属性
  }
  test() {
    //动态方法 可以调用this
  }

  createMap(BaseTileLayer,esriRequest,ArcGISMap) {

    var GaodeLayer = BaseTileLayer.createSubclass({
      properties: {
        urlTemplate: null,
      },
      getTileUrl: function (level, row, col) {
        return  'http://webrd0' + (col % 4 + 1) + '.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x=' + col + '&y=' + row + '&z=' + level;
      },
      fetchTile: function (level, row, col) {
        var url = this.getTileUrl(level, row, col);
        return esriRequest(url, {
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

    this.gaodemap = new ArcGISMap({
      layers: [gaodeLayer]
    });
  }
}

export default Map