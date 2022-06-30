declare namespace ZXFLOW {
  export interface Canvas extends fabric.Canvas {
    isMoveing: boolean;
    toDragLine: boolean;
    toDragRect: boolean;
    isLineDragIng: boolean;
    lastPosX: number;
    lastPosY: number;
    customData: any;
    removeActiveObject: () => void;
    getItem: (id: string) => fabric.Canvas | fabric.Line | fabric.Group;
  }

  // 画板参数
  export interface FlowArgs {
    thingInfo: ThingInfo;
    activeObj: Object;
  }

  // 物模型属性
  export type ThingInfo = Ref<any>;

  export interface CustomPolyline extends fabric.Polyline {
    edit: boolean;
    points: Array<number>;
  }

  export interface Menu {
    newFile: Array<{
      name: string;
      id: string;
      event: (canvas: Canvas) => void;
    }>;
    list: Array<{
      name: string;
      id: string;
      icon: JSX.Element;
      event: (canvas: Canvas, flowArgs?: FlowArgs) => void;
    }>;
  }
}

declare module "vue3-tabs-chrome";
