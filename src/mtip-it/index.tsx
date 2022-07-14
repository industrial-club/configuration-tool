import { defineComponent, nextTick, PropType, provide, ref, watch } from "vue";
import { fabric } from "fabric";
import "./style/index.less";
import editorConter from "./layout/editorConter";
import editorForm from "./layout/form";
import thingPlane from "./layout/thingPlane";
import canvasEditorTop from "./layout/canvasEditorTop";
import { create, createFlow } from "./config/createCanvas";

const allIts: Array<MtipIt.Item> = [];

export default defineComponent({
  props: {
    allIts: {
      type: Array as PropType<Array<MtipIt.Item>>,
      default: allIts,
    },
  },
  components: {
    editorConter,
    thingPlane,
    editorForm,
    canvasEditorTop,
  },
  setup(prop, context) {
    // 全局类前缀
    const prefix = ref("mtip_it_editor");

    // canvasList
    const canvasList = ref<Array<MtipIt.Item>>(allIts);

    // 设置选中thingid
    const thingId = ref("");
    const flowCanvas = createFlow();

    // 获取当前活跃的canvas
    const getActiveCanvas = () => {
      return canvasList.value.find((item) => item.id === thingId.value);
    };

    // 创建当前活跃的canvas
    const activeMtipItItem = ref<MtipIt.Item>();
    provide("activeMtipItItem", activeMtipItItem);
    //
    provide("thingId", thingId);
    canvasList.value.push(flowCanvas);
    if (canvasList.value.length > 0) {
      thingId.value = canvasList.value[0].id;
    }

    // 动态更新
    watch(
      () => thingId.value,
      () => {
        activeMtipItItem.value = getActiveCanvas();
        console.log(activeMtipItItem.value);
      },
      {
        immediate: true,
      }
    );

    // 所有图表集合
    return () => (
      <div id={prefix.value} class={prefix.value}>
        <canvasEditorTop />
        <div class={prefix.value + "_body"}>
          <thingPlane
            onOpenThing={(e: MtipIt.ThingItem) => {
              const eid = `canvas_${e.id}`;
              e.id = eid;
              const canvasItem = create(e);
              let status = false;
              for (let i of canvasList.value) {
                if (i.id === eid) {
                  status = true;
                }
              }

              // 防止重复加载
              if (!status) {
                thingId.value = canvasItem.id;
                canvasList.value.push(canvasItem);
              }
            }}
          />
          <editorConter mtipIts={canvasList.value} val={thingId.value} />
          <editorForm />
        </div>
      </div>
    );
  },
});