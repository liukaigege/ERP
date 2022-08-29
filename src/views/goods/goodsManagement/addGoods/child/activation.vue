<template>
  <div class="container">
     <div v-if="!showSimilar">
       <div class="erp-nav">
      <div class="nav-title-box">
        <i class="el-icon-arrow-left" @click="back"></i>
        <div class="nav-title">激活商品</div>
      </div>
      <div class="step">
        <el-steps :active="active" finish-status="finish" align-center>
          <el-step title="审核去重"></el-step>
          <el-step title="设置权限"></el-step>
          <el-step title="完成激活"></el-step>
        </el-steps>
      </div>
    </div>
    <div class="containers">
      <div class="info" v-if="active !== 3">
        <div class="infoLeft">共{{ query.count }}个商品，其中：</div>
        <div class="infoRight">
          <p>
            {{ query.sourceRepeatCount }}个商品来源重复，{{
              query.tortCount
            }}个商品可能存在侵权，无法激活,{{ query.noSpecsCount }}个商品未匹配常用规格
          </p>
          <p>{{ query.similarCount }}个商品存在相似，可勾选继续激活</p>
        </div>
      </div>

      <div class="table" v-if="active !== 3">
        <el-button
          v-if="active == 2"
          type="primary"
          @click="setPer"
          style="margin: 10px 0"
          >设置权限</el-button
        >
        <el-table
          :data="query.goodsActivateVO || []"
          ref="tableRef"
          @selection-change="handleSelectionChange"
          style="width: 100%"
        >
          <el-table-column type="selection" width="55" :selectable="checkSelectable">
          </el-table-column>
          <el-table-column label="图片" align="center" width="105">
            <template #default="scope">
              <div class="img">
                <img :src="scope.row.url || defaultImg" alt="" />
              </div>
            </template>
          </el-table-column>
          <el-table-column label="商品名称" prop="nameEn" width="350" align="center">
            <template #default="scope">
              {{ scope.row.nameEn || scope.row.nameCn }}
            </template>
          </el-table-column>
          <el-table-column label="品类" prop="categoryName" align="center">
          </el-table-column>
          <el-table-column label="结果" prop="result" align="center">
            <template #default="scope">
              <p v-if="scope.row.activateVO?.isSuccess == 1">无重复</p>
              <p class="resultText" v-else>
                {{ scope.row.result }}
                <span v-if="showButton(scope.row, 1)  && !showStatusOther(scope.row)"
                  >(可复制商品编码在【商品开发-{{
                    CopyStatus(scope?.row?.activateVO?.failMsg?.repeat.status)
                  }}】中搜索查看该商品)</span
                >
                <span v-if="showButton(scope.row, 1)  &&  showStatusOther(scope.row)">
                 ( 由于当前账号无{{scope.row.activateVO.failMsg.repeat.categoryName?scope.row.activateVO.failMsg.repeat.categoryName:'-'}}品类权限，所以无法使用已激活商品)
                </span>
                <span v-if="showButton(scope.row, 66)"
                  >(已开通权限,可复制商品编码在【商品开发-{{
                    CopyStatus(scope.row?.status)
                  }}】中搜索查看该商品)</span
                >
              </p>
            </template>
          </el-table-column>
          <!-- 此处有问题 -->
          <el-table-column width="105" label="操作" align="center" v-if="active == 1">
            <template #default="scope">
              <div class="button">
                <el-button
                  type="text"

                  @click="similarGoods(scope.row)"
                  v-if="showButton(scope.row, 3)"
                  >查看</el-button
                >
                <!-- 相似 -->
                <el-button
                  type="text"

                  @click="tortDetail(scope.row.goodsId)"
                  v-if="showButton(scope.row, 4)"
                  >查看</el-button
                >
                <el-button
                  type="text"

                  @click="apply(scope.row.goodsId)"
                  v-if="showButton(scope.row, 4)"
                  >申请审核</el-button
                >
                <!-- 侵权 -->
                <el-button
                  type="text"

                  v-if=" showButton(scope.row, 66)"
                  @click="copy(scope.row.goodsId)"
                  >复制商品编码 </el-button
                >

                  <el-button
                  type="text"

                  v-if="showButton(scope.row, 1)  && !showStatusOther(scope.row)"
                  @click="copy(scope.row.activateVO.failMsg.repeat.goodsId)"
                  >复制商品编码 </el-button>

              </div>
            </template>
          </el-table-column>

          <el-table-column label="权限" align="center" v-if="active == 2">
            <template #default="scope">
              <div class="button">
                {{ scope.row.permission || "" }}
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="activeSuccess" v-if="active == 3">
        <p><i class="el-icon-success"></i></p>
        <h1>成功激活商品{{ activeNum }}个</h1>
        <p class="tx">可点击【立即报价】立即申请报价</p>
        <p class="tx">也可在【商品开发-待申请】中编辑商品信息并申请报价</p>
        <p class="tx">报价完成后即可刊登该商品</p>
      </div>
    </div>
    <div class="btns flex-pagination page-fixed">
      <el-button type="default"  @click="back" v-if="active == 3"
        >关闭</el-button
      >
      <el-button
        v-if="active !== 3"
        type="primary"

        @click="nextStep"
        :disabled="selected.length == 0 && active == 1"
        >下一步</el-button
      >
      <el-button type="primary"  	v-debounce="goUnsetPrice"  v-if="active == 3"
        >查看已激活商品</el-button
      >
      <el-button type="primary" 	v-debounce="applyPrice"   v-if="active == 3"
        >立即报价</el-button
      >
    </div>

     </div>
    <SetPerDilago
      :dialogVisible="ActiveDilaogShow"
      v-if="ActiveDilaogShow"
      :query="activeQuery"
      @cancel="cancel"
      @setPerSuccess="setPerSuccess"
    />


    <SimilarGoods v-if="showSimilar" @cancel="cancelSimilar" :data="showSimilarQuerys" />
  </div>
