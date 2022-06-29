import { fabric } from "fabric";
import { computedZoomXY } from ".";

export const svgToCanvas = (
  canvas: ZXFLOW.Canvas,
  thingInfo: ZXFLOW.ThingInfo,
  e: fabric.IEvent<Event>
) => {
  fabric.loadSVGFromURL(thingInfo.path, (objects, options) => {
    const svg = fabric.util.groupSVGElements(objects, options);
    const userX = e.pointer?.x || e.e.layerX;
    const userY = e.pointer?.y || e.e.layerY;
    const { left, top } = computedZoomXY(userX, userY, canvas);

    svg.set({
      left,
      top,
    });
    canvas.add(svg);
  });
};