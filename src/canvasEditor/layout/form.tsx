import { defineComponent } from "vue";

export default defineComponent({
  setup(prop, context) {
    return () => <div class={"canvas_editor_form_box"}>form 表单</div>;
  },
});
