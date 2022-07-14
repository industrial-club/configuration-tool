import {
  computed,
  defineComponent,
  inject,
  onUnmounted,
  ref,
  watch,
  Ref,
  nextTick,
} from "vue";
import { fabric } from "fabric";
import { MenuId } from "../config/menus";
import PropertiesForm from "../component/properties-form";
import ThingForm from "../component/thing-form";
import FlowForm from "../component/flow-form";

export default defineComponent({
  setup(props, context) {
    const activeCanvas = inject<Ref<MtipIt.Item>>("activeMtipItItem")!;

    // const activeWidget = ref<fabric.Object>();
    // // 选择部件 (只有选择了一个部件才能操作)
    // const handleWidgetSelect = ({ selected }: any) => {
    //   // 只选择了一个小部件
    //   if (selected.length === 1) {
    //     activeWidget.value = selected[0];
    //   }
    // };
    // 取消选择
    // const handleClearSelect = () => {
    //   activeWidget.value = undefined;
    // };

    // 是否为物实例
    const isThing = computed(() => {
      if (activeCanvas.value?.type === MenuId.thing) {
        return true;
      }
      return false;
    });

    // 给当前活跃的canvas添加选中事件
    // watch(
    //   () => activeCanvas.value,
    //   async (val, oldVal) => {
    //     await nextTick();
    //     if (val) {
    //       val.canvas.on("selection:created", handleWidgetSelect);
    //       val.canvas.on("selection:updated", handleWidgetSelect);
    //       val.canvas.on("selection:cleared", handleClearSelect);
    //     }
    //     if (val !== oldVal) {
    //       oldVal?.canvas.off("selection:created", handleWidgetSelect);
    //       oldVal?.canvas.off("selection:updated", handleWidgetSelect);
    //       oldVal?.canvas.off("selection:cleared", handleClearSelect);
    //     }
    //   }
    // );
    // onUnmounted(() => {
    //   activeCanvas.value?.canvas.off("selection:created", handleWidgetSelect);
    //   activeCanvas.value?.canvas.off("selection:updated", handleWidgetSelect);
    //   activeCanvas.value?.canvas.off("selection:cleared", handleClearSelect);
    // });

    // 处理选中属性后展示到图中
    const handlePropertyChange = ({ checked, property }: any) => {
      const name = `_property_${property.key}`;
      // 选中
      if (checked) {
        // 创建text 值暂时写死
        const text = new fabric.Text(`${property.name}: 100m`, {
          name,
          fill: "#ff0000",
          fontSize: 16,
        });
        activeCanvas.value.canvas.add(text);
        // activeCanvas.value.thingInfo = activeCanvas.value?.thingInfo ?? [];
        // console.log(activeCanvas.value.thingInfo);

        // activeCanvas.value.thingInfo.push(text);
      } else {
        // 移除text
        const textList = activeCanvas.value?.canvas
          .getObjects()
          .filter((item: any) => item.name === name);
        if (textList?.length) activeCanvas.value?.canvas.remove(...textList);
        // const idx = activeCanvas.value.thingInfo.findIndex(
        //   (item: any) => item.name === name
        // );
        // idx !== -1 && activeCanvas.value.thingInfo.splice(idx, 1);
      }
    };

    return () => (
      <div class={"mtip_it_editor_form_box"}>
        {isThing.value ? (
          // 如果选中部件 展示部件属性表单 否则展示实例表单
          // activeWidget.value ? (
          //   <PropertiesForm widget={activeWidget.value} />
          // ) : (
          <ThingForm onPropertyChange={handlePropertyChange} />
        ) : (
          // )
          // <FlowForm widget={activeWidget.value} />
          <a-empty></a-empty>
        )}
      </div>
    );
  },
});
