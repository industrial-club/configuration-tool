import { defineComponent, PropType, ref, watch } from "vue";
import { StateItem, VideoItem } from "../preview";
import leftBtn from "@/assets/svg/btn_l.png";
import rightBtn from "@/assets/svg/btn_r.png";

export const Props = {
  data: {
    type: Object as PropType<StateItem>,
    required: true,
  },
  // camera: {
  //   type: [Object, String] as PropType<VideoItem | String>,
  // },
};

export default defineComponent({
  props: Props,
  setup(_props) {
    const list = ref([]);

    watch(
      () => _props.data,
      (e) => {
        list.value = _props.data.camera;
      },
      { immediate: true }
    );
    const index = ref(0);
    const toggle = (step: number) => {
      index.value += step;
      if (index.value > list.value.length - 1) {
        index.value = 0;
        return;
      }
      if (index.value < 0) {
        index.value = list.value.length - 1;
      }
    };
    return () => (
      <div class="preview-state">
        <a-row>
          <a-col span="14">
            <a-row>
              <a-col span="12">
                {_props.data.equipmentStatus.map((item, inx) => {
                  return (
                    <>
                      {inx <= 8 && (
                        <div style={`padding:5px 0;`}>
                          <span>{`${item.name}：`}</span>
                          <span>{item.state ? item.state : item.tem}</span>
                        </div>
                      )}
                    </>
                  );
                })}
              </a-col>
              <a-col span="12">
                {_props.data.equipmentStatus.map((item, inx) => {
                  return (
                    <>
                      {inx > 8 && (
                        <div style={`padding:5px 0;`}>
                          <span>{`${item.name}：`}</span>
                          <span>{item.state ? item.state : item.tem}</span>
                        </div>
                      )}
                    </>
                  );
                })}
              </a-col>
            </a-row>
          </a-col>
          <a-col span="10" class="preview-state-right">
            <div class="preview-state-video">
              {list.value.length > 1 ? (
                <>
                  <img
                    class="img leftImg"
                    onClick={() => {
                      toggle(-1);
                    }}
                    src={leftBtn}
                  />
                  <img
                    class="img rightImg"
                    onClick={() => {
                      toggle(1);
                    }}
                    src={rightBtn}
                  />
                </>
              ) : (
                ""
              )}
              {list.value.map((ele) => (
                <inl-video-player
                  camera={list.value[index.value]}
                ></inl-video-player>
              ))}
            </div>
          </a-col>
        </a-row>
      </div>
    );
  },
});
