import { canvasMove, setZoom, Mcanvas } from "./canvas";
import { getWindowInfo } from "./utils";
import { fabric } from "fabric";

export const createCanvas = (id: string) => {
  const getInfo = getWindowInfo("canvas_box");
  const { width, height } = getInfo();

  fabric.Canvas.prototype["getItem"] = function (
    id: string,
    type: "group" | "node"
  ) {
    const objects = this.getObjects();
    const item = objects.find((item) => item.data && item.data.id === id);
    return item;
  };

  const canvas = new fabric.Canvas(id, {
    width,
    height,
  }) as Mcanvas;

  // 插入按住alt 拖动画布事件
  canvasMove(canvas);

  // 缩放画布
  setZoom(canvas);

  // 动态设置画布大小
  window.onresize = () => {
    const { width, height } = getInfo();
    canvas.setWidth(width);
    canvas.setHeight(height);
  };
  return canvas;
};
