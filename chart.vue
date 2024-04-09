<template>
  <div>
    <div id="chart-container"></div>

    <n-button @click="brush">框选区域放大</n-button>
    <n-button @click="zoomWheel">zoom滚动方法缩小(后期拆分)</n-button>
  </div>
</template>
<script setup lang="ts" name="Chart">
import * as d3 from "d3";
import { dataAll } from "./data.ts";
import { onMounted, ref } from "vue";
const width = ref(600);
const height = ref(500);
const marginLeft = ref(50);
const marginRight = ref(30);
const marginBottom = ref(30);
const marginTop = ref(30);
let svg: any; // 保存 SVG 元素
let stage: any;
let target: any;
let gx: any;
let gy: any;
let x: any;
let y: any;
let xAxis: any;
let yAxis: any;
let line: any;
let brushSelector: any; // 保存 brush 选择器
let zoomSelector: any;
onMounted(() => {
  createSvg(dataAll);
});
const createSvg = (dataAll: { time: number; data: number }[]) => {
  svg = d3
    .select("#chart-container")
    .append("svg")
    .attr("width", width.value)
    .attr("height", height.value)
    .attr("viewBox", [0, 0, width.value, height.value])
    .property("value", []);
  // 比例尺 坐标轴
  x = d3
    .scaleLinear()
    .domain(d3.extent(dataAll, (d: any) => d.time)) //定义域
    .range([marginLeft.value, width.value - marginRight.value]); //值域
  xAxis = (g: any, x: any) =>
    g
      .attr("transform", `translate(0,${height.value - marginBottom.value})`)
      .call(d3.axisBottom(x));

  y = d3
    .scaleLinear()
    .domain(d3.extent(dataAll, (d: any) => d.data)) // d3.extent()数组范围程度
    .range([height.value - marginBottom.value, marginTop.value]); //y轴画线从上到下
  yAxis = (g: any, y: any) =>
    g
      .attr("transform", `translate(${marginLeft.value},0)`)
      .call(d3.axisLeft(y));

  // 折线
  line = (linedata: any, x: any, y: any) =>
    d3
      .line()
      .x((d: any) => x(d.time))
      .y((d: any) => y(d.data))(linedata);
  // 坐标轴位置
  gx = svg.append("g").call(xAxis, x);
  gy = svg.append("g").call(yAxis, y);
  // 建立可视区域 生效了但是path没有被剪切不知道为什么=
  // >找到问题：问题不在这，已经建立了剪切路径，是在zoom时path范围问题 已解决：在zoom中直接操作path
  svg
    .append("clipPath")
    .attr("id", "clipRect")
    .append("rect")
    .attr("x", marginLeft.value)
    .attr("y", marginBottom.value)
    .attr("width", width.value - marginLeft.value - marginRight.value)
    .attr("height", height.value - marginTop.value - marginBottom.value);

  //线
  target = svg
    .append("path")
    .attr("clip-path", "url(#clipRect)")
    .attr("fill", "none")
    .attr("stroke", "red")
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("stroke-width", 1.5)
    .attr("d", line(dataAll, x, y));

  zoomSelector = d3
    .zoom()
    .scaleExtent([
      width.value / (width.value + marginRight.value + marginLeft.value),
      Infinity
    ]) //限定缩小范围比框小点
    .translateExtent([
      [0, 0],
      [width.value - marginRight.value, height.value - marginBottom.value]
    ])
    .on("zoom", onZoom);
  brushSelector = d3
    .brush()
    .extent([
      [marginLeft.value, marginBottom.value],
      [width.value, height.value - marginBottom.value]
    ])
    .on("start brush", onBrush)
    .on("end", onEnd);

  return { brushSelector, zoomSelector };
};
function onBrush(event: any) {
  if (event.sourceEvent && event.sourceEvent.type === "zoom") return null;
}

function onZoom(event: any) {
  if (event.sourceEvent && event.sourceEvent.type === "brush") return null;
  const xz = event.transform.rescaleX(x);
  const yz = event.transform.rescaleY(y);
  console.log(x, y, event);
  target.attr("d", line(dataAll, xz, yz));
  gx.call(xAxis, xz);
  gy.call(yAxis, yz);
}
function onEnd(event: any) {
  console.log(event);
  if (event.selection) {
    const [[x0, y0], [x1, y1]] = event.selection; // 获取选中区域的范围
    const xDataRange = [x.invert(x0), x.invert(x1)]; // 获取选中区域在 x 轴上的数据范围
    const yDataRange = [y.invert(y1), y.invert(y0)];
    console.log(xDataRange, yDataRange);
    let newdataAll = filterData(dataAll, xDataRange, yDataRange);
    updateSvg(newdataAll);
    // svg.call(
    //   zoomSelector.transform,
    //   d3.zoomIdentity.translate(-scaledX0, -scaledY0).scale(zoomScale)
    // );
  }
}
// 按钮事件
const brush = () => {
  svg.call(brushSelector);
};
const zoomWheel = () => {
  svg.call(zoomSelector);
};
// 数据更新时重新绘制 SVG 图
function updateSvg(dataAll: any) {
  d3.select("#chart-container").select("svg").remove();
  createSvg(dataAll);
}

// 计算
function filterData(arr: any, valTime: any, valData: any) {
  return arr.filter(
    (item: any) => item.time >= valTime[0] && item.time <= valTime[1]
  );
}
</script>

<style scoped></style>
