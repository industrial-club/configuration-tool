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

export const computedZoomXY = (x: number, y: number, canvas: MtipIt.Canvas) => {
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
    const info = window.sessionStorage.getItem("previewInfo");
    const localtion = window.sessionStorage.getItem("editor_localtion");
    const zoom = window.sessionStorage.getItem("editor_zoom");
    return {
      info,
      localtion: JSON.parse(localtion),
      zoom,
    };
  },
  set(info: string, localtion: string, zoom: string) {
    window.sessionStorage.setItem("previewInfo", JSON.stringify(info));
    window.sessionStorage.setItem("editor_localtion", localtion);
    window.sessionStorage.setItem("editor_zoom", zoom);
  },
  clear() {
    window.sessionStorage.setItem("previewInfo", "");
  },
};
