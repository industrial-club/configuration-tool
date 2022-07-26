declare namespace MtipIt {
  export type EventsList = "mousedown" | "move";
  export interface Canvas extends fabric.Canvas {
    isCreateLine: boolean;
    isMoveing: boolean;
    lastPosX: number;
    lastPosY: number;
  }
  export interface Item {
    id: string;
    name: string;
    canvas: any; // Canvas as
    type: "flow" | "thing";
    events?: Partial<Record<EventsList, string /* (e: MouseEvent) => void */>>;
    thingPath?: string;
    flowJson?: string;
    thingInfo?: any;
  }

  export interface IProperty {
    name: string; // 唯一标识
    code: string; // 属性code
    content: string; // 属性内容
    style?: Partial<fabric.IObjectOptions>; // 属性样式
    position?: {
      top?: number;
      left?: number;
    }; // 属性位置
    size?: {
      width: number;
      height: number;
    };
  }

  export interface ThingItem {
    id: string | number;
    name: string;
    size?: { [key: string]: number };
    style: string;
    image_run: string;
    properties: Array<Record<string, unknown>>;
    events?: Partial<Record<EventsList, string /* (e: MouseEvent) => void */>>;
  }

  export interface ThingGroup {
    name: string;
    code: string;
    elements: Array<ThingItem>;
  }

  export type ThingGroupList = Array<ThingGroup>;

  export interface MenuItem {
    type: MenuItemType;
    name: string;
    id: string;
    icon?: JSX.Element;
    event: (canvas: Canvas) => void;
    child?: Array<MenuItem>;
  }

  export interface Object extends fabric.Object {
    outLines?: number[];
    inLines?: number[];
    id?: number;
    effectType?: string;
  }

  export interface Path extends fabric.Path {
    id?: number;
    points?: number[];
    path: any[];
    data?: any;
    tempPoint: id;
    effectType?: string;
  }

  export interface Circle extends fabric.Circle {
    id?: number;
    lineId?: number;
    effectType?: string;
  }
}
