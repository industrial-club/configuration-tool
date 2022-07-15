declare namespace MtipIt {
  export type EventsList = "mouse:down" | "move";
  export interface Canvas extends fabric.Canvas {
    isCreateLine: boolean;
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
  }

  export interface ThingItem {
    id: string | number;
    name: string;
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
}
