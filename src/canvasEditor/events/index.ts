import we from "./windowEvent";
import ce from "./canvasEvent";
import { toRaw } from "vue";

export default (canvas: CanvasEditor.Canvas, TabInfo: CanvasEditor.TabItem) => {
  canvas.TabInfo = TabInfo;
  we(toRaw(canvas));
  ce(toRaw(canvas));
};
