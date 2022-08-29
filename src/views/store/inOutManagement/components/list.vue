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
    <el-form
      :model="searchInfos"
      class="demo-form-inline demo-ruleForm headerForm"
      :rules="rules"
      ref="formRef"
      :inline="true"
      @keyup.enter="searchFn"
    >
      <el-form-item :label="inOut ? '出库仓库：' : '入库仓库：'" prop="value">
        <el-select v-model="searchInfos.warehouseId" placeholder="请选择">
          <el-option
            v-for="item in warehouseList"
            :key="item.warehouseId"
            :label="item.warehouseName"
            :value="item.warehouseId"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="搜索类型：">
        <el-select
          v-model="searchInfos.searchType"
          placeholder="请选择"
          style="width: 140px"
        >
          <el-option
            v-for="item in searchTypeListData"
            :key="item.id"
            :label="item.type"
            :value="item.id"
          >
          </el-option>
        </el-select>
        <el-input
          v-model="searchInfos.searchText"
          placeholder="请输入要检索的内容"
          style="width: 318px; margin-left: 15px"
          :maxlength="200"
        ></el-input>
      </el-form-item>
      <el-form-item label="创建时间：">
        <el-date-picker
          v-model="searchInfos.createTimeBegin_createTimeEnd"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="YYYY-MM-DD"
          unlink-panels
        >
        </el-date-picker>
        <el-button type="primary" style="margin-left: 20px" @click="searchFn"
          >查询</el-button
        >
        <el-button @click="resetFn">重置</el-button>
      </el-form-item>
    </el-form>
    <div
      class="btnsContainer"
      v-if="
        (authPath('manual_warehousing:btn') && !inOut) ||
        (authPath('manual_delivery:btn') && inOut) ||
        (authPath('addReceipt') && !inOut) ||
        (authPath('addIssue') && inOut)
      "
    >
      <el-button
        type="primary"
        @click="batchCtrl(false)"
        v-if="
          (authPath('manual_warehousing:btn') && !inOut) ||
          (authPath('manual_delivery:btn') && inOut)
        "
        >{{ inOut ? '批量出库' : '批量入库' }}</el-button
      >
      <el-button
        type="primary"
        @click="editNew(false, false)"
        v-if="
          (authPath('addReceipt') && !inOut) || (authPath('addIssue') && inOut)
        "
        >{{ inOut ? '新建出库单' : '新建入库单' }}</el-button
      >
    </div>
    <div class="tableContainer tabel">
      <vxe-table
        highlight-hover-row
        border
        auto-resize
        max-height="550"
        align="center"
        :data="list"
        ref="vxeTable"
        :span-method="colspanMethod"
        :expand-config="{ showIcon: false }"
      >
        <vxe-column
          type="expand"
          align="left"
          field="supplierType"
          width="40%"
          title="商品信息"
        >
          <template #header>
            <el-checkbox
              v-model="checkedAll"
              :indeterminate="indeterminate"
              @change="clickAllFn"
              :disabled="list.length == 0"
            ></el-checkbox>
            <span style="margin-left: 15px">商品信息</span
            ><el-button type="text" @click="openAll"
              >（{{ openAllStatus ? '收起' : '展开'
              }}<i
                :class="
                  openAllStatus ? 'el-icon-arrow-up' : 'el-icon-arrow-down'
                "
              ></i
              >）</el-button
            >
          </template>
          <template #default="{ row, rowIndex }">
            <div class="cell_header" v-if="rowIndex % 2 == 0">
              <div class="cell_header_list">
                <el-checkbox
                  v-model="row.active"
                  @change="checkedClick"
                ></el-checkbox>
                <span style="margin-left: 15px"
                  >{{ inOut ? '出' : '入' }}库单号：{{ row.serialNumber }}</span
                >
              </div>
              <div class="cell_header_list">
                【仓库：{{
                  warehouseList.filter(v => v.warehouseId == row.warehouseId)[0]
                    .warehouseName
                }}
                {{ inOut ? '' : '-' }}
                {{
                  inOut
                    ? ''
                    : areaList.filter(v => v.id === row.areaId)[0]?.areaName
                }}】
              </div>
            </div>
            <div class="mainImg" v-if="rowIndex % 2 == 1">
              <el-container>
                <el-aside width="100px">
                  <el-popover
                    v-if="row.itemList[0]?.mainImgThumbUrl"
                    placement="right-start"
                    trigger="hover"
                    width="auto"
                  >
                    <el-image
                      style="width: 200px; height: 200px"
                      :src="row.itemList[0]?.mainImgUrl"
                      fit="contain"
                    ></el-image>
                    <template #reference>
                      <el-image
                        class="ml-10"
                        style="width: 70px; height: 70px"
                        :src="row.itemList[0]?.mainImgThumbUrl"
                        fit="contain"
                      ></el-image>
                    </template>
                  </el-popover>
                </el-aside>
                <el-main>
                  <div>
                    商品种类：{{ row.goodsKind }}
                    <el-tooltip
                      class="item"
                      v-if="row.remark"
                      effect="light"
                      :content="row.remark"
                      placement="right"
                    >
                      <el-button
                        type="success"
                        size="small"
                        style="
                          width: 24px;
                          padding: 0;
                          height: 24px;
                          min-height: 24px;
                        "
                        >备</el-button
                      >
                    </el-tooltip>
                  </div>
                  <div>
                    {{ inOut ? '出' : '入' }}库数量：{{ row.totalQuantity }}
                  </div>
                  <el-button
                    type="text"
                    @click="openRow(row, rowIndex)"
                    icon="el-icon-document"
                    >货品详情
                    <i
                      :class="
                        row.arrow == 2
                          ? 'el-icon-arrow-up'
                          : 'el-icon-arrow-down'
                      "
                    ></i
                  ></el-button>
                </el-main>
              </el-container>
            </div>
          </template>
          <template #content="{ row, rowIndex }">
            <div v-if="rowIndex % 2 == 1" class="itemsConatiner">
              <el-row :gutter="12">
                <el-col
                  :span="6"
                  style="margin-bottom: 10px"
                  v-for="(v, i) in row.itemList"
                  :key="i"
                >
                  <el-card shadow="never" class="listStyle">
                    <el-container>
                      <el-aside width="100px">
                        <el-popover
                          v-if="v.mainImgThumbUrl"
                          placement="right-start"
                          trigger="hover"
                          width="auto"
                        >
                          <el-image
                            style="width: 200px; height: 200px"
                            :src="v.mainImgUrl"
                            fit="contain"
                          ></el-image>
                          <template #reference>
                            <el-image
                              class="ml-10"
                              style="width: 70px; height: 70px"
                              :src="v.mainImgThumbUrl"
                              fit="contain"
                            ></el-image>
                          </template>
                        </el-popover>
                      </el-aside>
                      <el-main style="color: #606266">
                        <el-tooltip
                          placement="top-start"
                          :offset="10"
                          :content="v.goodsName"
                        >
                          <div class="goodsName">{{ v.goodsName }}</div>
                        </el-tooltip>
                        <div class="speValContainer">
                          <el-tooltip
                            v-if="v.speVal"
                            placement="top-start"
                            :offset="10"
                            :content="v.speVal"
                          >
                            <div class="goodsName">{{ v.speVal }}</div>
                          </el-tooltip>
                          <div class="numContainer">
                            {{ inOut ? '出' : '入' }}库数量：{{ v.quantity }}
                          </div>
                        </div>
                        <div :title="v.skuId" class="skuClass">
                          SKU ID：{{ v.skuId }}
                        </div>
                        <div :title="v.skuCode" class="skuClass">
                          商品SKU：{{ v.skuCode }}
                        </div>
                        <div v-if="inOut" class="skuClass" :title="v.str">
                          {{ v.str }}
                        </div>
                      </el-main>
                    </el-container>
                  </el-card>
                </el-col>
              </el-row>
            </div>
          </template>
        </vxe-column>
        <vxe-column
          field="areaNums"
          :title="inOut ? '出库类型' : '入库类型'"
          width="20%"
        >
          <template #default="{ row }">
            <p :data-id="row">
              {{
                row.operateType == 1
                  ? '手动入库'
                  : row.operateType == 2
                  ? '报损出库'
                  : row.operateType == 4
                  ? '手动出库'
                  : '退货出库'
              }}
            </p>
          </template>
        </vxe-column>
        <vxe-column field="storageTime" title="时间" width="20%">
          <template #default="{ row }">
            <p :data-id="row">创建：{{ row.createTime }}</p>
          </template>
        </vxe-column>
        <vxe-column field="storageTimea" title="操作" width="20%">
          <template #default="{ row }">
            <el-button
              type="text"
              @click="batchCtrl(row.serialNumber)"
              v-if="
                (authPath('manual_warehousing:btn') && !inOut) ||
                (authPath('manual_delivery:btn') && inOut)
              "
              >确认{{ inOut ? '出' : '入' }}库</el-button
            >
            <el-button
              type="text"
              @click="editNew(row.serialNumber, row.id)"
              v-if="
                (authPath('addReceipt') && !inOut) ||
                (authPath('addIssue') && inOut)
              "
              >编辑</el-button
            >
            <el-button
              type="text"
              @click="clickRemark(row.remark, row.id)"
              v-if="
                (authPath('editRemark:btn') && !inOut) ||
                (authPath('edit_remark:btn') && inOut)
              "
              >备注</el-button
            >
            <el-button
              type="text"
              style="color: #e83939"
              @click="deleteFn(row.serialNumber)"
              v-if="
                (authPath('delete_warehousing:btn') && !inOut) ||
                (authPath('delete_delivery:btn') && inOut)
              "
              >删除</el-button
            >
          </template>
        </vxe-column>
      </vxe-table>
    </div>
    <!-- 表单分页 -->
    <ErpPage
      :total="totalCount"
      :count="checkedNum"
      ref="erpPage"
      @updateData="erpPageBack"
    />
    <!-- 出入库报错 -->
    <Faild v-if="faildShow" :errorList="faildData" :inOut="inOut" />
    <!-- 出入库成功 -->
    <Success v-if="successShow" :list="successList" />
    <!-- 备注信息 -->
    <Remark
      v-if="remarkShow"
      v-model="remark"
      :remarkId="remarkId"
      @ok="remarkBack"
    />
  </div>
