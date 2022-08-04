import { fabric } from "fabric";

export const resetFabric = () => {
  const newList = [
    "Line",
    "Group",
    "Rect",
    "Point",
    "Path",
    "Circle",
    "Textbox",
  ];
  for (let i of newList) {
    (fabric as any)[i].prototype["toObject"] = (function (toObject) {
      return function () {
        return fabric.util.object.extend(toObject.call(this), {
          data: (this as any).data,
          id: this.id || Math.random(),
          outLines: this.outLines,
          inLines: this.inLines,
          effectType: this.effectType,
          points: this.points,
          from: this.from,
          to: this.to,
          tempPoint: this.tempPoint,
          lineId: this.lineId,
          instanceId: this.instanceId || null,
          parentId: this.parentId || null,
          name: this.name || null,
          // perPixelTargetFind: this.perPixelTargetFind,
          // lockMovementX: this.lockMovementX,
          // lockMovementY: this.lockMovementY,
        });
      };
    })((fabric as any)[i].prototype["toObject"]);
  }
};
