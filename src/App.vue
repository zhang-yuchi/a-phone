<template>
  <div id="app">
    <esriMap></esriMap>
    <router-view />
  </div>
</template>

<script>
import esriMap from "./components/map/map";
export default {
  components: {
    esriMap
  }
};
</script>
<style>
body,
html,
#app {
  height: 100%;
}
</style>
