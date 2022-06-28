import { Mcanvas } from "../..";
import sentZoom from "./sentZoom";
import canvasMove from "./canvasMove";

// 所有canvas事件集合
export default (canvas: Mcanvas) => {
  canvas.on("mouse:down:before", (e) => {});
  canvas.on("mouse:down", (e) => {
    canvasMove.mouseDown(e, canvas);
  });
  canvas.on("mouse:move:before", (e) => {});
  canvas.on("mouse:move", (e) => {
    canvasMove.mouseMove(e, canvas);
  });
  canvas.on("mouse:out", (e) => {});
  canvas.on("mouse:over", (e) => {});
  canvas.on("mouse:up:before", (e) => {});
  canvas.on("mouse:up", (e) => {
    canvasMove.mouseUp(e, canvas);
  });
  canvas.on("mouse:wheel", (e) => {
    // 缩放画布 控制大小
    sentZoom(canvas, e);
  });
};
