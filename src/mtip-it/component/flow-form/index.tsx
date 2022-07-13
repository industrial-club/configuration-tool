import { computed, defineComponent, PropType, watch } from "vue";
import { fabric } from "fabric";
import PropertiesForm from "../properties-form";

/**
 * 流程图表单
 */
const FlowForm = defineComponent({
  props: {
    widget: {
      type: Object as PropType<fabric.Object>,
    },
  },
  setup(props) {
    // 是否展示属性表单 (选中连线)
    const showProperties = computed(() => props.widget?.type === "line");

    return () => (
      <div class="index">
        {showProperties.value ? (
          <PropertiesForm widget={props.widget!} />
        ) : (
          <a-empty />
        )}
      </div>
    );
  },
});

export default FlowForm;
