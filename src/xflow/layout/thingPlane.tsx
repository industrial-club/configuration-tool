import { computed, defineComponent, ref } from "vue";

export default defineComponent({
  setup() {
    const keyword = ref("");

    const thingList = ref([
      {
        key: "ymzbxt",
        name: "原煤准备系统",
        icons: [
          {
            path: "/icons/设备图标汇总_方仓 .svg",
            name: "101",
          },
          {
            path: "/icons/设备图标汇总_方仓 .svg",
            name: "102",
          },
          {
            path: "/icons/设备图标汇总_方仓 .svg",
            name: "103",
          },
        ],
      },
      {
        key: "zxxt",
        name: "主洗系统",
        icons: [
          {
            path: "/icons/设备图标汇总_综保数据.svg",
            name: "201",
          },
          {
            path: "/icons/设备图标汇总_仪表数据.svg",
            name: "303X",
          },
        ],
      },
    ]);

    const expandedKeys = ref(thingList.value.map((item) => item.key));

    return () => (
      <div class={"thing_plane"}>
        <a-input
          class="search"
          placeholder="请输入搜索内容"
          allowClear
          v-model={[keyword.value, "value"]}
        ></a-input>
        <a-collapse v-model={[expandedKeys.value, "activeKey"]}>
          {thingList.value.map((item) => (
            <a-collapse-panel key={item.key} header={item.name}>
              <div class="thing-list">
                {item.icons.map((icon) => (
                  <div class="thing-item" key={icon.path}>
                    <img
                      class="thing-item-thumbnail"
                      draggable="true"
                      src={icon.path}
                    />
                    <span class="thing-item-name">{icon.name}</span>
                  </div>
                ))}
              </div>
            </a-collapse-panel>
          ))}
        </a-collapse>
      </div>
    );
  },
});
