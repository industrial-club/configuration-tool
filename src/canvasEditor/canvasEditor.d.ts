declare namespace CanvasEditor {
  export interface TabItem {
    name: string;
    id: string;
    type: string;
    menuInfo: CanvasEditor.MenuItem;
  }

  export interface Object extends fabric.Object {
    outLines?: fabric.Path[];
    inLines?: fabric.Path[];
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
