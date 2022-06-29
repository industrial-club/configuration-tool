import {
  ApiOutlined,
  BorderOutlined,
  SaveOutlined,
} from "@ant-design/icons-vue";
import { uuid } from "../utils";
import Default from "./default";

const meuns: ZXFLOW.Menu = {
  newFile: [
    {
      name: "新建流程图",
      id: "add-xflow",
      event(canvas) {},
    },
    {
      name: "新建实例",
      id: "add-thing",
      event(canvas) {},
    },
  ],
  list: [
    {
      name: "矩形",
      id: "add-rect",
      icon: <BorderOutlined />,
      event(canvas) {
        const rect = Default.react();
        rect.data = {
          id: uuid(),
          type: "rect",
        };
        canvas.add(rect);
        canvas.renderAll();
      },
    },
    {
      name: "连线",
      id: "custom-line",
      icon: <ApiOutlined />,
      event(canvas) {
        const line = Default.line();
        line.data = {
          id: uuid(),
          type: "custom-line",
        };
        canvas.add(line);
      },
    },
    {
      name: "保存",
      id: "event-save",
      icon: <SaveOutlined />,
      event(canvas) {
        const canvasJSon = canvas.toJSON();
        const canvasCustomData = canvas.custonData;
        console.log(canvasJSon);
        console.log(canvasCustomData);
      },
    },
  ],
};

export default meuns;
