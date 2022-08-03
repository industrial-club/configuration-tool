import setZoom from "./sentZoom";
import canvasMove from "./canvasMove";
import svgDown from "./svgDown";
import createLine from "./createLine";
import thingMoving from "./thingMoving";

export default (canvas: MtipIt.Canvas) => {
  setZoom(canvas);
  canvasMove(canvas);
  svgDown(canvas);
  createLine(canvas);
  thingMoving(canvas);
};
