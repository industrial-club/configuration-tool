import onResize from "./onresize";
import keyDown from "./keyDown";

export default (canvas: CanvasEditor.Canvas) => {
  onResize(canvas, "canvas_box");
  keyDown(canvas);
};
