declare namespace MtipIt {
  export interface Canvas extends fabric.Canvas {
    isCreateLine: boolean;
  }
  export interface Item {
    id: string;
    name: string;
    canvas: any; // Canvas as
    type: "flow" | "thing";
    thingPath?: string;
    flowJson?: string;
  }

  export interface ThingItem {
    id: string | number;
    name: string;
    style: string;
    image_run: string;
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
