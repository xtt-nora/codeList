<template>
  <div class="comChart" ref="myChart">
    <div class="chart" :id="id" ref="chartRef" :style="echartsStyle" />
    <Panel :chart-instance="chartInstance" v-show="showPane" />
  </div>
</template>

<script setup lang="ts" name="chart">
import {
  computed,
  ref,
  watch,
  markRaw,
  onMounted,
  onBeforeUnmount,
  nextTick
} from "vue";
import echarts, { ECOption } from "./config";
import { ECElementEvent, EChartsType } from "echarts/core";
import { useDebounceFn } from "@vueuse/core";
import { useGlobalStore } from "../../stores/modules/global";
import { useHistoryStore } from "../../stores/modules/history";
import { storeToRefs } from "pinia";
import Panel from "./panel/index.vue";
const historyStore = useHistoryStore();
interface Props {
  option: ECOption;
  renderer?: "canvas" | "svg";
  resize?: boolean;
  id?: string;
  theme?: Object | string;
  width?: number | string;
  height?: number | string;
  onClick?: (event: ECElementEvent) => any;
  showPane?: boolean;
  onClickZr?: (event: ECElementEvent) => any;
}

const props = withDefaults(defineProps<Props>(), {
  renderer: "canvas",
  resize: true,
  id: "echarts",
  showPane: true
});

const echartsStyle = computed(() => {
  return props.width || props.height
    ? { height: props.height + "px", width: props.width + "px" }
    : { height: "100%", width: "100%" };
});

// 这个新增的监听事件是为了监听拖动窗口大小改变， 普通的resize方法并不能监听到该动作
const myChart = ref<Element | null>();
let observer: ResizeObserver | null = null;

const chartRef = ref<HTMLDivElement | HTMLCanvasElement>();
const chartInstance = ref<EChartsType>();

const draw = () => {
  if (chartInstance.value) {
    chartInstance.value.setOption(props.option, { notMerge: true });
  }
};

watch(props, () => {
  draw();
});

// 点击数据点事件
const handleClick = (event: ECElementEvent) =>
  props.onClick && props.onClick(event);

// 点击canvas任意区域事件
const hanleClickZr = (event: ECElementEvent) =>
  props.onClickZr && props.onClickZr(event);

const init = () => {
  if (!chartRef.value) return;
  chartInstance.value = echarts.getInstanceByDom(chartRef.value);
  if (!chartInstance.value) {
    chartInstance.value = markRaw(
      echarts.init(chartRef.value, props.theme, {
        renderer: props.renderer,
        locale: "ZH"
      })
    );
    chartInstance.value.on("click", handleClick);
    chartInstance.value.getZr().on("click", hanleClickZr);
    draw();
    historyStore.baseItems[chartInstance.value.id] = [
      chartInstance.value?.getOption()
    ];
  }
};

const resize = () => {
  if (chartInstance.value && props.resize) {
    chartInstance.value.resize({ animation: { duration: 500 } });
  }
};

const debouncedResize = useDebounceFn(resize, 50);

onMounted(() => {
  nextTick(() => init());
  window.addEventListener("resize", debouncedResize);
  if (myChart.value) {
    observer = new ResizeObserver(debouncedResize);
    observer.observe(myChart.value);
  }
});

onBeforeUnmount(() => {
  chartInstance.value?.dispose();
  window.removeEventListener("resize", debouncedResize);
  if (observer) {
    observer.disconnect();
  }
});

const globalStore = useGlobalStore();
const { isExpand } = storeToRefs(globalStore);

watch(
  () => [isExpand],
  () => {
    debouncedResize();
  },
  { deep: true }
);

// const updateCurTab = (key: number) => {
//   curTab.value = key;
//   globalStore.setGlobalState("leftSide", key);
// };
defineExpose({
  getInstance: () => chartInstance.value,
  resize,
  draw,
  debouncedResize
});
</script>
<style scoped lang="scss">
@import "./index.scss";
</style>
