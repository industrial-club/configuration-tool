export const ClickEvent = (
  canvas: ZXFLOW.Canvas,
  callBack: (e: fabric.IEvent<MouseEvent>) => void
) => {
  let tim = 0;
  canvas.on("mouse:down", (e) => {
    tim = new Date().getTime();
  });
  canvas.on("mouse:up", (e) => {
    const newTim = new Date().getTime();

    if (newTim - tim <= 200) {
      callBack(e);
    }
  });
};
