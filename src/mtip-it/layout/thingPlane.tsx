import { defineComponent, ref } from "vue";
import { svgPath } from "../config";
import ThingList from "../config/thingList";

export default defineComponent({
  emits: ["dropEnd", "dropStart", "openThing"],
  props: {},
  setup(props, content) {
    const keyword = ref("");

    const thingList = ref(ThingList);

    const expandedKeys = ref(thingList.value.map((item) => item.code));

    return () => (
      <div class={"mtip_it_editor_thing_plane"}>
        <a-input
          class="search"
          placeholder="请输入搜索内容"
          allowClear
          v-model={[keyword.value, "value"]}
        ></a-input>
        <a-collapse v-model={[expandedKeys.value, "activeKey"]}>
          {thingList.value.map((item) => (
            <a-collapse-panel key={item.code} header={item.name}>
              <div class="thing-list">
                {item.elements.map((thing) => (
                  <div
                    class="thing-item"
                    key={thing.id}
                    draggable="true"
                    onDragstart={() => {
                      svgPath.set(JSON.stringify(thing));
                    }}
                    onDragend={() => {
                      svgPath.clear();
                    }}
                    onDblclick={() => {
                      content.emit("openThing", thing);
                    }}
                  >
                    <img
                      class="thing-item-thumbnail"
                      src={
                        thing.image_run || "/icons/设备图标汇总_综保数据.svg"
                      }
                    />
                    <span class="thing-item-name">{thing.name}</span>
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
