import { defineStore } from "pinia";
import { useHistory } from "@/hooks/useHistory.ts";
import { remove as _remove, cloneDeep } from "lodash-es";
import { ref } from "vue";

export const useHistoryStore = defineStore("history", () => {
  let {
    state: components,
    update: updateComponents,
    undo,
    redo,
    undoStackCollect,
    undoStackPointerCollect,
    enable
  } = useHistory({});

  const baseItems = ref({});

  function create(group: keyof typeof baseItems, item: any) {
    updateComponents(
      group,
      components => {
        components.push(item);
      },
      "新增节点"
    );
  }
  function set(group: keyof typeof baseItems, value: any[]) {
    components.value[group] = value;
  }

  function init() {
    setTimeout(() => {
      // 恢复默认项，或者初始化其他逻辑
      components.value = cloneDeep(baseItems.value);
      enable();
    }, 1000);
  }

  return {
    baseItems,
    create,
    set,
    init,
    components,
    updateComponents,
    undo,
    redo,
    undoStackCollect,
    undoStackPointerCollect
  };
});
