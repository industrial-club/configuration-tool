import { fabric } from "fabric";

export function polygonPositionHandler(dim, finalMatrix, fabricObject) {
  var x = fabricObject.points[this.pointIndex].x - fabricObject.pathOffset.x,
    y = fabricObject.points[this.pointIndex].y - fabricObject.pathOffset.y;
  return fabric.util.transformPoint(
    { x: x, y: y },
    fabric.util.multiplyTransformMatrices(
      fabricObject.canvas.viewportTransform,
      fabricObject.calcTransformMatrix()
    )
  );
}

export function getObjectSizeWithStroke(object) {
  var stroke = new fabric.Point(
    object.strokeUniform ? 1 / object.scaleX : 1,
    object.strokeUniform ? 1 / object.scaleY : 1
  ).multiply(object.strokeWidth);
  return new fabric.Point(object.width + stroke.x, object.height + stroke.y);
}

// define a function that will define what the control does
// this function will be called on every mouse move after a control has been
// clicked and is being dragged.
// The function receive as argument the mouse event, the current trasnform object
// and the current position in canvas coordinate
// transform.target is a reference to the current object being transformed,
export function actionHandler(eventData, transform, x, y) {
  var polygon = transform.target,
    currentControl = polygon.controls[polygon.__corner],
    mouseLocalPosition = polygon.toLocalPoint(
      new fabric.Point(x, y),
      "center",
      "center"
    ),
    polygonBaseSize = getObjectSizeWithStroke(polygon),
    size = polygon._getTransformedDimensions(0, 0),
    finalPointPosition = {
      x:
        (mouseLocalPosition.x * polygonBaseSize.x) / size.x +
        polygon.pathOffset.x,
      y:
        (mouseLocalPosition.y * polygonBaseSize.y) / size.y +
        polygon.pathOffset.y,
    };
  polygon.points[currentControl.pointIndex] = finalPointPosition;
  return true;
}

// define a function that can keep the polygon in the same position when we change its
// width/height/top/left.
export function anchorWrapper(anchorIndex, fn) {
  return function (eventData, transform, x, y) {
    var fabricObject = transform.target,
      absolutePoint = fabric.util.transformPoint(
        {
          x: fabricObject.points[anchorIndex].x - fabricObject.pathOffset.x,
          y: fabricObject.points[anchorIndex].y - fabricObject.pathOffset.y,
        },
        fabricObject.calcTransformMatrix()
      ),
      actionPerformed = fn(eventData, transform, x, y),
      newDim = fabricObject._setPositionDimensions({}),
      polygonBaseSize = getObjectSizeWithStroke(fabricObject),
      newX =
        (fabricObject.points[anchorIndex].x - fabricObject.pathOffset.x) /
        polygonBaseSize.x,
      newY =
        (fabricObject.points[anchorIndex].y - fabricObject.pathOffset.y) /
        polygonBaseSize.y;
    fabricObject.setPositionByOrigin(absolutePoint, newX + 0.5, newY + 0.5);
    return actionPerformed;
  };
}

export const createControlPoint = (poly: ZXFLOW.CustomPolyline) => {
  var lastControl = poly.points.length - 1;
  poly.cornerStyle = "circle";
  poly.cornerColor = "rgba(0,0,255,0.5)";
  poly.controls = poly.points.reduce(function (acc, point, index) {
    (acc as Record<string, fabric.Control>)[`p${index}`] = new fabric.Control({
      positionHandler: polygonPositionHandler,
      actionHandler: anchorWrapper(
        index > 0 ? index - 1 : lastControl,
        actionHandler
      ),
      actionName: "modifyPolygon",
      pointIndex: index,
    });
    return acc;
  }, {});
};

export const addControlPoint = (
  canvas: ZXFLOW.Canvas,
  e: fabric.IEvent<MouseEvent>
) => {
  const edit = customLineEdit(canvas);
  if (e.transform?.action !== "modifyPolygon") {
    // const { points } = e.target as ZXFLOW.CustomPolyline;
    // // 当点击到控制点
    // const { offsetX, offsetY } = e.transform as any;
    // points.push({
    //   x: offsetX,
    //   y: offsetY,
    // });
    // fabric.util.rotatePoint
    // canvas.renderAll();
    // console.log({ offsetX, offsetY });
    console.log(e);
  }
};

const customLineEdit = (canvas: ZXFLOW.Canvas) => {
  return function (poly: ZXFLOW.CustomPolyline) {
    canvas.setActiveObject(poly);
    poly.edit = !poly.edit;
    if (poly.edit) {
      createControlPoint(poly);
    } else {
      poly.cornerColor = "blue";
      poly.cornerStyle = "rect";
      poly.controls = fabric.Object.prototype.controls;
    }
    poly.hasBorders = !poly.edit;
    canvas.requestRenderAll();
  };
};

export default customLineEdit;
