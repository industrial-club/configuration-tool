import { computed, defineComponent, nextTick, ref, watch } from "vue";
import CodeMirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/selection/active-line.js";

/**
 * 添加事件对话框
 */
const AddEventModal = defineComponent({
  emits: ["update:visible", "commit"],
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    listener: {
      type: String,
      default: "",
    },
  },
  setup(props, { emit }) {
    const isVisible = computed({
      get() {
        return props.visible;
      },
      set(val) {
        emit("update:visible", val);
      },
    });

    const codeRef = ref();
    const codeIns = ref<CodeMirror.EditorFromTextArea>();

    const setValue = () => {
      const val = codeIns.value?.getValue();
      val !== undefined && (code.value = val);
    };

    // 处理函数字符串
    const code = ref("");
    watch(isVisible, async (val) => {
      code.value = props.listener;
      await nextTick();
      if (val) {
        codeIns.value = CodeMirror.fromTextArea(codeRef.value, {
          mode: "javascript",
          smartIndent: true,
          firstLineNumber: 2,
          indentWithTabs: false,
          lineWrapping: true,
        });
        codeIns.value.on("change", setValue);
      } else {
        codeIns.value?.off("change", setValue);
        // 销毁
        setTimeout(() => {
          codeIns.value?.toTextArea();
        }, 200);
      }
    });

    // 提交
    const onCommit = () => {
      emit("commit", code.value);
    };

    return () => (
      <div class="add-event-modal">
        <a-modal
          title="添加事件"
          v-model={[isVisible.value, "visible"]}
          onOk={onCommit}
        >
          <code>function onClick(e) {"{"}</code>
          <textarea
            ref={codeRef}
            class="code-container"
            value={code.value}
          ></textarea>
          <code>{"}"}</code>
        </a-modal>
      </div>
    );
  },
});

export default AddEventModal;
