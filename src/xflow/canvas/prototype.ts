import { fabric } from "fabric";

export default () => {
  const fabricPrototype = fabric.Canvas.prototype;
  fabricPrototype["getItem"] = function (id: string) {
    const objs = this.getObjects();
    const item = objs.find((item) => item.data?.id === id);
    return item;
  };
  fabricPrototype["removeActiveObject"] = function () {
    const Item = this.getActiveObject();
    this.remove(Item);
  };
};
