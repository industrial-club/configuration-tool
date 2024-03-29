import { defineComponent, inject, PropType, Ref, ref, watch } from "vue";
import tabBar from "../component/tabBar";

export default defineComponent({
  components: {
    tabBar,
  },
  props: {
    mtipIts: {
      type: Array as PropType<Array<MtipIt.Item>>,
      default: [],
    },
  },
  emits: ["close"],
  setup(prop, context) {
    const thingId = inject<Ref<string>>("thingId")!;

    // 所有图表集合
    return () => (
      <div id="mtip_it_editor_center" class={"mtip_it_editor_center"}>
        <tabBar
          list={prop.mtipIts}
          v-models={[[thingId.value, "value"]]}
          onClose={(e: MtipIt.Item) => {
            // 因为目前只有一个全场工艺图，所以不需要关闭
            context.emit("close", e);
          }}
        />
        <div id="mtip_it_editor_canvas" class={"mtip_it_editor_canvas"}>
          {prop.mtipIts.map((item) => (
            <div
              class={[
                "mtip_it_editor_canvas_box",
                item.id === thingId.value ? "active" : "",
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
