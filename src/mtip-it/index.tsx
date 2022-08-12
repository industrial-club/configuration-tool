import "./style/index.less";
import {
  defineComponent,
  nextTick,
  onMounted,
  PropType,
  provide,
  ref,
  watch,
} from "vue";
import { omit } from "lodash";
import { create, createFlow } from "./config/createCanvas";
import editorConter from "./layout/editorConter";
import editorForm from "./layout/form";
import thingPlane from "./layout/thingPlane";
import MtipItTop from "./layout/canvasEditorTop";
import previewDom from "./component/preview";
import * as thingApi from "./api/thing";
import api from "@/mtip-it/api";
import { message } from "ant-design-vue";
import { uuid } from "./config";

const allIts: Array<MtipIt.Item> = [];

export default defineComponent({
  props: {
    allIts: {
      type: Array as PropType<Array<MtipIt.Item>>,
      default: allIts,
    },
  },
  components: {
    editorConter,
    thingPlane,
    editorForm,
    MtipItTop,
    previewDom,
  },
  setup(prop, context) {
    // 全局类前缀
    const prefix = ref("mtip_it_editor");

    // 实例列表
    const thingList = ref<MtipIt.ThingGroupList>([]);
    const getThingList = async () => {
      const { data } = await thingApi.getThingList();
      if (!data) return;

      // 转换thingInfo属性
      for (const group of data) {
        if (!group.elements) continue;
        for (let i = 0; i < group.elements.length; i++) {
          const element = group.elements[i];

          const thingInfo = element.style ? JSON.parse(element.style) : {};
          group.elements[i] = {
            ...group.elements[i],
            ...omit(thingInfo, "id"),
          };
        }
      }
      data[0].elements.forEach((ele: any) => {
        ele.image_run = ele.image_run.replace("http://192.168.5.234:9001", "");
      });
      thingList.value = data;
    };

    // flow 列表
    const flowList = ref<Array<any>>([]);
    const getFlowList = async (state?: boolean) => {
      if (canvasList.value.length > 0 && !state) {
        thingId.value = canvasList.value[0].id;
      }
      const res: any = await api.get(
        "/thing/v1/adapter/thing/inst/queryTopoMap"
      );

      if (res.data) {
        flowList.value = res.data;
      }
    };

    onMounted(() => {
      getThingList();
      getFlowList();
    });

    // canvasList
    const canvasList = ref<Array<MtipIt.Item>>(allIts);

    // 设置选中thingid
    const thingId = ref("");

    // 获取当前活跃的canvas
    const getActiveCanvas = () => {
      return canvasList.value.find((item) => item.id === thingId.value);
    };

    // 创建当前活跃的canvas
    const activeMtipItItem = ref<MtipIt.Item>();
    provide("activeMtipItItem", activeMtipItItem);
    //
    provide("thingId", thingId);

    // 动态更新当前活跃的canvas
    watch(
      () => thingId.value,
      () => {
        activeMtipItItem.value = getActiveCanvas();
      },
      {
        immediate: true,
      }
    );

    // 预览弹窗数据相关
    const previewVal = ref(false);

    const tabbar = {
      open(e: MtipIt.serverFlowInfo) {
        const canvas = createFlow(e);
        let status = false;
        for (let i of canvasList.value) {
          if (i.id === canvas.id) {
            status = true;
          }
        }
        // 防止重复加载
        if (!status) {
          canvasList.value.push(canvas);
        }
        setTimeout(() => {
          thingId.value = canvas.id;
        }, 1);
      },
      close(e: MtipIt.ThingItem) {
        const index = canvasList.value.findIndex((item) => item.id === e.id);
        if (index) {
          canvasList.value.splice(index, 1);
          const activeIndex = canvasList.value.length - 1;
          setTimeout(() => {
            thingId.value = canvasList.value[activeIndex].id;
          }, 1);
        }
      },
    };

    const addFlowMode = ref({
      state: false,
      val: "",
    });
    const deleteHandle = async (id: number) => {
      const res: any = await api.get(
        `/thing/v1/adapter/thing/inst/deleteTopoMap/${id}`
      );
      message.success(`删除${(res.code = "M0000" ? "成功" : "失败")}`);
      getFlowList();
    };
    const type = ref("add");

    // 所有图表集合
    return () => (
      <div id={prefix.value} class={prefix.value}>
        <a-modal
          v-models={[[addFlowMode.value.state, "visible"]]}
          title={`${type.value === "add" ? "新建" : "编辑"}工艺流程图`}
          cancelText="取消"
          okText={`${type.value === "add" ? "添加" : "修改"}流程图`}
          onOk={() => {
            if (addFlowMode.value.val === "") {
              message.error("工艺流程图名称不能为空.");
            } else {
              tabbar.open({
                cropId: 0,
                id: uuid(),
                image: "",
                style: "",
                title: addFlowMode.value.val,
              });
              nextTick(() => {
                addFlowMode.value.state = false;
                message.success("添加成功.");
              });
            }
          }}
        >
          <a-row>
            <a-col span="8">工艺流程图名称: </a-col>
            <a-col span="16">
              <a-input
                v-models={[[addFlowMode.value.val, "value"]]}
                placeholder="请输入流程图名称"
              />
            </a-col>
          </a-row>
        </a-modal>
        <MtipItTop
          onPreview={(e: MtipIt.MenuItem) => {
            previewVal.value = true;
          }}
          onSave={() => {
            getThingList();
            getFlowList(true);
          }}
          onAddFlow={() => {
            addFlowMode.value.val = "";
            type.value = "add";
            addFlowMode.value.state = true;
          }}
        />
        <div class={prefix.value + "_body"}>
          <thingPlane
            thingList={thingList.value}
            flowList={flowList.value}
            onCreateFlow={(e: MtipIt.serverFlowInfo) => {
              tabbar.open(e);
            }}
            onEditFlow={(data: { id: string; name: string }) => {
              addFlowMode.value.val = data.name;
              type.value = "edit";
              addFlowMode.value.state = true;
            }}
            onDeleteFlow={(id: number) => {
              deleteHandle(id);
            }}
          />
          <editorConter
            mtipIts={canvasList.value}
            val={thingId.value}
            onClose={(e: MtipIt.ThingItem) => {
              tabbar.close(e);
            }}
          />
          <editorForm onRefresh={getThingList} />
        </div>
        <previewDom v-models={[[previewVal.value, "val"]]} />
      </div>
    );
  },
});