</template>

<script>
import {
  toRefs,
  reactive,
  computed,
  onMounted,
  ref,
  onActivated,
  onUnmounted,
  h,
	nextTick
} from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { ElMessage,ElMessageBox } from "element-plus";
import { activates, setPermissionAll, applyOffer,activateCheck } from "@/api/goods/addGoods.js";
import SetPerDilago from "@/views/goods/goodsManagement/addGoods/components/setPerDilago.vue";
import defaultImg from "@/assets/image/mr_bg@2x.png";
import SimilarGoods from '@/views/goods/goodsManagement/addGoods/child/similarGoods.vue'
import { copy,debounce } from "@/utils/tool.js";
import { storage } from "@/utils/storage.js";

export default {
  components: { SetPerDilago,SimilarGoods },
  setup(props, { emit }) {
    let store = useStore();
    const route = useRoute();
    const router = useRouter();
    const data = reactive({
      tableData: [],
      active: 1,
      query: {},
      selected: [],
      ActiveDilaogShow: false,
      activeQuery: null,
      activeNum: 0,
      acitvedGoodsIds: null,
      showSimilar:false,
      similarGoodsIds:[],
      showSimilarQuerys:null
    });
    let sideBarWidth = computed(() => store.state.menu.sideBarWidth);
    const tableRef = ref(null);
    function cancel() {
      data.ActiveDilaogShow = false;
    }

    function nextStep() {
      if (data.active == 2) {
        setPerAll();
        // if(x){
        //   ElMessage.error('请给所有商品设置权限')
        // }else{

        // }
      } else {
        data.active += 1;
        data.query.goodsActivateVO = data.selected;
        data.query.goodsActivateVO.forEach((item) => {
          item.permission = "仅自己可见";
          item.permissionType = 0;
        });
      }
      tableRef.value.clearSelection();
      data.selected = [];
    }

    function handleSelectionChange(val) {
      data.selected = val;
    }

    function setPer() {
      if (data.selected.length == 0) {
        ElMessage.error("请勾选商品");
        return;
      }
      let goodsIds = [];
      data.selected.map((item) => {
        goodsIds.push(item.goodsId);
      });

      data.activeQuery = { goodsId: goodsIds.join(","), status: "all" };
      data.ActiveDilaogShow = true;
    }
    function search() {}
    function setPerSuccess({ goodsIds, authTypeName, authType }) {
      console.log(goodsIds, authTypeName, authType);
      data.ActiveDilaogShow = false;
      if (goodsIds.indexOf(",") !== -1) {
        goodsIds = goodsIds.split(",");
      } else {
        goodsIds = [goodsIds];
      }
      data.query.goodsActivateVO.forEach((item) => {
        if (goodsIds.indexOf(item.goodsId) !== -1) {
          item.permission = authTypeName;
          item.permissionType = authType;
        }
      });
      // console.log(data.query.goodsActivateVO)
    }

		let setPerAll = debounce(()=>{
			let goodsPermissionDTOS = [];
			data.query.goodsActivateVO.map((item) => {
				let obj = {
					authType: item.permissionType,
					goodsId: item.goodsId,
				};
				goodsPermissionDTOS.push(obj);
			});
			console.log(goodsPermissionDTOS);
			setPermissionAll({ goodsPermissionDTOS }).then((res) => {
				console.log(res.data);
				if (res.code == 200) {
					data.active += 1;
					data.activeNum = res.data.length;
					data.acitvedGoodsIds = res.data;
				}
			});
		})
    // function setPerAll() {
		// 	_debounce(() =>{
		// 		let goodsPermissionDTOS = [];
		// 		data.query.goodsActivateVO.map((item) => {
		// 			let obj = {
		// 				authType: item.permissionType,
		// 				goodsId: item.goodsId,
		// 			};
		// 			goodsPermissionDTOS.push(obj);
		// 		});
		// 		console.log(goodsPermissionDTOS);
		// 		setPermissionAll({ goodsPermissionDTOS }).then((res) => {
		// 			console.log(res.data);
		// 			if (res.code == 200) {
		// 				data.active += 1;
		// 				data.activeNum = res.data.length;
		// 				data.acitvedGoodsIds = res.data;
		// 			}
		// 		});
		// 	})
		//
    // }

    function applyPrice() {
      let arr = [];
      console.log(data.acitvedGoodsIds);
      applyOffer({ goodsIds: data.acitvedGoodsIds.join(",") }).then((res) => {
        console.log(res.data);
        if (res.code == 200) {
          ElMessage.success("申请报价成功");
          setTimeout(() => {
            back();
          }, 1000);
        }
      });
    } //激活完成报价

    function showStatusOther(row){
        if(row.activateVO?.failMsg.repeat.status && row.activateVO?.failMsg.repeat.status ==99  ) return true
        return false
    }

    function goUnsetPrice() {
      router.push({
        name:  "UnsetPrice",
				params:{isRefresh: true}
      });
    }

    function showButton(row, type) {
      if (row.activateVO?.isSuccess == 1) return false;
      if (row.activateVO?.failMsg.checkType == type) return true;
      return false;
    }

    function checkSelectable(row) {
      const { activateVO } = row;
      if (activateVO.isSuccess == 1) return true;
      if (activateVO.failMsg.checkType == 3) return true;
      return false;
    }

    function similarGoods(row) {
      const { goodsId, activateVO } = row;
      const query = {
        query: activateVO.failMsg.similarGoodsVO,
        goodsId,
        name: "activation",
      };
      data.showSimilarQuerys = query
      data.showSimilar = true
      // storage.set("similarGoods", JSON.stringify(query));
      // router.push({ name: "similarGoods" });
    } // 查看

    function back() {
      router.push({ name: "addGoods", params: { isRefresh: true } });
      storage.set('setPerGoodsId',null)
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
          case 99:
          x = "已报价";
          break;
      }
      return x;
    }

    function tortDetail(goodsId) {
      router.push({ name: "tortDetail", query: { goodsId } });
    }

    function apply(goodsId) {
      activateCheck({ goodsId }).then((res) => {
        if (res.code == 200) {
          ElMessageBox({
            title: "申请成功",
            message: h("p", null, [
              h("p", null, "申请审核成功，请等待审核结果。"),
              h("p", null, `审核通过后，可直接在【商品开发-待申请】中查看。`),
            ]),
            showCancelButton: true,
            showConfirmButton: false,
            cancelButtonText: "取消",
            closeOnPressEscape: false,
            closeOnClickModal: false,
          })
            .then((a) => {
              list();
            })
            .catch(() => {
              list();
            });
        }
      });
    }

    function list() {
      const { query } = route;
      if (query.goodsIds) {
        activates({ goodsIds: query.goodsIds }).then((res) => {
          if (res.code == 200) {
            data.query = res.data;
						nextTick(()=>{
							res.data.goodsActivateVO.map((item) => {
								if (item.activateVO.isSuccess == 1) {
									tableRef.value.toggleRowSelection(item);
								}
							});
						})
          }
        });
      }


    }

    function cancelSimilar(val){
      // data.similarGoodsIds.push(val)
      // data.similarGoodsVO = [...new Set(data.similarGoodsIds)]
      // console.log(data.similarGoodsVO)
      data.showSimilar = false
       data.query?.goodsActivateVO.map(item=>{
         console.log(item)
          if (item.activateVO.failMsg && item.activateVO.failMsg.checkType == 3) {
              let similar =  getNewSimi(item.activateVO.failMsg.similarGoodsVO.similarGoods);
							if(similar){
								item.result = "相似品";
								item.status = similar.status
								item.goodsId = similar.id
								item.activateVO.failMsg = { checkType: 66 };
							}
           } //
        })
      function getNewSimi(arr) {
				return arr.find(v=>{
						return val &&  val === v.id
					})

        arr.forEach((item) => {
          if (z &&z?.indexOf(item.id) !== -1) {
            item.result = "相似品";
            item.goodsId = item.id;
            //  item.checkType = 66
            item.url = item.imgList[0];
            item.activateVO = {};
            item.activateVO.failMsg = { checkType: 66 };
            if(data.query.goodsActivateVO.findIndex(v=>v.goodsId == item.id) == -1){
              data.query.goodsActivateVO.push(item);
            }
          }
        });
      }

    }


    onMounted(() => {
      list();
    });
    return {
      ...toRefs(data),
      sideBarWidth,
      cancel,
      nextStep,
      handleSelectionChange,
      setPer,
      search,
      setPerSuccess,
      checkSelectable,
      back,
      showButton,
      tableRef,
      similarGoods,
      applyPrice,
      goUnsetPrice,
      defaultImg,
      copy,
      tortDetail,
      apply,
      CopyStatus,
      cancelSimilar,
      showStatusOther
    };
  },
};
</script>

