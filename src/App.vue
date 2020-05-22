<template>
  <div id="app">
    <div class="search">
      <input type="text" class="search-input" v-model="query" @input="search(query)">
      <div class="search-res">
        <div class="result-block" v-for="(item,index) in Result" @click="MoveTo(index)" :key="index">
          {{item}}
        </div>
      </div>
    </div>
    <esriMap @loadedMap="mountMap" @click_highlight="whenClick"></esriMap>
    <div class="controller">
      <div class="controller-block">
        <div class="title">图层切换</div>
        <span>2D图层</span><br>
        <label for class="hidden-controller" v-for="(item,index) in this.baseMap['2d']" :key="item.field">
          <button @click="changeLayerState(item,index,'2d')">{{item.name}}</button>
          <br />
        </label>
        <span>3D图层</span><br>
        <label for class="hidden-controller" v-for="(item,index) in this.baseMap['3d']" :key="item.field">
          <button @click="changeLayerState(item,index,'3d')">{{item.name}}</button>
          <br />
        </label>
      </div>
      <div class="controller-block">
        <div class="title">图层隐藏和显示</div>
        <label for class="hidden-controller" v-for="(item,index) in this.layers" :key="index">
          <input type="checkbox" :checked="item.visible" @change="changeLayerHidden(item,index)" />
          {{item.name}}
          <br />
        </label>
      </div>
    </div>
    <router-view />
  </div>
</template>

<script>
import esriMap from "./components/map/map";
export default {
  components: {
    esriMap
  },
  data: () => {
    return {
      map:{},
      layers:[],
      baseMap:{
        "2d":[],
        "3d":[]
      },
      query:"",
      searchResult:[]
    };
  },
  computed: {
    Result(){
      console.log(this.searchResult);
      let res = this.searchResult.map(item=>{
        return item.feature.attributes.Name?item.feature.attributes.Name:item.feature.attributes.bianhao
      })
      return res
    }
  },
  watch:{
    map(){
      this.layers = this.map.getCurLayerFeature().map(item=>{
        item.visible = true;
        return item
      })
    }
  },
  methods: {
    //将map对象挂载到父组件,进行操作
    mountMap(map) {
      this.map = map;
      let arr = this.map.filterMap("2d").map(key => {
        return this.map.getBaseMapInfo(key)
      });
      this.baseMap['2d'] = this.map.filterMap('2d').map(item=>{
        return this.map.getBaseMapInfo(item)
      })
      this.baseMap['3d'] = this.map.filterMap('3d').map(item=>{
        return this.map.getBaseMapInfo(item)
      })
    },
    changeLayerState(item, index ,pattern) {
      //切换图层
      this.map.baseMapToggle(item.field,pattern)
      this.layers = this.map.getCurLayerFeature().map(item=>{
        item.visible = true;
        return item
      })
    },
    changeLayerHidden(item, index) {
      //图层隐藏
      item.visible = this.map.featureHidden(item.featureLayer)
    },
    search(query){
      this.map.queryFeature(this.map.currentBaseMap,query).then(res=>{
        this.searchResult = res.results
      })
    },
    MoveTo(index){
      console.log(index);
      this.map.mapMoveByElement(this.searchResult[index]).then(res=>{
        console.log(res.features[0].attributes);
      })
    },
    whenClick(graphic){
      console.log(graphic.attributes);
    }
  },
  mounted: () => {}
};
</script>
<style>
body,
html,
#app {
  height: 100%;
}
.search{
  z-index: 50;
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
}
.search-input{
  padding: 10px ;
}
/* .search-res{
  background-color: black;
  height: 50px;
} */
.controller {
  background-color: white;
  padding: 30px;
  position: absolute;
  top: 30px;
  right: 30px;
}
.title {
  font-size: 18px;
}
.hidden-controller {
  font-size: 18px;
}
.search-res{
  max-height: 100px;
  overflow: auto;
}
.result-block{
  cursor: pointer;
  font-size: 15px;
  box-sizing: border-box;
  width: 100%;
  background-color: white;
  border-bottom: 1px solid #f1f1f1;
  padding: 2px;
}
.result-block:hover{
  background-color: #f1f1f1;
}

</style>
