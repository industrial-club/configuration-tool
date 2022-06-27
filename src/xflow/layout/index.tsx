import { defineComponent, onMounted, provide, reactive, ref } from "vue";
import { fabric } from "fabric";
import ThingPlane from "./thingPlane";
import topOption from "../topopt";
import { createCanvas } from "../";
import "../style/index.less";
import { Mcanvas } from "../canvas";

export interface CustomTabProps {
  name: string;
  id: string;
}

export default defineComponent({
  components: { topOption },
  setup(props, content) {
    let canvas: Mcanvas;
    onMounted(() => {
      canvas = new fabric.Canvas("flow_canvas") as Mcanvas;
      createCanvas(canvas);
    });

    // 存储当前状态下的所有tab
    const tabs = ref<Array<CustomTabProps>>([]);
    const tabsActiveIndex = ref<string>(tabs.value[0]?.id || "");

    return () => (
      <div class={"canvas_body"}>
        <topOption
          onMenuClick={(e: any) => {
            e.event(canvas);
          }}
        />
        <div class={"canvas_box"}>
          <ThingPlane />
          <div class={"canvas_box canvas_box_column"}>
            <div class={"tabs_box"}></div>
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
