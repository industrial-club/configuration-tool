import { fabric } from "fabric";
import { uuid } from "../../utils";

const changeObjectsSelection = (canvas: ZXFLOW.Canvas, type: boolean) => {
  for (let i of canvas.getObjects()) {
    i.selectable = type;
  }
};

export const toDragLine = (canvas: ZXFLOW.Canvas) => {
  canvas.isLineDragIng = true;
  changeObjectsSelection(canvas, false);
};

export const finishDragLine = (canvas: ZXFLOW.Canvas) => {
  canvas.isLineDragIng = false;
  changeObjectsSelection(canvas, true);
};

export default {
  react(opt?: {
    x: number;
    y: number;
    width: number;
    height: number;
    fill: string;
  }) {
    let top, left, width, height, fill;
    if (opt) {
      top = opt.x;
      left = opt.y;
      width = opt.width;
      height = opt.height;
      fill = opt.fill;
    } else {
      top = 100; // 距离容器顶部 100px
      left = 100; // 距离容器左侧 100px
      fill = "orange"; // 填充 橙色
      width = 100; // 宽度 100px
      height = 100;
    }
    const rect = new fabric.Rect({
      top,
      left,
      fill,
      width,
      height,
    });
    return rect;
  },
  line(canvas: ZXFLOW.Canvas) {
    // 创建线条
    const line = new fabric.Polyline(
      [
        { x: 30, y: 30 },
        { x: 150, y: 140 },
        { x: 240, y: 150 },
        { x: 100, y: 30 },
      ],
      {
        fill: "transparent", // 如果画折线，需要填充透明
        stroke: "#6639a6", // 线段颜色：紫色
        strokeWidth: 5,
      }
    );
    line.data = {
      type: "custom-line",
      id: uuid(),
    };
    canvas.add(line);
  },
};
