import { Ref } from "vue";
import canvasEvent from "./canvasEvent";
import windowEvent from "./windowEvent";

const Events = (canvas: ZXFLOW.Canvas, flowArgs: ZXFLOW.FlowArgs) => {
  canvasEvent(canvas, flowArgs);
  windowEvent(canvas);
};

export default Events;
