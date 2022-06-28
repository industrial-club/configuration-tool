import { defineComponent, h, ref, resolveComponent, watch } from "vue";
import { cloneDeep } from "lodash";
import { diff } from "../utils";

const formGroupList = [
  {
    name: "基础信息",
    key: "basic",
    formItems: [
      {
        key: "abscissa",
        label: "横坐标",
        type: "number",
        rules: {
          max: 1000,
          min: 100,
          precision: 2,
        },
        value: 290,
      },
      {
        key: "angle",
        label: "角度",
        type: "text",
        value: "你好啊",
        disabled: true,
      },
      {
        key: "detail",
        label: "详细信息",
        type: "textarea",
        value: "hhh",
      },
      {
        key: "layer",
        label: "图层",
        type: "select",
        value: undefined,
        options: [{ label: "你好啊", value: "hello" }],
      },
      {
        key: "background",
        label: "背景",
        type: "color",
        value: "#ffffff",
      },
      {
        key: "isXXX",
        label: "是否XXX",
        type: "checkbox",
        value: true,
      },
    ],
  },
];

/**
 * 动态属性表单
 */
const PropertiedForm = defineComponent({
  setup() {
    const expendedKeys = ref(formGroupList.map((item) => item.key));

    // 表单
    const form = ref<any>({});
    const oldForm = ref<any>({});
    formGroupList.forEach((group) => {
      group.formItems.forEach((item) => {
        form.value[item.key] = item.value;
      });
    });
    oldForm.value = cloneDeep(form.value);

    watch(
      form,
      (val) => {
        const differences = diff(val, oldForm.value);
        console.log("表单变化", differences);

        oldForm.value = cloneDeep(val);
      },
      { deep: true }
    );

    // 根据描述 生成表单项
    const getFieldCpn = (desc: any) => {
      let fieldCpn;
      let props: any = {};
      const rules = desc.rules ?? {};
      const children: any[] = [];
      // 是否禁用
      props.disabled = desc.disabled;
      switch (desc.type) {
        case "textarea": // 文本域
          fieldCpn = "a-textarea";
          break;
        case "number": // 数字输入
          fieldCpn = "a-input-number";
          if (rules.min !== undefined) {
            props.min = rules.min;
          }
          if (rules.max !== undefined) {
            props.max = rules.max;
          }
          if (rules.precision !== undefined) {
            props.precision = rules.precision;
          }
          break;
        case "select": // 选择器
          fieldCpn = "a-select";
          props.options = desc.options ?? [];
          break;
        case "color": // 颜色选择器
          fieldCpn = "input";
          props.type = "color";
          props.onInput = (e: any) => {
            form.value[desc.key] = e.target.value;
          };
          break;
        case "checkbox": // 复选框
          fieldCpn = "a-checkbox";
          break;

        default: // 文本
          fieldCpn = "a-input";
          break;
      }

      const isNative = !fieldCpn.startsWith("a-");

      const tag = isNative ? fieldCpn : resolveComponent(fieldCpn as string);

      return h(
        tag,
        {
          ...props,
          key: desc.key,
          style: { width: "100%" },
          // 双向绑定
          value: form.value[desc.key],
          modelValue: form.value[desc.key],
          checked: form.value[desc.key],
          "onUpdate:value": (val: any) => {
            form.value[desc.key] = val;
          },
          "onUpdate:modelValue": (val: any) => {
            form.value[desc.key] = val;
          },
          "onUpdate:checked": (val: boolean) => {
            form.value[desc.key] = val;
          },
        }
        // children
      );
    };

    return () => (
      <div class="propertied-form">
        <a-form modal={form.value} labelCol={{ span: 6 }}>
          <a-collapse v-model={[expendedKeys.value, "activeKey"]}>
            {formGroupList.map((item) => (
              <a-collapse-panel key={item.key} header={item.name}>
                {item.formItems?.map((form) => (
                  <a-form-item name={form.key} label={form.label}>
                    {getFieldCpn(form)}
                  </a-form-item>
                ))}
              </a-collapse-panel>
            ))}
          </a-collapse>
        </a-form>
      </div>
    );
  },
});

export default PropertiedForm;
