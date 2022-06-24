import type { fabric } from "fabric";

export interface Mcanvas extends fabric.Canvas {
  isDragging: Boolean;
  lastPosX: number;
  lastPosY: number;
  getItem: (id: string) => fabric.Canvas;
}

export const setZoom = (canvas: Mcanvas) => {
  canvas.on("mouse:wheel", (opt) => {
    const delta = opt.e.deltaY; // 滚轮，向上滚一下是 -100，向下滚一下是 100
    let zoom = canvas.getZoom(); // 获取画布当前缩放值
    zoom *= 0.999 ** delta;
    if (zoom > 20) zoom = 20; // 限制最大缩放级别
    if (zoom < 0.01) zoom = 0.01; // 限制最小缩放级别

    // 以鼠标所在位置为原点缩放
    canvas.zoomToPoint(
      {
        // 关键点
        x: opt.e.offsetX,
        y: opt.e.offsetY,
      },
      zoom // 传入修改后的缩放级别
    );
  });
};

export const canvasMove = (canvas: Mcanvas) => {
  canvas.on("mouse:down", (opt) => {
    // 鼠标按下时触发

    let evt = opt.e;
    if (evt.altKey === true) {
      // 是否按住alt
      canvas.isDragging = true; // isDragging 是自定义的，开启移动状态
      canvas.lastPosX = evt.clientX; // lastPosX 是自定义的
      canvas.lastPosY = evt.clientY; // lastPosY 是自定义的
    }
  });

  canvas.on("mouse:move", (opt) => {
    // 鼠标移动时触发
    if (canvas.isDragging) {
      let evt = opt.e;
      let vpt = canvas.viewportTransform!; // 聚焦视图的转换
      vpt[4] += evt.clientX - canvas.lastPosX;
      vpt[5] += evt.clientY - canvas.lastPosY;
      canvas.requestRenderAll(); // 重新渲染
      canvas.lastPosX = evt.clientX;
      canvas.lastPosY = evt.clientY;
    }
  });

  canvas.on("mouse:up", (opt) => {
    // 鼠标松开时触发
    canvas.setViewportTransform(canvas.viewportTransform!); // 设置此画布实例的视口转换
    canvas.isDragging = false; // 关闭移动状态
  });
};

export default { canvasMove };
