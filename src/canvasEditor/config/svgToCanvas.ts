import { fabric } from "fabric";
import { computedZoomXY, svgPath } from ".";
import { MenuId } from "./menus";

export const svgToCanvas = (
  canvas: CanvasEditor.Canvas,
  e: fabric.IEvent<Event>
) => {
  const path = svgPath.get();

  if (path === "") return;

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
    // svg.type = "rect";
    svg.toObject = (function (toObject) {
      return function () {
        return fabric.util.object.extend(toObject.call(this), {
          data: (this as any).data,
        });
      };
    })(svg.toObject);
    svg.data = {
      a: "zx",
    };
    canvas.add(svg);
    canvas.setActiveObject(svg);

    console.log(svg);
  };
  const everySvg = (objects: fabric.Object[], options: any) => {
    // const svgList = [];
    // for(let i of objects) {
    //   svgList.push(i);
    // }
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
      console.log(svg);
      svg.toActiveSelection();
    }, 500);
  };
  fabric.loadSVGFromURL(path!, (objects, options) => {
    if (canvas.TabInfo.menuInfo.id === MenuId.newThing) {
      everySvg(objects, options);
    } else {
      groupSvg(objects, options);
    }
  });
};
