// 可配置的属性
export const CONFIG_PROPS: any = {
  // width: {
  //   label: "宽度",
  //   type: "number",
  // },
  // height: {
  //   label: "高度",
  //   type: "number",
  // },
  // scaleX: {
  //   label: "横向缩放",
  //   type: "number",
  // },
  // scaleY: {
  //   label: "纵向缩放",
  //   type: "number",
  // },
  fill: {
    label: "填充颜色",
    type: "color",
  },
  // stroke: "描边",
  // strokeWidth: {
  //   label: "边框宽度",
  //   type: "number",
  // },
  // stroke: {
  //   label: "边框颜色",
  //   type: "color",
  // },
  opacity: {
    label: "透明度",
    type: "range",
    props: {
      max: 1,
      min: 0,
      step: 0.01,
    },
  },
  visible: {
    label: "可见",
    type: "switch",
  },
  // angle: {
  //   label: "角度",
  //   type: "number",
  // },
  fontSize: {
    label: "字号",
    type: "number",
  },
};
