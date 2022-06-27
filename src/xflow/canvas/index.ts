import { fabric } from "fabric";
import events from "./events/event";

export interface Mcanvas extends fabric.Canvas {
  isDragging: boolean;
  toDragLine: boolean;
  toDragRect: boolean;
  lastPosX: number;
  lastPosY: number;
  getItem: (id: string) => fabric.Canvas | fabric.Line | fabric.Group;
}

export const reset = (canvas: Mcanvas) => {
  // 事件
  events(canvas);
};
