import { fabric } from "fabric";
import { nextTick } from "vue";
import { uuid } from "./";
import { initSvgCanvas } from "./svgToCanvas";

export const create: (e: MtipIt.ThingItem) => MtipIt.Item = (e) => {
  const id = e.id || uuid();
  const name = e.name || "thing";
  const a = {
    id,
    name,
    canvas: null,
    type: "thing",
    thingPath: e.image_run || "/icons/设备图标汇总_综保数据.svg",
  } as MtipIt.Item;
  nextTick(() => {
    a.canvas = initCanvas(a.id, a.thingPath!);
  });
  return a;
};

// 初始化canvas
export const initCanvas = (id: string, thingPath: string) => {
  const canvas = new fabric.Canvas(id);
  initSvgCanvas(canvas, thingPath);
  return canvas;
};

export const createFlow = () => {
  // mtip_it_editor_canvas
};
