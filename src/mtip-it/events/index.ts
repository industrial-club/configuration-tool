import we from "./windowEvent";
import ce from "./canvasEvent";
import { resetFabric } from "../config/resetFabric";
import { toRaw } from "vue";

export default (canvas: MtipIt.Canvas) => {
  resetFabric();
  we(toRaw(canvas));
  ce(toRaw(canvas));
};
