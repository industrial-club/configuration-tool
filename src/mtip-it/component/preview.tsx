import { defineComponent, nextTick, ref, watch } from "vue";
import { toPreview } from "../config/preview";

export const Props = {
  val: {
    type: Boolean,
  },
};

export default defineComponent({
  props: Props,
  emits: ["update:val"],
  setup(prop, cxt) {
    const val = ref(false);
    watch(
      () => prop.val,
      () => {
        val.value = prop.val;
      },
      { immediate: true }
    );

    watch(
      () => val.value,
      () => {
        console.log(val.value);
        if (val.value) {
          nextTick(() => {
            toPreview();
          });
        }
      }
    );
    return () => (
      <a-modal
        v-models={[[val.value, "visible"]]}
        title="预览"
        width="100%"
        closable={false}
        footer={null}
        wrap-class-name="full-modal"
        onCancel={() => {
          cxt.emit("update:val", false);
        }}
      >
        {val.value ? (
          <div class="preview_box" id="preview_box">
            <canvas id="preview_canvas"></canvas>
          </div>
        ) : (
          ""
        )}
      </a-modal>
    );
  },
});
