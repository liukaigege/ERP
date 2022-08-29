<template>
<div class="container">
  <div class="head">
    <el-form :model="formData" :inline="true" >
      <el-form-item label="绩效时间:">
        <el-date-picker v-model="date" type="daterange" range-separator="~" start-placeholder="开始时间" end-placeholder="结束时间"  style="width:300px" @change="dateChange">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="员工:">
        <elSelectTree ref="userRef" filterable clearable :data="userList" :treeProps="treeProps"  checkStrictly :width="286" @ok="ok" />
      </el-form-item>
      <el-form-item label="订单类型:" >
        <el-select v-model="formData.deliveryType" placeholder="" clearable>
          <el-option label="标准" :value="1">
          </el-option>
          <el-option label="COD" :value="2">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品SKU:" >
        <el-input v-model="formData.skuArr" placeholder="多个SKU用逗号隔开"  clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"  @click="searchHandle">查询</el-button>
        <el-button  @click="reset">重置</el-button>
      </el-form-item>
    </el-form>

  </div>
  <div class="unit">
    <div></div>
    <div>
      <el-button type="primary"  @click="dataEntryShow = true">录入数据</el-button>
      <!-- <el-button type="primary" >导出</el-button> -->
    </div>
  </div>
  <div class="tableBox">
    <vxe-table border ref="xTable1" :data="tableData" align="center">
      <vxe-column width="40">
        <template #header>
          <el-checkbox v-model="checked" :indeterminate="indeterminate" @change="checkAll"></el-checkbox>
        </template>
        <template #default="{row}">
          <el-checkbox v-model="row.checked" @change="checkRow(row)"></el-checkbox>
        </template>
      </vxe-column>
      <vxe-column field="date" title="时间"></vxe-column>
      <vxe-column field="deptName" title="部门名称"></vxe-column>
      <vxe-column field="userName" title="员工姓名"></vxe-column>
      <vxe-column field="deliveryType" title="订单类型" width="80">
        <template #default="{row}">
          {{row.deliveryType == '1'?'标准':'COD'}}
        </template>
      </vxe-column>
      <vxe-column field="totalSpend" title="总广告费($)"></vxe-column>
      <vxe-column field="totalSpendCny" title="总广告费(￥)"></vxe-column>
      <vxe-column field="fbSpend" title="FB($)" width="60"></vxe-column>
      <vxe-column field="tiktokSpend" title="TikTok($)"></vxe-column>
      <vxe-column field="googleSpend" title="Google($)"></vxe-column>
      <vxe-column field="pinterestSpend" title="Pinterest($)"></vxe-column>
      <vxe-column field="bingSpend" title="Bing($)" width="70"></vxe-column>
      <vxe-column field="skuTotal" title="SKU数量" width="80"></vxe-column>
      <vxe-column field="total" title="产品数量" width="80"></vxe-column>
      <vxe-column field="gross" title="总收入($)" width="90"></vxe-column>
      <vxe-column field="roi" title="ROI" width="50"></vxe-column>
      <vxe-column field="purchaseAmount" title="采购成本"></vxe-column>
      <vxe-column field="logisticsAmount" title="物流成本"></vxe-column>
      <vxe-column field="dssd" title="操作" type="expand" width="110">
        <template #default="{row}">
          <span style="margin-right:8px;color:#1890FF;cursor: pointer;" @click="editRow(row)">编辑</span>
          <el-popconfirm title="确定删除吗？" @confirm="delRow(row.id)">
            <template #reference>
              <span style="color:#FD4C60;cursor: pointer;">删除</span>
            </template>
          </el-popconfirm>

        </template>
        <template #content="{row}">
          <div v-if="row.skuList.length == 0" class="emypt">
            暂无数据
          </div>
          <div class="skuContent" v-else>
            <div v-for="(item,index) in row.skuList" class="item" :key="index">
              <img :src="item.mainImg" alt="">
              <div class="con">
                <div class="sku">
                  <span>{{item.skuId}}</span>
                  <span>x{{item.num}}</span>
                </div>
                <div class="price">
                  <span>采购报价/物流报价：￥{{item.purchasePrice}}/￥{{item.logisticsPrice}}</span>
                  <span>${{item.subGrossUsd}}(￥{{item.subGrossCny}})</span>
                </div>
              </div>
            </div>
          </div>
        </template>
      </vxe-column>
    </vxe-table>
  </div>
  <div class="flex-pagination page-fixed">
    <div class="statistics">
      <span>
        <el-checkbox v-model="checked" :indeterminate="indeterminate" @change="checkAll">
        </el-checkbox>
        已选 <span style="color:#1890FF;margin-left:0;">{{checkData.length}}</span> 条
      </span>
      <span>总广告费：${{advertisement}}</span>
      <span>SKU数量：{{skuTotal}}</span>
      <span>采购成本：${{purchaseAmount}}</span>
      <span>物流成本：{{logisticsAmount}}</span>
    </div>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :pager-count="5" :page-sizes="[10, 20, 30, 50,100]" :page-size="formData.page.pageSize" small layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
    </el-pagination>
  </div>
  <dataEntry v-if="dataEntryShow" @closeEvent="closeEvent" :data="sonData" @search="search" />
