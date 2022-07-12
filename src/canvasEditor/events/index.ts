import we from "./windowEvent";
import ce from "./canvasEvent";
import { resetFabric } from "../config/resetFabric";
import { toRaw } from "vue";

export default (canvas: CanvasEditor.Canvas, TabInfo: CanvasEditor.TabItem) => {
  canvas.TabInfo = TabInfo;
  resetFabric();
  we(toRaw(canvas));
  ce(toRaw(canvas));
};
