<template>
  <div class="container">
    <div class="erp-nav">
      <div class="nav-title-box">
        <i class="el-icon-arrow-left" @click="back"></i>
        <div class="nav-title">相似商品</div>
      </div>
    </div>

    <div class="container">
      <div class="goodsInfo">
        <div class="img">
          <img :src="query.mainImgUrl" alt="" />
        </div>
        <div class="rightInfo">
          <p>{{ query.nameEn }}</p>
          <p>{{ query.categoryName }}</p>
          <div class="tag">
            <el-tag  v-for="(item, index) in query.labelList" :key="index">{{
              item.name
            }}</el-tag>
          </div>
        </div>
      </div>

      <div class="similar">
        <p class="red">存在相似的商品</p>
        <p>请选择相同商品进行申请权限，如均不同可关闭弹窗继续激活</p>

        <div class="table">
          <el-table :data="query.similarGoods">
            <el-table-column width="55" align="center">
              <template #default="scope">
                <el-checkbox
                  v-model="scope.row.checked"
                  @change="(val) => changeRadio(scope.$index, val)"
                  :disabled="scope.row.tickStatus === 0"
                ></el-checkbox>
              </template>
            </el-table-column>

            <el-table-column label="序号" width="55" align="center">
              <template #default="scope">
                <p>{{ scope.$index + 1 }}</p>
              </template>
            </el-table-column>

            <el-table-column label="商品名称" prop="nameEn" align="center">
              <template #default="scope">
                {{ scope.row.nameEn || scope.row.nameCn }}
              </template>
            </el-table-column>
            <el-table-column label="品类" prop="categoryName" align="center">
            </el-table-column>

						<el-table-column label="商品位置" prop="goodsPosition" align="center">
							<template #default="scope">
								{{ scope.row.goodsPosition  }}
							</template>
						</el-table-column>


            <el-table-column label="商品图片" prop="nameEn" align="center">
              <template #default="scope">
                <div class="goodsImgList">
                  <div
                    class="imgBox"
                    v-for="(item, index) in scope.row.imgList"
                    @click="preview(scope.row.imgList, index)"
                    :key="index"
                    v-show="index < 6 "
                  >
                    <img :src="item" alt="" />
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <div class="btns flex-pagination page-fixed">
      <el-button type="default"  @click="back">取消</el-button>
      <el-button type="primary"  v-debounce="setPer">申请权限</el-button>
    </div>

    <el-image-viewer
      v-if="showPreview"
      :url-list="previwList"
      :initial-index="previwIndex"
      @close="
        () => {
          showPreview = false;
        }
      "
    />

    <SetPerDilago
      v-if="dialogVisible"
      :dialogVisible="dialogVisible"
      @cancel="cancel"
      :query="serPerQuery"
    />
  </div>
</template>

