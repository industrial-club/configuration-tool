import { computed, defineComponent, PropType, watch } from "vue";
import { fabric } from "fabric";
import PropertiesForm from "../properties-form";

/**
 * 流程图表单
 */
const FlowForm = defineComponent({
  props: {
    widget: {
      type: Object as PropType<MtipIt.Object>,
    },
  },
  setup(props) {
    watch(
      () => props.widget,
      (val) => {
        if (val && !val.data) {
          val.data = {};
        }
      },
      { immediate: true }
    );

    // 是否展示属性表单 (选中连线)
    const isLine = computed(() => props.widget.effectType === "line");

    return () => (
      <div class="index">
        <PropertiesForm widget={props.widget!} />
        {!isLine.value && (
          <a-form labelCol={{ style: { width: "6em" } }}>
            <a-form-item label="组名">
              <a-input
                v-model={[props.widget.data.groupName, "value"]}
              ></a-input>
            </a-form-item>
            <a-form-item label="标签名">
              <a-input v-model={[props.widget.data.tagName, "value"]}></a-input>
            </a-form-item>
          </a-form>
        )}
      </div>
    );
  },
});

export default FlowForm;
