<!--
 * @Descripttion: 弹框模板
 * @version:
 * @Author: 朱涛
 * @Date: 2021-07-15 17:01:59
 * @LastEditors: 朱涛
 * @LastEditTime: 2021-08-05 10:00:34
-->

<template>
  <div>
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      :width="width"
      @close="close"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div class="clearfix">
        <div class="fl goodsContainer">
          <div class="goodsContainerHeader clearfix">
            <span class="fl">商品</span>
            <div class="fr">
              <el-input
                placeholder="请输入商品名称或SKU"
                v-model="listSearchData.search"
                class="input-with-select"

                style="width: 240px"
                :maxlength="200"
                @keydown.enter="search"
              >
                <template #append>
                  <el-button icon="el-icon-search" @click="search"></el-button>
                </template>
              </el-input>
            </div>
          </div>
          <div class="mainContainer">
            <div class="warehouseContainer">
              <div style="width: 50%">
              <el-menu
                  :default-active="activeIndex"
                  class="el-menu-demo"
                  mode="horizontal"
                  @select="handleSelect"
                >
                  <el-menu-item index="1" :disabled="tableLoading">单品</el-menu-item>
                  <el-menu-item index="2" :disabled="tableLoading">组合</el-menu-item>
                </el-menu>
              </div>
              <div>
                <span>仓库：</span>
                <el-select
                  v-model="listSearchData.warehouseId"
                  style="width: 140px"
                  placeholder="请选择"

                  @change="search"
                >
                  <el-option
                    v-for="item in warehouseList"
                    :key="item.warehouseId"
                    :label="item.warehouseName"
                    :value="item.warehouseId"
                  >
                  </el-option>
                </el-select>
              </div>
            </div>
            <ul class="leftItemsContent">
              <li class="leftList clearfix" v-for="item in tableData" :key="item.skuId">
                <div class="itemImage fl">
                  <img :src="item.mainImgUrl" alt="" />
                </div>
                <div class="itemInfo fl">
                  <p class="itemsTitle">{{ item.goodsName }}</p>
                  <p class="itemsTitle">{{ item.skuCode }}</p>
                  <p class="itemsTitle">CNY {{ item.declareAmount }}</p>
<!--                  <p class="itemsTitle">-->
<!--                    库存：{{ item.stdCount ? item.stdCount : 0 }}（{{-->
<!--                      item.warehouseName ? item.warehouseName : "万众智谷仓库"-->
<!--                    }}）-->
<!--                  </p>-->
                </div>
                  <div class="itemTool fr">
                      <el-button
                          type="text"
                          :style="{ color: item.isSelect ? '#ccc' : '#409EFE' }"
                          @click="cleckLeftSelect(item)"
                      >{{ item.isSelect ? '已选' : '选择' }}</el-button
                      >
                  </div>
              </li>
              <li class="hint" v-if="tableData.length == 0">
                没有此商品，请确认输入内容是否正确
              </li>
            </ul>
          </div>
        </div>
        <div class="fr goodsContainer">
          <div class="goodsContainerHeader">已选 {{ rightList.length }} 个商品</div>
          <ul class="rightItemsContent">
            <li class="leftList clearfix" v-for="item in rightList" :key="item.goodsId">
              <div class="itemImage fl">
                <img :src="item.mainImgUrl" alt="" />
              </div>
              <div class="itemInfo fl" style="width: 145px">
                <p class="itemsTitle">{{ item.goodsName }}</p>
                <p class="itemsTitle">{{ item.skuCode }}</p>
                <p class="itemsTitle">CNY {{ item.declareAmount }}</p>
<!--                <p class="itemsTitle">-->
<!--                  库存：{{ item.stdCount ? item.stdCount : 0 }}（{{-->
<!--                    item.warehouseName ? item.warehouseName : "万众智谷仓库"-->
<!--                  }}）-->
<!--                </p>-->
              </div>
              <div class="itemRight fr">
                <div class="delBtns" @click="delRightGoods(item.skuId)">删除</div>
                <el-input-number
                  v-model="item.goodsQuantity"
                  controls-position="right"
                  :min="1"
                  :max="999"
                  :precision="0"
                  @blur="blurChangeNum(item)"

                  style="width: 88px"
                ></el-input-number>
                <div class="switchContainer" v-if="!isGift">
                  赠品：
                  <el-switch v-model="item.isGift"> </el-switch>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
        <el-pagination class="mt-20" small @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.currentPage" :page-sizes="pagination.pageSizes" :page-size="pagination.pageSize" layout="sizes, prev, pager, next, jumper" :total="pagination.totalCount">
        </el-pagination>
      <template #footer>
        <span class="dialog-footer">
          <el-button  @click="cancel">取 消</el-button>
          <el-button :disabled="!rightList.length" type="primary"  @click="sureFn">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, toRefs, getCurrentInstance,ref,onMounted,inject } from "vue";
import { getGoods } from '@/views/order/orderManagement/reissueGifts/composables/addGoodsApi.js'
import { warehouseList } from '@/assets/js/staticData.js'
import { ElMessage } from 'element-plus'
import {addDeliver} from '@/api/order/orderManagement.js'
import { erpElTable } from "@/utils/hooks.js";

