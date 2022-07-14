import { defineComponent, ref } from "vue";
import { CheckboxChangeEvent } from "ant-design-vue/es/_util/EventInterface";

const propertiesList = [
  {
    key: "master",
    name: "主机属性",
    children: [
      {
        key: "length",
        name: "长度",
        value: "100m",
      },
      {
        key: "speed",
        name: "运行速度",
        value: "100m/s",
      },
    ],
  },
  {
    key: "motor",
    name: "电机属性",
    children: [
      {
        key: "temperature",
        name: "温度",
        value: "100℃",
      },
      {
        key: "voltage",
        name: "电压",
        value: "100V",
      },
    ],
  },
  {
    key: "alarm",
    name: "报警属性",
    children: [
      {
        key: "smoke",
        name: "烟雾故障",
        value: "你好",
      },
    ],
  },
];

/**
 * 实例属性表单
 */
const ThingForm = defineComponent({
  emits: ["propertyChange"],
  setup(props, { emit }) {
    const selectedProps = ref([]);

    // 选中/取消选中属性 通知父组件 展示到图中
    const onPropertyChange = (e: CheckboxChangeEvent, ele: any) => {
      emit("propertyChange", { checked: e.target.checked, property: ele });
    };

    return () => (
      <div class="thing-form">
        <a-form>
          <a-form-item label="名称">
            <a-input disabled value="302X"></a-input>
          </a-form-item>
          <a-form-item label="备注">
            <a-textarea value="302刮板机"></a-textarea>
          </a-form-item>
          <a-form-item>
            <a-checkbox-group
              style={{ width: "100%" }}
              v-model={selectedProps.value}
            >
              <a-collapse>
                {propertiesList.map((item) => (
                  <a-collapse-panel key={item.key} header={item.name}>
                    <a-row>
                      {item.children.map((ele) => (
                        <a-col span={24}>
                          <a-checkbox
                            value={ele.key}
                            onChange={(e: any) => onPropertyChange(e, ele)}
                          >
                            {ele.name}
                          </a-checkbox>
                        </a-col>
                      ))}
                    </a-row>
                  </a-collapse-panel>
                ))}
              </a-collapse>
            </a-checkbox-group>
          </a-form-item>
        </a-form>
      </div>
    );
  },
});

export default ThingForm;
