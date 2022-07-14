import {
  computed,
  defineComponent,
  h,
  PropType,
  ref,
  resolveComponent,
  watch,
} from "vue";
import { fabric } from "fabric";
import { CONFIG_PROPS } from "./config";

/**
 * 动态部件属性表单
 */
const PropertiesForm = defineComponent({
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

    // 给部件添加点击事件
    const isAddEventShow = ref(false);
    const listener = ref<any>();
    const listenerStr = ref("");
    const handleAddEvents = () => {
      isAddEventShow.value = true;
      const { _onClick, _onClickStr } = props.widget.data ?? {};
      listener.value = _onClick;
      listenerStr.value = _onClickStr;
    };
    const handleAddOver = (fnStr: string) => {
      // 如果存在监听函数 移除
      if (listener.value) {
        props.widget.off("mousedown", listener.value);
      }
      // 创建监听函数
      if (fnStr) {
        listener.value = function onClick(e: any) {
          eval(fnStr);
        };
        props.widget.on("mousedown", listener.value);
        props.widget.data || (props.widget.data = {});
        props.widget.data._onClick = listener.value;
        props.widget.data._onClickStr = fnStr;
      }
      isAddEventShow.value = false;
    };

    return () => (
      <div class="propertiesForm">
        <a-space style={{ marginBottom: "16px" }}>
          <a-button type="primary" onClick={handleAddEvents}>
            添加事件
          </a-button>
        </a-space>
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
