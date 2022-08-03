import { IEvent } from "fabric/fabric-impl";

export const onClick = (
  canvas: MtipIt.Canvas,
  cb: (e: IEvent<MouseEvent>) => void,
  delay: number = 200
) => {
  let times = 0;

  canvas.on("mouse:down:before", () => {
    times = new Date().getTime();
  });
  canvas.on("mouse:up:before", (e) => {
    const newTimes = new Date().getTime();
    if (newTimes - times <= delay) {
      cb(e);
    }
  });
};
