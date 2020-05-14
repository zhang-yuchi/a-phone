<template>
  <div id="app">

      <!-- <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> -->
      <esriMap></esriMap>

    <router-view/>
  </div>
</template>

<script>
import esriMap from './components/map/map'
export default {
  components:{
    esriMap
  }
}
</script>
<style>
body,html,#app{
  height: 100%;
}
</style>
