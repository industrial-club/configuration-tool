import setZoom from "./sentZoom";
import canvasMove from "./canvasMove";
import svgDown from "./svgDown";
import createLine from "./createLine";

export default (canvas: CanvasEditor.Canvas) => {
  setZoom(canvas);
  canvasMove(canvas);
  svgDown(canvas);
  createLine(canvas);
};
