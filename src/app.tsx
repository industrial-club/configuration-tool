import { defineComponent, onMounted, ref } from "vue";
import inl from "inl-ui";
import canvasEditor from "./mtip-it";
import "./index.less";

export default defineComponent({
  components: { canvasEditor },
  setup(props, content) {
    const state = ref(false);
    const login = new inl.utils.login();
    login.getTokenByCode().then((res) => {
      if (res.token) {
        state.value = true;
      }
    });
    return () => (state.value ? <canvasEditor /> : "");
  },
});
