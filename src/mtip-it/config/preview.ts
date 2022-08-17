import { message } from "ant-design-vue";
import { fabric } from "fabric";
import { getWindowInfo, previewInfo } from "../config";
import { onClick } from "../events/canvasEvent/click";

interface TOPreview {
  event?: {
    click: (i: MtipIt.Object) => void;
  };
}

export const toPreview = (opt: TOPreview) => {
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
      if (item.type !== "path") {
        item.bringToFront();
      }
      if (item?.type === "circle") {
        item.visible = false;
      }
      if (item?.data?.events) {
        for (const key in item?.data?.events) {
          onClick(
            item,
            () => {
              opt.event.click(item);
            },
            200,
            true
          );
        }
      }
    });
    canvas.renderAll();
  });
};
