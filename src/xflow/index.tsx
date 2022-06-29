import { defineComponent, nextTick, ref, watch } from "vue";
import vue3TabsChrome from "vue3-tabs-chrome";
import "vue3-tabs-chrome/dist/vue3-tabs-chrome.css";
import prototype from "./canvas/prototype";
import thingPlane from "./layout/thingPlane";
import topOption from "./topopt";
import { reset, ThingInfo } from "./canvas";
import "./style/index.less";
import { createCanvas, uuid } from "./utils";
import PropertiedForm from "./layout/propertied-form";

export interface CustomTabProps {
  label: string;
  key: string;
  type: "add-xflow" | "add-thing";
}

export default defineComponent({
  components: { vue3TabsChrome, topOption, thingPlane },
  setup(props, content) {
    const tabsRef = ref();

    let canvas: Record<string, ZXFLOW.Canvas> = {};
    prototype();

    // 活跃的左侧菜单icon
    const flowArgsById = ref<Record<string, ZXFLOW.FlowArgs>>({});

    // 存储当前状态下的所有tab
    const tabs = ref<Array<CustomTabProps>>([]);
    const tabsActiveIndex = ref(tabs.value[0]?.key || undefined);

    const handleOpenNewTab = (type: string) => {
      const label = window.prompt("请输入标签名称");
      const id = uuid();

      if (!label) return;
      const tab = { label: label, key: id, type };
      tabsRef.value.addTab(tab);
      tabsActiveIndex.value = id;
      flowArgsById.value[id] = {
        thingInfo: {},
      };
      nextTick(() => {
        if (!canvas[id]) {
          canvas[id] = createCanvas(id, flowArgsById.value[id], type);
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
          <thingPlane
            onDropEnd={() => {
              // thingInfo.value = null;
            }}
            onDropStart={(e: ThingInfo) => {
              flowArgsById.value[tabsActiveIndex.value!].thingInfo = e;
            }}
          />
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
