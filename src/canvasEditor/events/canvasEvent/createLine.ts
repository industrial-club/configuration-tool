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
    if (beginObj && !canvas.isCreateLine && beginObj.type === "rect") {
      beginObj.outLines?.forEach((lineId: number) => {
        const beginPoint: { [key: string]: number } = getCenter(beginObj!);
        const line: CanvasEditor.Path = canvas._objects.find(
          (ele: CanvasEditor.Object) => {
            return ele.id === lineId;
          }
        ) as CanvasEditor.Path;
        const test = (line.path as Array<any>)[0];
        test[1] = beginPoint.x;
        test[2] = beginPoint.y;
      });
      beginObj.inLines?.forEach((lineId: number) => {
        const beginPoint: { [key: string]: number } = getCenter(beginObj!);
        const line: CanvasEditor.Path = canvas._objects.find(
          (ele: CanvasEditor.Object) => {
            return ele.id === lineId;
          }
        ) as CanvasEditor.Path;
        const test = (line.path as Array<any>)[1];
        test[1] = beginPoint.x;
        test[2] = beginPoint.y;
      });
    }
    if (beginObj && !canvas.isCreateLine && beginObj.type === "line") {
      console.log(e);
    }
  });
  canvas.on("mouse:up", (e) => {
    const endObj: CanvasEditor.Object | undefined = e.target;
    if (beginObj && !canvas.isCreateLine && beginObj.type === "rect") {
      [...(beginObj.outLines || []), ...(beginObj.inLines || [])]?.forEach(
        (lineId: number) => {
          const line: CanvasEditor.Path = canvas._objects.find(
            (ele: CanvasEditor.Object) => {
              return ele.id === lineId;
            }
          ) as CanvasEditor.Path;
          const path = line.path;
          canvas.remove(line);
          const newLine: CanvasEditor.Path = new fabric.Path(path, {
            fill: "",
            stroke: "black",
            objectCaching: false,
            strokeWidth: 10,
            selectable: false,
            hasControls: false,
          });
          newLine.id = lineId;
          newLine.type = "line";
          canvas.add(newLine);
        }
      );
    }
    if (endObj && canvas.isCreateLine && beginObj && beginObj !== endObj) {
      const beginPoint: { [key: string]: number } = getCenter(beginObj);
      const endPoint: { [key: string]: number } = getCenter(endObj);
      const line: CanvasEditor.Path = new fabric.Path(
        `M ${beginPoint.x} ${beginPoint.y} L ${endPoint.x} ${endPoint.y}`,
        {
          fill: "",
          stroke: "black",
          objectCaching: false,
          strokeWidth: 10,
          selectable: false,
          hasControls: false,
        }
      );
      line.id = Math.random();
      line.type = "line";
      canvas.add(line);
      if (!beginObj.outLines) {
        beginObj.outLines = [];
      }
      if (!endObj.inLines) {
        endObj.inLines = [];
      }
      beginObj.outLines.push(line.id);
      endObj.inLines!.push(line.id);
      beginObj = undefined;
      canvas.isCreateLine = false;
      canvas.getObjects().map((item) => {
        if (item.type !== "line") {
          item.selectable = true;
        }
        return item;
      });

      canvas.renderAll();
    }
    beginObj = undefined;
  });
};
export default createLine;
