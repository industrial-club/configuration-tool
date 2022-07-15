import {
  defineComponent,
  ref,
  inject,
  Ref,
  onMounted,
  computed,
  watch,
  nextTick,
} from "vue";
import { CheckboxChangeEvent } from "ant-design-vue/es/_util/EventInterface";
import AddEventModal from "./add-event-modal";
import * as api from "@/mtip-it/api/form";

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

    const selectedProps = ref([]);

    watch(
      activeCanvas,
      async () => {
        await nextTick();
        thingDetail.value = {};
        selectedProps.value = [];
        // 回显选中的属性
        const properties = activeCanvas.value?.thingInfo?.properties;
        if (properties?.length > 0) {
          selectedProps.value = properties.map((item: any) => item.code);
          for (const prop of properties) {
            emit("propertyChange", {
              checked: true,
              property: prop,
              isInit: true,
            });
          }
        }
        getProperties();
      },
      { immediate: true }
    );

    // 选中/取消选中属性 通知父组件 展示到图中
    const onPropertyChange = (e: CheckboxChangeEvent, ele: any) => {
      emit("propertyChange", {
        checked: e.target.checked,
        property: ele,
        isInit: false,
      });
    };

    return () => (
      <div class="thing-form">
        <a-form>
          <a-form-item label="名称">
            <a-input disabled value={thingDetail.value.name}></a-input>
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
      </div>
    );
  },
});

export default ThingForm;
