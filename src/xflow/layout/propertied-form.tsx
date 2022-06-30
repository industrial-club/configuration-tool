import {
  defineComponent,
  h,
  ref,
  Ref,
  resolveComponent,
  watch,
  PropType,
  nextTick,
} from "vue";
import { cloneDeep } from "lodash";
import { diff } from "../utils";
import CheckboxGroup from "../components/checkbox-group";
import menus from "../config/menu";

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
  {
    name: "控制-单击弹出框信息",
    key: "controls",
    formItems: [
      {
        key: "status",
        label: "状态",
        type: "checkgroup",
        value: ["long", "speed", "direction", "frontTemperture", "fault"],
        options: [
          {
            name: "主机属性",
            key: "main",
            checkboxOptions: [
              { label: "长度", value: "long" },
              { label: "运行速度", value: "speed" },
            ],
          },
          {
            name: "电机",
            key: "motor",
            checkboxOptions: [
              { label: "转动方向", value: "direction" },
              { label: "前轴温度", value: "frontTemperture" },
              { label: "后轴温度", value: "backTemperture" },
              { label: "电流", value: "dianliu" },
              { label: "故障", value: "fault" },
            ],
          },
        ],
      },
    ],
  },
];

export const Props = {
  tabId: String,
  canvas: Object as PropType<Record<string, ZXFLOW.Canvas>>,
  flowArgsById: Object as PropType<Record<string, ZXFLOW.FlowArgs>>,
};

/**
 * 动态属性表单
 */
const PropertiedForm = defineComponent({
  props: Props,
  setup(props, context) {
    const expendedKeys = ref(formGroupList.map((item) => item.key));

    // 判断表单类型，分为 模型 - 模型实例 - 流程图
    const formType = ref("");
    const createForm = () => {
      const item = props.flowArgsById![props.tabId!];
      const { customData } = props.canvas![props.tabId!];
      if (item) {
        console.log(item.activeObj, customData);
      } else {
        // 点击的有可能是canvas画板
      }
    };
    watch(
      () => [props.tabId, props.flowArgsById],
      () => {
        nextTick(() => {
          createForm();
        });
      },
      {
        deep: true,
      }
    );
    // 表单
    const form = ref<any>({});
    const oldForm = ref<any>({});
    formGroupList.forEach((group) => {
      group.formItems.forEach((item) => {
        form.value[item.key] = item.value;
      });
    });
    oldForm.value = cloneDeep(form.value);

    // 但表单产生变化时触发
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
        case "checkgroup": // 复选框组
          fieldCpn = CheckboxGroup;
          props.options = desc.options;
          break;

        default: // 文本
          fieldCpn = "a-input";
          break;
      }

      const isNative = fieldCpn === "input" || fieldCpn === CheckboxGroup;

      const tag = isNative ? fieldCpn : resolveComponent(fieldCpn as string);

      return h(
        tag as any,
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

    // 渲染表单
    const renderForm = (form: Ref<any>) => (
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
    );

    return () => <div class="propertied-form">{formType.value?.name}</div>;
  },
});

export default PropertiedForm;
