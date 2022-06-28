import { defineComponent, onMounted } from "vue";
import { fabric } from "fabric";
import xFlow from "./xflow";

export default defineComponent({
  components: { xFlow },
  setup(props, content) {
    return () => <xFlow />;
  },
});
