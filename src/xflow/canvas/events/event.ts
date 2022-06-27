import { Mcanvas } from "..";
import canvasEvent from "./canvasEvent";
import windowEvent from "./windowEvent";

export default (canvas: Mcanvas) => {
  canvasEvent(canvas);
  windowEvent(canvas);
};
