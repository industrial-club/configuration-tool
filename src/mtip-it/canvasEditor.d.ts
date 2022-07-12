declare namespace MtipIt {
  export interface Canvas extends fabric.Canvas {}
  export interface Item {
    id: string;
    name: string;
    canvas: any; // Canvas as
    type: "flow" | "thing";
  }
}
