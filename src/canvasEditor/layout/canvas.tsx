import { defineComponent } from "vue";
import { TabItem } from "..";

export default defineComponent({
  props: { tabsActiveIndex: String, tabs: Array<TabItem> },
  setup(prop, context) {
    return () => (
      <div class={"canvas_editor_ct_box_canvas"} id="canvas_box">
        <div class={"canvas_editor_ct_box_canvas_list"}>
          {prop.tabs?.map(item => <div class={['canvas_editor_ct_box_canvas_list_item', item.id === prop.tabsActiveIndex ? 'active' : '']}>
            <canvas id={item.id}></canvas>
          </div>)}
        </div>
      </div>
    );
  },
});
