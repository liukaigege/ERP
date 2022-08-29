<!--
* @Descripttion: Vango ERP chooseItems.vue 选择商品
* @version: 1.0
* @Author: 王新国
* @Date: 2021-11-01 15:16:38
* @LastEditors: 王新国
* @LastEditTime: 2021-11-01 17:07:46
-->
<template>
  <div>
    <el-dialog
      title="选择商品"
      v-model="dialogVisible"
      width="1156px"
      @closed="handleClose"
      :close-on-click-modal="false"
    >
      <div class="outterContainer clearfix">
        <div class="fl leftContainer">
          <div class="headerContainer">
            <el-select
              v-model="searchData.searchType"
              placeholder="请选择"
              size="small"
              style="width: 140px"
            >
              <el-option
                v-for="item in [
                  { id: 1, label: '商品名称' },
                  { id: 3, label: '商品sku id' },
                  { id: 2, label: '商品sku编码' }
                ]"
                :key="item.id"
                :label="item.label"
                :value="item.id"
              >
              </el-option>
            </el-select>
            <el-input
              v-model="searchData.search"
              placeholder="请输入搜索内容"
              size="small"
              style="width: 330px; margin: 0 10px"
              :maxlength="200"
              @keydown.enter="searchGoodsFn(true)"
            ></el-input>
            <el-button type="primary" size="small" @click="searchGoodsFn(true)"
              >搜索</el-button
            >
            <el-button size="small" @click="resetFn">重置</el-button>
          </div>
          <ul class="clearfix listContainer">
            <li
              class="itemList clearfix"
              v-for="(item, index) in list"
              :key="item.skuId"
              :class="index % 2 == 0 ? 'fl' : 'fr'"
            >
              <div class="fl">
                <el-popover
                  placement="right-start"
                  trigger="hover"
                  width="auto"
                >
                  <el-image
                    style="width: 200px; height: 200px"
                    :src="item.mainImgUrl"
                    fit="contain"
                  ></el-image>
                  <template #reference>
                    <el-image
                      class="ml-10"
                      style="width: 70px; height: 70px"
                      :src="item.mainImgThumbUrl"
                      fit="contain"
                    ></el-image>
                  </template>
                </el-popover>
              </div>
              <div
                class="fl itemInfo"
                :style="inOut ? 'width: 150px;' : 'width: 190px;'"
              >
                <el-tooltip
                  class="item"
                  effect="light"
                  :content="item.goodsName"
                  placement="top"
                >
                  <p class="itemTitle">{{ item.goodsName }}</p>
                </el-tooltip>
                <p>
                  <span>{{ item.speVal }}</span>
                </p>
                <p>{{ item.skuId }}</p>
                <el-tooltip
                  class="item"
                  effect="light"
                  :content="item.skuCode"
                  placement="top"
                >
                  <p class="itemTitle">{{ item.skuCode || '-' }}</p>
                </el-tooltip>
              </div>
              <div class="storeContainer fl" v-if="inOut">
                <p>可用库存</p>
                <p>{{ item.totalQuantity }}</p>
              </div>
              <div class="fl" style="width: 40px">
                <el-button
                  v-if="
                    selectedList?.filter(v => v.skuId == item.skuId).length == 0
                  "
                  type="text"
                  size="small"
                  style="margin-top: 28px"
                  @click="checkedFn(item.skuId)"
                  :disabled="item.totalQuantity == 0 && inOut == 1"
                  >选择</el-button
                >
                <el-button
                  v-if="selectedList?.filter(v => v.skuId == item.skuId).length"
                  type="text"
                  size="small"
                  style="margin-top: 28px; color: #c0c4cc"
                  :disabled="item.totalQuantity == 0 && inOut == 1"
                  @click="deleteFn(item.skuId)"
                  >已选择</el-button
                >
              </div>
            </li>
          </ul>
          <div class="paginationContainer">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="searchData.page.pageNo"
              :page-sizes="[10, 20, 30, 40, 100]"
              :page-size="searchData.page.pageSize"
              layout="total, prev, pager, next, sizes, jumper"
              :total="totleNum"
            >
            </el-pagination>
          </div>
        </div>
        <div class="fr rightContainer">
          <div class="headerContainer clearfix">
            <span>已选</span>
            <span class="blueColor"> {{ selectedList.length }} </span>
            <span>个SKU</span>
            <el-button
              type="text"
              class="fr"
              size="small"
              @click="clearAll"
              :disabled="selectedList.length == 0"
              >清空</el-button
            >
          </div>
          <ul class="listContainer">
            <li
              class="itemList clearfix"
              v-for="item in selectedList"
              :key="item.skuId"
            >
              <div class="fl">
                <el-popover
                  placement="right-start"
                  trigger="hover"
                  width="auto"
                >
                  <el-image
                    style="width: 200px; height: 200px"
                    :src="item.mainImgUrl"
                    fit="contain"
                  ></el-image>
                  <template #reference>
                    <el-image
                      class="ml-10"
                      style="width: 70px; height: 70px"
                      :src="item.mainImgThumbUrl"
                      fit="contain"
                    ></el-image>
                  </template>
                </el-popover>
              </div>
              <div
                class="fl itemInfo"
                :style="inOut ? 'width: 190px;' : 'width: 150px;'"
              >
                <el-tooltip
                  class="item"
                  effect="light"
                  :content="item.goodsName"
                  placement="top"
                >
                  <p class="itemTitle">{{ item.goodsName }}</p>
                </el-tooltip>
                <p>
                  <span>{{ item.speVal }}</span>
                </p>
                <p>{{ item.skuId }}</p>
                <el-tooltip
                  class="item"
                  effect="light"
                  :content="item.skuCode"
                  placement="top"
                >
                  <p class="itemTitle">{{ item.skuCode || '-' }}</p>
                </el-tooltip>
              </div>
              <div class="fl" style="text-align: center">
                <span class="redColor" @click="deleteFn(item.skuId)">删除</span>
                <br />
                <el-input-number
                  v-if="!inOut"
                  style="width: 100px"
                  v-model="item.quantity"
                  controls-position="right"
                  :min="1"
                  :max="9999"
                  :step-strictly="true"
                ></el-input-number>
                <el-button
                  type="text"
                  v-if="inOut"
                  @click="changeNumber(item.skuId)"
                  >{{ item.quantity || '数量' }}</el-button
                >
              </div>
            </li>
          </ul>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="ok">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <Outboound
      v-if="outbooundShow"
      :wareHouseArea="wareHouseArea"
      :outbooundData="outbooundData"
      @ok="outbooundBack"
    />
  </div>
