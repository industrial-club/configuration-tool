import { fabric } from "fabric";

const createLine = (canvas: CanvasEditor.Canvas) => {
  let beginObj: CanvasEditor.Object;
  canvas.on("mouse:down:before", (e) => {
    console.log(e);
    if (e.target && canvas.isCreateLine) {
      beginObj = e.target;
    }
  });
  canvas.on("mouse:up", (e) => {
    const endObj = e.target;
    if (endObj && canvas.isCreateLine && beginObj && beginObj !== endObj) {
      const beginPoint: { [key: string]: number } = {
        x: beginObj.left! + beginObj.width! / 2,
        y: beginObj.top! + beginObj.height! / 2,
      };
      const endPoint: { [key: string]: number } = {
        x: endObj.left! + endObj.width! / 2,
        y: endObj.top! + endObj.height! / 2,
      };
      var line = new fabric.Path(
        `M ${beginPoint.x} ${beginPoint.y} L ${endPoint.x} ${endPoint.y}`,
        {
          fill: "",
          stroke: "black",
          objectCaching: false,
        }
      );
      canvas.add(line);
      beginObj.outLines?.push(line);
      beginObj.inLines?.push(line);
    }
  });
};
export default createLine;