<script>
import { toRefs, reactive, computed, onMounted, h } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import SetPerDilago from "@/views/goods/goodsManagement/addGoods/components/setPerDilago.vue";
import { setPermission } from "@/api/goods/addGoods.js";
import { ElMessage, ElMessageBox } from "element-plus";
import { copy } from "@/utils/tool.js";
import { storage } from "@/utils/storage.js";
export default {
  components: { SetPerDilago },
  props: {
    data: {
      type: Object,
      default: null,
    },
  },
  setup(props, { emit }) {
    let store = useStore();
    const route = useRoute();
    const router = useRouter();
    const data = reactive({
      tableData: [],
      query: {},
      selected: [],
      serPerQuery: {},
      dialogVisible: false,
      isDisabled: false,
      showPreview: false,
      previwIndex: 0,
      previwList: [],
      routeFromName: null,
      backEmitId: null,
    });
    let sideBarWidth = computed(() => store.state.menu.sideBarWidth);

    function cancel() {
      data.dialogVisible = false;
    }

    function handleSelectionChange(val) {
      data.selected = val;
    }

    function preview(list, index) {
      data.previwList = list;
      data.previwIndex = index;
      data.showPreview = true;
    }

    function setPer() {
      // const {goodsId} = route.params
      let goodsIds = [];
      let bole = false;
      data.query.similarGoods.map((item) => {
        console.log(item);
        if (item.checked) {
          goodsIds.push(item.id);
          bole = true;
        }
      });
      if (!bole) {
        ElMessage.error("请选择相似商品!");
        return;
      }
      console.log({ goodsIds: goodsIds.join(","), authType: 0, similarGoods: 1 });

      setPermission({goodsId:data.query.goodsId, goodsIds: goodsIds.join(","), authType: 0, similarGoods: 1 }).then(
        (res) => {
          if (res.code == 200) {
            const { status } = res.data;
            let x = CopyStatus(status);

            data.backEmitId = goodsIds[0];

            ElMessageBox({
              title: "申请成功",
              message: h("p", null, [
                h("p", null, "权限申请成功"),
                h("p", null, `可复制商品编码在【商品开发-${x}】中搜索查看该激活商品`),
              ]),
              showCancelButton: true,
              confirmButtonText: "复制商品编码",
              cancelButtonText: "取消",
              closeOnPressEscape: false,
              closeOnClickModal: false,
            })
              .then((a) => {
                copy(goodsIds[0]);
                back();
              })
              .catch(() => {
                back();
              });
          }
        }
      );

      //  data.serPerQuery = {goodsId}
      //  data.dialogVisible = true
    }

    function CopyStatus(val) {
      let x;
      switch (val) {
        case 1:
          x = "待申请";
          break;
        case 2:
          x = "待采购报价";
          break;
        case 3:
          x = "采购打回";
          break;
        case 4:
          x = "待物流报价";
          break;
        case 5:
          x = "物流打回";
          break;
        case 6:
          x = "已报价";
          break;
				case 10:
					x = "搁置中";
					break;
      }
      return x;
    }

    function back() {
      //  router.push({name:'addGoods'})
      if (props.data) {
        backEmit();
      } else {
        storage.set("similarGoods", null);
        // router.go(-1);
         router.push({name:'addGoods'})
      }
    }

    function backEmit() {
      emit("cancel", data.backEmitId);
    }

    function changeRadio(i, val) {
      data.query.similarGoods.forEach((item, index) => {
        if (index !== i) {
          item.checked = false;
        }
      });
    }

    onMounted(() => {
      //  const {params} = route

      if (props.data) {
        data.query = props.data.query;
        data.query.similarGoods.forEach((item) => (item.checked = false));
      } else if (storage.get("similarGoods")) {
        let x = JSON.parse(storage.get("similarGoods"));
        console.log(x)
        data.routeFromName = x.name;
        data.query = x.query;
        data.query.similarGoods.forEach((item) => (item.checked = false));
      }

      // data.query = JSON.parse(params.query)
    });

    return {
      ...toRefs(data),
      sideBarWidth,
      cancel,
      handleSelectionChange,
      setPer,
      back,
      changeRadio,
      preview,
    };
  },
};
</script>

<style lang="scss" scoped>
.erp-nav {
  background: #fff;
  position: fixed;
  left: v-bind(sideBarWidth);
  right: 0;
  top: 111px;
  transition: left 1s;
  border-top: 1px solid #e8e8e8;
  z-index: 15;
  .nav-title-box {
    height: 75px;
    display: flex;
    align-items: center;
    padding-left: 20px;
  }
  .nav-title {
    color: rgba(0, 0, 0, 0.85);
    font-size: 20px;
    font-weight: 500;
    text-align: center;
    flex-grow: 1;
  }
  .el-icon-arrow-left {
    cursor: pointer;
    font-size: 20px;
  }
}
.container {
  margin-top: 78px;
}
.goodsInfo {
  padding: 10px;
  background: white;
  display: flex;
  align-items: flex-start;
  .img {
    width: 140px;
    height: 140px;

    margin-right: 20px;
    img {
      width: auto;
      height: auto;
      max-width: 140px;
      max-height: 140px;
    }
  }
  .rightInfo {
    p {
      margin-bottom: 15px;
    }
  }
}

.similar {
  padding: 10px;
  margin-top: 20px;
  background: white;
  p {
    color: rgba(0, 0, 0, 0.65);
  }
  .red {
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #fd4c60;
    margin-bottom: 10px;
  }
}

.btns {
  justify-content: flex-end !important;
}

.goodsImgList {
  display: flex;
  flex-wrap: wrap;
  .imgBox {
    margin: 5px;
    width: 60px;
    height: 60px;
    img {
      max-width: 60px;
      max-height: 60px;
      width: auto;
      height: auto;
    }
  }
}
</style>
