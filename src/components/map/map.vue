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
    // lazy load the required ArcGIS API for JavaScript modules and CSS
    loadModules(
      [
        "esri/Map",
        "esri/views/MapView",
        "esri/layers/BaseTileLayer",
        "esri/request",
        "esri/layers/FeatureLayer"
      ],
      { css: true },
      {
        url: esriMap.config.url,
        css: esriMap.config.css
      }
    ).then(([ArcGISMap, MapView, BaseTileLayer, esriRequest, FeatureLayer]) => {
      var esrimap = new esriMap();//创建地图对象
      this.view = new MapView({
        container: this.$el,
        map: null,
        center: [104.818, 31.517],
        zoom: 12, //min 3   max 18
        constraints: {
          minZoom: 3,
          maxZoom: 18
        }
      });
      //地图的初始化
      esrimap.initMap({
        view: this.view,
        modules: {
          ArcGISMap,
          MapView,
          BaseTileLayer,
          esriRequest,
          FeatureLayer
        }
      });
      //监听
      esrimap.listenView()
      console.log(esrimap);
    });
  },
  beforeDestroy() {
    if (this.view) {
      // destroy the map view
      this.view.container = null;
    }
  }
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