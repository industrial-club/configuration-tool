import { svgToCanvas } from "../../config/svgToCanvas";

const svgDown = (canvas: CanvasEditor.Canvas) => {
  canvas.on("drop", (e) => {
    svgToCanvas(canvas, e);
  });
};

export default svgDown;
