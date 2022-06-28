import { defineComponent, onMounted, ref } from "vue";
import { fabric } from "fabric";
import prototype from "./canvas/prototype";
import { Vue3TabsChrome } from "vue3-tabs-chrome";
import "vue3-tabs-chrome/dist/vue3-tabs-chrome.css";
import ThingPlane from "./layout/thingPlane";
import topOption from "./topopt";
import { reset } from "./canvas";
import "./style/index.less";
import { Mcanvas } from "./canvas";
import PropertiedForm from "./layout/propertied-form";
import { uuid } from "./utils";

export interface CustomTabProps {
  label: string;
  key: string;
  type: "add-xflow" | "add-thing";
}

export default defineComponent({
  components: { topOption },
  setup(props, content) {
    const tabsRef = ref();

    let canvas: Mcanvas;
    prototype();
    onMounted(() => {
      canvas = new fabric.Canvas("flow_canvas") as Mcanvas;
      reset(canvas);
    });

    // 存储当前状态下的所有tab
    const tabs = ref<Array<CustomTabProps>>([
      { label: "新建标签1", key: uuid(), type: "add-xflow" },
    ]);
    const tabsActiveIndex = ref(tabs.value[0]?.key || undefined);

    const handleOpenNewTab = (type: "add-xflow" | "add-thing") => {
      const label = window.prompt("请输入标签名称");
      const tab: CustomTabProps = {
        label: label || "新建标签页",
        key: uuid(),
        type,
      };
      tabsRef.value.addTab(tab);
    };

    return () => (
      <div class={"canvas_body"}>
        <topOption onNewTab={handleOpenNewTab} />
        <div class={"canvas_box"}>
          <ThingPlane />
          <div class={"canvas_box canvas_box_column"}>
            <div class={"tabs_box"}>
              <Vue3TabsChrome
                ref={tabsRef}
                tabs={tabs.value}
                v-model={[tabsActiveIndex.value]}
              ></Vue3TabsChrome>
            </div>
            <div class={"canvas_box"} id="canvas_box">
              <canvas id="flow_canvas"></canvas>
            </div>
          </div>

          <PropertiedForm />
        </div>
      </div>
    );
  },
});
