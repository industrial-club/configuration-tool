import { fabric } from "fabric";
import {
  ApiOutlined,
  BorderOutlined,
  SaveOutlined,
} from "@ant-design/icons-vue";
import Default from "./default";
import { Mcanvas } from "../canvas";
import { Ref } from "vue";

export default {
  newFile: [
    {
      name: "新建流程图",
      id: "add-xflow",
      event(canvas: Mcanvas) {},
    },
    {
      name: "新建实例",
      id: "add-thing",
      event(canvas: Mcanvas) {},
    },
  ],
  list: [
    {
      name: "矩形",
      id: "add-rect",
      icon: <BorderOutlined />,
      event(canvas: Mcanvas) {
        const rect = Default.react();
        canvas.add(rect);
        canvas.renderAll();
      },
    },
    {
      name: "连线",
      id: "add-line",
      icon: <ApiOutlined />,
      event(canvas: Mcanvas) {},
    },
    {
      name: "保存",
      id: "event-save",
      icon: <SaveOutlined />,
      event(canvas: Mcanvas) {
        const canvasJSon = canvas.toJSON();
        const canvasCustomData = canvas.custonData;
        console.log(canvasJSon);
      },
    },
  ],
};
