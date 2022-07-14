import onResize from "./onresize";
import keyDown from "./keyDown";

export default (canvas: MtipIt.Canvas) => {
  onResize(canvas, "mtip_it_editor_canvas");
  keyDown(canvas);
};
