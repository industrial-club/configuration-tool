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
  title: { type: String },
  data: {
    type: Object as PropType<DataItem>,
  },
};
const previewModal = defineComponent({
  props: Props,
  components: { State },
  emits: ["update:visible"],
  setup(_props, cxt) {
    const activeKey = ref(0);
    const data = reactive<{
      tab: Array<{ label: string; value?: number; VNode?: VNode; data?: any }>;
    }>({
      tab: [],
    });
    watch(
      () => _props.data,
      (e) => {
        if (e) {
          data.tab = _props.data.tabList;
          data.tab.forEach((item, inx) => {
            item.value = inx;
            if (item.data) item.VNode = <State data={item.data}></State>;
          });
        }
      },
      { immediate: true, deep: true }
    );
    return () => (
      <a-modal
        v-models={[[_props.visible, "visible"]]}
        title={_props.title}
        width="40%"
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
