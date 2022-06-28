import { computed, defineComponent, PropType } from "vue";

export interface IOptions {
  key: string;
  name: string;
  checkboxOptions: {
    label: string;
    value: any;
  }[];
}

const CheckboxGroup = defineComponent({
  emits: ["update:value"],
  props: {
    value: {
      type: Array,
      default: () => [],
    },
    options: {
      type: Array as PropType<IOptions[]>,
      default: () => [],
    },
  },
  setup(props, { emit }) {
    const modelValue = computed({
      get() {
        return props.value;
      },
      set(val) {
        emit("update:value", val);
      },
    });

    return () => (
      <div class="checkbox-group">
        <a-checkbox-group v-model={[modelValue.value, "value"]}>
          <a-collapse>
            {props.options.map((item) => (
              <a-collapse-panel key={item.key} forceRender header={item.name}>
                <a-row>
                  {item.checkboxOptions.map((option) => (
                    <a-col span={24}>
                      <a-checkbox value={option.value}>
                        {option.label}
                      </a-checkbox>
                    </a-col>
                  ))}
                </a-row>
              </a-collapse-panel>
            ))}
          </a-collapse>
        </a-checkbox-group>
      </div>
    );
  },
});

export default CheckboxGroup;