</div>
</template>

<script>
import { computed, nextTick, onMounted, reactive, toRefs, watch } from 'vue'
import elSelectTree from '@/components/elSelectTree/index.vue'
import { shopUserList } from '@/api/goods/shop.js'
import dataEntry from './components/dataEntry.vue'
import { pageQuery, deleteAchievement } from '@/api/achievements.js'
import moment from 'moment'
import { erpElTable } from '@/utils/hooks.js'
import { deepCopy } from '@/utils/tool.js'
export default {
  components: { elSelectTree, dataEntry },
  name: 'achievementsManagement',
  setup() {
    const state = reactive({
      formData: {
        page: { pageNo: 1, pageSize: 10 },
        startDate: moment(moment().startOf('month')).format('YYYY-MM-DD'), // 开始时间 (默认当前月的第一天)
        endDate: moment(moment().endOf('month')).format('YYYY-MM-DD'), // 结束时间 (默认当前月份的最后一天)
        deptId: '', // 部门id
        userId: '', // 员工id
        deliveryType: '', // 订单类型
        skuIds: '', // sku string
        skuArr: ''
      },
      date: [moment(moment().startOf('month')).format('YYYY-MM-DD'), moment(moment().endOf('month')).format('YYYY-MM-DD')],
      userList: [],
      userRef: null,
      dataEntryShow: false,
      sonData: null,
      checkData: [],
      checked: false,
      indeterminate: false,
      totalCount: 0,
      currentPage: 1,
      tableData: []
    })

    onMounted(() => {
      shopUserList().then(res => {
        loop(res.data)
        state.userList = res.data
      })
      search()
    })

    function loop(data) {
      data.forEach(item => {
        item.disabled = true
        if (item.children && item.children.length) loop(item.children)
        let arr = []
        if (item.userVos && item.userVos.length) {
          item.userVos.forEach(val => {
            arr.push({ deptId: { userId: val.userId, deptId: item.deptId }, deptName: val.fullName, disabled: false })
          })
        }
        item.children = arr.concat(item.children)
      })
    }
    const treeProps = {
      value: 'deptId',
      label: 'deptName',
      children: 'children',
      disabled: 'disabled'
    }

    function ok(e) {
      if (!e) {
        state.formData.userId = ''
        state.formData.deptId = ''
        return
      }
      if (typeof e == 'object') {
        state.formData.userId = e.userId
        state.formData.deptId = ''
      } else {
        state.formData.userId = ''
        state.formData.deptId = e
      }
      console.log(e, '---');
    }

    function dateChange(e) {
      console.log(e);
      if (e) {
        state.formData.startDate = moment(e[0]).format('YYYY-MM-DD')
        state.formData.endDate = moment(e[1]).format('YYYY-MM-DD')
      } else {
        state.formData.startDate = ''
        state.formData.endDate = ''
      }
    }

    function searchHandle() {
      if (state.formData.skuArr.trim()) {
        let str = state.formData.skuArr.replace(/，/g, ',')
        state.formData.skuIds = str.split(',')
      }
      search()
    }

    function delRow(id) {
      deleteAchievement({ id }).then(res => {
        searchHandle()
      })
    }

    function editRow(row) {
      state.sonData = deepCopy(row)
      state.dataEntryShow = true
    }

    function closeEvent() {
      state.dataEntryShow = false
      state.sonData = null
    }

    // 计算属性
    let advertisement = computed(() => { // 广告费总计
      let num = 0
      state.checkData.forEach(item => {
        num += item.totalSpend
      })
      return num
    })

    let skuTotal = computed(() => { // sku数量
      let num = 0
      state.checkData.forEach(item => {
        num += item.skuTotal
      })
      return num
    })

    let logisticsAmount = computed(() => { // 物流总计
      let num = 0
      state.checkData.forEach(item => {
        num += item.logisticsAmount
      })
      return num
    })

    let purchaseAmount = computed(() => { // 采购总计
      let num = 0
      state.checkData.forEach(item => {
        num += item.purchaseAmount
      })
      return num
    })

    // 表格复选框
    function checkAll(e) {
      if (e) {
        state.checkData = [...state.tableData]
        state.checkData.forEach(item => {
          item.checked = true
        })
      } else {
        state.checkData = []
        state.tableData.forEach(item => {
          item.checked = false
        })
      }
      state.indeterminate = false
    }

    function checkRow(e) {
      let flag = state.checkData.some(item => item.id == e.id)
      if (flag) {
        state.checkData.splice(state.checkData.findIndex(item => item.id == e.id), 1)
      } else {
        state.checkData.push(e)
      }
      state.checked = state.checkData.length == state.tableData.length
      state.indeterminate = state.checkData.length > 0 && !state.checked

    }

    function reset() {

      state.formData.startDate = moment(moment().startOf('month')).format('YYYY-MM-DD'), // 开始时间 (默认当前月的第一天)
        state.formData.endDate = moment(moment().endOf('month')).format('YYYY-MM-DD'), // 结束时间 (默认当前月份的最后一天)
        state.formData.deptId = '', // 部门id
        state.formData.userId = '', // 员工id
        state.formData.deliveryType = '', // 订单类型
        state.formData.skuIds = '', // sku string
        state.formData.skuArr = ''

      state.userRef.clearHandle()
      state.date = [moment(moment().startOf('month')).format('YYYY-MM-DD'), moment(moment().endOf('month')).format('YYYY-MM-DD')]
      search()
    }

    function handleSizeChange(e) {
      state.formData.page.pageSize = e
      search()
    }

    function handleCurrentChange(e) {
      state.currentPage = e
      state.formData.page.pageNo = e
      search()
    }

    function search() {
      state.checked = false
      state.indeterminate = false
      state.checkData = []
      state.tableData.forEach(item => {
        item.checked = false
      })
      pageQuery(state.formData).then(res => {
        res.data.dataList.forEach(item => {
          item.checked = false
        })
        state.tableData = res.data.dataList
        state.totalCount = res.data.page.totalCount
      })

    }
    return {
      ...toRefs(state),
      ok,
      treeProps,
      dateChange,
      searchHandle,
      delRow,
      editRow,
      closeEvent,
      checkAll,
      checkRow,
      search,
      handleSizeChange,
      handleCurrentChange,
      advertisement,
      skuTotal,
      logisticsAmount,
      purchaseAmount,
      reset
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding-bottom: 60px;
}

.emypt {
  height: 30px;
  line-height: 30px;
  padding-left: 16px;
}

.head {
  padding: 24px 24px 10px 24px;
  background-color: #fff;
}

.unit {
  display: flex;
  justify-content: space-between;
  padding: 24px 0;
}

.tableBox {
  padding: 14px;
  background-color: #fff;
}

::v-deep(.vxe-table--expanded) {
  i {
    color: #1890FF !important;
  }
}

.skuContent {
  width: 100%;
  display: flex;
  padding: 8px;
  flex-wrap: wrap;

  .item {
    display: flex;
    width: 33%;
    padding: 8px;
    margin: 4px 2px;
    border: 1px solid rgb(232, 234, 236);

    img {
      width: 85px;
      height: 85px;
      margin-right: 16px;
    }

    .con {
      display: flex;
      flex: 1;
      flex-direction: column;
      justify-content: space-around;

      .sku,
      .price {
        display: flex;
        justify-content: space-between;
      }
    }
  }

}

.statistics {
  span {
    margin-left: 16px;
  }
}
</style>
