import {
  computed,
  defineComponent,
  PropType,
  ref,
  watch,
  createVNode,
} from "vue";
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import { Modal } from "ant-design-vue";
import { svgPath } from "../config";

export default defineComponent({
  emits: ["dropEnd", "dropStart", "createFlow", "deleteFlow", "editFlow"],
  props: {
    thingList: {
      type: Array as PropType<Array<any>>,
      default: () => [],
    },
    flowList: {
      type: Array as PropType<Array<MtipIt.serverFlowInfo>>,
      default: () => [],
    },
    showInstenceId: {
      type: Boolean,
      default: false,
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

    // tabs index
    const tabsIndex = ref("1");

    const active = ref(-1);
    const showConfirm = (title: string, id: string) => {
      Modal.confirm({
        title,
        icon: createVNode(ExclamationCircleOutlined),
        content: "确认删除所选内容吗?",
        okText: "删除",
        cancelText: "取消",
        onOk() {
          content.emit("deleteFlow", id);
        },
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onCancel() {},
      });
    };
    return () => (
      <div
        class={"mtip_it_editor_thing_plane"}
        onContextmenu={(e) => {
          e.preventDefault();
        }}
      >
        <a-tabs v-models={[[tabsIndex.value, "activeKey"]]}>
          <a-tab-pane
            key="1"
            tab="工艺流程图"
            force-render
            class="mtip_it_editor_flow_box"
          >
            {props.flowList.map((item, inx) => (
              <a-dropdown
                trigger={["contextmenu"]}
                v-slots={{
                  overlay: () => (
                    <div class="mtip_it_editor_flow_menu">
                      <div
                        class="mtip_it_editor_flow_i"
                        onClick={() => {
                          showConfirm(item.title, item.id);
                        }}
                      >
                        删除
                      </div>
                    </div>
                  ),
                }}
              >
                <div
                  class="mtip_it_editor_flow_box_item"
                  onDblclick={() => {
                    content.emit("createFlow", item);
                  }}
                  onMousedown={(e: MouseEvent) => {
                    if (e.button === 2) {
                      active.value = inx;
                    }
                  }}
                  onClick={() => {
                    active.value = inx;
                  }}
                >
                  <a-image
                    class={`${
                      active.value === inx
                        ? "mtip_it_editor_flow_active"
                        : "mtip_it_editor_flow_img"
                    }`}
                    width={100}
                    height={100}
                    src={item.image}
                    preview={false}
                    fallback="data:image/png;base64,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"
                  />
                  <span>{item.title}</span>
                </div>
              </a-dropdown>
            ))}
          </a-tab-pane>
          <a-tab-pane key="2" tab="物实例">
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
                      >
                        <img
                          class="thing-item-thumbnail"
                          src={
                            thing.image_run ||
                            "/icons/设备图标汇总_综保数据.svg"
                          }
                        />
                        <span class="thing-item-name">
                          {thing.name}
                          {props.showInstenceId ? `-${thing.id}` : ""}
                        </span>
                      </div>
                    ))}
                  </div>
                </a-collapse-panel>
              ))}
            </a-collapse>
          </a-tab-pane>
        </a-tabs>
      </div>
    );
  },
});
