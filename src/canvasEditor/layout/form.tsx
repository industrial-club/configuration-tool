import { defineComponent, ref, watch } from "vue";
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
        const avtiveCanvas = findCanvasById(prop.tabsActiveIndex!)!;
        const activeObj = ref<fabric.Object>();
        if (avtiveCanvas && avtiveCanvas.canvas) {
        console.log(avtiveCanvas);

          avtiveCanvas.canvas.on('mouse:up', (e) => {
            activeObj.value = e.target;
          });
        }

        watch(() => activeObj.value, () => {
          console.log(activeObj.value)
        })
    return () => <div class={"canvas_editor_form_box"}>
      {avtiveCanvas?.canvas.TabInfo.menuInfo.id}
    </div>;
  },
});
