import { computed, defineComponent, PropType, ref, watch } from "vue";
import { svgPath } from "../config";

export default defineComponent({
  emits: ["dropEnd", "dropStart", "openThing"],
  props: {
    thingList: {
      type: Array as PropType<Array<any>>,
      default: () => [],
    },
  },
  setup(props, content) {
    const keyword = ref("");

    // 通过关键字过滤
    const filteredList = computed(() => {
      return props.thingList.map((item) => {
        return {
          ...item,
          elements: item.elements.filter((element: any) =>
            element.name.includes(keyword.value)
          ),
        };
      });
    });

    const expandedKeys = ref<string[]>([]);
    watch(
      () => filteredList,
      () => (expandedKeys.value = filteredList.value.map((item) => item.code)),
      { immediate: true, deep: true }
    );

    return () => (
      <div class={"mtip_it_editor_thing_plane"}>
        <div class="search">
          <a-input
            placeholder="请输入搜索内容"
            allowClear
            v-model={[keyword.value, "value"]}
          ></a-input>
        </div>
        <a-collapse v-model={[expandedKeys.value, "activeKey"]}>
          {filteredList.value.map((item) => (
            <a-collapse-panel key={item.code} header={item.name}>
              <div class="thing-list">
                {item.elements.map((thing: any) => (
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
