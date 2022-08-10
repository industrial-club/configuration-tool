import { defineComponent, nextTick, reactive, ref, watch } from "vue";
import { toPreview } from "../config/preview";
import PreviewModal from "./preview-modal";
import "../style/preview.less";

export const Props = {
  val: {
    type: Boolean,
  },
};
export interface StateItem {
  equipmentStatus: Array<{ state: any; name: string; tem: any }>;
}
export interface DataItem {
  title: number;
  state: StateItem;
}
export interface VideoItem {
  pass: string;
  rtspPort: number;
  ip: string;
  channel: string;
  remark: string;
  rtspTemplateMerged: string;
  uuid: string;
  webrtcTemplateMerged: string;
  nvrBo: {
    brandTypePo: {
      code: string;
      name: string;
      rtspTemplate: string;
      id: number;
      prodType: string;
    };
    pass: string;
    brandTypeCode: string;
    rtspPort: number;
    ip: string;
    name: string;
    remark: string;
    id: number;
    user: string;
    uuid: string;
  };
  brandTypePo: {
    streamTypeDict: string;
    code: string;
    name: string;
    rtspTemplate: string;
    remark: string;
    id: number;
    prodType: string;
    streamTypeDictList: [
      {
        code: string;
        name: string;
      },
      {
        code: string;
        name: string;
      }
    ];
  };
  streamType: string;
  brandTypeCode: string;
  mediaServerPo: {
    name: string;
    remark: string;
    id: number;
    secret: string;
    uuid: string;
    url: string;
  };
  name: string;
  nvrChannel: string;
  id: number;
  nvrUuid: string;
  user: string;
  mediaServerUuid: string;
}

export default defineComponent({
  props: Props,
  emits: ["update:val"],
  setup(prop, cxt) {
    const val = ref(false);
    watch(
      () => prop.val,
      () => {
        val.value = prop.val;
      },
      { immediate: true }
    );
    const visible = ref(false);
    const data = reactive<{ list: DataItem }>({
      list: { title: 0, state: { equipmentStatus: [] } },
    });
    const dataList = {
      title: 701,
      state: {
        equipmentStatus: [
          { state: "启动", name: "设备状态", tem: null },
          { state: "正常", name: "机尾北侧轴承", tem: null },
          { state: "正常", name: "机尾南侧轴承", tem: null },
          { state: "正常", name: "机尾南侧轴承", tem: null },
          { state: null, name: "后轴承温度", tem: "20°C" },
          { state: null, name: "后轴承温度", tem: "20°C" },
          { state: null, name: "后轴承温度", tem: "20°C" },
          { state: null, name: "后轴承温度", tem: "20°C" },
          { state: null, name: "后轴承温度", tem: "20°C" },
          { state: null, name: "后轴承温度", tem: "30°C" },
        ],
      },
    };
    watch(
      () => val.value,
      () => {
        if (val.value) {
          nextTick(() => {
            toPreview({
              event: {
                click(i) {
                  visible.value = !visible.value;
                  // console.log(i);
                  // data.list = i.data;
                  data.list = dataList;
                },
              },
            });
          });
        }
      }
    );
    return () => (
      <a-modal
        v-models={[[val.value, "visible"]]}
        title="预览"
        width="100%"
        closable={false}
        footer={null}
        wrap-class-name="full-modal"
        onCancel={() => {
          cxt.emit("update:val", false);
        }}
      >
        {val.value ? (
          <div class="preview_box" id="preview_box">
            <canvas id="preview_canvas"></canvas>
            <PreviewModal
              state={dataList.state}
              title={data.list.title}
              v-models={[[visible.value, "visible"]]}
            ></PreviewModal>
          </div>
        ) : (
          ""
        )}
      </a-modal>
    );
  },
});
