import { ref, shallowRef, computed } from "vue";
import { applyPatches, produceWithPatches, Patch, enablePatches } from "immer";

enablePatches();

export function useHistory<T extends Record<string, any[]>>(
  baseState: T,
  max = 100
) {
  const undoStack = ref<
    { action: string; patches: Patch[]; inversePatches: Patch[] }[]
  >([]);
  const undoStackPointer = ref(-1);
  const undoable = ref(false);

  // 指针和补丁={换成对象数组} {group:[op]}
  // const undoStackPointerCollect = ref({});
  // const undoStackCollect = ref({});
  const undoStackCollect = ref<
    Record<
      keyof T,
      { action: string; patches: Patch[]; inversePatches: Patch[] }[]
    >
  >({});
  const undoStackPointerCollect = ref<Record<keyof T, number>>({});
  const state = shallowRef(baseState);
  const update = (
    group: keyof T,
    updater: (draft: T[typeof group]) => any,
    action: string
  ) => {
    const [nextState, patches, inversePatches] = produceWithPatches(
      state.value[group],
      updater
    );
    state.value = { ...state.value, [group]: nextState };
    console.log(state, patches, "state");
    if (!undoStackCollect.value[group]) {
      undoStackCollect.value[group] = [];
      undoStackPointerCollect.value[group] = -1;
    }
    console.log(undoStackCollect.value, undoStackPointerCollect.value);
    if (patches.length && inversePatches.length) {
      const pointer = ++undoStackPointerCollect.value[group];
      undoStackCollect.value[group].length = pointer;
      undoStackCollect.value[group][pointer] = {
        action,
        patches,
        inversePatches
      };
      console.log(
        undoStackPointerCollect.value,
        undoStackCollect.value,
        "undoStackCollect"
      );
      if (undoStackCollect.value[group].length > max) {
        const head = undoStackCollect.value[group].shift();
        const currentHead = undoStackCollect.value[group][0];
        if (head && currentHead) {
          currentHead.inversePatches.push(...head.inversePatches);
          currentHead.patches.unshift(...head.patches);
          undoStackPointerCollect.value[group] = max - 1;
        }
      }
    }
  };

  function enable(value = true) {
    undoable.value = value;
  }

  function undo(group: keyof T) {
    if (undoStackPointerCollect.value[group] < 0) return;
    const patches =
      undoStackCollect.value[group][undoStackPointerCollect.value[group]]
        .inversePatches;
    state.value[group] = applyPatches(state.value[group], patches);

    undoStackPointerCollect.value[group]--;
  }

  function redo(group: keyof T) {
    if (
      undoStackPointerCollect.value[group] ===
      undoStackCollect.value[group].length - 1
    )
      return;
    undoStackPointerCollect.value[group]++;
    const patches =
      undoStackCollect.value[group][undoStackPointerCollect.value[group]]
        .patches;
    state.value[group] = applyPatches(state.value[group], patches);
  }
  return {
    state,
    update,
    undo,
    redo,
    undoStackPointerCollect,
    undoStackCollect,
    enable
  };
}
