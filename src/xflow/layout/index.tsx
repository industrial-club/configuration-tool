import { defineComponent, onMounted, provide, ref } from "vue";
import Vue3TabsChrome from "vue3-tabs-chrome";
import { fabric } from "fabric";
import ThingPlane from "./thingPlane";
import topOption from "../topopt";
import { createCanvas } from "../";
import "../style/index.less";
import "vue3-tabs-chrome/dist/vue3-tabs-chrome.css";
import { Mcanvas } from "../canvas";

export interface CustomTabProps {
  name: string;
  id: string;
}

export default defineComponent({
  components: { topOption },
  setup(props, content) {
    const canvas = ref<Mcanvas>();
    provide("canvas", canvas);

    onMounted(() => {
      window["canvas"] = canvas.value = createCanvas("flow_canvas");
    });

    // 存储当前状态下的所有tab
    const tabs = ref<Array<CustomTabProps>>([]);
    const tabsActiveIndex = ref<string>(tabs.value[0]?.id || "");

    return () => (
      <div class={"canvas_body"}>
        <topOption />
        <div class={"canvas_box"}>
          <ThingPlane />
          <div class={"canvas_box canvas_box_column"}>
            <div class={"tabs_box"}>
              {tabs.value.map((item) => (
                <Vue3TabsChrome>{item.name}</Vue3TabsChrome>
              ))}
            </div>
            <div class={"canvas_box"} id="canvas_box">
              <canvas id="flow_canvas"></canvas>
            </div>
          </div>

          <ThingPlane />
        </div>
      </div>
    );
  },
});
