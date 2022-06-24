import { defineComponent, onMounted, provide, ref } from "vue";
import { fabric } from "fabric";
import ThingPlane from "./thingPlane";
import topOption from "../topopt";
import { createCanvas } from "../";
import "../style/index.less";
import { Mcanvas } from "../canvas";

export default defineComponent({
  components: { topOption },
  setup(props, content) {
    const canvas = ref<Mcanvas>();
    provide("canvas", canvas);

    onMounted(() => {
      window["canvas"] = canvas.value = createCanvas("flow_canvas");
    });

    return () => (
      <div class={"canvas_body"}>
        <topOption />
        <div class={"canvas_box"}>
          <ThingPlane />
          <div class={"canvas_box"} id="canvas_box">
            <canvas id="flow_canvas"></canvas>
          </div>
          <ThingPlane />
        </div>
      </div>
    );
  },
});
