import { fabric } from "fabric";

const getCenter = (obj: CanvasEditor.Object) => {
  return {
    x: obj.left! + obj.width! / 2,
    y: obj.top! + obj.height! / 2,
  };
};

const createLine = (canvas: CanvasEditor.Canvas) => {
  let beginObj: CanvasEditor.Object | undefined;
  canvas.on("mouse:down:before", (e) => {
    if (e.target) {
      beginObj = e.target;
    } else {
      beginObj = undefined;
    }
  });
  canvas.on("mouse:move", (e) => {
    if (beginObj && !canvas.isCreateLine) {
      beginObj.outLines?.forEach((line: fabric.Path) => {
        const beginPoint: { [key: string]: number } = getCenter(beginObj!);
        const test = (line.path as Array<any>)[0];
        test[1] = beginPoint.x;
        test[2] = beginPoint.y;
      });
      beginObj.inLines?.forEach((line: fabric.Path) => {
        const beginPoint: { [key: string]: number } = getCenter(beginObj!);
        const test = (line.path as Array<any>)[1];
        test[1] = beginPoint.x;
        test[2] = beginPoint.y;
      });
    }
  });
  canvas.on("mouse:up", (e) => {
    const endObj: CanvasEditor.Object | undefined = e.target;
    if (endObj && canvas.isCreateLine && beginObj && beginObj !== endObj) {
      const beginPoint: { [key: string]: number } = getCenter(beginObj);
      const endPoint: { [key: string]: number } = getCenter(endObj);
      var line = new fabric.Path(
        `M ${beginPoint.x} ${beginPoint.y} L ${endPoint.x} ${endPoint.y}`,
        {
          fill: "",
          stroke: "black",
          objectCaching: false,
        }
      );
      canvas.add(line);
      if (!beginObj.outLines) {
        beginObj.outLines = [];
      }
      if (!endObj.inLines) {
        endObj.inLines = [];
      }
      beginObj.outLines.push(line);
      endObj.inLines!.push(line);
      beginObj = undefined;
      canvas.isCreateLine = false;
      canvas.getObjects().map((item) => {
        item.selectable = true;
        return item;
      });
    }
  });
};
export default createLine;
