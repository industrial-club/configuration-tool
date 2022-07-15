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

export default defineComponent({
  emits: ["addElement", "removeElement", "save"],
  setup(props, { emit }) {
    const activeCanvas = inject<Ref<MtipIt.Item>>("activeMtipItItem")!;

    // 复制当前canvas
    const copyCanvas = ref<MtipIt.Item>({} as MtipIt.Item);
    watch(
      activeCanvas,
      (newVal) => {
        copyCanvas.value = cloneDeep(newVal);
      },
      { deep: true, immediate: true }
    );

    // const activeWidget = ref<fabric.Object>();
    // // 选择部件 (只有选择了一个部件才能操作)
    // const handleWidgetSelect = ({ selected }: any) => {
    //   // 只选择了一个小部件
    //   if (selected.length === 1) {
    //     activeWidget.value = selected[0];
    //   }
    // };
    // 取消选择
    // const handleClearSelect = () => {
    //   activeWidget.value = undefined;
    // };

    // 是否为物实例
    const isThing = computed(() => {
      if (copyCanvas.value?.type === MenuId.thing) {
        return true;
      }
      return false;
    });

    // 给当前活跃的canvas添加选中事件
    // watch(
    //   () => activeCanvas.value,
    //   async (val, oldVal) => {
    //     await nextTick();
    //     if (val) {
    //       val.canvas.on("selection:created", handleWidgetSelect);
    //       val.canvas.on("selection:updated", handleWidgetSelect);
    //       val.canvas.on("selection:cleared", handleClearSelect);
    //     }
    //     if (val !== oldVal) {
    //       oldVal?.canvas.off("selection:created", handleWidgetSelect);
    //       oldVal?.canvas.off("selection:updated", handleWidgetSelect);
    //       oldVal?.canvas.off("selection:cleared", handleClearSelect);
    //     }
    //   }
    // );
    // onUnmounted(() => {
    //   activeCanvas.value?.canvas.off("selection:created", handleWidgetSelect);
    //   activeCanvas.value?.canvas.off("selection:updated", handleWidgetSelect);
    //   activeCanvas.value?.canvas.off("selection:cleared", handleClearSelect);
    // });

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
        const content = `${property.name}: 100m`;
        const text = new fabric.Text(isInit ? property.content : content, {
          name: isInit ? property.name : name,
          fill: "#ff0000",
          fontSize: 16,
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

    // 添加事件
    const isAddEventShow = ref(false);
    const currListener = computed(
      () => copyCanvas.value.thingInfo?.events?.mousedown || ""
    );
    const handleSetListener = (code: string) => {
      if (!copyCanvas.value.thingInfo) copyCanvas.value.thingInfo = {};
      if (!copyCanvas.value.thingInfo.events)
        copyCanvas.value.thingInfo.events = {};
      copyCanvas.value.thingInfo.events.mousedown = code;
      isAddEventShow.value = false;
    };

    // 保存
    const handleSave = () => {
      emit("save", copyCanvas.value);
    };

    return () => (
      <div class={"mtip_it_editor_form_box"}>
        {isThing.value ? (
          // 如果选中部件 展示部件属性表单 否则展示实例表单
          // activeWidget.value ? (
          //   <PropertiesForm widget={activeWidget.value} />
          // ) : (
          <div>
            <a-space class="operation">
              <a-button onClick={() => (isAddEventShow.value = true)}>
                添加事件
              </a-button>
              <a-button type="primary" onClick={handleSave}>
                保存
              </a-button>
            </a-space>
            <ThingForm onPropertyChange={handlePropertyChange} />
          </div>
        ) : (
          // )
          // <FlowForm widget={activeWidget.value} />
          <a-empty></a-empty>
        )}

        <AddEventModal
          listener={currListener.value}
          v-model={[isAddEventShow.value, "visible"]}
          onCommit={handleSetListener}
        />
      </div>
    );
  },
});
