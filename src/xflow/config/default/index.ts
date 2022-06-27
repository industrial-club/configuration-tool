import { fabric } from "fabric";

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
};
