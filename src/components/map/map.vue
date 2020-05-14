<template>
  <div></div>
</template>

<script>
import { loadModules } from "esri-loader";
import esriMap from "../../assets/map/index";
console.log(esriMap);
export default {
  name: "web-map",
  mounted() {
    const esrimap = new esriMap();
    // lazy load the required ArcGIS API for JavaScript modules and CSS
    loadModules(
      ["esri/Map", "esri/views/MapView", "esri/layers/BaseTileLayer",  "esri/request"],
      { css: true },
      {
        url: esrimap.config.url,
        css: esrimap.config.css
      }
    ).then(([ArcGISMap, MapView, BaseTileLayer, esriRequest]) => {

      // const map = new ArcGISMap({
      //   basemap: "topo-vector"
      // });

      var newmap = new esriMap()
      newmap.createMap(BaseTileLayer,esriRequest,ArcGISMap)

      this.view = new MapView({
        container: this.$el,
        map: newmap.gaodemap,
        center: [103.0419678465576,30.01008405698828],
        zoom: 12,                 //min 3   max 18
        constraints:{
          minZoom:3,
          maxZoom:18
        }
      });

      this.view.ui.remove("attribution")  // 去掉右下角 powed by Esri 字样
      console.log(this.view)
    });
  },
  beforeDestroy() {
    if (this.view) {
      // destroy the map view
      this.view.container = null;
    }
  },
};
</script>

<style scoped>
div {
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
}
</style>