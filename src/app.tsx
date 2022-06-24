import { defineComponent, onMounted } from "vue";
import { fabric } from "fabric";
import { createCanvas } from "./xflow";
import xFlow from "./xflow/layout";

export default defineComponent({
  components: { xFlow },
  setup(props, content) {
    return () => <xFlow />;
  },
});
