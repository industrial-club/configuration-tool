import "./style/index.less";
import {
  defineComponent,
  nextTick,
  onMounted,
  PropType,
  provide,
  ref,
  watch,
} from "vue";
import { omit } from "lodash";
import { fabric } from "fabric";
import { message } from "ant-design-vue";
import { create, createFlow } from "./config/createCanvas";
import things from "@/mtip-it/config/thingList2";
import editorConter from "./layout/editorConter";
import editorForm from "./layout/form";
import thingPlane from "./layout/thingPlane";
import canvasEditorTop from "./layout/canvasEditorTop";
import previewDom from "./component/preview";
import * as thingApi from "./api/thing";
import api from "@/mtip-it/api";

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
    const thingList = ref<MtipIt.ThingGroupList>([]);
    const getThingList = async () => {
      const { data } = await thingApi.getThingList();
      if (!data) return;

      // 转换thingInfo属性
      for (const group of data) {
        if (!group.elements) continue;
        for (let i = 0; i < group.elements.length; i++) {
          const element = group.elements[i];

          const thingInfo = element.style ? JSON.parse(element.style) : {};
          group.elements[i] = {
            ...group.elements[i],
            ...omit(thingInfo, "id"),
          };
        }
      }
      data[0].elements.forEach((ele: any) => {
        ele.image_run = ele.image_run.replace("http://192.168.5.234:9001", "");
      });
      thingList.value = data;
    };
    onMounted(getThingList);

    // canvasList
    const canvasList = ref<Array<MtipIt.Item>>(allIts);

    // 设置选中thingid
    const thingId = ref("");

    let flowCanvas = createFlow();
    canvasList.value.push(flowCanvas);
    if (canvasList.value.length > 0) {
      thingId.value = canvasList.value[0].id;
    }
    onMounted(async () => {
      const res: any = await api.get(
        "/thing/v1/adapter/thing/inst/queryTopoMap"
      );
      const json = JSON.parse(res.data.style);
      flowCanvas.canvas.loadFromJSON(json);
      if (json.zoom) {
        flowCanvas.canvas.setZoom(json.zoom);
      }
      flowCanvas.canvas.renderAll();
    });

    // 获取当前活跃的canvas
    const getActiveCanvas = () => {
      return canvasList.value.find((item) => item.id === thingId.value);
    };

    // 创建当前活跃的canvas
    const activeMtipItItem = ref<MtipIt.Item>();
    provide("activeMtipItItem", activeMtipItItem);
    //
    provide("thingId", thingId);

    // 在当前活跃的canvas上添加元素
    const handleAddElement = (element: fabric.Object) =>
      activeMtipItItem.value?.canvas.add(element);
    // 删除当前活跃的canvas上的元素
    const handleRemoveElement = (elements: fabric.Object[]) =>
      activeMtipItItem.value?.canvas.remove(...elements);

    // 保存当前活跃的canvas的信息
    const handleSave = async (data: MtipIt.Item) => {
      const id = data.thingInfo.id.replace("canvas_", "");
      await thingApi.saveThingInfo(id, data.thingInfo);
      message.success("保存成功");
      getThingList();
    };

    // 动态更新
    watch(
      () => thingId.value,
      () => {
        activeMtipItItem.value = getActiveCanvas();
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
              const eid = `${e.id}`.startsWith("canvas_")
                ? e.id
                : `canvas_${e.id}`;
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