</template>
<script>
import { reactive, toRefs } from 'vue'
import { searchData } from '../../composables/data'
import { getGoods } from '@/views/order/orderManagement/reissueGifts/composables/addGoodsApi'
import { deepCopy } from '@/utils/tool.js'
import { ElMessage } from 'element-plus'
import { getList } from '../../composables/api'
import { strToJson } from '../../composables/tool'
import Outboound from './outboound.vue'
export default {
  props: {
    inOut: Number, // 1 出库   0 入库
    choosedList: Array, // 已选择商品(需要回显使用)
    operateType: Number, //操作类型（1手动入库、2报损出库、3退货出库）
    wareHouseArea: Array,
    purchaseOrderNumber: String
  },
  components: { Outboound },
  setup(props, { emit }) {
    // props.inOut = 1 出库
    // props.inOut = 0 入库
    const state = reactive({
      dialogVisible: false,
      list: [],
      searchData: deepCopy(searchData),
      totleNum: 0,
      selectedList: deepCopy(props.choosedList) || [],
      outbooundShow: false,
      outbooundData: {}
    })
    // 查询匹配条件的商品
    searchGoodsFn(false)
    function searchGoodsFn(status) {
      // 后期需要根据出入库状态判断使用不同的接口
      state.searchData.operateType = props.operateType
      state.searchData.searchText = state.searchData.search
      // 退货出库->采购单号
      if (props.operateType == 3)
        state.searchData.purchaseOrderNumber = props.purchaseOrderNumber
      if (props.inOut) {
        // 出库
        getList(state.searchData)
          .then(res => {
            state.totleNum = res.data.page.totalCount || 0
            if (res.data.page.totalCount) {
              state.list = res.data.dataList
              state.dialogVisible = true
            } else {
              state.list = []
              if (!status) {
                handleClose()
              }
            }
          })
          .catch(res => {
            handleClose()
          })
      } else {
        // 入库
        getGoods(state.searchData)
          .then(res => {
            state.totleNum = res.data.page.totalCount || 0
            if (res.data.page.totalCount) {
              state.list = res.data.dataList.map(v => {
                v.speVal = ''
                strToJson(v.skuValue).forEach((k, i) => {
                  v.speVal += i == 0 ? k.speVal : '-' + k.speVal
                })
                return v
              })
              state.dialogVisible = true
            } else {
              state.list = []
              if (!status) handleClose()
            }
          })
          .catch(res => {
            handleClose()
          })
      }
    }
    function handleClose() {
      state.dialogVisible = false
      emit('chooseBack', false)
    }
    function ok() {
      if (state.selectedList.length) {
        if (state.selectedList.some(v => !v.quantity)) {
          ElMessage.warning({ message: '请输入出库数量' })
          return false
        }
        state.dialogVisible = false
        emit('chooseBack', false, state.selectedList)
      } else {
        ElMessage.warning({ message: '请选择商品' })
      }
    }
    // 切换页面数据条数
    function handleSizeChange(val) {
      state.searchData.page.pageNo = 1
      state.searchData.page.pageSize = val
      searchGoodsFn(true)
    }
    // 切换页码
    function handleCurrentChange(val) {
      state.searchData.page.pageNo = val
      searchGoodsFn(true)
    }
    // 重置按钮
    function resetFn() {
      state.searchData = deepCopy(searchData)
      searchGoodsFn(true)
    }
    // 选择左侧的商品到右侧列表
    function checkedFn(val) {
      let obj = state.list.filter(v => v.skuId == val)[0]
      obj.quantity = props.inOut ? 0 : 1
      state.selectedList.push(obj)
    }
    // 清空右侧数据
    function clearAll() {
      state.selectedList = []
    }
    // 右侧删除单挑数据
    function deleteFn(val) {
      state.selectedList = state.selectedList.filter(v => v.skuId != val)
    }
    function outbooundBack(data) {
      const list = state.selectedList.map(v => {
        if (v.skuId == data.skuId) v = data.data
        return v
      })
      state.selectedList = [...list]
      state.outbooundShow = false
    }
    function changeNumber(skuId) {
      state.outbooundData = {
        data: state.selectedList.filter(v => v.skuId === skuId)[0],
        skuId
      }
      state.outbooundShow = true
    }
    return {
      ...toRefs(state),
      handleClose,
      ok,
      handleSizeChange,
      handleCurrentChange,
      searchGoodsFn,
      resetFn,
      checkedFn,
      clearAll,
      deleteFn,
      outbooundBack,
      changeNumber
    }
  }
}
</script>
<style lang='scss' scoped>
.itemList {
  margin: 10px 0;
}
.paginationContainer {
  position: absolute;
  text-align: right;
  width: 100%;
  bottom: 0;
  right: 0;
  background-color: #fff;
  height: 40px;
  box-sizing: border-box;
  padding: 5px 20px;
  border-top: 1px solid #e8e8e8;
}
.storeContainer {
  width: 60px;
  text-align: center;
  line-height: 25px;
  padding-top: 10px;
}
.outterContainer {
  height: 595px;
  .leftContainer {
    width: 723px;
    border: 1px solid #e8e8e8;
    height: 100%;
    box-sizing: border-box;
    position: relative;
    .itemList:nth-child(even) {
      margin-right: 10px;
    }
    .listContainer {
      height: 515px;
      overflow-y: auto;
    }
    .itemInfo {
      font-size: 12px;
      line-height: 23px;
      margin: 0 10px;
      p {
        width: 100%;
        height: 23px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
  .rightContainer {
    width: 368px;
    height: 100%;
    border: 1px solid #e8e8e8;
    box-sizing: border-box;
    .listContainer {
      height: 550px;
      overflow-y: auto;
    }
    .itemInfo {
      font-size: 12px;
      line-height: 23px;
      margin: 0 10px;
      p {
        width: 100%;
        height: 23px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
  .headerContainer {
    height: 38px;
    box-sizing: border-box;
    border-bottom: 1px solid #e8e8e8;
    background-color: #fafafa;
    padding: 5px 10px;
    span {
      line-height: 32px;
    }
  }
}
.blueColor {
  color: #1890ff;
}
.redColor {
  color: #f56c6c;
  font-size: 12px;
  line-height: 23px;
}
.redColor:hover {
  cursor: pointer;
  opacity: 0.85;
}
</style>