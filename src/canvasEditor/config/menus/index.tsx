import {
  BorderOutlined,
  BarsOutlined,
  ApiOutlined,
} from "@ant-design/icons-vue";
import { fabric } from "fabric";

export enum MenuId {
  newXflow = "流程图",
  newThing = "物模型",
  thing = "thing",
  save = "save",
  circle = "circle",
  rect = "rect",
  line = "线",
}

const onLine = (canvas: CanvasEditor.Canvas) => {
  canvas.isCreateLine = true;
  canvas.getObjects().map((item) => {
    item.selectable = false;
    return item;
  });
};
const finishLine = (canvas: CanvasEditor.Canvas) => {
  canvas.isCreateLine = false;
  canvas.getObjects().map((item) => {
    if (item.type !== "line") {
      item.selectable = true;
    }
    return item;
  });
};

const menus: Array<CanvasEditor.MenuItem> = [
  {
    type: "group",
    id: "",
    name: "",
    icon: <BarsOutlined />,
    event(canvas) {},
    child: [
      {
        type: "item",
        id: MenuId.newXflow,
        name: "创建流程图",
        event(canvas) {},
      },
      {
        type: "item",
        id: MenuId.newThing,
        name: "创建物实例",
        event(canvas) {},
      },
    ],
  },
  {
    id: MenuId.rect,
    event(canvas) {
      const rect = new fabric.Rect({
        top: 100, // 距离容器顶部 100px
        left: 100, // 距离容器左侧 100px
        fill: "orange", // 填充 橙色
        width: 100, // 宽度 100px
        height: 100, // 高度 100px
      });
      canvas.add(rect);
      canvas.renderAll();
    },
    type: "item",
    icon: <BorderOutlined />,
    name: "创建矩形",
  },
  {
    id: MenuId.line,
    event(canvas) {
      if (canvas.isCreateLine) {
        finishLine(canvas);
      } else {
        onLine(canvas);
      }
    },
    type: "item",
    icon: <ApiOutlined />,
    name: "创建管道",
  },
];

export default menus;
