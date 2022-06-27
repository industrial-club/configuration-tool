import { fabric } from "fabric";
import { Mcanvas } from "../..";

export default (canvas: Mcanvas) => {
  window.addEventListener("keydown", (e) => {
    if (e.key === "Backspace" || e.key === "Delete") {
      canvas.removeActiveObject();
    }
  });
};
