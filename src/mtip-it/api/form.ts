import instance from ".";

/**
 * 根据物实例id获取物实例thingCode
 * @param id 物实例id
 */
export const getThingCode = (id: string) =>
  instance.get(`/thing/v1/adapter/thing/inst/find/${id}`);

/**
 * 根据Thingcode获取物实例属性
 * @param code 物实例thingCode
 * @returns
 */
export const getThingDetail = (code: string) =>
  instance.get(`/thing/v1/core/thing/findByCode/${code}`);
