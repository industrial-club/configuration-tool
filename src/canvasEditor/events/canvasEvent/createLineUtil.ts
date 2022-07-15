import { fabric } from "fabric";
import { computedZoomXY } from "@/canvasEditor/config/index";

const pointRadius = 7;

export const getCenter = (obj: CanvasEditor.Object) => {
  return {
    x: obj.left! + obj.width! / 2,
    y: obj.top! + obj.height! / 2,
  };
};

export const getObjById = (canvas: CanvasEditor.Canvas, id: number) => {
  return canvas._objects.find((ele: CanvasEditor.Object) => {
    return ele.id === id;
  });
};

export const addPoint = (line: CanvasEditor.Path, x: number, y: number) => {
  const point: CanvasEditor.Circle = new fabric.Circle({
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

export const getInsertIndex = (
  canvas: CanvasEditor.Canvas,
  line: CanvasEditor.Path,
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

export const addLine = (
  canvas: CanvasEditor.Canvas,
  id: number,
  path: Array<any>,
  data: any,
  points?: number[]
) => {
  const newLine: CanvasEditor.Path = new fabric.Path(path, {
    fill: "",
    stroke: "black",
    objectCaching: false,
    strokeWidth: 5,
    perPixelTargetFind: true,
    lockMovementX: true,
    lockMovementY: true,
  }) as CanvasEditor.Path;
  newLine.id = id;
  newLine.data = data;
  newLine.type = "line";
  if (points) {
    newLine.points = points;
  } else {
    newLine.points = [];
  }
  const point: CanvasEditor.Circle = new fabric.Circle({
    radius: pointRadius,
    fill: "#4FC3F7",
    left: path[0][1],
    top: path[0][2],
    hasControls: false,
    opacity: 0.7,
    stroke: "blue",
    strokeWidth: 2,
    strokeUniform: true,
  });
  point.type = "point";
  point.visible = false;
  point.id = Math.random();
  newLine.on("mousemove", (event: any) => {
    const xy: any = computedZoomXY(event.e.offsetX, event.e.offsetY, canvas);
    const line: CanvasEditor.Path = event.target;
    const temp: any = getObjById(canvas, line.tempPoint);
    temp.left = xy.left - pointRadius;
    temp.top = xy.top - pointRadius;
    canvas.renderAll();
  });
  newLine.on("mouseover", (event: any) => {
    const line: CanvasEditor.Path = event.target;
    const temp: any = getObjById(canvas, line.tempPoint);
    temp.visible = true;
    canvas.renderAll();
  });
  newLine.on("mouseout", (event: any) => {
    const line: CanvasEditor.Path = event.target;
    const temp: any = getObjById(canvas, line.tempPoint);
    temp.visible = false;
    canvas.renderAll();
  });
  newLine.tempPoint = point.id;
  canvas.add(newLine);
  canvas.add(point);
  return newLine;
};

export const updateLine = (
  canvas: CanvasEditor.Canvas,
  line: CanvasEditor.Path
) => {
  canvas.remove(line);
  const newLine: CanvasEditor.Path = new fabric.Path(line.path, {
    fill: "",
    stroke: "black",
    objectCaching: false,
    strokeWidth: 5,
    perPixelTargetFind: true,
    lockMovementX: true,
    lockMovementY: true,
  }) as CanvasEditor.Path;
  newLine.id = line.id;
  newLine.data = line.data;
  newLine.type = "line";
  newLine.points = line.points;
  newLine.tempPoint = line.tempPoint;

  newLine.on("mousemove", (event: any) => {
    const xy: any = computedZoomXY(event.e.offsetX, event.e.offsetY, canvas);
    const line: CanvasEditor.Path = event.target;
    const temp: any = getObjById(canvas, line.tempPoint);
    temp.left = xy.left - pointRadius;
    temp.top = xy.top - pointRadius;
    canvas.renderAll();
  });
  newLine.on("mouseover", (event: any) => {
    const line: CanvasEditor.Path = event.target;
    const temp: any = getObjById(canvas, line.tempPoint);
    temp.visible = true;
    canvas.renderAll();
  });
  newLine.on("mouseout", (event: any) => {
    const line: CanvasEditor.Path = event.target;
    const temp: any = getObjById(canvas, line.tempPoint);
    temp.visible = false;
    canvas.renderAll();
  });

  canvas.add(newLine);
  return newLine;
};