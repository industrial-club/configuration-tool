import { fabric } from "fabric";
import { getWindowInfo, previewInfo } from "../config";

export const toPreview = () => {
  const { width, height } = getWindowInfo("preview_box")();
  const canvas = new fabric.Canvas("preview_canvas");
  canvas.setHeight(height!);
  canvas.setWidth(width!);
  const info = previewInfo.get();

  canvas.loadFromJSON(info, () => {
    canvas.getObjects().forEach((item) => {
      item.selectable = false;
    });
  });
};
