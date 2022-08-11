import { previewInfo } from "..";

export default (canvasItem: MtipIt.Item) => {
  const canvasJson: any = canvasItem.canvas.toJSON();
  canvasJson?.objects.forEach((element: any) => {
    if (element.effectType === "line") {
      element.perPixelTargetFind = true;
      element.lockMovementX = true;
      element.lockMovementY = true;
    }
  });

  canvasJson.localtion = {
    x: canvasItem.canvas.viewportTransform[4],
    y: canvasItem.canvas.viewportTransform[5],
  };
  canvasJson.zoom = canvasItem.canvas.getZoom();
  previewInfo.set(
    canvasItem.canvas.toJSON(),
    JSON.stringify(canvasJson.localtion),
    canvasJson.zoom
  );
  return {
    canvasJson,
  };
};
