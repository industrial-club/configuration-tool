import { fabric } from "fabric";

export default (canvas: ZXFLOW.Canvas, opt: fabric.IEvent<WheelEvent>) => {
  const delta = opt.e.deltaY; // 滚轮，向上滚一下是 -100，向下滚一下是 100
  let zoom = canvas.getZoom(); // 获取画布当前缩放值
  zoom *= 0.999 ** delta;
  if (zoom > 20) zoom = 20; // 限制最大缩放级别
  if (zoom < 0.01) zoom = 0.01; // 限制最小缩放级别

  canvas.zoomToPoint(
    {
      // 关键点
      x: opt.e.offsetX,
      y: opt.e.offsetY,
    },
    zoom // 传入修改后的缩放级别
  );
};
