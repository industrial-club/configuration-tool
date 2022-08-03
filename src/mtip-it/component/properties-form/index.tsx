import { computed, defineComponent, h, PropType, resolveComponent } from "vue";
import { fabric } from "fabric";
import { CONFIG_PROPS } from "./config";

/**
 * 动态部件属性表单
 */
const PropertiesForm = defineComponent({
  emits: ["update"],
  props: {
    widget: {
      type: Object as PropType<fabric.Object>,
      required: true,
    },
  },
  setup(props, { emit }) {
    const configureProps = computed(() => {
      const properties: string[] = props.widget?.stateProperties ?? [];
      const res = [];
      for (const p of properties) {
        CONFIG_PROPS[p] &&
          res.push({
            key: p,
            ...CONFIG_PROPS[p],
          });
      }
      return res;
    });

    // 更新属性
    const update = (key: string, value: any) => {
      props.widget.set<any>(key, value);
      emit("update", { key, value });
      props.widget.canvas!.requestRenderAll();
    };

    // 获取表单项的类型
    const getFormItem = (type: string, key: string) => {
      let tag = "";
      const props: any = {};
      if (type === "color") {
        tag = "input";
        props.type = "color";
        props.onInput = (e: any) => {
          update(key, e.target.value);
        };
      } else if (type === "number") {
        tag = "a-input-number";
      } else if (type === "text") {
        tag = "a-input";
      } else if (type === "switch") {
        tag = "a-switch";
      } else if (type === "range") {
        tag = "a-slider";
      }
      return {
        tag,
        props,
        isNative: tag === "input",
      };
    };

    return () => (
      <div class="propertiesForm">
        <a-form labelCol={{ style: { width: "6em" } }}>
          {configureProps.value.length ? (
            configureProps.value.map((item) => (
              <a-form-item key={item.key} label={item.label}>
                {() => {
                  const res = getFormItem(item.type, item.key);
                  return h(res.isNative ? res.tag : resolveComponent(res.tag), {
                    ...(item.props ?? {}),
                    ...res.props,
                    value: props.widget.get(item.key),
                    checked: props.widget.get(item.key),
                    modelValue: props.widget.get(item.key),
                    "onUpdate:value": (val: any) => update(item.key, val),
                    "onUpdate:checked": (val: any) => update(item.key, val),
                    "onUpdate:modelValue": (val: any) => update(item.key, val),
                  });
                }}
              </a-form-item>
            ))
          ) : (
            <a-empty />
          )}
        </a-form>
      </div>
    );
  },
});

export default PropertiesForm;
