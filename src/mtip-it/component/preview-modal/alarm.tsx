import { defineComponent, PropType, ref, watch } from "vue";
import { DataItem } from "../preview";

export const Props = {
  data: {
    type: Object as PropType<DataItem>,
    required: true,
  },
};

export default defineComponent({
  props: Props,
  setup(prop, cxt) {
    return () => <div>报警</div>;
  },
});
