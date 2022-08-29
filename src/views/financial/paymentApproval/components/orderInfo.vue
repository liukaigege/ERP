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
    <ErpNav title="订单信息" :goBack="goBack" />
    <div class="formContainer">
      <el-form :model="form" :inline="true" ref="formRef" @keyup.enter="queryList">
        <el-form-item label="搜索内容:">
          <el-select style="width: 140px;" v-model="form.searchType" placeholder="请选择" clearable>
            <el-option v-for="item in [{ value: 1, label: '商品sku' },{ value: 2, label: '订单sku' },{ value: 3, label: '订单号' }]" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>&nbsp;&nbsp;
          <el-input style="width: 318px" v-model="form.searchText" placeholder="请输入要检索的内容多条可用逗号或空格隔开" clearable></el-input>
        </el-form-item>&nbsp;&nbsp;&nbsp;&nbsp;
        <el-form-item label="团队:">
          <el-cascader v-model="form.deptId" :options="oraganziationList" :show-all-levels="false" clearable :props="{
              checkStrictly: true,
              expandTrigger: 'click',
              label: 'deptName',
              value: 'deptId',
              children: 'children',
							emitPath:false
            }">
          </el-cascader>
        </el-form-item>&nbsp;&nbsp;
        <el-form-item>
          <el-button type="primary" style="margin-left: 20px" @click="queryList">查询</el-button>
          <el-button @click="resetFn">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="tableContainer">
      <vxe-table border resizable max-height="500" :scroll-y="{ enabled: false }" :data="list" align="center">
        <!-- @checkbox-all="marksCheckboxAll"
					@checkbox-change="selectRows" -->
        <!-- <vxe-table-column v-if="isChecked" type="checkbox" width="55"> -->
        <vxe-table-column width="55">
          <template #header>
            <el-checkbox :disabled="isDisabled" @change="marksCheckboxAll" :indeterminate="indeterminate" v-model="allChecked" />
          </template>
          <template #default="{ row }">
            <el-checkbox :disabled="row.isDisabled" @change="selectRows(row)" v-model="row.checked" />
          </template>
        </vxe-table-column>
        <vxe-column title="商品信息">
          <template #default="{ row }">
            <div class="goodsInfo">
              <div>
                <el-popover placement="right-start" trigger="hover" width="auto">
                  <el-image style="width: 200px; height: 200px" :src="row.mainImg" fit="contain"></el-image>
                  <template #reference>
                    <el-image class="ml-10" style="width: 70px; height: 70px" :src="row.mainImg" fit="contain"></el-image>
                  </template>
                </el-popover>
              </div>
              <div style="text-align: left;padding-left:20px;">
                <p>{{row.skuCode}}</p>
                <p>{{row.currency}} {{row.price}}</p>
                <p v-if="row.skuValue">{{remderSkuValue(JSON.parse(row.skuValue))}}</p>
              </div>
            </div>
          </template>
        </vxe-column>
        <vxe-column field="orderId" title="订单号" width="200">
        </vxe-column>
        <vxe-column v-if="pageType === 1" field="paymentTime" title="付款时间" width="200">
        </vxe-column>
        <vxe-column field="goodsQuantity" title="数量" width="100">
        </vxe-column>
        <vxe-column field="arrivalQuantity" title="到货数量" width="100">
        </vxe-column>
        <vxe-column title="配件金额" width="100">
          <template #default="{ row }">
            <p v-if="row.partSwitch==0">-</p>
            <p v-if="row.importStatus==1 && row.partSwitch">未导入</p>
            <p v-if="row.importStatus==3 && row.partSwitch">￥{{row.partTotalPrice}}</p>
          </template>
        </vxe-column>
        <vxe-column title="定制属性" width="350">
          <template #default="{row}">
            <el-popover placement="left-end" trigger="hover" width="auto">
              <div>
                <div class="customValueList" v-for="(v,i) in row.customValue" :key="i">
                  <p v-if="isImgString(v.value)">
                    {{v.field}}：
                    <el-popover placement="right-start" trigger="hover" width="auto">
                      <el-image style="width: 200px; height: 200px" :src="v.value" fit="contain"></el-image>
                      <template #reference>
                        <el-icon style="font-size: 20px;position: relative;top: 3px;">
                          <PictureFilled />
                        </el-icon>
                      </template>
                    </el-popover>
                  </p>
                  <p v-else>{{v.field}}：{{v.value}}</p>
                </div>
              </div>
              <template #reference>
                <div class="customValueContainer">
                  <div class="customValueList" v-for="(v,i) in row.customValue" :key="i">
                    <p v-if="isImgString(v.value)">
                      {{v.field}}：
                      <el-popover placement="right-start" trigger="hover" width="auto">
                        <el-image style="width: 200px; height: 200px" :src="v.value" fit="contain"></el-image>
                        <template #reference>
                          <el-icon style="font-size: 20px;position: relative;top: 3px;">
                            <PictureFilled />
                          </el-icon>
                        </template>
                      </el-popover>
                    </p>
                    <p v-else>{{v.field}}：{{v.value}}</p>
                  </div>
                </div>
              </template>
            </el-popover>

          </template>
        </vxe-column>
        <vxe-column title="付款状态" width="100">
          <template #default="{ row }">
            {{payStatusList[row.payStatus]}}
          </template>
        </vxe-column>
        <vxe-column title="操作" width="200">
          <template #default="{ row }">
            <el-button type="text" @click="queryCustomInfoFn(row)">查看定制信息</el-button>
          </template>
        </vxe-column>
      </vxe-table>
    </div>
    <ErpFooter>
      <div class="footer">
        <div class="left-box">
          <el-button @click="goBack">
            取 消
          </el-button>
          <el-button v-if="isChecked" type="primary" @click="sellectOk">
            确认选择
          </el-button>
        </div>
        <div class="right-box">
          <el-pagination :total="totalNum" :current-page="form.page.pageNo" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[100, 200, 300, 400, 500]" layout="total, sizes, prev, pager, next, jumper" :page-size="form.page.pageSize"></el-pagination>
        </div>
      </div>
    </ErpFooter>
    <CustomInfo v-if="!!customInfoData" :data="customInfoData" :nobtn="true" :tabPosition="1" @customInfoClose="customInfoClose" />
  </div>
