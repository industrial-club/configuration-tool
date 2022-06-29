declare namespace ZXFLOW {
  export interface Canvas extends fabric.Canvas {
    isDragging: boolean; // 是否为绘制状态
    toDragLine: boolean;
    toDragRect: boolean;
    lastPosX: number;
    lastPosY: number;
    custonData: Object;
    removeActiveObject: () => void;
    getItem: (id: string) => fabric.Canvas | fabric.Line | fabric.Group;
  }

  // 画板参数
  export interface FlowArgs {
    thingInfo: ThingInfo;
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
      event: (canvas: Canvas) => void;
    }>;
  }
}

declare module "vue3-tabs-chrome";
