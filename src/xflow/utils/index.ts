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
