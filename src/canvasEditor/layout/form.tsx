import {
  computed,
  defineComponent,
  onUnmounted,
  PropType,
  ref,
  watch,
} from "vue";
import { fabric } from "fabric";
import { CanvasInfo } from "..";
import { MenuId } from "../config/menus";
import PropertiesForm from "../components/properties-form";

export default defineComponent({
  props: {
    avtiveCanvas: {
      type: Object as PropType<CanvasInfo>,
    },
  },
  setup(props, context) {
    const activeWidget = ref<fabric.Object>();
    // 选择部件 (只有选择了一个部件才能操作)
    const handleWidgetSelect = ({ selected }: any) => {
      // 只选择了一个小部件
      if (selected.length === 1) {
        activeWidget.value = selected[0];
        activeWidget.value!.on("event:modified", (e) => {
          console.log(e);
        });
      }
    };
    // 取消选择
    const handleClearSelect = () => {
      activeWidget.value = undefined;
    };

    // 是否为物实例
    const isThing = computed(() => {
      if (!props.avtiveCanvas?.canvas) return false;
      if (props.avtiveCanvas.canvas.TabInfo.menuInfo.id === MenuId.newThing) {
        return true;
      }
      return false;
    });

    // 给当前活跃的canvas添加选中事件
    watch(
      () => props.avtiveCanvas,
      (val, oldVal) => {
        if (val) {
          val.canvas.on("selection:created", handleWidgetSelect);
          val.canvas.on("selection:updated", handleWidgetSelect);
          val.canvas.on("selection:cleared", handleClearSelect);
        }
        if (val !== oldVal) {
          oldVal?.canvas.off("selection:created", handleWidgetSelect);
          oldVal?.canvas.off("selection:updated", handleWidgetSelect);
          oldVal?.canvas.off("selection:cleared", handleClearSelect);
        }
      }
    );
    onUnmounted(() => {
      props.avtiveCanvas?.canvas.off("selection:created", handleWidgetSelect);
      props.avtiveCanvas?.canvas.off("selection:updated", handleWidgetSelect);
      props.avtiveCanvas?.canvas.off("selection:cleared", handleClearSelect);
    });

    return () => (
      <div class={"canvas_editor_form_box"}>
        {isThing.value ? (
          <PropertiesForm widget={activeWidget.value} />
        ) : (
          <div>流程图</div>
        )}
      </div>
    );
  },
});
