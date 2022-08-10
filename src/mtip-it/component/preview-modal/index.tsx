import {
  computed,
  defineComponent,
  PropType,
  reactive,
  ref,
  VNode,
  watch,
} from "vue";
import State from "./state";
import Alarm from "./alarm";
import Control from "./control";
import { DataItem, StateItem } from "../preview";
/**
 * 预览弹窗
 */

export const Props = {
  visible: {
    type: Boolean,
  },
  title: { type: Number },
  // data: {
  //   type: Object as PropType<DataItem>,
  //   required: true,
  // },
  state: Object as PropType<StateItem>,
};
const previewModal = defineComponent({
  props: Props,
  components: { State },
  emits: ["update:visible"],
  setup(_props, cxt) {
    const activeKey = ref(1);
    const data = reactive<{
      tab: Array<{ label: string; value: number; VNode?: VNode }>;
    }>({
      tab: [
        { label: "状态", value: 1, VNode: <State data={_props.state} /> },
        { label: "报警", value: 2 },
        { label: "控制", value: 3 },
      ],
    });
    return () => (
      <a-modal
        v-models={[[_props.visible, "visible"]]}
        title={_props.title}
        width="50%"
        // closable={false}
        footer={null}
        wrap-class-name="preview-modal"
        onCancel={() => {
          cxt.emit("update:visible", false);
        }}
      >
        <a-tabs v-model={activeKey.value}>
          {data.tab.map((item) => (
            <a-tab-pane key={item.value} tab={item.label}>
              {item.VNode}
            </a-tab-pane>
          ))}
        </a-tabs>
      </a-modal>
    );
  },
});

export default previewModal;
