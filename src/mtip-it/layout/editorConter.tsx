import { defineComponent, PropType, ref, watch } from "vue";
import tabBar, { tabBarItem } from "../component/tabBar";

export default defineComponent({
  components: {
    tabBar,
  },
  props: {
    mtipIts: {
      type: Array as PropType<Array<MtipIt.Item>>,
      default: [],
    },
    val: String,
  },
  setup(prop, context) {
    const value = ref("");

    watch(
      () => prop.val,
      () => {
        value.value = prop.val!;
      },
      { immediate: true }
    );
    // 所有图表集合
    return () => (
      <div id="mtip_it_editor_center" class={"mtip_it_editor_center"}>
        <tabBar list={prop.mtipIts} v-models={[[value.value, "value"]]} />
        <div id="mtip_it_editor_canvas" class={"mtip_it_editor_canvas"}>
          {prop.mtipIts.map((item) => (
            <div
              class={[
                "mtip_it_editor_canvas_box",
                item.id === value.value ? "active" : "",
              ]}
            >
              <div class={[`mtip_it_editor_canvas_box_${item.type}`]}>
                <canvas id={item.id}></canvas>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  },
});
