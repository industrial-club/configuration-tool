const thingList: MtipIt.ThingGroupList = [
  {
    code: "system_mt",
    name: "system_mt",
    elements: [
      {
        id: 66,
        name: "生产系统",
        style: "[{key:value},{key1:value1}]",
        image_run: "/icons/设备图标汇总_综保数据.svg",
        events: {
          click: "console.log(e)",
        },
        properties: [
          {
            code: "ALARM_ZHOUJIE",
            name: "_property_ALARM_ZHOUJIE",
            content: "周界报警: 100m",
            style: {
              fill: "#ff0000",
              fontSize: 16,
            },
            position: {
              top: 0,
              left: 0,
            },
          },
          {
            code: "ALARM_OFF",
            name: "_property_ALARM_OFF",
            content: "相机断线: 100m",
            style: {
              fill: "#ff0000",
              fontSize: 16,
            },
            position: {
              top: 22,
              left: 0,
            },
          },
        ],
      },
      // {
      //   id: 1,
      //   name: "原煤准备系统",
      //   style: "[{key:value},{key1:value1}]",
      //   image_run: "/icons/设备图标汇总_仪表数据.svg",
      // },
      // {
      //   id: 157,
      //   name: "重介旋流器分选系统",
      //   style: "[{key:value},{key1:value1}]",
      //   image_run: "/icons/设备图标汇总_方仓 .svg",
      // },
    ],
  },
];

export default thingList;
