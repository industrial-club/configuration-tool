import setZoom from "./sentZoom";
import canvasMove from "./canvasMove";
import svgDown from "./svgDown";

export default (canvas: CanvasEditor.Canvas) => {
  setZoom(canvas);
  canvasMove(canvas);
  svgDown(canvas);
};
