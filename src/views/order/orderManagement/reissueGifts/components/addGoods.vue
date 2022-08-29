<!--
 * @Descripttion: 'addGoods.vue'
 * @version: 2.0
 * @Author: 王新国
 * @Date: 2021-09-11 00:00:00
 * @LastEditors: 王新国
 * @LastEditTime: 2021-09-11 00:00:00
-->
<template>
  <div class="addGoods" v-dragDialog>
    <el-dialog
      title="选择商品"
      v-model="showModal"
      width="800px"
      :close-on-click-modal="closeMasker"
      :before-close="closeTheModalFn"
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
                @keydown.enter="search"
                :maxlength="200"
                clearable
              >
                <template #append>
                  <el-button icon="el-icon-search" @click="search"></el-button>
                </template>
              </el-input>
            </div>
          </div>
          <div class="mainContainer">
            <div class="warehouseContainer clearfix">
              <div class="fl" style="width: 50%">
                <!-- <el-menu :default-active="activeIndex" style="width:100%;" mode="horizontal" @select="handleSelect">
									<el-menu-item index="1">单品</el-menu-item>
									<el-menu-item index="2">组合</el-menu-item>
								</el-menu> -->
                <el-tabs v-model="activeIndex" @tab-click="handleSelect">
                  <el-tab-pane label="单品" name="1"></el-tab-pane>
                  <el-tab-pane label="组合" name="2"></el-tab-pane>
                </el-tabs>
              </div>
              <div class="fr" style="margin-top: 9px; width: 50%">
                <span>仓库：</span>
                <el-select
                  v-model="listSearchData.warehouseId"
                  style="width: 120px"
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
							<div class="tab_masker" v-if="tab_masker_show"></div>
            </div>
            <ul class="leftItemsContent">
              <li
                class="leftList clearfix"
                v-for="item in tableData"
                :key="item.skuId"
              >
                <div class="itemImage fl">
                  <img :src="item.mainImgUrl" alt="" />
                </div>
                <div class="itemInfo fl">
                  <p class="itemsTitle" :title="item.goodsName">
                    {{ item.goodsName }}
                  </p>
                  <p class="itemsTitle" :title="item.skuCode">
                    {{ item.skuCode }}
                  </p>
                  <p class="itemsTitle" :title="skuShow(item.skuValue)">
                    {{ skuShow(item.skuValue) }}
                  </p>
                  <p class="itemsTitle" :title="item.declareAmount">
                    CNY {{ item.declareAmount }}
                  </p>
                </div>
                <div class="itemTool fr">
                  <el-button
                    type="text"
                    :style="{ color: item.isSelect ? '#ccc' : '#409EFE' }"
                    :disabled="!isMultiple && rightList.length > 0"
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
          <div class="goodsContainerHeader">
            已选 {{ rightList.length }} 个商品
          </div>
          <ul class="rightItemsContent">
            <li
              class="leftList clearfix"
              v-for="item in rightList"
              :key="item.goodsId"
            >
              <div class="itemImage fl">
                <img :src="item.mainImgUrl" alt="" />
              </div>
              <div class="itemInfo fl" style="width: 145px">
                <p class="itemsTitle" :title="item.goodsName">
                  {{ item.goodsName }}
                </p>
                <p class="itemsTitle" :title="item.skuCode">
                  {{ item.skuCode }}
                </p>
                <p class="itemsTitle" :title="skuShow(item.skuValue)">
                  {{ skuShow(item.skuValue) }}
                </p>
                <p class="itemsTitle" :title="item.declareAmount">
                  CNY {{ item.declareAmount }}
                </p>
              </div>
              <div class="itemRight fr">
                <div class="delBtns" @click="delRightGoods(item.skuId)">
                  删除
                </div>
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
      <el-pagination
        class="mt-20"
        small
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagination.currentPage"
        :page-sizes="pagination.pageSizes"
        :page-size="pagination.pageSize"
        layout="sizes, prev, pager, next, jumper"
        :total="pagination.totalCount"
      >
      </el-pagination>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeTheModalFn">取 消</el-button>
          <el-button
            type="primary"
            @click="sureFn"
            :disabled="!rightList.length"
            >确 定</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import { reactive, toRefs, ref } from 'vue'
import { warehouseList } from '@/assets/js/staticData.js'
import { getGoods } from '../composables/addGoodsApi.js'
import { erpElTable } from '@/utils/hooks.js'
import { deepCopy, skuShow } from '@/utils/tool.js'
export default {
  props: {
    multiple: {
      //是否支持多选
      type: Boolean,
      default: true
    },
    isGift: {
      //是否是补发赠品
      type: Boolean,
      default: false
    },
    excludeSkuIds: {
      // 已选择id
      type: Array,
      default: []
    }
  },
  setup(props, context) {
    const state = reactive({
      showModal: true,
      closeMasker: false,
      list: [],
      rightList: [],
      listSearchData: {
        excludeSkuIds: props.excludeSkuIds,
        search: '',
        warehouseId: 1,
        combineType: 1,
				skuTypeFlag:3
      },
      isMultiple: props.multiple,
      single_combinationList: [],
			tab_masker_show:true
    })
    const erpTableOpt = erpElTable(getGoods, state.listSearchData, {
      dataFilter: data => {
        data.forEach(item => {
          //是否是赠品
          item.isGift = false
          //商品数量
          item.goodsNumber = 1
          item.goodsQuantity = 1
          item.id = null
          if (
            state.rightList.length &&
            state.rightList.findIndex(sku => sku.skuId === item.skuId) !== -1
          ) {
            item.isSelect = true
          } else {
            item.isSelect = false
          }
        })
        return data
      }
    })

    const activeIndex = ref('1')
    //关闭弹框
    const closeTheModalFn = () => {
      context.emit('setData', false)
    }
    //选择单品/组合品的切换
    const handleSelect = (key, keyPath) => {
      ;[state.single_combinationList, state.rightList] = [
        state.rightList,
        state.single_combinationList
      ]
      state.listSearchData.combineType = key.props.name - 0
      erpTableOpt.search()
    }
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
      state.rightList.forEach(v => (v.goodsNumber = v.goodsQuantity || 1))
      context.emit('setData', deepCopy(state.rightList))
    }

    function blurChangeNum(item) {
      if (item.goodsQuantity === undefined) {
        item.goodsQuantity = 1
      }
    }

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
      blurChangeNum,
      skuShow
    }
  }
}
</script>
<style lang="scss" scoped>
.addGoods {
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
    box-sizing: border-box;
    padding: 6px 10px 0 0;
		position: relative;
		.tab_masker{
			width: 370px;
			height: 50px;
			position: absolute;
			left: 0;
			top: 0;
			z-index: 999;
		}
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
    min-height: 50px;
    overflow: auto;
    border-top: 0.5px solid #eeeeee;
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
  :deep(.el-tabs__nav) {
    width: 90%;
  }
  :deep(.el-tabs__item) {
    width: 50%;
    text-align: center;
  }
}
</style>
