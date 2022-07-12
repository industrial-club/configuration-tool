import { computed, defineComponent, nextTick, ref } from "vue";
import { fabric } from "fabric";
import { message } from "ant-design-vue";
import canvasEditor from "./layout/canvas";
import thingPlane from "./layout/thingPlane";
import tabBar from "./layout/tabBar";
import canvasEditorForm from "./layout/form";
import canvasEditorTop from "./layout/canvasEditorTop";
import "./style/index.less";
import { previewInfo, uuid } from "./config";
import events from "./events";
import { MenuId } from "./config/menus";
import onresize from "./events/windowEvent/onresize";
import { onClick } from "./events/canvasEvent/click";

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
    const createCustomCanvas = (e: CanvasEditor.MenuItem, uid?: string) => {
      const id = uid || uuid();
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

    // 当前选中的canvas
    const avtiveCanvas = computed(() => {
      const findCanvasById = (id: string) => {
        return canvasInfo.value!.find((item) => item.id === id);
      };
      return findCanvasById(TabInfo.value.indexKey)!;
    });

    const test = () => {
      createCanvasConfirm.value.val = "测试Tab";
      const id = uuid();
      createCustomCanvas({
        id,
        name: "测试-tab",
        event() {},
        type: "item",
      });
      nextTick(() => {
        createCanvasConfirm.value.val = "";
      });
    };
    test();

    // 预览弹窗
    const preview = ref(false);
    let PreviewCanvas: CanvasEditor.Canvas;
    const toPreview = () => {
      if (!PreviewCanvas) {
        PreviewCanvas = new fabric.Canvas(
          "previewCanvas"
        ) as CanvasEditor.Canvas;
        onresize(PreviewCanvas, "previewBox");
        onClick(
          PreviewCanvas,
          (e) => {
            console.log(e);
          },
          200
        );
      } else {
        PreviewCanvas.clear();
      }
      PreviewCanvas.loadFromJSON(previewInfo.get(), () => {
        PreviewCanvas.getObjects().forEach((e) => {
          e.selectable = false;
        });
      });
    };

    return () => (
      <div class={"canvas_editor"}>
        <canvasEditorTop
          tabsActiveIndex={TabInfo.value.indexKey}
          canvasInfo={canvasInfo.value}
          onNewCanvas={(e: CanvasEditor.MenuItem) => {
            createCanvasConfirm.value.visible = true;
            createCanvasConfirm.value.tabInfo = e;
          }}
          onSee={(e: CanvasEditor.MenuItem) => {
            preview.value = true;
            nextTick(() => {
              message.info("Esc 即可退出预览模式");
              toPreview();
            });
          }}
        />
        <div class={"canvas_editor_conter"}>
          <thingPlane
            onOpenIcon={(e: any) => {
              console.log(e);
              createCanvasConfirm.value.val = "测试Tab";
              createCustomCanvas(e);
              nextTick(() => {
                createCanvasConfirm.value.val = "";
              });
            }}
          />
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
          <canvasEditorForm avtiveCanvas={avtiveCanvas.value} />
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

        <a-modal
          width="100%"
          wrap-class-name="full-modal"
          v-models={[[preview.value, "visible"]]}
          title={createCanvasConfirm.value.tabInfo.name}
          footer={null}
          closable={false}
        >
          <div id="previewBox">
            {preview.value ? <canvas id="previewCanvas"></canvas> : ""}
          </div>
        </a-modal>
      </div>
    );
  },
});
