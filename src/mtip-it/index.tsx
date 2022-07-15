import { defineComponent, nextTick, PropType, provide, ref, watch } from "vue";
import { fabric } from "fabric";
import "./style/index.less";
import things from "@/mtip-it/config/thingList2";
import editorConter from "./layout/editorConter";
import editorForm from "./layout/form";
import thingPlane from "./layout/thingPlane";
import canvasEditorTop from "./layout/canvasEditorTop";
import { create, createFlow } from "./config/createCanvas";
import previewDom from "./component/preview";
import { message } from "ant-design-vue";

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
    previewDom,
  },
  setup(prop, context) {
    // 全局类前缀
    const prefix = ref("mtip_it_editor");

    // 实例列表
    const storageThingList = JSON.parse(
      localStorage.getItem("thingList") || "[]"
    );
    const thingList = ref<MtipIt.ThingGroupList>(
      storageThingList.length ? storageThingList : things
    );
    watch(
      thingList,
      (val) => {
        localStorage.setItem("thingList", JSON.stringify(val));
      },
      { immediate: true, deep: true }
    );

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

    // 在当前活跃的canvas上添加元素
    const handleAddElement = (element: fabric.Object) =>
      activeMtipItItem.value?.canvas.add(element);
    // 删除当前活跃的canvas上的元素
    const handleRemoveElement = (elements: fabric.Object[]) =>
      activeMtipItItem.value?.canvas.remove(...elements);

    // 保存当前活跃的canvas的信息
    const handleSave = (data: MtipIt.Item) => {
      const id = data.thingInfo.id;
      for (const item of thingList.value) {
        const idx = item.elements.findIndex((ele) => ele.id === id);
        if (idx > -1) {
          item.elements[idx] = data.thingInfo;
          message.success("保存成功");
          break;
        }
      }
    };

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

    // 预览弹窗数据相关
    const previewVal = ref(false);

    // 所有图表集合
    return () => (
      <div id={prefix.value} class={prefix.value}>
        <canvasEditorTop
          onPreview={(e: MtipIt.MenuItem) => {
            previewVal.value = true;
          }}
        />
        <div class={prefix.value + "_body"}>
          <thingPlane
            thingList={thingList.value}
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
          <editorForm
            onAddElement={handleAddElement}
            onRemoveElement={handleRemoveElement}
            onSave={handleSave}
          />
        </div>
        <previewDom v-models={[[previewVal.value, "val"]]} />
      </div>
    );
  },
});
