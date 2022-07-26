import { fabric } from "fabric";
import { computedZoomXY } from "@/MtipIt/config/index";

const getCenter = (obj: MtipIt.Object) => {
  return {
    x: obj.left! + obj.width! / 2,
    y: obj.top! + obj.height! / 2,
  };
};

const getObjById = (canvas: MtipIt.Canvas, id: number) => {
  return canvas._objects.find((ele: MtipIt.Object) => {
    return ele.id === id;
  });
};

const addPoint = (line: MtipIt.Path, x: number, y: number) => {
  const point: MtipIt.Circle = new fabric.Circle({
    radius: 5,
    fill: "#4FC3F7",
    left: x,
    top: y,
    hasControls: false,
    opacity: 0.7,
    stroke: "blue",
    strokeWidth: 3,
    strokeUniform: true,
  });
  point.type = "point";
  point.id = Math.random();
  point.lineId = line.id;
  return point;
};

const addLine = (
  canvas: MtipIt.Canvas,
  id: number,
  path: Array<any>,
  data: any,
  points?: number[]
) => {
  const newLine: MtipIt.Path = new fabric.Path(path, {
    fill: "",
    stroke: "black",
    objectCaching: false,
    strokeWidth: 5,
    perPixelTargetFind: true,
    lockMovementX: true,
    lockMovementY: true,
  }) as MtipIt.Path;
  newLine.id = id;
  newLine.data = data;
  newLine.type = "line";
  if (points) {
    newLine.points = points;
  } else {
    newLine.points = [];
    // const p1: MtipIt.Circle = addPoint(newLine, path[0][1], path[0][2]);
    // const p2: MtipIt.Circle = addPoint(newLine, path[1][1], path[1][2]);
    // canvas.add(p1);
    // canvas.add(p2);
    // newLine.points.push(p1.id!);
    // newLine.points.push(p2.id!);
  }
  canvas.add(newLine);
  return newLine;
};

const getInsertIndex = (
  canvas: MtipIt.Canvas,
  line: MtipIt.Path,
  x: number,
  y: number
) => {
  let index = 0;
  let distance;
  for (let i: number = 0; i <= line.path.length - 2; i++) {
    const point1 = line.path[i];
    const point2 = line.path[i + 1];
    const num =
      Math.sqrt(Math.pow(x - point1[1], 2) + Math.pow(y - point1[2], 2)) +
      Math.sqrt(Math.pow(x - point2[1], 2) + Math.pow(y - point2[2], 2)) -
      Math.sqrt(
        Math.pow(point1[1] - point2[1], 2) + Math.pow(point1[2] - point2[2], 2)
      );
    if (!distance || num < distance) {
      distance = num;
      index = i;
    }
  }
  return index;
};

// 连线相关事件
const createLine = (canvas: MtipIt.Canvas) => {
  let beginObj: MtipIt.Object | undefined;
  canvas.on("mouse:down:before", (e) => {
    if (e.target) {
      beginObj = e.target;
    } else {
      beginObj = undefined;
    }
  });
  // 加点
  canvas.on("mouse:dblclick", (e: fabric.IEvent) => {
    const obj: MtipIt.Object | undefined = e.target;
    const xy = computedZoomXY(e.pointer!.x, e.pointer!.y, canvas);
    if (obj?.type === "line") {
      const line: MtipIt.Path = obj as MtipIt.Path;
      const point: MtipIt.Circle = addPoint(line, xy.left! - 5, xy.top! - 5);
      canvas.add(point);
      const index = getInsertIndex(canvas, line, xy!.left, xy!.top);
      line.path.splice(index + 1, 0, ["L", xy!.left, xy!.top]);
      line.points!.splice(index, 0, point.id!);
    }
  });
  canvas.on("mouse:move", (e) => {
    // 移动块
    if (beginObj && !canvas.isCreateLine && beginObj.type === "rect") {
      beginObj.outLines?.forEach((lineId: number) => {
        const beginPoint: { [key: string]: number } = getCenter(beginObj!);
        const line: MtipIt.Path = getObjById(canvas, lineId) as MtipIt.Path;
        const path = line.path;
        path[0][1] = beginPoint.x;
        path[0][2] = beginPoint.y;
        canvas.remove(line);
        addLine(canvas, lineId, path, line.data, line.points);
      });
      beginObj.inLines?.forEach((lineId: number) => {
        const beginPoint: { [key: string]: number } = getCenter(beginObj!);
        const line: MtipIt.Path = getObjById(canvas, lineId) as MtipIt.Path;
        const path = line.path;
        path[line.path.length - 1][1] = beginPoint.x;
        path[line.path.length - 1][2] = beginPoint.y;
        canvas.remove(line);
        addLine(canvas, lineId, path, line.data, line.points);
      });
    }
    // 移动点
    if (beginObj && !canvas.isCreateLine && beginObj.type === "point") {
      const point: MtipIt.Circle = beginObj as MtipIt.Circle;
      const line: MtipIt.Path = getObjById(
        canvas,
        point.lineId!
      ) as MtipIt.Path;
      const index: number = line.points?.indexOf(point.id!)!;
      const xy = computedZoomXY(e.pointer!.x, e.pointer!.y, canvas);
      line.path[index + 1][1] = xy.left;
      line.path[index + 1][2] = xy.top;
      canvas.remove(line);
      addLine(canvas, line.id!, line.path, line.data, line.points);
    }
  });

  canvas.on("mouse:up", (e) => {
    const endObj: MtipIt.Object | undefined = e.target;
    // 新连线
    if (endObj && canvas.isCreateLine && beginObj && beginObj !== endObj) {
      const beginPoint: { [key: string]: number } = getCenter(beginObj);
      const endPoint: { [key: string]: number } = getCenter(endObj);
      const lineId = Math.random();
      const data = {
        from: beginObj.id,
        to: endObj.id,
      };
      const newLine = addLine(
        canvas,
        lineId,
        [
          ["M", beginPoint.x, beginPoint.y],
          ["L", endPoint.x, endPoint.y],
        ],
        data
      );
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
      canvas.getObjects().map((item) => {
        if (item.type !== "line") {
          item.selectable = true;
        }
        return item;
      });
    }
    beginObj = undefined;
  });
};

export default createLine;
