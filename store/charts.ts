import { defineStore } from "pinia";
import { ref } from "vue";
import piniaPersisConfig from "@/stores/helper/persist";
export const useChartsStore = defineStore(
  "charts",
  () => {
    const charts = ref({});
    const selectCharts = ref({});
    function saveCharts(chartId: string, chartRef: any) {
      charts.value[chartId] = chartRef;
    }
    function getCharts(chartId: string) {
      selectCharts.value = charts.value[chartId];
    }
    return { charts, selectCharts, saveCharts, getCharts };
  },
  {
    persist: piniaPersisConfig("charts")
  }
);
