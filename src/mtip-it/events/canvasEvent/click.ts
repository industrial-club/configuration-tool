import { IEvent } from "fabric/fabric-impl";

export const onClick = (
  canvas: MtipIt.Canvas | MtipIt.Object,
  cb: (e: IEvent<MouseEvent>) => void,
  delay: number = 200,
  isObject?: boolean
) => {
  let times = 0;
  const startEvent = !isObject ? "mouse:down:before" : "mousedown";
  const endEvent = !isObject ? "mouse:up:before" : "mouseup";
  canvas.on(startEvent, () => {
    times = new Date().getTime();
  });
  canvas.on(endEvent, (e) => {
    const newTimes = new Date().getTime();
    if (newTimes - times <= delay) {
      cb(e);
    }
  });
};
