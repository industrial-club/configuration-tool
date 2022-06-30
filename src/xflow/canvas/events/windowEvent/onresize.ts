import { fabric } from "fabric";
import { getWindowInfo } from "../../../utils";

export default (canvas: ZXFLOW.Canvas) => {
  // 动态设置画布大小
  const getInfo = getWindowInfo("canvas_box");
  const { width, height } = getInfo();
  canvas.setWidth(width);
  canvas.setHeight(height);
  window.onresize = () => {
    const { width, height } = getInfo();
    canvas.setWidth(width);
    canvas.setHeight(height);
  };
};
