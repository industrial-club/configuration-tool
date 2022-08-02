import {
  defineComponent,
  ref,
  inject,
  Ref,
  onMounted,
  computed,
  watch,
  nextTick,
  PropType,
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
    thingPropList: {
      type: Object,
      default: () => [],
    },
    activeCanvas: {
      type: Object as PropType<MtipIt.Item>,
      required: true,
    },
  },
  setup(props, { emit }) {
    // 属性列表
    const propertiesList = computed(() => {
      return props.thingPropList || [];
    });

    const selectedProps = ref([]);

    watch(
      () => props.thingPropList,
      async () => {
        await nextTick();
        selectedProps.value = (
          props.activeCanvas.thingInfo.properties || []
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
          <a-form-item>
            <a-collapse activeKey={1}>
              <a-collapse-panel key={1} header="属性">
                <a-checkbox-group v-model={[selectedProps.value, "value"]}>
                  <a-row>
                    {propertiesList.value.map((item: any) => (
                      <a-col span={24}>
                        <a-checkbox
                          value={item}
                          onChange={(e: CheckboxChangeEvent) =>
                            onPropertyChange(e, item)
                          }
                        >
                          {item}
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
