import { fabric } from "fabric";
import { computedZoomXY } from "@/mtip-it/config/index";
import {
  getCenter,
  getObjById,
  addPoint,
  getInsertIndex,
  addLine,
  updateLine,
} from "./createLineUtil";

const pointRadius = 7;
let tempLine: MtipIt.Path | undefined;
// 点下标
let pointIndex: number | undefined;

// 连线相关事件
const createLine = (canvas: MtipIt.Canvas) => {
  let beginObj: MtipIt.Object | undefined;
  canvas.on("mouse:down:before", (e) => {
    if (e.target) {
      beginObj = e.target;
      const xy = computedZoomXY(e.pointer!.x, e.pointer!.y, canvas);
      const active = canvas.getActiveObject();
      // 如果是选中后的线
      if (
        beginObj?.effectType === "line" &&
        (active as any)?.id === beginObj.id
      ) {
        const line: MtipIt.Path = beginObj as MtipIt.Path;
        pointIndex = getInsertIndex(canvas, line, xy!.left, xy!.top);
        line.path.splice(pointIndex + 1, 0, ["L", xy!.left, xy!.top]);
      }

      if (
        canvas.isCreateLine &&
        beginObj.effectType !== "line" &&
        beginObj.effectType !== "point"
      ) {
        console.log(111);
        const xy: any = computedZoomXY(e.pointer!.x, e.pointer!.y, canvas);
        const beginPoint: { [key: string]: number } = getCenter(beginObj);
        const newLine: MtipIt.Path = new fabric.Path(
          [
            ["M", beginPoint.x, beginPoint.y],
            ["L", beginPoint.x, beginPoint.y],
          ] as any[],
          {
            fill: "",
            stroke: "black",
            objectCaching: false,
            strokeWidth: 3,
            perPixelTargetFind: true,
            lockMovementX: true,
            lockMovementY: true,
          }
        ) as MtipIt.Path;
        newLine.id = Math.random();
        newLine.effectType = "line";
        tempLine = newLine;
        canvas.add(newLine);
        canvas.renderAll();
      }
    } else {
      beginObj = undefined;
    }
  });
  // 悬浮线
  canvas.on("mouse:over", (e: fabric.IEvent) => {
    const obj: MtipIt.Object | MtipIt.Path | undefined = e.target;
    const active: MtipIt.Object = canvas.getActiveObject();
    if (
      !canvas.isCreateLine &&
      obj?.effectType === "line" &&
      active?.id === obj.id
    ) {
      const line: MtipIt.Path = obj as MtipIt.Path;
      const temp: any = getObjById(canvas, line.tempPoint);
      temp.visible = true;
      canvas.renderAll();
    }
  });
  // 离开线
  canvas.on("mouse:out", (e: fabric.IEvent) => {
    const obj: MtipIt.Object | undefined = e.target;
    if (!canvas.isCreateLine && obj?.effectType === "line") {
      const line: MtipIt.Path = obj as any;
      const temp: any = getObjById(canvas, line.tempPoint);
      temp.visible = false;
      canvas.renderAll();
    }
  });
  canvas.on("mouse:move", (e) => {
    const obj: MtipIt.Object | undefined = e.target;
    // 线预览
    if (
      canvas.isCreateLine &&
      beginObj &&
      beginObj?.effectType !== "line" &&
      beginObj?.effectType !== "point"
    ) {
      const xy: any = computedZoomXY(e.pointer!.x, e.pointer!.y, canvas);
      const path = tempLine.path;
      path[1][1] = xy.left;
      path[1][2] = xy.top;
      canvas.renderAll();
    }
    // 悬浮点提示
    if (!canvas.isCreateLine && obj?.effectType === "line") {
      const xy: any = computedZoomXY(e.pointer!.x, e.pointer!.y, canvas);
      const line: MtipIt.Path = obj as any;
      const temp: any = getObjById(canvas, line.tempPoint);
      temp.left = xy.left - pointRadius;
      temp.top = xy.top - pointRadius;
      canvas.renderAll();
    }
    // 移动块
    if (
      beginObj &&
      !canvas.isCreateLine &&
      beginObj.effectType !== "line" &&
      beginObj.effectType !== "point"
    ) {
      beginObj.outLines?.forEach((lineId: number) => {
        const beginPoint: { [key: string]: number } = getCenter(beginObj!);
        const line: MtipIt.Path = getObjById(canvas, lineId) as MtipIt.Path;
        const path = line.path;
        path[0][1] = beginPoint.x;
        path[0][2] = beginPoint.y;
        updateLine(canvas, line);
      });
      beginObj.inLines?.forEach((lineId: number) => {
        const beginPoint: { [key: string]: number } = getCenter(beginObj!);
        const line: MtipIt.Path = getObjById(canvas, lineId) as MtipIt.Path;
        const path = line.path;
        path[line.path.length - 1][1] = beginPoint.x;
        path[line.path.length - 1][2] = beginPoint.y;
        updateLine(canvas, line);
      });
    }
    // 移动点
    if (beginObj && !canvas.isCreateLine && beginObj.effectType === "point") {
      const point: MtipIt.Circle = beginObj as MtipIt.Circle;
      const line: MtipIt.Path = getObjById(
        canvas,
        point.lineId!
      ) as MtipIt.Path;
      const index: number = line.points?.indexOf(point.id!)!;
      const xy = computedZoomXY(e.pointer!.x, e.pointer!.y, canvas);
      line.path[index + 1][1] = xy.left;
      line.path[index + 1][2] = xy.top;
      updateLine(canvas, line);
    }
    // 通过临时点拖动线
    if (
      beginObj &&
      !canvas.isCreateLine &&
      beginObj.effectType === "line" &&
      pointIndex !== undefined
    ) {
      const line: MtipIt.Path = beginObj as MtipIt.Path;
      const xy = computedZoomXY(e.pointer!.x, e.pointer!.y, canvas);
      line.path[pointIndex + 1][1] = xy.left;
      line.path[pointIndex + 1][2] = xy.top;
    }
  });

  canvas.on("mouse:up", (e) => {
    const endObj: MtipIt.Object | undefined = e.target;
    if (canvas.getActiveObjects().length > 1) {
      canvas.getActiveObject().set("lockMovementX", true);
      canvas.getActiveObject().set("lockMovementY", true);
    }

    // 新连线
    if (endObj && canvas.isCreateLine && beginObj && beginObj !== endObj) {
      const beginPoint: { [key: string]: number } = getCenter(beginObj);
      const endPoint: { [key: string]: number } = getCenter(endObj);
      const lineId = Math.random();
      const data = {
        from: beginObj.id,
        to: endObj.id,
      };
      const newLine: MtipIt.Path = addLine(
        canvas,
        lineId,
        [
          ["M", beginPoint.x, beginPoint.y],
          ["L", endPoint.x, endPoint.y],
        ],
        data
      );
      // newLine.to = endObj.id;
      // newLine.from = beginObj.id;
      if (!beginObj.outLines) {
        beginObj.outLines = [];
      }
      if (!endObj.inLines) {
        endObj.inLines = [];
      }
      beginObj.outLines.push(lineId);
      endObj.inLines!.push(lineId);
      beginObj = undefined;
      canvas.isCreateLine = false;
      canvas.selection = true;
      canvas.getObjects().map((item: MtipIt.Object) => {
        if (item.effectType !== "line") {
          item.selectable = true;
        }
        return item;
      });
    }
    // 新点
    if (
      beginObj &&
      !canvas.isCreateLine &&
      beginObj.effectType === "line" &&
      pointIndex !== undefined
    ) {
      const line: MtipIt.Path = beginObj as MtipIt.Path;
      const xy = computedZoomXY(e.pointer!.x, e.pointer!.y, canvas);
      const point: MtipIt.Circle = addPoint(
        line,
        xy.left! - pointRadius,
        xy.top! - pointRadius
      );
      canvas.add(point);
      line.points?.splice(pointIndex, 0, point.id!);

      updateLine(canvas, line);
    }
    if (tempLine) {
      canvas.remove(tempLine);
    }
    tempLine = undefined;
    beginObj = undefined;
    pointIndex = undefined;
  });
};
export default createLine;
