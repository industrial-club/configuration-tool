import { defineComponent, PropType, watch } from "vue";

export interface tabBarItem {
  id: string;
  name: string;
}

export const Props = {
  list: {
    type: Array as PropType<Array<tabBarItem>>,
    default: [],
  },
  value: {},
};

export default defineComponent({
  props: Props,
  emits: ["update:value"],
  setup(prop, cxt) {
    // 当item被点击事件
    const itemClick = (e: tabBarItem) => {
      cxt.emit("update:value", e.id);
    };

    return () => (
      <ul id="mtip_it_editor_tabbar" class={"mtip_it_editor_tabbar"}>
        {prop.list.map((i) => (
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
        ))}
      </ul>
    );
  },
});
