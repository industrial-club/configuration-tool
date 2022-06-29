import { isEqual, difference } from "lodash";
import { fabric } from "fabric";
import { ThingInfo, reset } from "../canvas";
import { computed, Ref } from "vue";

export const getWindowInfo = (domId?: string) => {
  let height, width, dom: HTMLElement;
  if (domId && document.getElementById(domId)) {
    dom = document.getElementById(domId)!;
  }
  return () => {
    if (dom) {
      height = dom.clientHeight;
      width = dom.clientWidth;
    } else {
      height = document.body.clientHeight;
      width = document.body.clientWidth;
    }
    return { height, width };
  };
};

export const uuid = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * 得到两个对象不一样的属性 (以a为基准)
 * @param a
 * @param b
 */
export const diff = (a: any, b: any) => {
  const res: any = {};
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);

  const diffKeys = difference(aKeys, bKeys);

  for (const key of diffKeys) {
    res[key] = a[key];
  }

  // a b 都有的key
  const basicKeys = aKeys.filter((key) => bKeys.includes(key));

  for (const key of basicKeys) {
    if (!isEqual(a[key], b[key])) {
      res[key] = a[key];
    }
  }
  return res;
};

export const computedZoomXY = (x: number, y: number, canvas: ZXFLOW.Canvas) => {
  const zoom = canvas.getZoom();
  let left = x;
  let top = y;
  if (canvas.viewportTransform) {
    left = (left - canvas.viewportTransform[4]) / zoom;
    top = (top - canvas.viewportTransform[5]) / zoom;
  }
  return {
    left,
    top,
  };
};

export const createCanvas: (
  id: string,
  flowArgs: ZXFLOW.FlowArgs,
  type: string
) => ZXFLOW.Canvas = (id, flowArgs, type) => {
  const canvas = new fabric.Canvas(id) as ZXFLOW.Canvas;

  canvas.custonData = {
    id,
    type,
  };
  reset(canvas, flowArgs);

  return canvas;
};
