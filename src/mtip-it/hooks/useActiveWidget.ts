import { nextTick, onBeforeUnmount, Ref, ref, watch } from "vue";

/**
 * 获取当前选中的小部件
 * @param activeCanvas 当前激活的画布
 * @returns
 */
export default function useActiveWidget(activeCanvas: Ref<MtipIt.Item>) {
  const activeWidget = ref<MtipIt.Object>();

  // 选择部件 (只有选择了一个部件才能操作)
  const handleWidgetSelect = ({ selected }: any) => {
    // 只选择了一个小部件
    if (selected.length === 1) {
      activeWidget.value = selected[0];
    }
  };

  // 取消选择
  const handleClearSelect = () => {
    activeWidget.value = undefined;
  };

  // 绑定/解绑 选中事件
  watch(
    activeCanvas,
    async (val, oldVal) => {
      await nextTick();
      // 给新值绑定事件
      if (val) {
        val.canvas.on("selection:created", handleWidgetSelect);
        val.canvas.on("selection:updated", handleWidgetSelect);
        val.canvas.on("selection:cleared", handleClearSelect);
      }
      // 旧值解绑事件
      if (val !== oldVal) {
        oldVal?.canvas.off("selection:created", handleWidgetSelect);
        oldVal?.canvas.off("selection:updated", handleWidgetSelect);
        oldVal?.canvas.off("selection:cleared", handleClearSelect);
      }
    },
    { immediate: true }
  );
  onBeforeUnmount(() => {
    activeCanvas.value?.canvas.off("selection:created", handleWidgetSelect);
    activeCanvas.value?.canvas.off("selection:updated", handleWidgetSelect);
    activeCanvas.value?.canvas.off("selection:cleared", handleClearSelect);
  });
  return activeWidget;
}
