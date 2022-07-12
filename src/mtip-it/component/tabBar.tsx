import { defineComponent, PropType } from "vue";

export interface tabBarItem {
  id: string;
  name: string;
}

export const Props = {
  list: {
    type: Array as PropType<Array<tabBarItem>>,
    default: [],
  },
  value: String,
};

export default defineComponent({
  props: Props,
  emits: ["update:value"],
  setup(prop, cxt) {
    // 当item被点击事件
    const itemClick = (e: tabBarItem) => {
      cxt.emit("update:value", e.id);
    };
    // 渲染子类
    const renderChild: () => Array<JSX.Element> = () => {
      const elementList: Array<JSX.Element> = [];
      for (let i of prop.list) {
        elementList.push(
          <li
            class={[
              "mtip_it_editor_tabbar_item",
              i.id === prop.value ? "active" : "",
            ]}
            onClick={() => {
              itemClick(i);
            }}
          >
            <span>{i.name}</span>
          </li>
        );
      }
      return elementList;
    };
    return () => (
      <ul id="mtip_it_editor_tabbar" class={"mtip_it_editor_tabbar"}>
        {renderChild()}
      </ul>
    );
  },
});
