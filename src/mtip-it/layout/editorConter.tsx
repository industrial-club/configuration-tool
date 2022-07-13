import { defineComponent, PropType, ref, watch } from "vue";
import { fabric } from "fabric";
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
  },
  setup(prop, context) {
    const list = ref<Array<tabBarItem>>([]);
    const value = ref("");

    // 渲染canvasList
    const canvasElementList = ref<Array<JSX.Element>>([]);
    const renderCanvas = (item: MtipIt.Item) => {
      canvasElementList.value.push(
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
      );
    };

    // 检测mtipIts 数据变动
    watch(
      prop.mtipIts,
      () => {
        for (let i of prop.mtipIts) {
          renderCanvas(i);
          list.value.push({
            name: i.name,
            id: i.id,
          });
        }
      },
      { deep: true, immediate: true }
    );

    // 初始化editor
    const init = () => {
      if (list.value.length > 0) {
        value.value = list.value[0].id;
      }
    };
    init();

    // 所有图表集合
    return () => (
      <div id="mtip_it_editor_center" class={"mtip_it_editor_center"}>
        <tabBar list={list.value} v-models={[[value.value, "value"]]} />
        {value.value}
        <div id="mtip_it_editor_canvas" class={"mtip_it_editor_canvas"}>
          {canvasElementList.value}
        </div>
      </div>
    );
  },
});
