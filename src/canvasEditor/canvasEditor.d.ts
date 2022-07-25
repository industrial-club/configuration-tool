declare namespace CanvasEditor {
  export interface TabItem {
    name: string;
    id: string;
    type: string;
    menuInfo: CanvasEditor.MenuItem;
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
  }

  export interface Circle extends fabric.Circle {
    id?: number;
    lineId?: number;
  }

  export interface Canvas extends fabric.Canvas {
    isMoveing: boolean;
    lastPosX: number;
    lastPosY: number;
    TabInfo: TabItem;
    isCreateLine: boolean;
  }

  type MenuItemType = "group" | "item";
  export interface MenuItem {
    type: MenuItemType;
    name: string;
    id: string;
    icon?: JSX.Element;
    event: (canvas: Canvas) => void;
    child?: Array<MenuItem>;
  }
}
