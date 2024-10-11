<template>
  <div class="panel">
    <n-scrollbar>
      <IconButtonGroup
        :options="iconOptions"
        size="16"
        @update-value="handleUpdateValue"
      />
    </n-scrollbar>
  </div>
</template>

<script setup lang="tsx">
import { reactive, ref } from "vue";
import { VxeUI } from "vxe-pc-ui";
import { useI18n } from "vue-i18n";
import { useHistoryStore } from "@/stores/modules/history.ts";
const { t } = useI18n();
const historyStore = useHistoryStore();
historyStore.init();

const props = defineProps<{
  chartInstance: any;
}>();
const formData = reactive({
  measure: "time",
  min: "26.2663",
  minUnit: "hr",
  max: "2426.27",
  maxUnit: "hr"
});
const cumOptions = [
  { label: "day", value: "day" },
  { label: "hr", value: "hr" },
  { label: "min", value: "min" },
  { label: "Month", value: "Month" },
  { label: "ms", value: "ms" },
  { label: "sec", value: "sec" },
  { label: "Week", value: "Week" },
  { label: "Year", value: "Year" }
];
const measureOption = [
  { label: t("menu.time"), value: "time" },
  { label: t("menu.pressure"), value: "pressure" }
];

const iconOptions = ref([
  { icon: "tsZoomInS", key: "zoomIn" },
  { icon: "tsZoomResetS", key: "zoomRest" },
  { icon: "tsZoomOutS", key: "zoomOut" },
  { icon: "tsZoomResetVertS", key: "tsZoomResetVertS" },
  { icon: "tsZoomVerticalS", key: "zoomVertical" },
  { icon: "tsZoomHorizontalS", key: "zoomHorizontal" },
  { icon: "VerticalScaleSettingsS", key: "VerticalScaleSettingsS" },
  { icon: "tsSplitterSynchroScalesS", key: "tsSplitterSynchroScalesS" },
  { icon: "tsZoomManualS", key: "tsZoomManualS" },
  { icon: "tsZoomPanningS", key: "tsZoomPanningS" },
  { icon: "tsNavigatorS", key: "tsNavigatorS" },
  { icon: "tsRedoS", key: "tsRedoS" },
  { icon: "tsUndoS", key: "tsUndoS" },
  { icon: "tsZoomHomeMakeDefaultS", key: "tsZoomHomeMakeDefaultS" },
  { icon: "tsZoomDefaultS", key: "tsZoomDefaultS" },
  { icon: "tsDisplayLegendS", key: "tsDisplayLegendS" },
  { icon: "ShowValueS", key: "ShowValueS" }
]);

let zoomHistory = [
  {
    start: 0,
    end: 100
  }
];
// 点击默认还原数据
const restoreData = () => {
  formData.min = "2.77778E-4";
  formData.max = "176.566";
};
//点击应用新的x范围
const okData = () => {
  console.log(formData);
};

const handleUpdateValue = (value: string) => {
  if (props.chartInstance) {
    const actions = new Map([
      ["zoomIn", () => handleZoomIn()],
      ["zoomOut", () => handleZoomOut()],
      ["zoomRest", () => handleReset()],
      ["zoomVertical", () => handleBrushY()],
      ["zoomHorizontal", () => handleBrushX()],
      ["tsZoomManualS", () => handleManual()],
      ["tsRedoS", () => redo()],
      ["tsUndoS", () => undo()],
      ["ShowValueS", () => handleShowData()]
    ]);
    const handler = actions.get(value) || (() => {});
    cancel();
    handler();
  }
};
const handleZoomIn = () => {
  reA();
};
const handleBrushX = () => {
  const options = props.chartInstance.getOption();
  options.toolbox[0].feature.dataZoom.xAxisIndex = null;
  options.toolbox[0].feature.dataZoom.yAxisIndex = "none";
  props.chartInstance.setOption(options, { Merge: true });
  reA();
};
const handleBrushY = () => {
  const options = props.chartInstance.getOption();
  options.toolbox[0].feature.dataZoom.xAxisIndex = "none";
  options.toolbox[0].feature.dataZoom.yAxisIndex = null;
  props.chartInstance.setOption(options, { Merge: true });
  // console.log(options, "optionsY");
  reA();
};
const reA = () => {
  props.chartInstance.on("dataZoom", handleRecord);
  props.chartInstance.dispatchAction({
    type: "takeGlobalCursor",
    key: "dataZoomSelect",
    // 启动或关闭
    dataZoomSelectActive: true
  });
};
const handleRecord = () => {
  const newItem = props.chartInstance.getOption();
  historyStore.create(props.chartInstance.id, newItem);
};
// 缩小
const handleZoomOut = () => {
  cancel();
  props.chartInstance.off("dataZoom", handleRecord);
  if (zoomHistory.length > 1) {
    zoomHistory.pop(); // 弹出当前的缩放状态
  }
  let previousZoom: any = zoomHistory[zoomHistory.length - 1]; // 获取上一次的缩放状态
  props.chartInstance.dispatchAction({
    type: "dataZoom",
    start: previousZoom.start,
    end: previousZoom.end
  });
};

