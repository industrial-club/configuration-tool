import { defineComponent, ref } from "vue";
import { svgPath } from "../config";
import ThingList from "../config/thingList";

export default defineComponent({
  emits: ["dropEnd", "dropStart", "openIcon"],
  props: {},
  setup(props, content) {
    const keyword = ref("");

    const thingList = ref(ThingList);

    const expandedKeys = ref(thingList.value.map((item) => item.key));

    const thinginfo = ref();
    return () => (
      <div class={"canvas_editor_thing_plane"}>
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
                  <div
                    class="thing-item"
                    key={icon.path}
                    draggable="true"
                    onDragstart={() => {
                      svgPath.set(JSON.stringify(icon));
                    }}
                    onDragend={() => {
                      svgPath.clear();
                    }}
                    onDblclick={() => {
                      content.emit("openIcon", icon);
                    }}
                  >
                    <img class="thing-item-thumbnail" src={icon.path} />
                    <span class="thing-item-name">{icon.data.name}</span>
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
