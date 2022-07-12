import { defineComponent, onMounted } from "vue";
// import canvasEditor from "./canvasEditor";
import canvasEditor from "./mtip-it";
import "./index.less";

export default defineComponent({
  components: { canvasEditor },
  setup(props, content) {
    return () => <canvasEditor />;
  },
});