// 还原
const handleReset = () => {
  console.log(props.chartInstance.getOption());
  props.chartInstance.dispatchAction({
    type: "restore"
  });
};

//图例显示
const handleShowData = () => {
  const options = props.chartInstance.getOption();
  const isLegendVisible = options.legend[0].show;
  options.legend[0].show = !isLegendVisible;
  props.chartInstance.setOption(options, { Merge: true });
};
// 最大最小边界改变->弹窗
const handleManual = () => {
  VxeUI.modal.open({
    title: t("menu.scaleRange"),
    showFooter: true,
    width: 400,
    height: "auto",
    slots: {
      default() {
        return (
          <div>
            <vxe-card title={t("menu.limits")}>
              <div className="alltotal">
                <div className="form">
                  <n-form
                    ref="formRef"
                    label-width="auto"
                    size="small"
                    model={formData}
                    require-mark-placement="right-hanging"
                    label-placement="left"
                  >
                    <n-form-item label={t("menu.measure")} path="measure">
                      <n-select
                        v-model:value={formData.measure}
                        options={measureOption}
                      ></n-select>
                    </n-form-item>
                    <n-form-item label={t("menu.min")} path="min">
                      <n-input-group>
                        <n-input v-model:value={formData.min} placeholder=" " />
                        <n-popselect
                          v-model:value={formData.minUnit}
                          options={cumOptions}
                          trigger="click"
                        >
                          <n-button>{formData.minUnit}</n-button>
                        </n-popselect>
                      </n-input-group>
                    </n-form-item>
                    <n-form-item label={t("menu.max")} path="max">
                      <n-input-group>
                        <n-input v-model:value={formData.max} placeholder=" " />
                        <n-popselect
                          v-model:value={formData.maxUnit}
                          options={cumOptions}
                          trigger="click"
                        >
                          <n-button>{formData.maxUnit}</n-button>
                        </n-popselect>
                      </n-input-group>
                    </n-form-item>
                  </n-form>
                </div>
                <div>
                  <n-button onClick={restoreData}>{t("menu.default")}</n-button>
                </div>
              </div>
            </vxe-card>
            <div className="limit-button">
              <n-button size="tiny" className="mar">
                {t("menu.apply")}
              </n-button>
              <n-button size="tiny" className="mar" onClick={okData}>
                {t("menu.ok")}
              </n-button>
              <n-button size="tiny" className="mar">
                {t("menu.cancel")}
              </n-button>
            </div>
          </div>
        );
      }
    }
  });
};
//redo
const redo = () => {
  historyStore.redo(props.chartInstance.id);
  props.chartInstance.setOption(
    historyStore.components[props.chartInstance.id][
      historyStore.components[props.chartInstance.id].length - 1
    ],
    { Merge: false }
  );
};
//undo
const undo = () => {
  historyStore.undo(props.chartInstance.id);
  console.log(historyStore.components, "sisis");
  props.chartInstance.setOption(
    historyStore.components[props.chartInstance.id][
      historyStore.components[props.chartInstance.id].length - 1
    ],
    { Merge: false }
  );
};
// 取消所有事件
const cancel = () => {
  props.chartInstance.dispatchAction({
    type: "brush",
    areas: []
  });
  props.chartInstance.dispatchAction({
    type: "takeGlobalCursor"
  });
};
</script>

<style scoped lang="scss">
.panel {
  width: 30px;
}
.vxe-modal--body {
  background-color: #fff;
}
</style>

<style lang="scss">
.alltotal {
  overflow: auto;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
}
.limit-button {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-end;
}
.mar {
  margin-top: 5px;
  margin-left: 5px;
}
</style>
