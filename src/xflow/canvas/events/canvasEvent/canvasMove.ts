import { fabric } from "fabric";
export default {
  mouseDown(opt: fabric.IEvent<MouseEvent>, canvas: ZXFLOW.Canvas) {
    let evt = opt.e;
    if (evt.ctrlKey === true) {
      // 是否按住ctrl
      canvas.isMoveing = true; // isMoveing 是自定义的，开启移动状态
      canvas.lastPosX = evt.clientX; // lastPosX 是自定义的
      canvas.lastPosY = evt.clientY; // lastPosY 是自定义的
    }
  },
  mouseMove(opt: fabric.IEvent<MouseEvent>, canvas: ZXFLOW.Canvas) {
    if (canvas.isMoveing) {
      let evt = opt.e;
      let vpt = canvas.viewportTransform!; // 聚焦视图的转换
      vpt[4] += evt.clientX - canvas.lastPosX;
      vpt[5] += evt.clientY - canvas.lastPosY;
      canvas.requestRenderAll(); // 重新渲染
      canvas.lastPosX = evt.clientX;
      canvas.lastPosY = evt.clientY;
    }
  },
  mouseUp(opt: fabric.IEvent<MouseEvent>, canvas: ZXFLOW.Canvas) {
    canvas.setViewportTransform(canvas.viewportTransform!); // 设置此画布实例的视口转换
    canvas.isMoveing = false; // 关闭移动状态
  },
};
