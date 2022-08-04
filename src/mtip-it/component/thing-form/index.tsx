import {
  defineComponent,
  ref,
  inject,
  Ref,
  watch,
  PropType,
  onMounted,
} from "vue";
import { CheckboxChangeEvent } from "ant-design-vue/es/_util/EventInterface";
import { fabric } from "fabric";
import { message } from "ant-design-vue";
import * as api from "@/mtip-it/api/form";
import * as thingApi from "@/mtip-it/api/thing";

/**
 * 实例属性表单
 */
const ThingForm = defineComponent({
  emits: ["refresh"],
  props: {
    widget: {
      type: Object as PropType<MtipIt.Object>,
      required: true,
    },
    proptyList: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
  },
  setup(props, { emit }) {
    const activeCanvas = inject<Ref<MtipIt.Item>>("activeMtipItItem")!;

    const selectedProps = ref([]);

    // 回显选中的属性
    watch(
      () => props.widget,
      () => {
        const properties = props.widget.data?.properties ?? [];
        selectedProps.value = properties.map((item: any) => item.key);
      },
      { immediate: true }
    );

    /* ===== 选中/取消属性 ===== */
    // 处理选中属性后展示到图中
    const handlePropertyChange = ({ checked, property }: any) => {
      const name = `_property_${property.code}`;
      const instanceId = props.widget.instanceId;
      const content = `${property.displayLabel}:无`;

      let textEle: fabric.Object;

      // 添加
      if (checked) {
        // 位置 相对于物实例
        const position = {
          left: props.widget.left,
          top: props.widget.top - 20,
        };

        const defaultStyle = {
          fill: "#ff0000",
          fontSize: 16,
        };

        // 文字属性抽象
        const data = {
          name,
          label: property.displayLabel,
          key: property.code,
          parentId: instanceId,
          position,
          style: defaultStyle,
        };
        textEle = new fabric.Textbox(content, {
          name,
          ...position,
          ...defaultStyle,
          parentId: instanceId,
          data: {
            key: property.code,
            name,
          },
        } as any);
<<<<<<< HEAD
        textEle.on("modified", () => {
          position.left = textEle.left;
          position.top = textEle.top;
        });
=======
>>>>>>> 4c9d38cbbc9a67b99e20f35e3cfbdc28585d6b52

        activeCanvas.value.canvas.add(textEle);
        props.widget.data.properties.push(data);
      } else {
        // 移除
        const textList = (activeCanvas.value.canvas as fabric.Canvas)
          .getObjects("textbox")
          .filter(
            (item: MtipIt.Object) =>
              item.name === name && item.parentId === instanceId
          );
        for (const text of textList) {
          activeCanvas.value.canvas.remove(text);
          props.widget.data.properties = props.widget.data.properties.filter(
            (item: any) =>
              item.parentId === props.widget.parentId &&
              item.key !== property.code
          );
        }
      }
    };
    onMounted(() => {
      if (!props.widget.data) {
        props.widget.data = {};
      }
      if (!props.widget.data.properties) {
        props.widget.data.properties = [];
      }
    });
    /* ===== ===== */

    // 保存
    const handleSave = async () => {
      const { instanceId, data } = props.widget;

      // 获取选中的属性
      const properties = (activeCanvas.value.canvas as fabric.Canvas)
        .getObjects("textbox")
        .filter((item: MtipIt.Object) => item.parentId === instanceId);
      data.properties = [];
      for (const property of properties) {
        const {
          left,
          top,
          fill,
          fontSize,
          text,
          visible,
          opacity,
          data: textData,
        } = property as fabric.Textbox;
        data.properties.push({
          key: textData.key,
          name: textData.name,
          position: { left, top },
          style: {
            fill,
            fontSize,
            visible,
            opacity,
          },
          text,
        });
      }

      await thingApi.saveThingInfo(instanceId, data);
      message.success("保存成功");
      emit("refresh");
    };

    return () => (
      <div class="thing-form">
        <a-form>
          <a-form-item>
            <a-button type="primary" block onClick={handleSave}>
              保存
            </a-button>
          </a-form-item>
          <a-form-item label="是否响应点击事件">
            <a-checkbox
              checked={props.widget.data?.events?.mousedown}
              onChange={(e: any) => {
                if (!props.widget.data.events) {
                  props.widget.data.events = {};
                }
                props.widget.data.events.mousedown = e.target.checked;
              }}
            ></a-checkbox>
          </a-form-item>
          <a-form-item>
            {/* 属性 */}
            <a-collapse activeKey={1}>
              <a-collapse-panel key={1} header="属性">
                <a-checkbox-group v-model={[selectedProps.value, "value"]}>
                  <a-row>
                    {props.proptyList.map((item: any) => (
                      <a-col span={24} key={item.code}>
                        <a-checkbox
                          value={item.code}
                          onChange={(e: CheckboxChangeEvent) =>
                            handlePropertyChange({
                              checked: e.target.checked,
                              property: item,
                            })
                          }
                        >
                          {item.displayLabel}
                        </a-checkbox>
                      </a-col>
                    ))}
                  </a-row>
                </a-checkbox-group>
              </a-collapse-panel>
            </a-collapse>
          </a-form-item>
        </a-form>
      </div>
    );
  },
});

export default ThingForm;
