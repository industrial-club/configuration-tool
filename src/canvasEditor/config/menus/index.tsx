import {
  ApiOutlined,
  BorderOutlined,
  SaveOutlined,
  BarsOutlined,
} from "@ant-design/icons-vue";
import { fabric } from "fabric";
import { toRaw } from "vue";

export enum MenuId {
  newXflow = "newXflow",
  newThing = "newThing",
  thing = "thing",
  save = "save",
  circle = "circle",
  rect = "rect",
}

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
];

export default menus;
