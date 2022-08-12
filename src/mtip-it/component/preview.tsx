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
  camera: Array<VideoItem> | Array<string>;
}
export interface DataItem {
  title: string;
  tabList: Array<{ label: string; data?: StateItem }>;
}
export interface VideoItem {
  user: string;
  mediaServerPo: {
    url: string;
  };
  pass: string;
  rtspPort: number;
  ip: string;
  channel: string;
  streamType: string;
  webrtcTemplateMerged: string;
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
    const data = reactive<{
      list: DataItem;
    }>({
      list: {
        title: "",
        tabList: [],
      },
    });
    const dataList = {
      title: "701",
      tabList: [
        {
          label: "状态",
          data: {
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
            camera: [
              // {
              //   user: "admin",
              //   mediaServerPo: {
              //     url: "http://192.168.5.43:10880",
              //   },
              //   pass: "zg123456",
              //   rtspPort: 554,
              //   ip: "172.16.110.19",
              //   channel: "1",
              //   streamType: "0",
              //   webrtcTemplateMerged:
              //     "http://192.168.5.43:880/index/api/addStreamProxy?vhost=__defaultVhost__&app=live&stream=v172.16.202.53-554-${channel}-${streamType}&url=rtsp://admin:password01@172.16.202.53:554/H264/ch${channel}/${streamType}/av_stream",
              // },
              "c371661235678801920",
              "c360021015999737856",
            ],
          },
        },
        { label: "报警" },
        { label: "控制" },
      ],
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
              data={dataList}
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