</template>
<script>
import { computed, onMounted, reactive, toRefs } from 'vue'
import ErpNav from '@/components/erpNav/index.vue'
import { deepCopy, isImgString, renderCustomInfo } from '@/utils/tool'
import { orderInfoForms, payStatusList } from '../composables/data'
import { queryOrderInfo } from '../composables/api'
import { getOrganizationTree } from '@/api/user'
import ErpFooter from '@/components/erpFooter/index.vue'
import { PictureFilled } from '@element-plus/icons-vue'
import CustomInfo from '@/views/purchase/purchaseManagement/customOder/components/customInfo.vue'
import { ElMessage } from 'element-plus'
export default {
  components: {
    ErpNav,
    ErpFooter,
    CustomInfo,
    PictureFilled
  },
  props: {
    pageType: {//1,财务审批 2,付款申请中
      type: Number,
      default: 2
    },
    isShowStatus: { // 付款单审批 付款申请-待审核已付款，只展示status为0的数据
      type: Boolean,
      default: false
    },
    orderInfoForm: {
      type: Object,
      default: {}
    },
    isChecked: {
      type: Boolean,
      default: false
    },
    rowData: {
      type: Object,
      default: null
    },
		checkedInfo:{
      type: Array,
      default: []
    }
  },

  emits: ['closeBack'],
  setup(props, { emit }) {
		const isClose = props.pageType == 2 && props.isChecked? 0 : null
    const form = { ...props.orderInfoForm, ...orderInfoForms, isCount: props.isShowStatus ? 1 : 0 ,isClose }
    const state = reactive({
      form: deepCopy(form),
      oraganziationList: [],
      totalNum: 0,
      list: [],
      customInfoData: null,
      allChecked: false,
      indeterminate: false,
      // isDisabled: false,
			checkedInfoState:deepCopy(props.checkedInfo)
    })
    // onMounted(()=>{
    //   if(!props.isChecked){
    //     state.isDisabled = true
    //   }
    // })
    const isDisabled = computed(() => {
      return !props.isChecked || state.list.every(v => v.isDisabled)
    })
    // get team list data
    getOrganizationTree().then(res => {
      if (res.code === 200) {
        state.oraganziationList = deleteChildren(res.data)
      }
    })
    // delete children = null data
    function deleteChildren(arr) {
      arr.forEach(v => {
        if (v?.children?.length > 0) {
          v.children = deleteChildren(v.children)
        } else {
          v.children = null
        }
      })
      return arr
    }
    // close the modal
    function goBack() {
      emit('closeBack', false)
    }
    // get table list data
    queryList()
    function queryList() {
      queryOrderInfo(state.form).then(res => {
        state.list = res.data.dataList.map(v => {
          v.isDisabled = (v.importStatus == 1 && v.partSwitch == 1) || !props.isChecked ||  v.payStatus == 2
          // if (props.rowData && props.rowData.itemOrderIds) {
          //   v.checked = props.rowData.itemOrderIds.some(val => val == v.id)
          // } else {
          //   v.checked = v.status !== 1
          // }
					if(props.checkedInfo?.length > 0) {
						v.checked = props.checkedInfo.some(val => val.id == v.id)
					}else{
						v.checked = v.status !== 1
					}
          if (v.customValue) {
            const copyCustomValue = JSON.parse(v.customValue)
            v.customValue = renderCustomInfo(copyCustomValue, 2)
          } else {
            v.customValue = []
          }
          return v
        })
        if (props.isShowStatus) state.list = state.list.filter(item => !item.status)
        state.indeterminate = !(state.list.every(v => v.checked) || state.list.every(v => !v.checked))
        state.allChecked = state.list.every(v => v.checked)
        state.totalNum = res.data.page.totalCount
      })
    }
    // reset page data
    function resetFn() {
      state.form = deepCopy(form)
      queryList()
    }
    function handleSizeChange(val) {
      state.form.page.pageSize = val
      queryList()
    }
    function handleCurrentChange(val) {
      state.form.page.pageNo = val
      queryList()
    }
    function remderSkuValue(list = []) {
      let str = ''
      list.forEach(v => str += `${v.spe}:${v.speVal} `)
      return str
    }
    function renderCustom(list = []) {
      let str = ''
      list.forEach(v => str += `${v.field}:${v.value} `)
      return str
    }
    function customInfoClose() {
      state.customInfoData = null
    }
    function queryCustomInfoFn(row) {
      const obj = deepCopy(row)
      // obj.customValue = JSON.stringify(obj.customValue)
      state.customInfoData = obj
    }
    function marksCheckboxAll(val) {
      state.indeterminate = false
      state.list.forEach(v => {
        v.checked = val
        if (v.isDisabled) {
          v.checked = false
        }
      })
    }
    function selectRows(row) {
      if (row.checked) state.indeterminate = !state.list.every(v => v.checked)
      else state.indeterminate = !state.list.every(v => !v.checked)
      state.allChecked = state.list.every(v => v.checked)
    }
    function sellectOk() {
      const checkedList = state.list.filter(v => v.checked)
			var checkedInfo = deepCopy(state.checkedInfoState)
			state.list.forEach(v => {
				if(v.checked){
					if(state.checkedInfoState.every(val=>val.id != v.id)){
						checkedInfo.push({
							id:v.id,
							checked:v.checked
						})
					}
				}else {
					if(state.checkedInfoState.some(val=>val.id == v.id)){
						checkedInfo = checkedInfo.filter(val=>val.id != v.id)
					}
				}
			})
      if (!checkedList.length) return ElMessage.warning('请勾选列表数据')
      emit('closeBack', checkedList, checkedInfo)
    }
    return {
      ...toRefs(state),
      goBack,
      resetFn,
      sellectOk,
      queryList,
      selectRows,
      renderCustom,
      remderSkuValue,
      customInfoClose,
      marksCheckboxAll,
      handleSizeChange,
      queryCustomInfoFn,
      handleCurrentChange,
      isImgString,
      renderCustomInfo,
      payStatusList,
			isDisabled
    }
  }
}
</script>
<style lang='scss' scoped>
.formContainer {
  background-color: #fff;
  margin-top: 20px;
  padding: 20px 20px 0;
}
.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 0 20px;
  .left-box {
    display: flex;
    align-items: center;
  }
  .right-box {
    flex-grow: 1;
  }
}
.goodsInfo {
  display: flex;
}
.tableContainer {
  background-color: #fff;
  padding: 20px;
  margin-top: 20px;
}
.customValueContainer {
  text-align: center;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  width: max-content;
  margin: 0 auto;
}
</style>
