import { fabric } from "fabric";

export default () => {
  const fabricPrototype = (fabric.Canvas as any).prototype;
  fabricPrototype["getItem"] = function () {};
  fabricPrototype["removeActiveObject"] = function () {
    const Item = this.getActiveObject();
    this.remove(Item);
  };
};
