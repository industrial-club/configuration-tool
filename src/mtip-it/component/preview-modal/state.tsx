import { defineComponent, PropType, ref, watch } from "vue";
import { StateItem } from "../preview";

export const Props = {
  data: {
    type: Object as PropType<StateItem>,
    required: true,
  },
};

export default defineComponent({
  props: Props,
  setup(_props) {
    watch(
      () => _props.data,
      (e) => {
        // console.log(e);
      },
      { immediate: true }
    );
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
          <a-col span="10">
            <div class="preview-state-video">
              <inl-video-player camera={""}></inl-video-player>
            </div>
          </a-col>
        </a-row>
      </div>
    );
  },
});
