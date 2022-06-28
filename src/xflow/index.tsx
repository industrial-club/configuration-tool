import {
  defineComponent,
  nextTick,
  onMounted,
  provide,
  reactive,
  ref,
} from "vue";
import { fabric } from "fabric";
import vue3TabsChrome from "vue3-tabs-chrome";
import "vue3-tabs-chrome/dist/vue3-tabs-chrome.css";
import prototype from "./canvas/prototype";
import ThingPlane from "./layout/thingPlane";
import topOption from "./topopt";
import { reset } from "./canvas";
import "./style/index.less";
import { Mcanvas } from "./canvas";
import { createCanvas, uuid } from "./utils";
import PropertiedForm from "./layout/propertied-form";

export interface CustomTabProps {
  label: string;
  key: string;
}

export default defineComponent({
  components: { vue3TabsChrome, topOption },
  setup(props, content) {
    const tabsRef = ref();

    let canvas: Record<string, Mcanvas> = {};
    prototype();

    // 存储当前状态下的所有tab
    const tabs = ref<Array<CustomTabProps>>([]);
    const tabsActiveIndex = ref(tabs.value[0]?.key || undefined);

    const handleOpenNewTab = (type: string) => {
      const id = uuid();
      const tab = { label: "新建标签页", key: id, type };
      tabsRef.value.addTab(tab);
      tabsActiveIndex.value = id;

      nextTick(() => {
        if (!canvas[id]) {
          canvas[id] = createCanvas(id);
          reset(canvas[id]);
        }
      });
    };

    return () => (
      <div class={"canvas_body"}>
        <topOption
          onNewTab={handleOpenNewTab}
          onMenuClick={(e: any) => {
            e.event(canvas[tabsActiveIndex.value!]);
          }}
        />
        <div class={"canvas_box"}>
          <ThingPlane />
          <div class={"canvas_box canvas_box_column"}>
            <div class={"tabs_box"}>
              <vue3TabsChrome
                ref={tabsRef}
                tabs={tabs.value}
                v-model={[tabsActiveIndex.value]}
              ></vue3TabsChrome>
            </div>
            <div class={"canvas_list_box"} id="canvas_box">
              {tabs.value.map((item) => (
                <div
                  class={[
                    "canvas_box_item",
                    item.key === tabsActiveIndex.value ? "active" : "",
                  ]}
                >
                  <canvas id={item.key}></canvas>
                </div>
              ))}
            </div>
          </div>

          <PropertiedForm />
        </div>
      </div>
    );
  },
});
