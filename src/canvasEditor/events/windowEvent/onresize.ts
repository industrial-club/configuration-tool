import { getWindowInfo } from "../../config";

export default (canvas: CanvasEditor.Canvas) => {
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
