import { message } from "ant-design-vue";
import { fabric } from "fabric";
import { getWindowInfo, previewInfo } from "../config";

export const toPreview = () => {
  const { width, height } = getWindowInfo("preview_box")();
  const canvas = new fabric.Canvas("preview_canvas", {});
  canvas.setHeight(height!);
  canvas.setWidth(width!);
  const { info, localtion, zoom } = previewInfo.get();
  canvas.loadFromJSON(info, () => {
    canvas.setZoom(Number(zoom));
    canvas.viewportTransform[4] = localtion.x;
    canvas.viewportTransform[5] = localtion.y;
    canvas.getObjects().forEach((item: MtipIt.Object) => {
      item.selectable = false;
      if (item?.type === "circle") {
        item.visible = false;
      }
      if (item?.data?.events) {
        for (const key in item?.data?.events) {
          item.on(key, () => {
            if (item?.data?.events[key]) {
              message.success("下发成功");
            }
          });
        }
      }
    });
    canvas.renderAll();
  });
};
