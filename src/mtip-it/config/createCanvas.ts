import { fabric } from "fabric";
import { nextTick } from "vue";
import events from "../events";
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
    thingPath:
      // 代理 *****
      e.image_run?.replace("http://192.168.5.234:9001", "") ||
      "/icons/设备图标汇总_综保数据.svg",
    thingInfo: e,
  } as MtipIt.Item;
  nextTick(() => {
    a.canvas = initCanvas(a.id, a.thingPath!);
  });
  return a;
};

// 初始化canvas
export const initCanvas = (id: string, thingPath: string) => {
  const canvas = new fabric.Canvas(id) as MtipIt.Canvas;
  initSvgCanvas(canvas, thingPath);
  return canvas;
};

export const createFlow: () => MtipIt.Item = () => {
  const id = uuid();
  const flowCanvas: MtipIt.Item = {
    canvas: null,
    type: "flow",
    id,
    name: "全场工艺流程图",
  };
  nextTick(() => {
    flowCanvas.canvas = new fabric.Canvas(id, { selection: false });
    events(flowCanvas.canvas);

    flowCanvas.canvas.isCreateLine = false;
  });
  return flowCanvas;
  // mtip_it_editor_canvas
};
