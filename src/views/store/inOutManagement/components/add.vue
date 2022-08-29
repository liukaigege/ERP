<!--
* @Descripttion: Vango ERP
* @version: 1.0
* @Author: 王新国
* @Date: 2021-11-01 15:16:38
* @LastEditors: 王新国
* @LastEditTime: 2021-11-01 17:07:46
-->
<template>
  <div>
    <div class="searchContainer">
      <el-form
        :model="orderInfos"
        class="demo-form-inline demo-ruleForm"
        :inline="true"
      >
        <el-form-item :label="inOut ? '出库仓库：' : '入库仓库：'">
          <el-select v-model="orderInfos.warehouseId" placeholder="请选择">
            <el-option
              v-for="item in warehouseList"
              :key="item.warehouseId"
              :label="item.warehouseName"
              :value="item.warehouseId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="入库分区：" v-if="!inOut">
          <el-select v-model="orderInfos.areaId" placeholder="请选择">
            <el-option
              v-for="item in wareHouseArea"
              :key="item.id"
              :label="item.areaName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="inOut ? '出库类型：' : '入库类型：'">
          <el-select
            v-model="orderInfos.operateType"
            placeholder="请选择"
            @change="typeChange(orderInfos.operateType, operateTypeList)"
          >
            <el-option
              v-for="item in operateTypeList"
              :key="item.id"
              :label="item.type"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="scanningContainer">
        <span>{{
          orderInfos.operateType === 3 ? '采购单号：' : '扫描\/录入：'
        }}</span>
        <el-input
          v-model="scanningContent"
          clearable
          :autofocus="true"
          :placeholder="
            orderInfos.operateType === 3
              ? '请输入采购单号'
              : '请输入\/扫描商品SKU\/二维码'
          "
          style="width: 290px; margin-right: 20px"
          @keyup.enter="scanItems"
          :maxlength="20"
        ></el-input>
        <el-button
          type="primary"
          :disabled="disabledStatus"
          @click="chooseItemsShowFn(true)"
          >{{
            orderInfos.operateType == 1
              ? '选择商品'
              : orderInfos.operateType == 3
              ? '选择采购单商品'
              : '选择商品库商品'
          }}</el-button
        >
      </div>
      <el-button class="closePageBtn" @click="closePage">关闭</el-button>
    </div>
    <div class="tableContainer">
      <vxe-table
        ref="myTable"
        keep-source
        align="center"
        :max-height="500"
        show-overflow
        :scroll-y="{ enabled: true, gt: 20 }"
        highlight-hover-row
        :auto-resize="true"
        :data="orderInfos.itemList"
        border
        :row-config="{ height: 100 }"
        :edit-rules="editRules"
        :edit-config="{
          trigger: 'click',
          mode: 'cell'
        }"
      >
        <vxe-table-column title="商品信息">
          <template #default="{ row }">
            <el-container>
              <el-aside width="100px">
                <el-popover
                  v-if="row.mainImgThumbUrl"
                  placement="right-start"
                  trigger="hover"
                  width="auto"
                >
                  <el-image
                    style="width: 200px; height: 200px"
                    :src="row.mainImgUrl"
                    fit="contain"
                  ></el-image>
                  <template #reference>
                    <el-image
                      class="ml-10"
                      style="width: 70px; height: 70px"
                      :src="row.mainImgThumbUrl"
                      fit="contain"
                    ></el-image>
                  </template>
                </el-popover>
              </el-aside>
              <el-main>
                <el-tooltip placement="top-start" :offset="10">
                  <template #content>
                    <a style="color: #fff" v-copy="row.goodsName">复制</a>
                  </template>
                  <div class="titleName">
                    {{ row.goodsName }}
                  </div>
                </el-tooltip>
                <div class="titleName">
                  {{ row.speVal }}
                </div>
                <div class="titleName">SKU ID：{{ row.skuId }}</div>
                <div class="titleName">商品SKU：{{ row.skuCode }}</div>
              </el-main>
            </el-container>
          </template>
        </vxe-table-column>
        <vxe-table-column v-if="inOut" title="货架位" width="200">
          <template #default="{ row }">
            <div class="areaContainer">
              <div
                v-for="(v, i) in row.detailList"
                :key="i"
                :class="v.quantity ? '' : 'hide'"
              >
                {{ v.areaName }} {{ v.gridName }} x{{ v.quantity || 0 }}
              </div>
            </div>
          </template>
        </vxe-table-column>
        <vxe-table-column v-if="inOut" title="可用库存" width="200">
          <template #default="{ row }">
            <div class="areaContainer">
              {{ row.availableQuantity || row.totalQuantity || 0 }}
            </div>
          </template>
        </vxe-table-column>
        <vxe-table-column :title="inOut ? '出库数量' : '入库数量'" width="200">
          <template #default="{ row }">
            <div>
              <span v-if="inOut">{{ row.quantity }}</span>
              <el-input-number
                style="width: 100px"
                v-model="row.quantity"
                controls-position="right"
                :min="1"
                :max="9999"
                :step-strictly="true"
                v-else
              ></el-input-number>
            </div>
          </template>
        </vxe-table-column>
        <!-- 商品单价（CNY） -->
        <vxe-table-column
          v-if="inOut === 0"
          title="商品单价（CNY）"
          field="price"
          width="200"
          :edit-render="{
            name: '$input',
            immediate: true,
            props: {
              type: 'float',
              min: 0.01,
              max: 9999999.99,
              controls: false
            }
          }"
        >
        </vxe-table-column>
        <vxe-table-column
          field="skuId"
          title="操作"
          :width="inOut ? '180' : '126'"
        >
          <template #default="{ row }">
            <div>
              <el-button
                type="text"
                size="small"
                v-if="inOut"
                :disabled="disabledStatus"
                @click="editFn(row.skuId)"
                >编辑</el-button
              >
              <el-button
                type="text"
                style="color: #f56c6c"
                size="small"
                :disabled="disabledStatus"
                @click="deleteFn(row.skuId)"
                >删除</el-button
              >
            </div>
          </template>
        </vxe-table-column>
      </vxe-table>
    </div>
    <div class="pageFooter">
      <span>{{ inOut ? '出库备注：' : '入库备注：' }}</span>
      <el-input
        v-model="orderInfos.remark"
        placeholder="请输入内容"
        style="width: 380px; margin-right: 20px"
        :maxlength="100"
      ></el-input>
      <el-button
        type="primary"
        @click="preservation"
        :disabled="disabledStatus"
        >{{ inOut ? '创建出库单' : '创建入库单' }}</el-button
      >
    </div>
    <ChooseItems
      v-if="chooseItemsShow"
      :inOut="inOut"
      :choosedList="orderInfos.itemList"
      :operateType="orderInfos.operateType"
      @chooseBack="chooseItemsShowFn"
      :wareHouseArea="wareHouseArea"
      :purchaseOrderNumber="scanningContent"
    />
    <Outboound
      v-if="outbooundShow"
      :wareHouseArea="wareHouseArea"
      :outbooundData="outbooundData"
      @ok="outbooundBack"
    />
  </div>
