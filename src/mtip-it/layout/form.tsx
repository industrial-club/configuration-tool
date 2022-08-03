import { computed, defineComponent, inject, ref, watch, Ref, VNode } from "vue";
import useActiveWidget from "../hooks/useActiveWidget";
import { fabric } from "fabric";
import PropertiesForm from "../component/properties-form";
import ThingForm from "../component/thing-form";
import CanvasForm from "../component/canvas-form";
import * as api from "@/mtip-it/api/form";

export default defineComponent({
  emits: ["addElement", "removeElement", "save"],
  setup(props, { emit }) {
    const activeCanvas = inject<Ref<MtipIt.Item>>("activeMtipItItem")!;
    const activeWidget = useActiveWidget(activeCanvas);

    // 获取设备的属性列表
    const thingPropertyList = ref({ instanceId: undefined, list: [] });
    watch(activeWidget, async (val) => {
      if (
        val &&
        val.effectType === "svg" &&
        val.instanceId !== thingPropertyList.value.instanceId
      ) {
        const { data } = await api.getThingPropList(val.instanceId);
        thingPropertyList.value = { instanceId: val.instanceId, list: data };
      }
    });

    // 保存
    const handleSave = () => {
      console.log("保存");
    };

    return () => {
      let content: VNode;
      // 没有选中部件 展示画布表单
      if (activeWidget.value) {
        // 选中了设备 展示设备表单
        if (activeWidget.value.effectType === "svg") {
          content = (
            <ThingForm
              widget={activeWidget.value}
              proptyList={thingPropertyList.value.list}
            />
          );
        } else {
          // 选中其他(文字、线) 展示动态属性表单
          content = <PropertiesForm widget={activeWidget.value} />;
        }
      } else {
        content = <CanvasForm />;
      }

      return <div class={"mtip_it_editor_form_box"}>{content}</div>;
    };
  },
});
