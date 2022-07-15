import { fabric } from "fabric";
export const createCanvas: (id: string) => CanvasEditor.Canvas = (id) => {
  const canvas = new fabric.Canvas(id) as CanvasEditor.Canvas;
  return canvas;
};
