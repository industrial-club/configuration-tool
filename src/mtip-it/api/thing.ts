import instance from ".";

/**
 * 获取物实例列表
 */
export const getThingList = () =>
  instance.get("/thing/v1/adapter/thing/inst/topoInsts");

/**
 * 保存实例信息
 * @param id id
 * @param style 自定义属性
 */
export const saveThingInfo = (id: string, style: any) =>
  instance.post("/thing/v1/adapter/thing/inst/saveTopoInst", {
    id,
    style: JSON.stringify(style),
  });
