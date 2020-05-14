class Map {
  constructor(){
    this.config = {
      url:"http://www.nylv.xyz:4000/4.15/init.js",
      css:"http://www.nylv.xyz:4000/4.15/esri/themes/light/main.css"
    }
    this.map = null
    this.view = null
  }
  initMap(options){
    this.view = options.view||null
    this.map = options.map || null
  }
}

export default Map