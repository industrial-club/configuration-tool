import sentZoom from "./sentZoom";
import canvasMove from "./canvasMove";
import { svgToCanvas } from "../../../utils/svgToCanvas";
import customLineEdit, { addControlPoint } from "./customLineClick";
import { ClickEvent } from "./clickEvent";

// 所有canvas事件集合
const Events = (canvas: ZXFLOW.Canvas, flowArgs: ZXFLOW.FlowArgs) => {
  const customLineFun = customLineEdit(canvas);
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
    if (e.target && (e.target as ZXFLOW.CustomPolyline).edit) {
      addControlPoint(canvas, e);
    }
  });
  canvas.on("mouse:wheel", (e) => {
    // 缩放画布 控制大小
    sentZoom(canvas, e);
  });

  canvas.on("mouse:dblclick", (e) => {
    // 自定义连线
    if (e.target?.data.type === "custom-line") {
      customLineFun(e.target as ZXFLOW.CustomPolyline);
    }
  });

  canvas.on("drop", (e) => {
    svgToCanvas(canvas, flowArgs.thingInfo, e);
  });

  // 自定义模拟点击事件
  ClickEvent(canvas, (e) => {
    flowArgs.activeObj = e.target!;
  });
};
export default Events;
