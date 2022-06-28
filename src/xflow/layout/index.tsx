import { defineComponent, onMounted, provide, ref } from "vue";
import { Vue3TabsChrome } from "vue3-tabs-chrome";
import { fabric } from "fabric";
import ThingPlane from "./thingPlane";
import topOption from "../topopt";
import { createCanvas } from "../";
import "../style/index.less";
import "vue3-tabs-chrome/dist/vue3-tabs-chrome.css";
import { Mcanvas } from "../canvas";
import PropertiedForm from "./propertied-form";

export interface CustomTabProps {
  label: string;
  key: string;
}

export default defineComponent({
  components: { topOption },
  setup(props, content) {
    const canvas = ref<Mcanvas>();
    provide("canvas", canvas);

    const tabsRef = ref();

    onMounted(() => {
      window["canvas"] = canvas.value = createCanvas("flow_canvas");
    });

    // 存储当前状态下的所有tab
    const tabs = ref<Array<CustomTabProps>>([
      { label: "新建标签1", key: Date.now() + "" },
    ]);
    const tabsActiveIndex = ref(tabs.value[0]?.key || undefined);

    const handleOpenNewTab = (type: string) => {
      const tab = { label: "新建标签页", key: Date.now() + "", type };
      tabsRef.value.addTab(tab);
      console.log(tabs);
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
