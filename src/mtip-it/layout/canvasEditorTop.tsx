import { defineComponent, PropType } from "vue";
import Menus, { MenuId } from "../config/menus";

export default defineComponent({
  emits: ["newCanvas", "see"],
  props: {
    activeCanvas: {
      type: Object as PropType<MtipIt.Item>,
    },
    customMenus: {
      type: Array,
      default: [],
    },
  },
  setup(prop, ctx) {
    const renderMenus = () => {
      const allMenu = [...Menus, ...prop.customMenus!];
      return allMenu.map((item: any) => {
        if (item.type === "group") return renderMenuGroup(item);
        return renderMenuItem(item);
      });
    };

    const toDoMenuEvent = (item: CanvasEditor.MenuItem) => {};
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
