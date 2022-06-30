import { fabric } from "fabric";
import { computedZoomXY, svgPath } from ".";

export const svgToCanvas = (
  canvas: CanvasEditor.Canvas,
  e: fabric.IEvent<Event>
) => {
  const path = svgPath.get();

  if (path === "") return;

  // 当流程图情况下，将svg打组 后渲染
  const groupSvg = (objects: fabric.Object[], options: any) => {
    const svg = fabric.util.groupSVGElements(objects, options) as any;
    const userX = (e.pointer?.x || (e.e as any).layerX) - svg.width / 2;
    const userY = (e.pointer?.y || (e.e as any).layerY) - svg.height / 2;
    const { left, top } = computedZoomXY(userX, userY, canvas);
    svg.set({
      left,
      top,
    });
    canvas.add(svg);
  };
  const everySvg = (objects: fabric.Object[], options: any) => {
    for (let i of objects) {
      canvas.add(i);
    }
  };
  fabric.loadSVGFromURL(path!, (objects, options) => {
    if (canvas.TabInfo.menuInfo.id === "newThing") {
      everySvg(objects, options);
    } else {
      groupSvg(objects, options);
    }
  });
};
