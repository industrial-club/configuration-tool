import { defineComponent, inject, onMounted, ref, Ref } from "vue";

/**
 * 画布表单
 */
const CanvasForm = defineComponent({
  setup() {
    const activeCanvas = inject<Ref<MtipIt.Item>>("activeMtipItItem")!;
    const canvasBgColor = ref("");
    onMounted(() => {
      setTimeout(() => {
        canvasBgColor.value =
          activeCanvas.value.canvas?.backgroundColor || "#f3ffff";
      }, 500);
    });

    return () => (
      <div class="canvas-form">
        <a-form>
          <a-form-item label="背景颜色">
            <input
              type="color"
              v-model={[canvasBgColor.value, "value"]}
              onInput={(e: any) => {
                activeCanvas.value.canvas.set(
                  "backgroundColor",
                  e.target.value
                );
                activeCanvas.value.canvas.requestRenderAll();
              }}
            />
          </a-form-item>
        </a-form>
      </div>
    );
  },
});

export default CanvasForm;
