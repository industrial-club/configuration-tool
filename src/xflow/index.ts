import { ref } from "vue";
import { Mcanvas, reset } from "./canvas";
import { getWindowInfo } from "./utils";
import { fabric } from "fabric";

export const createCanvas = (canvas: Mcanvas) => {
  // reset
  reset(canvas);
};