</template>
<script>
import { reactive, toRefs, computed, ref } from 'vue'
import { warehouseList } from '@/assets/js/staticData'
import { operateTypeList, editRules } from '../composables/data'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useStore } from 'vuex'
// 选择商品
import ChooseItems from './dialog/chooseItems.vue'
// 出库数量
import Outboound from './dialog/outboound.vue'
import { useRoute, useRouter } from 'vue-router'
import { deepCopy, isObjectValueEqual } from '@/utils/tool.js'
import {
  wareHouseAreaList,
  addOrUpdate,
  scanQuery,
  queryDetail
} from '../composables/api'
export default {
  props: {
    inOut: Number
  },
  components: { ChooseItems, Outboound },
  setup(props) {
    // props.inOut = 1 出库
    // props.inOut = 0 入库
    const store = useStore()
    const route = useRoute()
    const serialNumber = route.query.serialNumber || null
    const id = route.query.id - 0 || null
    let myTable = ref(null)
    const router = useRouter()
    const sideBarWidth = computed(() => store.state.menu.sideBarWidth)
    const state = reactive({
      editRules,
      wareHouseArea: [],
      operateTypeList: props.inOut
        ? operateTypeList.outeType
        : operateTypeList.inType,
      scanningContent: null, //扫描输入框内容
      // 出入库单数据
      orderInfos: {
        id, // id(编辑时有值)
        warehouseId: 1, // 仓库ID
        type: props.inOut + 1, // 1入库 2出库
        areaId: null, // 分区ID（入库时必填）
        operateType: props.inOut > 0 ? 4 : 1, // 1手动入库  2报损出库  3退货出库  4手动出库
        remark: null, //备注
        itemList: [] //表格商品数据
      },
      chooseItemsShow: false, //选择商品弹框显示隐藏
      outbooundShow: false, //出库数量弹框显示隐藏
      outbooundData: {},
      isChangeType: props.inOut + 1, // 1手动入库 2报损出库 3 退货出库
      originalData: null, //当前列表原始数据，用于修改编辑关闭页面对比
      disabledStatus: false
    })

    // 编辑出入库单
    if (serialNumber) {
      queryDetail({ serialNumber, type: props.inOut + 1 })
        .then(res => {
          if (res.code == 272008 || res.code == 272009) {
            state.disabledStatus = true
          } else {
            const list = res.data.data.map(v => {
              // 根据后台需求 删除创建时间，修改时间 数量由detailList前端累加
              v.quantity = v.quantity || 0
              delete v.createTime
              delete v.updateTime
              if (v.detailList && v.detailList.length) {
                v.quantity = 0
                v.detailList?.forEach(k => {
                  v.quantity += k.quantity - 0
                })
              }
              return v
            })
            state.originalData = deepCopy(list)
            state.orderInfos.itemList = list
            state.orderInfos.remark = res.data.remark
            state.orderInfos.warehouseId = res.data.warehouseId
            state.orderInfos.areaId = res.data.areaId
            state.orderInfos.operateType = res.data.operateType
            state.isChangeType = state.orderInfos.operateType
          }
        })
        .catch(res => {
          state.disabledStatus = true
        })
    }

    // 查询分区
    wareHouseAreaListFn()
    function wareHouseAreaListFn() {
      wareHouseAreaList({ warehouseId: 1 }).then(res => {
        state.wareHouseArea = res.data
      })
    }
    // 选择商品
    function chooseItemsShowFn(val = false, data = null) {
      data = data
        ? data.map(v => {
            v.price = 0
            return v
          })
        : null
      if (state.orderInfos.operateType === 3 && !state.scanningContent) {
        //退货出库
        ElMessage.warning({
          message: '请输入采购单号!'
        })
      } else {
        state.chooseItemsShow = val
        if (data) {
          state.orderInfos.itemList = deepCopy(data)
        }
      }
    }

    // 删除商品
    function deleteFn(val) {
      state.orderInfos.itemList = state.orderInfos.itemList.filter(
        v => v.skuId != val
      )
    }
    // 确认保存
    function preservation() {
      if (!state.orderInfos.itemList.every(v => v.quantity)) {
        ElMessage.warning({ message: '请输入出库数量' })
        return false
      }
      if (state.orderInfos.itemList.some(v => v.totalQuantity < v.quantity)) {
        ElMessage.warning({ message: '出库数量大于现有库存数量' })
        return false
      }
      if (props.inOut == 0 && !state.orderInfos.areaId) {
        ElMessage.warning({ message: '请选择分区' })
        return false
      }
      //
      if (state.orderInfos.operateType == 3) {
        // 退货出库
        state.orderInfos.purchaseOrderNumber = state.scanningContent
      }
      state.orderInfos.itemList.forEach(v => {
        delete v.createTime
        delete v.updateTime
      })

      if (state.orderInfos.itemList.length) {
        if (state.orderInfos.itemList.every(v => v.price) || props.inOut == 1) {
          addOrUpdate({ param: [state.orderInfos] }).then(res => {
            ElMessage.success({
              message: res.message
            })
            state.orderInfos.itemList = []
            state.scanningContent = null
            router.push({ name: props.inOut ? 'issueList' : 'receiptList' })
          })
        } else {
          myTable.value.validate(true).then(res => {
            ElMessage.warning({ message: '请填写商品单价' })
          })
        }
      } else {
        ElMessage.warning({ message: '请添加商品' })
      }
    }
    // 关闭页面
    function closePage() {
      if (
        !isObjectValueEqual(
          state.originalData || [],
          state.orderInfos.itemList || []
        )
      ) {
        ElMessageBox.confirm(
          `确认关闭${props.inOut ? '出' : '入'}库单？`,
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            closeOnClickModal: false
          }
        ).then(() => {
          router.push({ name: props.inOut ? 'issueList' : 'receiptList' })
        })
      } else {
        router.push({ name: props.inOut ? 'issueList' : 'receiptList' })
      }
    }
    //编辑
    function editFn(val) {
      state.outbooundData = {
        data: state.orderInfos.itemList.filter(v => v.skuId === val)[0],
        skuId: val
      }
      state.outbooundShow = true
    }
    // 编辑返回
    function outbooundBack(data) {
      const list = state.orderInfos.itemList.map(v => {
        if (v.skuId == data.skuId) v = data.data
        return v
      })
      state.orderInfos.itemList = [...list]
      myTable.value.loadData(state.orderInfos.itemList)
      state.outbooundShow = false
    }

    //扫描结果
    function scanItems() {
      if (state.orderInfos.operateType != 3) {
        if (
          state.orderInfos.itemList.some(v => v.skuId === state.scanningContent)
        ) {
          ElMessage.error({
            message: '商品已在商品列表，请勿重复扫描'
          })
        } else {
          scanQuery({
            skuId: state.scanningContent,
            type: props.inOut + 1
          }).then(res => {
            if (!res.data.availableQuantity && props.inOut) {
              ElMessage.warning({
                message: '添加失败，该商品可用库存为0'
              })
            } else {
              ElMessage.success({
                message: res.message
              })
              res.data.price = 0
              res.data.quantity = props.inOut ? 0 : 1
              state.orderInfos.itemList.push(res.data)
              myTable.value.loadData(state.orderInfos.itemList)
            }
          })
        }
      }
    }
    // 搜索类型有一个以上，已选商品，修改了
    function typeChange(val, list) {
      if (state.orderInfos.itemList.length) {
        ElMessageBox.confirm(
          `更换${
            props.inOut ? '出' : '入'
          }库类型，将会清空已添加的商品，确认要更换吗？`,
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
          .then(() => {
            state.orderInfos.itemList = []
            state.isChangeType = val
          })
          .catch(() => {
            state.orderInfos.operateType = state.isChangeType
          })
      } else {
        state.isChangeType = val
      }
    }

    return {
      ...toRefs(state),
      warehouseList,
      sideBarWidth,
      chooseItemsShowFn,
      deleteFn,
      preservation,
      closePage,
      editFn,
      scanItems,
      myTable,
      outbooundBack,
      typeChange
    }
  }
}
</script>
<style lang='scss' scoped>
.areaContainer {
  max-height: 90px;
  overflow-y: auto;
}
.searchContainer,
.tableContainer {
  box-sizing: border-box;
  padding: 20px;
  background-color: #fff;
  margin-bottom: 20px;
  position: relative;
  .closePageBtn {
    position: absolute;
    right: 20px;
    top: 20px;
  }
}
.scanningContainer {
  border-top: 1px dashed #e9e9e9;
  padding-top: 20px;
}
.imagesContainer {
  width: 70px;
  height: 70px;
  position: relative;
  img {
    max-height: 100%;
    max-width: 100%;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}
:deep(.el-main) {
  padding: 0;
}
.titleName {
  text-align: left;
  cursor: pointer;
  line-height: 23px;
  height: 23px;
  white-space: nowrap;
  overflow: hidden;
  -o-text-overflow: ellipsis;
  text-overflow: ellipsis;
}
.pageFooter {
  height: 52px;
  box-sizing: border-box;
  padding: 10px 20px 0;
  width: calc(100% - v-bind(sideBarWidth));
  background-color: #fff;
  position: fixed;
  bottom: 0;
  right: 0;
  border-top: 1px solid #e8ecef;
  z-index: 16;
  text-align: right;
}
:deep(.el-form-item__label) {
  padding: 0;
}
.hide {
  display: none;
}
</style>