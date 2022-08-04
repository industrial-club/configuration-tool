import { defineComponent, ref, inject, Ref, watch, PropType } from "vue";
import { CheckboxChangeEvent } from "ant-design-vue/es/_util/EventInterface";
import { fabric } from "fabric";
import * as api from "@/mtip-it/api/form";
import * as thingApi from "@/mtip-it/api/thing";
import { message } from "ant-design-vue";

/**
 * 实例属性表单
 */
const ThingForm = defineComponent({
  emits: ["propertyChange"],
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
        const textEle = new fabric.Textbox(content, {
          name,
          ...position,
          ...defaultStyle,
          parentId: instanceId,
          data,
        } as any);
        textEle.on("modified", () => {
          position.left = textEle.left;
          position.top = textEle.top;
        });

        activeCanvas.value.canvas.add(textEle);
        // 添加到设备属性列表
        if (!props.widget.data) {
          props.widget.data = {};
        }
        if (!props.widget.data.properties) {
          props.widget.data.properties = [];
        }
        props.widget.data.properties.push(data);
      } else {
        // 移除
        const textList = (activeCanvas.value.canvas as fabric.Canvas)
          .getObjects("text")
          .filter(
            (item) => item.name === name && item.data?.instanceId === instanceId
          );
        for (const text of textList) {
          activeCanvas.value.canvas.remove(text);
        }
      }
    };
    /* ===== ===== */

    // 保存
    const handleSave = async () => {
      const { instanceId, data } = props.widget;
      if (data) {
        await thingApi.saveThingInfo(instanceId, data);
        message.success("保存成功");
      }
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
