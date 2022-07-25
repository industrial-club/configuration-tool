import {
  computed,
  defineComponent,
  inject,
  onUnmounted,
  ref,
  watch,
  Ref,
  nextTick,
} from "vue";
import { fabric } from "fabric";
import { cloneDeep } from "lodash";
import { MenuId } from "../config/menus";
import PropertiesForm from "../component/properties-form";
import ThingForm from "../component/thing-form";
import FlowForm from "../component/flow-form";
import AddEventModal from "@/canvasEditor/components/properties-form/add-event-modal";
import * as api from "@/mtip-it/api/form";

export default defineComponent({
  emits: ["addElement", "removeElement", "save"],
  setup(props, { emit }) {
    const activeCanvas = inject<Ref<MtipIt.Item>>("activeMtipItItem")!;

    // 复制当前canvas
    const copyCanvas = ref<MtipIt.Item>({} as MtipIt.Item);

    // 物实例详情
    const thingDetail = ref({});
    const getThingDetail = async () => {
      // const id = activeCanvas.value.id;
      const id = "1";
      const { data } = await api.getThingCode(id);
      const thingCode = data.thingInst.thingCode;
      const { data: res } = await api.getThingDetail(thingCode);
      thingDetail.value = res;
    };

    // 是否为物实例
    const isThing = computed(() => {
      if (copyCanvas.value?.type === MenuId.thing) {
        return true;
      }
      return false;
    });

    watch(
      activeCanvas,
      async (newVal) => {
        await nextTick();
        copyCanvas.value = cloneDeep(newVal);
        if (!isThing.value) return;
        await getThingDetail();
        const size = copyCanvas.value.thingInfo.size;

        if (size) {
          const { width, height } = size;
          activeCanvas.value.canvas.setWidth(width);
          activeCanvas.value.canvas.setHeight(height);
        } else {
          // 获取宽高
          const width = activeCanvas.value.canvas.getWidth();
          const height = activeCanvas.value.canvas.getHeight();

          // 设置到详情中
          copyCanvas.value.thingInfo.size = { width, height };
        }

        // 回显属性到图中
        if (Array.isArray(copyCanvas.value.thingInfo?.properties)) {
          for (const item of copyCanvas.value.thingInfo.properties) {
            handlePropertyChange({
              checked: true,
              property: item,
              isInit: true,
            });
          }
        }
      },
      { immediate: true, flush: "post" }
    );

    /* ======= 当前选中的部件 ======= */
    const activeWidget = ref<fabric.Object>();
    // 选择部件 (只有选择了一个部件才能操作)
    const handleWidgetSelect = ({ selected }: any) => {
      // 只选择了一个小部件
      if (selected.length === 1) {
        activeWidget.value = selected[0];
      }
    };
    // 取消选择
    const handleClearSelect = () => {
      activeWidget.value = undefined;
    };
    // 给当前活跃的canvas添加选中事件
    watch(
      () => activeCanvas.value,
      async (val, oldVal) => {
        await nextTick();
        if (val) {
          val.canvas.on("selection:created", handleWidgetSelect);
          val.canvas.on("selection:updated", handleWidgetSelect);
          val.canvas.on("selection:cleared", handleClearSelect);
        }
        if (val !== oldVal) {
          oldVal?.canvas.off("selection:created", handleWidgetSelect);
          oldVal?.canvas.off("selection:updated", handleWidgetSelect);
          oldVal?.canvas.off("selection:cleared", handleClearSelect);
        }
      }
    );
    onUnmounted(() => {
      activeCanvas.value?.canvas.off("selection:created", handleWidgetSelect);
      activeCanvas.value?.canvas.off("selection:updated", handleWidgetSelect);
      activeCanvas.value?.canvas.off("selection:cleared", handleClearSelect);
    });

    // 处理选中属性后展示到图中
    const handlePropertyChange = ({
      checked,
      property,
      isInit = false,
    }: any) => {
      const name = `_property_${property.code}`;
      // 选中
      if (checked) {
        // 创建text 值暂时写死
        const content = `${property.name}: null`;
        const text = new fabric.Text(isInit ? property.content : content, {
          name: name,
          // 回显使用原有的样式 否则使用初始化样式
          ...(isInit ? property.style : { fill: "#ff0000", fontSize: 16 }),
          left: isInit ? property.position.left : 0,
          top: isInit ? property.position.top : 0,
        });
        emit("addElement", text);
        if (!isInit) {
          // 抽象属性
          const abstractProperty = {
            name,
            content,
            style: {
              fill: "#ff0000",
              fontSize: 16,
            },
            position: {
              top: text.top,
              left: text.left,
            },
            code: property.code,
          };
          // 创建属性数组
          if (!copyCanvas.value.thingInfo) copyCanvas.value.thingInfo = {};
          if (!copyCanvas.value.thingInfo.properties)
            copyCanvas.value.thingInfo.properties = [];
          copyCanvas.value.thingInfo.properties.push(abstractProperty);
          // 文字移动，更新位置
          text.on("modified", () => {
            abstractProperty.position = {
              top: text.top,
              left: text.left,
            };
          });
        } else {
          text.on("modified", () => {
            property.position = {
              top: text.top,
              left: text.left,
            };
          });
        }
      } else {
        // 移除text
        const textList = activeCanvas.value?.canvas
          .getObjects()
          .filter((item: fabric.Object) => item.name === name);
        emit("removeElement", textList);
        // 移除属性
        if (copyCanvas.value.thingInfo?.properties) {
          copyCanvas.value.thingInfo.properties =
            copyCanvas.value.thingInfo.properties.filter(
              (item: any) => item.name !== name
            );
        }
      }
    };

    // 更改样式，更新属性
    const handlePropertyUpdate = ({ key, value }: any) => {
      const name = activeWidget.value?.name;

      const properties = copyCanvas.value.thingInfo.properties.filter(
        (item: any) => item.name === name
      );
      if (properties.length > 0) {
        for (const property of properties) {
          property.style[key] = value;
        }
      }
    };

    // 保存
    const handleSave = () => {
      emit("save", copyCanvas.value);
    };

    return () => (
      <div class={"mtip_it_editor_form_box"}>
        {isThing.value ? (
          // 如果选中属性文字 展示部件属性表单 否则展示实例表单
          activeWidget.value?.type === "text" ? (
            <PropertiesForm
              widget={activeWidget.value}
              onUpdate={handlePropertyUpdate}
            />
          ) : (
            <div>
              <a-button
                class="btn-save"
                block
                type="primary"
                onClick={handleSave}
              >
                保存
              </a-button>
              <a-form-item>
                <a-checkbox
                  checked={copyCanvas.value.thingInfo?.events?.mousedown}
                  onChange={(e: any) => {
                    if (!copyCanvas.value.thingInfo.events) {
                      copyCanvas.value.thingInfo.events = {};
                    }
                    copyCanvas.value.thingInfo.events.mousedown =
                      e.target.checked;
                  }}
                >
                  是否响应点击事件
                </a-checkbox>
              </a-form-item>
              <a-form-item label="宽">
                <a-input-number
                  value={copyCanvas.value.thingInfo?.size?.width}
                  onChange={(val: number) => {
                    if (!copyCanvas.value.thingInfo.size) {
                      copyCanvas.value.thingInfo.size = {};
                    }
                    copyCanvas.value.thingInfo.size.width = val;
                    activeCanvas.value.canvas.setWidth(val);
                  }}
                ></a-input-number>
              </a-form-item>
              <a-form-item label="高">
                <a-input-number
                  value={copyCanvas.value.thingInfo?.size?.height}
                  onChange={(val: number) => {
                    if (!copyCanvas.value.thingInfo.size) {
                      copyCanvas.value.thingInfo.size = {};
                    }
                    copyCanvas.value.thingInfo.size.height = val;

                    activeCanvas.value.canvas.setHeight(val);
                  }}
                ></a-input-number>
              </a-form-item>
              <ThingForm
                thingDetail={thingDetail.value}
                onPropertyChange={handlePropertyChange}
              />
            </div>
          )
        ) : (
          // )
          // <FlowForm widget={activeWidget.value} />
          <a-empty></a-empty>
        )}
      </div>
    );
  },
});
