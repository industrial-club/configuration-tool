import { remove } from "lodash";

export default (canvas: MtipIt.Canvas) => {
  const getObjById = (canvas: MtipIt.Canvas, id: number) => {
    return canvas._objects.find((ele: MtipIt.Object) => {
      return ele.id === id;
    });
  };
  const removeLine = (canvas: MtipIt.Canvas, line: MtipIt.Path) => {
    const from: MtipIt.Object = getObjById(canvas, line.data?.from!)!;
    const to: MtipIt.Object = getObjById(canvas, line.data?.to!)!;
    from.outLines = from.outLines?.filter((id) => {
      id !== line.data.from;
    });
    to.inLines = to.inLines?.filter((id) => {
      id !== line.data.to;
    });
    const temp = getObjById(canvas, line.tempPoint!)!;
    canvas.remove(temp);
    line.points?.forEach((id: number) => {
      const p = getObjById(canvas, id)!;
      canvas.remove(p);
    });
    canvas.remove(line);
  };

  window.addEventListener("keydown", (e) => {
    if (e.key === "Backspace" || e.key === "Delete") {
      const target: MtipIt.Object = canvas.getActiveObject();
      if (target?.effectType === "line") {
        removeLine(canvas, target as MtipIt.Path);
      } else if (target?.effectType === "point") {
        const point = target as MtipIt.Circle;
        const line: MtipIt.Path = getObjById(
          canvas,
          point.lineId!
        ) as MtipIt.Path;
        const index: number = line.points?.indexOf(point.id!)!;
        line.points?.splice(index, 1);
        line.path.splice(index + 1, 1);
        canvas.remove(point);
      } else if (target?.effectType === "rect") {
        const rect: MtipIt.Object = target;
        [...(rect.outLines || []), ...(rect.inLines || [])]?.forEach(
          (id: number) => {
            const line: MtipIt.Path = getObjById(canvas, id) as MtipIt.Path;
            removeLine(canvas, line);
          }
        );
        canvas.remove(rect);
      }
    }
  });
};
