import { fabric } from "fabric";

const event = {
  mouseDown(opt: fabric.IEvent<MouseEvent>, canvas: MtipIt.Canvas) {
    let evt = opt.e;
    if (evt.ctrlKey === true) {
      // 是否按住ctrl
      canvas.isMoveing = true; // isMoveing 是自定义的，开启移动状态
      canvas.lastPosX = evt.clientX; // lastPosX 是自定义的
      canvas.lastPosY = evt.clientY; // lastPosY 是自定义的
    }
  },
  mouseMove(opt: fabric.IEvent<MouseEvent>, canvas: MtipIt.Canvas) {
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
  mouseUp(opt: fabric.IEvent<MouseEvent>, canvas: MtipIt.Canvas) {
    canvas.setViewportTransform(canvas.viewportTransform!); // 设置此画布实例的视口转换
    canvas.isMoveing = false; // 关闭移动状态
  },
};
export default (canvas: MtipIt.Canvas) => {
  canvas.on("mouse:down", (e) => {
    event.mouseDown(e, canvas);
  });
  canvas.on("mouse:move", (e) => {
    event.mouseMove(e, canvas);
  });
  canvas.on("mouse:up", (e) => {
    event.mouseUp(e, canvas);
  });
};
