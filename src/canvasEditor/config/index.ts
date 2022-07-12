import Menus from "./menus";

export const uuid = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

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

export const computedZoomXY = (
  x: number,
  y: number,
  canvas: CanvasEditor.Canvas
) => {
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

export const svgPath = {
  get() {
    const ss = window.sessionStorage.getItem("svgPath");
    return JSON.parse(ss!);
  },
  set(val: string) {
    window.sessionStorage.setItem("svgPath", val);
  },
  clear() {
    window.sessionStorage.setItem("svgPath", "");
  },
};

export const previewInfo = {
  get() {
    return window.sessionStorage.getItem("previewInfo");
  },
  set(val: string) {
    window.sessionStorage.setItem("previewInfo", JSON.stringify(val));
  },
  clear() {
    window.sessionStorage.setItem("previewInfo", "");
  },
};

export default { Menus, uuid, computedZoomXY };
