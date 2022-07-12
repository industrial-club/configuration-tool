import { defineComponent, PropType } from "vue";
import { fabric } from "fabric";
import "./style/index.less";
import editorConter from "./layout/editorConter";

const allIts: Array<MtipIt.Item> = [
  {
    canvas: {},
    id: "6",
    name: "zx6",
    type: "thing",
  },
  {
    canvas: {},
    id: "7",
    name: "zx7",
    type: "flow",
  },
];

export default defineComponent({
  props: {
    allIts: {
      type: Array as PropType<Array<MtipIt.Item>>,
      default: allIts,
    },
  },
  components: {
    editorConter,
  },
  setup(prop, context) {
    // 所有图表集合
    return () => (
      <div id="mtip_it_editor" class={"mtip_it_editor"}>
        <editorConter mtipIts={prop.allIts} />
      </div>
    );
  },
});
