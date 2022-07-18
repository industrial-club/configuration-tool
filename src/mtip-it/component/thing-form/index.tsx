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
  props: {
    thingDetail: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props, { emit }) {
    const activeCanvas = inject<Ref<MtipIt.Item>>("activeMtipItItem")!;

    // 属性列表
    const propertiesList = computed(() => {
      return props.thingDetail.thingPropertyList || [];
    });

    const selectedProps = ref([]);

    watch(
      () => props.thingDetail,
      async () => {
        await nextTick();
        selectedProps.value = (
          activeCanvas.value.thingInfo.properties || []
        ).map((item: any) => item.code);
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
            <a-input disabled value={props.thingDetail.name}></a-input>
          </a-form-item>
          <a-form-item>
            <a-checkbox-group
              style={{ width: "100%" }}
              v-model={selectedProps.value}
            >
              <a-collapse activeKey={1}>
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
