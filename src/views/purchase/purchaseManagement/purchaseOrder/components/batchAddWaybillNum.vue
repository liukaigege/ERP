<template>
	<el-dialog title="添加运单号" v-model="ifShow" :width="800" custom-class="myDialog" :close-on-click-modal="false" :destroy-on-close="true" @close="closeEvent">
		<div class="contentView">
      <vxe-table v-bind="tableOptions" :data="tableData" :loading="tableLoading" ref="tableRef">
        <vxe-column title="采购单号" field="purchaseOrderNumber" width="120"></vxe-column>
        <vxe-column title="物流方式" width="170">
          <template #default="{ row }">
            <div class="logisticses">
              <el-select v-model="scoped.nameCn" v-for="(scoped) in row.logisticses" :key="scoped.uuid" >
                <el-option :label="item.nameCn" :value="item.nameCn" v-for="(item, index) in logisticsesOptions" :key="index"></el-option>
              </el-select>
            </div>
            <div class="sitting" :style="{ 'margin-top': row.logisticses.length == 0 ? 0 : '10px' }"></div>
          </template>
        </vxe-column>
        <vxe-column title="运单号" width="170">
          <template #header>
            <div class="header">
              <i class="required-icon">*</i>
              <i class="vxe-cell--edit-icon vxe-icon--edit-outline"></i>
              运单号
            </div>
          </template>
          <template #default="{ row, $rowIndex }">
            <div class="trackNum">
              <el-input v-model="item.trackNum" placeholder="请输入" clearable :maxlength="60" v-for="(item, index) in row.logisticses" :key="item.id" ></el-input>
            </div>
            <div class="sitting" :style="{ 'margin-top': row.logisticses.length == 0 ? 0 : '10px' }"><el-button type="text" @click="add($rowIndex)">+增加</el-button></div>
          </template>
        </vxe-column>
        <vxe-column title="发货箱数" width="200">
          <template #header>
            <div class="header">
              <i class="required-icon">*</i>
              <i class="vxe-cell--edit-icon vxe-icon--edit-outline"></i>
              发货箱数
            </div>
          </template>
          <template #default="{ row, $rowIndex }">
            <div class="email">
              <div v-for="(item, index) in row.logisticses" :key="item.id" class="emailBox">
                <el-input-number v-model="item.boxesNum" clearable :controls="false" :min="1" :max="100" :precision="0" placeholder="请输入" ></el-input-number>
                <el-button type="text" @click="del($rowIndex, index)" :disabled="row.logisticses.length == 1">删除</el-button>
              </div>
            </div>
            <div class="sitting" :style="{ 'margin-top': row.logisticses.length == 0 ? 0 : '10px' }"></div>
          </template>
        </vxe-column>
        <vxe-column title="操作">
          <template #default="{ row }">
            <div><el-button type="text" @click="delPurchase(row.purchaseOrderNumber)" :disabled="tableData.length == 1">移除</el-button></div>
          </template>
        </vxe-column>
      </vxe-table>
		</div>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="cancelEvent" >取消</el-button>
				<el-button type="primary" @click="affirmEvent"  :loading="loading">确定</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup>
import { ref, reactive, toRefs, onMounted } from 'vue'
import { getuuid } from '@/utils/tool'
import { ivtLogisticses, saveLogisticses } from '@/api/purchase/purchase.js'
import { ElMessage } from 'element-plus'
  let props = defineProps({
    selectionArr: {
      type: Array,
      default: []
    }
  })
  let state = reactive({
    ifShow: true,
    loading: false,
    tableLoading: false,
    tableData: [],
    logisticsesOptions: [],
    form: {
      orderPurchaseLogisticsDTOS: []
    }
  })
  let tableOptions = {
    autoResize: true,
    keepSource: true,
    align: 'center',
    highlightHoverRow: true,
    scrollY: { enabled: false },
  }
  const emit = defineEmits(['closeEvent'])
  let tableRef = ref(null)
  // 关闭弹框
  let closeEvent = (refresh = false) => {
    state.ifShow = false
    setTimeout(() => {
      emit('closeEvent', refresh)
    }, 500)
  }

  let add = (index) => {
    state.tableData[index].logisticses.push({
      id: null,
      nameCn: state.logisticsesOptions[0].nameCn,
      trackNum: '',
      boxesNum: 1
    })
  }

  let del = (index, ind) => {
    state.tableData[index].logisticses.splice(ind, 1)
  }

  let initData = () => {
    props.selectionArr.forEach(item => {
      state.tableData.push({
        purchaseOrderNumber: item.purchaseOrderNumber,
        logisticses: [
          {
            id: null,
            nameCn: state.logisticsesOptions[0].nameCn,
            trackNum: '',
            boxesNum: 1
          }
        ]
      })
    })
    tableRef.value.loadData(state.tableData)
  }

  // 获取所有物流方式
  let getIvtLogisticses = () => {
    ivtLogisticses().then(res => {
      if (res.code == 200) {
        state.logisticsesOptions = res.data
        initData()
      } else {
        ElMessage.error(res.message)
      }
    })
  }

  let delPurchase = (purchaseOrderNumber) => {
    state.tableData = state.tableData.filter(item => item.purchaseOrderNumber !== purchaseOrderNumber)
  }

  // 取消回调
  let cancelEvent = () => {
    closeEvent()
  }

  // 确认回调
  let affirmEvent = () => {
    let rules = true
    state.tableData.forEach(item => {
      item.logisticses.forEach(it => {
        if (it.trackNum == '' || it.boxesNum == undefined) {
          rules = false
        }
        it.trackNum = it.trackNum.trim()
      })
    })
    if (!rules) {
      ElMessage.error('信息填写错误, 运单号和发货箱数必填')
      return false;
    }
    state.form.orderPurchaseLogisticsDTOS = []
    state.tableData.forEach(item => {
      state.form.orderPurchaseLogisticsDTOS.push({
        purchaseOrderNumber: item.purchaseOrderNumber,
        logisticses: item.logisticses
      })
    })
    saveLogisticses(state.form).then(res => {
      state.loading = false
      if (res.code == 200) {
        ElMessage.success({ message: '操作成功！', type: 'success' });
        closeEvent(true)
      } else {
        ElMessage.error(res.message)
      }
    }).catch(err => {
      state.loading = false
    
    })
  }

  onMounted(() => {
    getIvtLogisticses()
  })

  let { ifShow, loading, tableLoading, tableData, logisticsesOptions } = toRefs(state)
</script>

<style lang="scss" scoped>
.logisticses{
  .el-select{
    width: 140px;
    margin-bottom: 10px;
  }
  .el-select:last-of-type{
    margin-bottom: 0;
  }
}
:deep(.trackNum){
  .el-input{
    width: 140px;
    margin-bottom: 10px;
  }
  .el-input:last-of-type{
    margin-bottom: 0
  }
}
.email{
  .emailBox{
    display: flex;
    align-items: center;
    height: 32px;
    margin-bottom: 10px;
  }
  .el-input-number{
    width: 140px;
  }
  .emailBox:last-of-type{
    margin-bottom: 0;
  }
  .el-button{
    color: #FD4C60;
    margin-left: 10px;
  }
}
.sitting{
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.header{
  .required-icon{
    color: #f56c6c;
    font-size: 17px;
    margin-right: 3px;
  }
  .vxe-icon--edit-outline{
    width: 1em;
    height: 1em;
    line-height: 1em;
  }
}


</style>