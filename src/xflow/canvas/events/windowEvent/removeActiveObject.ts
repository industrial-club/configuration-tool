import { fabric } from "fabric";

export default (canvas: ZXFLOW.Canvas) => {
  window.addEventListener("keydown", (e) => {
    if (e.key === "Backspace" || e.key === "Delete") {
      canvas.removeActiveObject();
    }
  });
};
