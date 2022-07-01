const createLine = (canvas: CanvasEditor.Canvas) => {
  const onLine = () => {
    canvas.isCreateLine = true;
    canvas.getObjects().map((item) => {
      item.selectable = false;
      return item;
    });
    canvas.selection = true;
  };
  const finushLine = () => {
    canvas.isCreateLine = false;
    canvas.getObjects().map((item) => {
      item.selectable = true;
      return item;
    });
    canvas.selection = false;
  };

  canvas.on("mouse:down:before", () => {
    onLine();
  });
  canvas.on("mouse:up", () => {
    onLine();
  });
};
export default createLine;
