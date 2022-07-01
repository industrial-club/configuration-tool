import { defineComponent } from "vue";
import { CanvasInfo } from "..";

export default defineComponent({
  props: {
    canvasInfo: Array<CanvasInfo>,
    tabsActiveIndex: String,
  },
  setup(prop, context) {
    const findCanvasById = (id: string) => {
            return prop.canvasInfo!.find((item) => item.id === id);
        };
    return () => <div class={"canvas_editor_form_box"}>
      {findCanvasById(prop.tabsActiveIndex!)?.canvas.TabInfo.menuInfo.id}
    </div>;
  },
});
