//要素映射表:要素-地图
const FeatureMap = [
  {
    map:"gaodemap",
    layers:[
      {
        name:"yxq_mian",
        url:"http://113.54.15.13:6080/arcgis/rest/services/huayan/yxq/MapServer/1",
      },
      {
        name:"yxq_dian",
        url:"http://113.54.15.13:6080/arcgis/rest/services/huayan/yxq/MapServer/0",
      }
    ]
  }
]
export  {FeatureMap}