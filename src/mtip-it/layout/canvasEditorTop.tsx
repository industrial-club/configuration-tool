import { defineComponent, inject, PropType, Ref, toRaw } from "vue";
import Menus, { MenuId } from "../config/menus";

export default defineComponent({
  emits: ["newCanvas", "preview", "save", "addFlow"],
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

    const toDoMenuEvent = (item: MtipIt.MenuItem) => {
      item.event(toRaw(activeCanvas.value), () => {
        if (item.id === MenuId.save) {
          ctx.emit("save", item);
        }

        if (item.id === MenuId.newXflow) {
          ctx.emit("addFlow", item);
        }
      });
      if (item.id === MenuId.see) {
        ctx.emit("preview", item);
      }
    };
    const renderMenuGroup = (item: MtipIt.MenuItem) => {
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

    const renderMenuItem = (item: MtipIt.MenuItem) => {
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