<style lang="scss" scoped>
.step {

  width: 70%;
  margin: 0 auto;
    margin-bottom: 10px;
}
.table {
  margin-top: 40px;
}
.erp-nav {
  background: #fff;
  position: fixed;
  left: v-bind(sideBarWidth);
  right: 0;
  top: 111px;
  transition: left 1s;
  border-top: 1px solid #e8e8e8;
  z-index: 15;
  padding: 0 24px;
  .nav-title-box {
    height: 75px;
    display: flex;
    align-items: center;
    padding-left: 0px;
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
.containers {
  margin-top: 130px;
  background: white;
  padding: 5px 30px 30px 30px;
}

.info {
  display: flex;
  align-items: flex-start;
  margin: 10px 0;
  .infoRight {
    color: #fd4c60;
  }
}

.btns {
  justify-content: flex-end !important;
}

.img {
  width: 80px;
  height: 80px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    width: auto;
    height: auto;
    max-width: 80px;
    max-height: 80px;
  }
}

.activeSuccess {
  text-align: center;
  margin-top: 20px;
  .tx {
    color: rgba(0, 0, 0, 0.43);
    font-weight: 500;
  }
  p {
    margin: 5px 0;
  }
  i {
    font-size: 72px;
    color: #74c041;
  }
}

.resultText {
  color: red;
  span {
    color: #9e9e9e;
  }
}
</style>
