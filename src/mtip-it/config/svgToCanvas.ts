import { fabric } from "fabric";
import { computedZoomXY, svgPath } from ".";

export const svgToCanvas = (canvas: MtipIt.Canvas, e: fabric.IEvent<Event>) => {
  const thing: MtipIt.ThingItem = svgPath.get();
  // if (thing === "") return;
  const pathUrl = thing.image_run;
  // 当流程图情况下，将svg打组 后渲染
  const groupSvg = (objects: fabric.Object[], options: any) => {
    const svgTest = fabric.util.groupSVGElements(objects) as any;
    svgTest.set({
      instanceId: thing.id,
    });
    const texts =
      thing.properties?.map((ele: any, index: number) => {
        return new fabric.Textbox(`${ele.label}:无`, {
          ...ele.position,
          ...ele.style,
          attrCode: "attrCode",
          parentId: thing.id,
        });
      }) || [];
    const svg = fabric.util.groupSVGElements([svgTest]) as any;
    for (let i of texts) {
      canvas.add(i);
    }
    const userX = (e.pointer?.x || (e.e as any).layerX) - svg.width / 2;
    const userY = (e.pointer?.y || (e.e as any).layerY) - svg.height / 2;
    const { left, top } = computedZoomXY(userX, userY, canvas);
    svg.set({
      left,
      top,
    });
    svg.id = Math.random();
    svg.data = thing;
    svg.effectType = "svg";
    canvas.add(svg);
    // canvas.setActiveObject(svg);
  };

  fabric.loadSVGFromURL(pathUrl, (objects, options) => {
    groupSvg(objects, options);
  });
};

export const initSvgCanvas = (canvas: MtipIt.Canvas, path: string) => {
  const padding = 120;
  fabric.loadSVGFromURL(path, (objects, options) => {
    const svg = fabric.util.groupSVGElements(objects, options);
    const { width, height } = svg;
    const nw = width! + padding;
    const nh = height! + padding;
    svg.set({
      left: padding / 2,
      top: padding / 2,
    });

    canvas.add(svg);
    setTimeout(() => {
      if ((svg as any).toActiveSelection) {
        (svg as any).toActiveSelection();
      }
    }, 500);

    canvas.setHeight(nh!);
    canvas.setWidth(nw!);
  });
};
