import { defineComponent, PropType } from "vue";
import { UnorderedListOutlined } from "@ant-design/icons-vue";
import { menus } from "../config";
import "./index.less";

export default defineComponent({
  emits: ["MenuClick", "newTab"],
  props: {
    canvas: {
      type: Object as PropType<ZXFLOW.Canvas>,
    },
  },
  setup(props, content) {
    const dropMenu = () => {
      const items = () => {
        return menus.newFile.map((item) => (
          <a-menu-item onClick={() => content.emit("newTab", item)}>
            <a href="javascript:;">{item.name}</a>
          </a-menu-item>
        ));
      };
      return <a-menu>{items()}</a-menu>;
    };

    return () => (
      <div class={"zx_xflow_opt"}>
        <a-dropdown
          vSlots={{
            overlay: dropMenu,
          }}
        >
          <div class={"optItem"}>
            <UnorderedListOutlined />
          </div>
        </a-dropdown>

        {menus.list.map((item) => (
          <a-tooltip placement="bottom" vSlots={{ title: () => item.name }}>
            <div
              class={"optItem"}
              onClick={() => {
                content.emit("MenuClick", item);
              }}
            >
              {item.icon}
            </div>
          </a-tooltip>
        ))}
      </div>
    );
  },
});
