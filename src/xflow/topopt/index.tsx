import { defineComponent, onMounted, inject, Ref } from "vue";
import { fabric } from "fabric";
import { UnorderedListOutlined } from "@ant-design/icons-vue";
import { menus } from "../config";
import { Mcanvas } from "../canvas";

export default defineComponent({
  setup(props, content) {
    onMounted(() => {
      const canvas = inject<Ref<Mcanvas>>("canvas")!;
      fabric.loadSVGFromURL("svg/a.svg", (e, opt) => {
        for (let i of e) {
          canvas.value.add(i);
          console.log(i);
        }

        const sti = canvas.value.toDatalessJSON();
        setTimeout(() => {
          canvas.value.clear();
          const circle = new fabric.Circle({
            top: 100,
            left: 500,
            radius: 50, // 圆的半径 50
            fill: "green",
          });
          canvas.value.add(circle);
        }, 1000);
        setTimeout(() => {
          canvas.value;
          canvas.value.loadFromJSON(sti, () => {
            console.log(e);
          });
          //   fabric.loadSVGFromString(sti, (e, opt) => {
          //     for (let i of e) {
          //       canvas.value.add(i);
          //     }
          //   });
        }, 2000);
      });
      //   setTimeout(() => {
      //     const item = canvas.value.getItem("2");
      //     item.getObjects()[0].set("fill", "red");
      //     canvas.value.renderAll();
      //   }, 5000);
    });

    const dropMenu = () => {
      const items = () => {
        return menus.newFile.map((item) => (
          <a-menu-item>
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
          <UnorderedListOutlined />
        </a-dropdown>
      </div>
    );
  },
});
