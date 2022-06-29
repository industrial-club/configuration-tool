import { Ref } from "vue";
import events from "./events/event";

export type ThingInfo = Ref<any>;

export const reset = (canvas: ZXFLOW.Canvas, flowArgs: ZXFLOW.FlowArgs) => {
  // 事件
  events(canvas, flowArgs);
};
