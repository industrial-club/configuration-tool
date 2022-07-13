import { fabric } from "fabric";
export const createCanvas: (id: string) => CanvasEditor.Canvas = (id) => {
  const canvas = new fabric.Canvas(id) as CanvasEditor.Canvas;
  console.log("create event");
  return canvas;
};
