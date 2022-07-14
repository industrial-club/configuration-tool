import { toRaw } from "vue";
import we from "./windowEvent";
import ce from "./canvasEvent";
import { resetFabric } from "../config/resetFabric";

export default (canvas: MtipIt.Canvas) => {
  resetFabric();
  we(toRaw(canvas));
  ce(toRaw(canvas));
};
