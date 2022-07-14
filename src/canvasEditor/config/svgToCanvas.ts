import { fabric } from "fabric";
import { MenuId } from "./menus";
import { computedZoomXY, svgPath } from ".";

export const svgToCanvas = (
  canvas: CanvasEditor.Canvas,
  e: fabric.IEvent<Event>
) => {
  const thing = svgPath.get();
  if (thing === "") return;

  // 当流程图情况下，将svg打组 后渲染
  const groupSvg = (objects: fabric.Object[], options: any) => {
    const svg = fabric.util.groupSVGElements(objects, { a: 0 }) as any;
    const userX = (e.pointer?.x || (e.e as any).layerX) - svg.width / 2;
    const userY = (e.pointer?.y || (e.e as any).layerY) - svg.height / 2;
    const { left, top } = computedZoomXY(userX, userY, canvas);

    svg.set({
      left,
      top,
    });

    svg.data = {
      info: thing,
    };
    canvas.add(svg);
    canvas.setActiveObject(svg);

    console.log(svg);
  };

  const everySvg = (objects: fabric.Object[], options: any) => {
    const svg = fabric.util.groupSVGElements(objects, options) as any;
    const userX = (e.pointer?.x || (e.e as any).layerX) - svg.width / 2;
    const userY = (e.pointer?.y || (e.e as any).layerY) - svg.height / 2;
    const { left, top } = computedZoomXY(userX, userY, canvas);
    svg.set({
      left,
      top,
    });
    canvas.add(svg);
    setTimeout(() => {
      svg.toActiveSelection();
    }, 500);
  };

  fabric.loadSVGFromURL(thing.path!, (objects, options) => {
    if (canvas.TabInfo.menuInfo.id === MenuId.newThing) {
      everySvg(objects, options);
    } else {
      groupSvg(objects, options);
    }
  });
};
