import { defineComponent, inject, PropType, Ref } from "vue";
import Menus, { MenuId } from "../config/menus";

export default defineComponent({
  emits: ["newCanvas", "see"],
  props: {
    customMenus: {
      type: Array,
      default: [],
    },
  },
  setup(prop, ctx) {
    // 获取当前活跃的canvas
    const activeCanvas = inject<Ref<MtipIt.Item>>("activeMtipItItem");
    const renderMenus = () => {
      const allMenu = [...Menus, ...prop.customMenus!];
      return allMenu.map((item: any) => {
        if (item.type === "group") return renderMenuGroup(item);
        return renderMenuItem(item);
      });
    };

    const toDoMenuEvent = (item: CanvasEditor.MenuItem) => {
      item.event(activeCanvas?.value.canvas);
    };
    const renderMenuGroup = (item: CanvasEditor.MenuItem) => {
      const dropMenu: () => JSX.Element = () => {
        const items = () => {
          return item.child!.map((item) => (
            <a-menu-item
              onClick={() => {
                toDoMenuEvent(item);
              }}
            >
              <a href="javascript:;">{item.name}</a>
            </a-menu-item>
          ));
        };
        return <a-menu>{items()}</a-menu>;
      };
      return (
        <a-dropdown
          vSlots={{
            overlay: dropMenu,
          }}
        >
          <div class={"optItem"}>{item.icon}</div>
        </a-dropdown>
      );
    };

    const renderMenuItem = (item: CanvasEditor.MenuItem) => {
      return (
        <a-tooltip placement="bottom" vSlots={{ title: () => item.name }}>
          <div
            class={"optItem"}
            onClick={() => {
              toDoMenuEvent(item);
            }}
          >
            {item.icon}
          </div>
        </a-tooltip>
      );
    };
    return () => <div class={"mtip_it_editor_top"}>{renderMenus()}</div>;
  },
});
