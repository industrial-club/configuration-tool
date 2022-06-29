import { computed, defineComponent, ref } from "vue";
import ThingList from "../config/thingList";

export default defineComponent({
  emits: ["dropEnd", "dropStart"],
  props: {},
  setup(props, content) {
    const keyword = ref("");

    const thingList = ref(ThingList);

    const expandedKeys = ref(thingList.value.map((item) => item.key));

    const thinginfo = ref();
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
                      onDragstart={() => {
                        thinginfo.value = icon;
                        content.emit("dropStart", icon);
                      }}
                      onDragend={() => {
                        content.emit("dropEnd", icon);
                      }}
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
