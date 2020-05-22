//要素映射表:要素-地图
const FeatureMap = [
  {
    map:"gaodemap",
    layers:[
      {
        name:"游仙区面图层",
        url:"http://113.54.15.13:6080/arcgis/rest/services/huayan/yxq/MapServer/1",
      },
      {
        name:"游仙区点图层",
        url:"http://113.54.15.13:6080/arcgis/rest/services/huayan/yxq/MapServer/0",
      }
    ]
  },
  {
    map:"satellite2D",
    layers:[
      {
        name:"卫星下的面图层",
        url:"http://113.54.15.13:6080/arcgis/rest/services/huayan/yxq/MapServer/1",
      },
    ]
  }
]
export  {FeatureMap}