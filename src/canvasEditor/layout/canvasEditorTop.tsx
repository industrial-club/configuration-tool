import { defineComponent, PropType, toRaw } from "vue";
import { CanvasInfo } from "..";
import Menus, { MenuId } from "../config/menus";

export default defineComponent({
  emits: ["newCanvas", "see"],
  props: {
    canvasInfo: Array<CanvasInfo>,
    tabsActiveIndex: String,
    customMenus: {
      type: Array as PropType<Array<CanvasEditor.MenuItem>>,
      default() {
        return [];
      },
    },
  },
  setup(prop, ctx) {
    const renderMenus = () => {
      const allMenu = [...Menus, ...prop.customMenus];
      return allMenu.map((item) => {
        if (item.type === "group") return renderMenuGroup(item);
        return renderMenuItem(item);
      });
    };
    const findCanvasById = (id: string) => {
      return prop.canvasInfo!.find((item) => item.id === id);
    };
    const toDoMenuEvent = (item: CanvasEditor.MenuItem) => {
      if (item.id === MenuId.newThing || item.id === MenuId.newXflow) {
        ctx.emit("newCanvas", item);
      } else {
        if (item.id === MenuId.see) {
          // 触发预览
          ctx.emit('see', item)
        }
        item.event(toRaw(findCanvasById(prop.tabsActiveIndex!)?.canvas!));
      }
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
    return () => <div class={"canvas_editor_top"}>{renderMenus()}</div>;
  },
});