export default {
  props: {
    data:{
       type: Object,
      default: null,
    },
    dialog: {
      type: Object,
      default: null,
    },
    dialogTitle: {
      type: String,
      default: "提示",
    },
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    width: {
      type: String,
      default: "30%",
    },
    isGift: {
      type: Boolean,
      default: true,
    },
    excludeSkuIds: {
      type: Array,
      default: [],
    },
  },
  setup(props, context) {
    const { proxy } = getCurrentInstance();
    		const formOptions = inject('formOptions')
    const data = reactive({});

    const dialogHandOk = () => {};

    const close = () => {
      proxy.$parent.dialogVisible = false;
    };
    const cancel = () => {
      proxy.$parent.dialogVisible = false;
    };

    const state = reactive({
      showModal: true,
      closeMasker: false,
      list: [],
      rightList: [],
      listSearchData: {
        // excludeSkuIds: props.data.excludeSkuIds,
        excludeSkuIds: [], // 取消过滤
        search: "",
        combineType: 1,
        warehouseId: 1,
				skuTypeFlag:props.dialogTitle == '追加发货商品' ? 3 : null
      }
    });

    const erpTableOpt = erpElTable(getGoods, state.listSearchData, {
        dataFilter: data => {
            data.forEach(item => {
                //是否是赠品
                item.isGift = false
                //商品数量
                item.goodsNumber = 1
                item.goodsQuantity = 1
                item.id = null
                if (state.rightList.length && state.rightList.findIndex(sku => sku.skuId === item.skuId) !== -1) {
                    item.isSelect = true
                } else {
                    item.isSelect = false
                }
            })
            return data
        }
    })

    const activeIndex = ref("1");
    //关闭弹框
    const closeTheModalFn = () => {
      context.emit("setData", false);
    };
    //选择单品/组合品的切换
    const handleSelect = (key, keyPath) => {
      state.listSearchData.combineType = key - 0;
      erpTableOpt.search();
    };
      //左侧列表点击选择
      function cleckLeftSelect(item) {
          item.isSelect = !item.isSelect
          item.goodsNumber = 1
          item.goodsQuantity = 1
          if (item.isSelect) {
              state.rightList.push(item)
          } else {
              delRightGoods(item.skuId)
          }
      }
      //右侧列表点击删除
      function delRightGoods(skuId) {
          state.rightList = state.rightList.filter(v => v.skuId != skuId)
          const item = erpTableOpt.tableData.value.find(e => e.skuId === skuId)
          if (item) item.isSelect = false
      }
    //弹框点击确定
    function sureFn() {
      context.emit("setData", state.rightList);
      // let goods = []
      // state.rightList.map(item=>{
      //     let x = item
      //     x.id =null
      //     x.operation = 1
      //     x.goodsQuantity = x.goodsNumber
      //     x.giftFlag = x.isGift ? 1 : 0
      //     x.price = x.proposalPrice
			//
      //     goods.push(x)
      // })
      const parma = {
        packageOrderIds:props.data.infos,
        goods:state.rightList
      }
      addDeliver(parma).then(res=>{
        if(res.code == 200){
            proxy.$message.success(res.message)
								formOptions.value.init()
								cancel()
        }
      })
    }

    function blurChangeNum(item) {
        // if (item.goodsNumber === undefined) {
        //     item.goodsNumber = 1
        // }
        if (item.goodsQuantity === undefined) {
            item.goodsQuantity = 1
        }
    }

    onMounted(()=>{
    })


    return {
      ...toRefs(state),
      ...erpTableOpt,
      closeTheModalFn,
      activeIndex,
      handleSelect,
      warehouseList,
      cleckLeftSelect,
      delRightGoods,
      sureFn,
      dialogHandOk,
      cancel,
      close,
      blurChangeNum
    };
  },
};
</script>

<style lang="scss" scoped>
:deep(.el-dialog__body) {
  padding: 10px 20px 0;
}
.goodsContainer {
  width: 49%;
  max-height: 440px;
  border: 1px solid #eeeeee;
  .goodsContainerHeader {
    background-color: #fafafa;
    font-size: 14px;
    font-weight: 550;
    border-bottom: 1px solid #eeeeee;
    line-height: 36px;
    box-sizing: border-box;
    padding: 0 10px 0 20px;
  }
}
.warehouseContainer {
  //box-sizing: border-box;
  padding: 6px 10px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.leftList {
  border-top: 1px solid #eee;
  box-sizing: border-box;
  padding: 15px 16px;
  .itemImage {
    position: relative;
    width: 70px;
    height: 70px;
    box-sizing: border-box;
    border: 1px solid #eee;
    img {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      max-height: 100%;
      max-width: 100%;
    }
  }
  .itemInfo {
    width: 200px;
    font-size: 12px;
    line-height: 17.5px;
    margin-left: 10px;
    p {
      height: 17.5px;
      overflow: hidden;
      white-space: nowrap;
      overflow: hidden;
      -o-text-overflow: ellipsis;
      text-overflow: ellipsis;
    }
  }
  .itemTool {
    line-height: 70px;
  }
}
.leftItemsContent {
  max-height: 348px;
  overflow: auto;
  .hint {
    text-align: center;
    line-height: 50px;
    color: #ccc;
    font-size: 12px;
  }
}
.rightItemsContent {
  max-height: 400px;
  overflow: auto;
  .itemInfo {
    width: 158px;
  }
}
.itemRight {
  width: 90px;
  height: 70px;
  font-size: 12px;
  .delBtns {
    color: #fd4c60;
    text-align: right;
    margin-bottom: 5px;
  }
  .delBtns:hover {
    cursor: pointer;
    opacity: 0.85;
  }
  .switchContainer {
    line-height: 20px;
    margin-top: 5px;
    text-align: right;
  }
}
:deep(.el-menu--horizontal > .el-menu-item) {
  line-height: 50px;
  height: 50px;
}
</style>
