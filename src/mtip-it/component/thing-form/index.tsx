import { defineComponent, ref, inject, Ref, onMounted, computed } from "vue";
import { CheckboxChangeEvent } from "ant-design-vue/es/_util/EventInterface";
import AddEventModal from "./add-event-modal";
import * as api from "@/mtip-it/api/form";

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
    const activeCanvas = inject<Ref<MtipIt.Item>>("activeMtipItItem")!;

    // 当前实例详细信息
    const thingDetail = ref<any>({});

    // 属性列表
    const propertiesList = computed(() => {
      return thingDetail.value.thingPropertyList || [];
    });

    // 获取实例属性
    const getProperties = async () => {
      // const id = activeCanvas.value.id;
      const id = "1";
      const { data } = await api.getThingCode(id);
      const thingCode = data.thingInst.thingCode;
      const { data: res } = await api.getThingDetail(thingCode);
      thingDetail.value = res;
    };
    onMounted(getProperties);

    const selectedProps = ref([]);

    // 选中/取消选中属性 通知父组件 展示到图中
    const onPropertyChange = (e: CheckboxChangeEvent, ele: any) => {
      emit("propertyChange", { checked: e.target.checked, property: ele });
    };

    // 添加事件
    const isAddEventShow = ref(false);
    const currListener = computed(() => activeCanvas.value.events?.click || "");
    const handleSetListener = (code: string) => {
      activeCanvas.value.events = {
        click: code,
      };
      isAddEventShow.value = false;
    };

    return () => (
      <div class="thing-form">
        <a-form>
          <a-form-item>
            <a-button onClick={() => (isAddEventShow.value = true)}>
              添加事件
            </a-button>
          </a-form-item>
          <a-form-item label="名称">
            <a-input disabled value={thingDetail.value.name}></a-input>
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
                <a-collapse-panel key={1} header="属性">
                  <a-checkbox-group v-model={[selectedProps.value, "value"]}>
                    <a-row>
                      {propertiesList.value.map((item: any) => (
                        <a-col span={24}>
                          <a-checkbox
                            value={item.code}
                            onChange={(e: CheckboxChangeEvent) =>
                              onPropertyChange(e, item)
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
            </a-checkbox-group>
          </a-form-item>
        </a-form>

        <AddEventModal
          listener={currListener.value}
          v-model={[isAddEventShow.value, "visible"]}
          onCommit={handleSetListener}
        />
      </div>
    );
  },
});

export default ThingForm;