</template>
<script>
import { reactive, toRefs, onMounted, ref } from 'vue'
import { warehouseList } from '@/assets/js/staticData'
import ErpPage from '@/components/erpPage/index.vue'
import { deepCopy, debounce } from '@/utils/tool.js'
import { searchTypeList } from '../composables/data'
import { colspanMethod, copyList } from '../composables/tool'
import Faild from './dialog/faild.vue'
import Success from './dialog/success.vue'
import Remark from './dialog/remark.vue'
import { useRouter } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import { authPath } from '@/utils/hooks'
import {
  getOrderList,
  deleteList,
  confirmBatch,
  confirmOutBatch,
  wareHouseAreaList
} from '../composables/api'
export default {
  props: {
    inOut: Number,
    wareHouseArea: Array
  },
  components: {
    ErpPage,
    Faild,
    Remark,
    Success
  },
  setup(props) {
    const vxeTable = ref(null)
    const erpPage = ref(null)
    const router = useRouter()
    // 搜索类型
    const searchTypeListData = props.inOut
      ? searchTypeList.outeType
      : searchTypeList.inType
    // 搜索条件数据
    const searchInfos = {
      warehouseId: 1, //仓库ID
      type: props.inOut ? 2 : 1, //1入库 2出库
      searchType: 1, //搜索类型 1 商品名称  2商品SKU 3出库单号
      searchText: '', //搜索内容
      createTimeBegin_createTimeEnd: [], //创建时间开始
      page: {
        pageNo: 1,
        pageSize: 10
      }
    }

    // 页面数据
    const state = reactive({
      searchInfos: deepCopy(searchInfos),
      rules: {
        value: [
          { required: true, message: '请选择出库仓库', trigger: 'change' }
        ]
      },
      list: [],
      checkedAll: false, //选择所有
      indeterminate: false, //部分选择
      faildShow: false, //出入库报错
      faildData: [], //出入库报错
      openAllStatus: false, //是否全部展开
      remarkShow: false, //备注信息
      remark: '', //备注内容
      remarkId: null, //修改备注的id
      checkedNum: 0,
      areaList: [],
      successShow: false,
      successList: [],
      totalCount: 0
    })
    // 查询分区
    wareHouseAreaListFn(1)
    function wareHouseAreaListFn(warehouseId) {
      wareHouseAreaList({ warehouseId }).then(res => {
        state.areaList = res.data
      })
    }

    // 展开当前行
    function openRow(val, i) {
      if (state.list[i].arrow == 1) {
        state.list[i].arrow = 2
      } else {
        state.list[i].arrow = 1
      }
      if (state.list.filter(v => v.arrow == 1).length == 0) {
        // 全部不展开
        state.openAllStatus = false
        vxeTable.value.setAllRowExpand(state.openAllStatus)
      } else if (
        state.list.filter(v => v.arrow == 1).length ==
        state.list.length / 2
      ) {
        // 全部展开了
        state.openAllStatus = true
        vxeTable.value.setAllRowExpand(state.openAllStatus)
      } else {
        // 部分展开
        state.openAllStatus = false
        vxeTable.value.toggleRowExpand(val)
      }
    }
    // 展开所有行
    function openAll() {
      state.openAllStatus = !state.openAllStatus
      state.list.forEach(v => (v.arrow = state.openAllStatus ? 2 : 1))
      vxeTable.value.setAllRowExpand(state.openAllStatus)
    }
    // 搜索重置按钮
    function resetFn() {
      state.searchInfos = deepCopy(searchInfos)
      erpPage.value.handleSizeChange(10)
    }
    // 搜索按钮
    searchFn()
    function searchFn() {
      getOrderList(state.searchInfos).then(res => {
        // 将列表数据重新组装，为了符合表格格式，需要将数据复制一份，将[1,2]类型数组复制为[1,1,2,2]，奇数项合并当前行展示
        if (res.data) {
          state.list = copyList(res.data.dataList)
          state.totalCount = res.data.page.totalCount
          state.checkedNum = 0
          state.checkedAll = false
          state.indeterminate = false
        } else {
          ElMessage.warning({ message: res.message })
        }
      })
    }
    // 分页返回值
    function erpPageBack(val) {
      state.searchInfos.page = val
      searchFn()
    }
    // 点击商品的复选框
    function checkedClick(val) {
      if (state.list.filter(v => v.active).length === state.list.length / 2) {
        // 全选
        state.checkedAll = true
        state.indeterminate = false
      } else if (
        state.list.filter(v => v.active).length &&
        state.list.filter(v => v.active).length < state.list.length / 2
      ) {
        // 部分选择
        state.indeterminate = true
        state.checkedAll = false
      } else {
        // 全不选
        state.checkedAll = false
        state.indeterminate = false
      }
      state.checkedNum = state.list.filter(v => v.active).length
    }
    // 点击全选
    function clickAllFn(val) {
      state.indeterminate = false
      state.list.forEach((v, i) => {
        if (i % 2 == 0) v.active = val
      })
      state.checkedNum = state.list.filter(v => v.active).length
    }
    // 批量出入库
    function batchCtrl(val) {
      // confirmBatch
      if (val) {
        // 单独一条数据
        if (props.inOut) {
          // 出库
          debounce(outBatch([val]))
        } else {
          // 入库
          debounce(inBatch([val]))
        }
      } else {
        const arr = []
        state.list.map(v => {
          if (v.active) arr.push(v.serialNumber)
        })
        // 批量处理
        if (props.inOut) {
          // 出库
          debounce(outBatch(arr))
        } else {
          // 入库
          debounce(inBatch(arr))
        }
      }
    }

    function inBatch(serialNumberList) {
      if (serialNumberList.length === 0)
        return ElMessage.warning({
          message: '请选择入库单'
        })
      confirmBatch({ serialNumberList }).then(res => {
        clickAllFn(false)
        state.checkedAll = false
        searchFn()
        if (res.data.flag) {
          searchFn()
          ElMessage.success({
            message: '入库成功'
          })
          state.successList = res.data.detailList || []
          state.successShow = true
        } else {
          state.faildData = res.data.errList
          state.faildShow = true
        }
      })
    }
    function outBatch(serialNumberList) {
      if (serialNumberList.length === 0)
        return ElMessage.warning({
          message: '请选择出库单'
        })
      confirmOutBatch({ serialNumberList }).then(res => {
        clickAllFn(false)
        state.checkedAll = false
        searchFn()
        if (res.data.flag) {
          ElMessage.success({
            message: '出库成功'
          })
        } else {
          state.faildData = res.data.errList
          state.faildShow = true
        }
      })
    }
    // 新建出入库单
    function editNew(val, id) {
      router.push({
        path: props.inOut
          ? '/store/inOutManagement/manualDelivery/addIssue/index'
          : '/store/inOutManagement/manualWarehousing/addReceipt/index',
        query: val ? { serialNumber: val, id } : {}
      })
    }
    // 列表点击备注按钮
    function clickRemark(val, id) {
      state.remark = val
      state.remarkId = id
      state.remarkShow = true
    }
    // 备注返回函数
    function remarkBack(val) {
      state.list.forEach(v => {
        if (v.id == val.id) v.remark = val.remark
      })
    }
    // 列表点击删除按钮
    function deleteFn(serialNumber) {
      ElMessageBox.confirm(
        `确认删除${props.inOut ? '出' : '入'}库单？`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        deleteList({ serialNumber }).then(res => {
          ElMessage.success({
            message: '删除成功'
          })
          searchFn()
        })
      })
    }

    onMounted(() => {})
    return {
      ...toRefs(state),
      warehouseList,
      searchTypeListData,
      vxeTable,
      erpPage,
      colspanMethod,
      openRow,
      erpPageBack,
      resetFn,
      searchFn,
      checkedClick,
      clickAllFn,
      batchCtrl,
      editNew,
      openAll,
      clickRemark,
      deleteFn,
      remarkBack,
      debounce
    }
  }
}
</script>
<style lang='scss' scoped>
.speValContainer {
  display: flex;
  div {
    flex: 1;
  }
  .numContainer {
    text-align: right;
  }
}
:deep(.el-range-separator) {
  z-index: 1;
}
.headerForm {
  background-color: #fff;
  box-sizing: border-box;
  padding: 20px 20px 0;
}
.btnsContainer {
  text-align: right;
  padding: 20px 0;
}
.tableContainer {
  box-sizing: border-box;
  padding: 20px;
  background-color: #fff;
}
.cell_header {
  display: flex;
  .cell_header_list {
    flex: 1;
  }
  .cell_header_list:nth-child(2) {
    text-align: right;
  }
}
:deep(.el-main) {
  padding: 0;
}
.itemsConatiner {
  box-sizing: border-box;
  padding: 10px 20px;
}
.emptyP {
  font-size: 30px;
  line-height: 200px;
}
.goodsName {
  line-height: 23px;
  height: 23px;
  white-space: nowrap;
  overflow: hidden;
  -o-text-overflow: ellipsis;
  text-overflow: ellipsis;
}
:deep(.el-card__body) {
  padding: 10px;
}
:deep(.el-form-item__label) {
  margin: 0;
  padding: 0;
}
.listStyle {
  font-size: 12px;
  color: #dcdfe6;
}
.skuClass {
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  -o-text-overflow: ellipsis;
  text-overflow: ellipsis;
}
</style>