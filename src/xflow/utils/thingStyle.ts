export const getThingStyle = (canvas: ZXFLOW.Canvas) => {
  const object = canvas.getActiveObject() || canvas.getActiveObjects();
  console.log(object);
};
