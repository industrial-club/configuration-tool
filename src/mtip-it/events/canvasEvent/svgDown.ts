import { svgToCanvas } from "../../config/svgToCanvas";

const svgDown = (canvas: MtipIt.Canvas) => {
  canvas.on("drop", (e) => {
    svgToCanvas(canvas, e);
  });
};

export default svgDown;
