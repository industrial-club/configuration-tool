import { defineComponent, onMounted } from "vue";
// import xFlow from "./xflow";
import canvasEditor from "./canvasEditor";
import "./index.less";

export default defineComponent({
  components: { canvasEditor },
  setup(props, content) {
    return () => <canvasEditor />;
  },
});
