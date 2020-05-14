class Map {
  constructor(){
    this.config = {
      url:"http://www.nylv.xyz:4000/4.15/init.js",
      css:"http://www.nylv.xyz:4000/4.15/esri/themes/light/main.css"
    }
    this.map = null
    this.view = null
  }
  //将map和view加入Map实例
  initMap(options){
    this.view = options.view||null
    this.map = options.map || null
  }
  static function test(){
    //静态方法 无法调用this中的属性
  }
  test(){
    //动态方法 可以调用this
  }
}

export default Map