import { fabric } from "fabric";
import events from "../../events";
export const createCanvas: (id: string) => CanvasEditor.Canvas = (id) => {
  const canvas = new fabric.Canvas(id) as CanvasEditor.Canvas;
  events(canvas);
  return canvas;
};
