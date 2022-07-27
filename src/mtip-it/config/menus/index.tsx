import {
  BorderOutlined,
  BarsOutlined,
  ApiOutlined,
  SaveOutlined,
  FastForwardOutlined,
} from "@ant-design/icons-vue";
import { fabric } from "fabric";
import { previewInfo } from "..";
import api from "@/mtip-it/api";
import { message } from "ant-design-vue";

export enum MenuId {
  newXflow = "流程图",
  newThing = "物模型",
  thing = "thing",
  save = "save",
  circle = "circle",
  rect = "rect",
  line = "线",
  see = "看",
}

const onLine = (canvas: MtipIt.Canvas) => {
  canvas.isCreateLine = true;
  canvas.getObjects().map((item) => {
    item.selectable = false;
    return item;
  });
};
const finishLine = (canvas: MtipIt.Canvas) => {
  canvas.isCreateLine = false;
  canvas.getObjects().map((item) => {
    if (item.type !== "line") {
      item.selectable = true;
    }
    return item;
  });
};

const menus: Array<MtipIt.MenuItem> = [
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
  {
    id: MenuId.save,
    event(canvas) {
      const canvasJson: any = canvas.toJSON();
      previewInfo.set(canvas.toJSON());
      canvasJson?.objects.forEach((element: any) => {
        if (element.effectType === "line") {
          element.perPixelTargetFind = true;
          element.lockMovementX = true;
          element.lockMovementY = true;
        }
      });
      canvasJson.zoom = canvas.getZoom();
      api
        .post(
          "/thing/v1/adapter/thing/inst/saveTopoMap",
          JSON.stringify(canvasJson)
        )
        .then((res: any) => {
          if (res.code === "M0000") {
            message.success("保存成功");
          } else {
            message.error(res.message);
          }
        });
    },
    type: "item",
    icon: <SaveOutlined />,
    name: "保存",
  },
  {
    id: MenuId.see,
    event(canvas) {},
    type: "item",
    icon: <FastForwardOutlined />,
    name: "预览",
  },
];

export default menus;
