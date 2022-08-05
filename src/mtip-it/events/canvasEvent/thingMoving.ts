import { computedZoomXY } from "../../config";
import { svgToCanvas } from "../../config/svgToCanvas";

const thingMoving = (canvas: MtipIt.Canvas) => {
  let child = [];
  let status = false;

  canvas.on("mouse:down:before", (e) => {
    const target = e.target! as MtipIt.Object;

    if (target?.effectType === "svg" && !canvas.isCreateLine) {
      status = true;
      child = [];
      // 获取当前svg下所有的动态和静态属性
      for (let i of canvas.getObjects() as Array<MtipIt.Object>) {
        if (i.parentId === target.instanceId) {
          const offsetX = e.target?.left - i.left;
          const offsetY = e.target?.top - i.top;
          child.push({
            target: i,
            offsetX,
            offsetY,
          });
        }
      }
    }
  });
  canvas.on("mouse:move", (e) => {
    if (status) {
      for (let i of child as Array<{
        target: MtipIt.Object;
        offsetX: number;
        offsetY: number;
      }>) {
        // 获取每一个元素的位置
        const left = e.target?.left - i.offsetX;
        const top = e.target?.top - i.offsetY;
        i.target.set({
          left,
          top,
        });
      }
      child = [];
    }
  });
  canvas.on("mouse:up", (e) => {
    status = false;
  });
};

export default thingMoving;
