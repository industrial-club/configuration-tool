import { defineComponent, nextTick, ref } from "vue";
import { fabric } from "fabric";
import canvasEditor from "./layout/canvas";
import thingPlane from "./layout/thingPlane";
import tabBar from "./layout/tabBar";
import canvasEditorForm from "./layout/form";
import canvasEditorTop from "./layout/canvasEditorTop";
import "./style/index.less";
import { uuid } from "./config";
import events from "./events";
import { MenuId } from "./config/menus";

export interface CanvasInfo {
  canvas: CanvasEditor.Canvas;
  id: string;
  tabInfo?: CanvasEditor.TabItem;
}

export interface TabInfo {
  list: Array<CanvasEditor.TabItem>;
  indexKey: string;
}

export default defineComponent({
  components: {
    canvasEditor,
    thingPlane,
    tabBar,
    canvasEditorForm,
    canvasEditorTop,
  },
  setup(prop, context) {
    // 所有图表集合
    const canvasInfo = ref<Array<CanvasInfo>>([]);

    // tab 合集
    const TabInfo = ref<TabInfo>({
      list: [],
      indexKey: "",
    });

    const createCanvasConfirm = ref<{
      visible: boolean;
      tabInfo: CanvasEditor.MenuItem;
      val: string;
    }>({
      visible: false,
      tabInfo: {} as CanvasEditor.MenuItem,
      val: "",
    });

    // 创建
    const createCustomCanvas = (e: CanvasEditor.MenuItem) => {
      const id = uuid();
      const tabInfo = {
        menuInfo: e,
        name: createCanvasConfirm.value.val,
        id,
        type: e.type,
      };
      TabInfo.value.list.push(tabInfo);
      TabInfo.value.indexKey = id;

      nextTick(() => {
        canvasInfo.value.push({
          id,
          canvas: new fabric.Canvas(id) as CanvasEditor.Canvas,
        });
        events(
          canvasInfo.value.find((item) => item.id === id)?.canvas!,
          tabInfo
        );
      });
    };

    const test = () => {
      createCanvasConfirm.value.val = "测试Tab";
      createCustomCanvas({
        id: MenuId.newXflow,
        name: "测试tab",
        event() {},
        type: "item",
      });
      nextTick(() => {
        createCanvasConfirm.value.val = "";
      });
    };
    test();
    return () => (
      <div class={"canvas_editor"}>
        <canvasEditorTop
          tabsActiveIndex={TabInfo.value.indexKey}
          canvasInfo={canvasInfo.value}
          onNewCanvas={(e: CanvasEditor.MenuItem) => {
            createCanvasConfirm.value.visible = true;
            createCanvasConfirm.value.tabInfo = e;
          }}
        />
        <div class={"canvas_editor_conter"}>
          <thingPlane />
          <div class={"canvas_editor_ct_box"}>
            <tabBar
              tabsActiveIndex={TabInfo.value.indexKey}
              tabs={TabInfo.value.list}
              onChange={(e: string) => {
                TabInfo.value.indexKey = e;
              }}
            />
            <canvasEditor
              tabsActiveIndex={TabInfo.value.indexKey}
              tabs={TabInfo.value.list}
            />
          </div>
          <canvasEditorForm
            tabsActiveIndex={TabInfo.value.indexKey}
            canvasInfo={canvasInfo.value}
          />
        </div>

        <a-modal
          v-models={[[createCanvasConfirm.value.visible, "visible"]]}
          title={createCanvasConfirm.value.tabInfo.name}
          onOk={() => {
            createCustomCanvas(createCanvasConfirm.value.tabInfo);
            nextTick(() => {
              createCanvasConfirm.value.visible = false;
              createCanvasConfirm.value.val = "";
            });
          }}
        >
          <a-input
            v-models={[[createCanvasConfirm.value.val, "value"]]}
            placeholder="请输入..."
          />
        </a-modal>
      </div>
    );
  },
});
