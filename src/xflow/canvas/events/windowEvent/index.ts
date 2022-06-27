import { Mcanvas } from "../..";
import sentZoom from "./onresize";
import removeActiveObject from "./removeActiveObject";

export default (canvas: Mcanvas) => {
  sentZoom(canvas);
  removeActiveObject(canvas);
};
