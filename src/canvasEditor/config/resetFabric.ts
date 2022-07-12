import { fabric } from "fabric";

export const resetFabric = () => {
  const newList = ["Line", "Group", "Rect", "Point", "Path"];
  for (let i of newList) {
    (fabric as any)[i].prototype["toObject"] = (function (toObject) {
      return function () {
        return fabric.util.object.extend(toObject.call(this), {
          data: (this as any).data,
          id: this.id || "aaa",
        });
      };
    })((fabric as any)[i].prototype["toObject"]);
  }
};
