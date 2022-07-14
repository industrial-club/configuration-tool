export default (canvas: MtipIt.Canvas) => {
  window.addEventListener("keydown", (e) => {
    if (e.key === "Backspace" || e.key === "Delete") {
      canvas.remove(canvas.getActiveObject());
    }
  });
};
