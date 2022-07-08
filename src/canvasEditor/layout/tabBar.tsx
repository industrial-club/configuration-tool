import { defineComponent, ref } from "vue";
import { CloseCircleFilled} from '@ant-design/icons-vue';

export default defineComponent({
  emits: ["change"],
  props: { tabsActiveIndex: String, tabs: Array<CanvasEditor.TabItem> },
  setup(prop, ctx) {
    const renderTab = () => {
        return prop.tabs?.map(item => {
            return (<div class={['canvas_editor_tab_item', item.id === prop.tabsActiveIndex ? 'active' : '']} onClick={() => {
                ctx.emit('change', item.id);
            }}>
                <span class={'name'}>{item.name}</span>
                <CloseCircleFilled/>
            </div>)
        });
    }
    return () => <div class={"canvas_editor_tab"}>{renderTab()}</div>;
  },
});
