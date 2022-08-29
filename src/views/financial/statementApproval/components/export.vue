<template>
  <div class="box">
    <el-dialog title="导出" v-model="show" width="700px" @close="close" :close-on-click-modal="false">
      <el-tabs v-model="exportParams.type" tab-position="top">
        <el-tab-pane label="按当前数据导出" :name="0">
          <el-radio-group v-model="exportParams.subType">
            <el-radio :label="1">当前查询数据</el-radio>
            <el-radio :label="2">当前勾选数据</el-radio>
          </el-radio-group>
        </el-tab-pane>
        <el-tab-pane label="按天导出" :name="1">
          选择日期：
          <el-date-picker v-model="date" value-format="YYYY-MM-DD" @change="timeChange" type="daterange" unlink-panels range-separator="~" start-placeholder="开始时间" end-placeholder="结束时间" />
        </el-tab-pane>
        <el-tab-pane label="自定义导出" :name="2">
          <div style="display:flex;align-items:center">
            <div>{{exportType === 2 ? '按流水号导出：' : '按对账单号导出：'}}</div>
            <el-input v-model="exportParams.serialNumsList" clearable style="width:400px"></el-input>
          </div>
        </el-tab-pane>
      </el-tabs>
      <template #footer>
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="ok">导出</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, toRefs } from 'vue'
import moment from 'moment'
import { verifyCheckExport, paymentCheckExport } from '@/api/financial'
import { ElMessage } from 'element-plus'
export default {
  emits: ['close'],
  props: {
    seachParams: Object,
    selectList: Array,
    exportType: {
      type: Number,
      default: 1 //1对账单导出 2付款单导出
    },
    status: Number,
		tableData:{
			type: Array,
      default:[]
		}
  },
  setup(props, ctx) {
    const state = reactive({
      show: true,
      tabsChecked: 0,
      date: null,
      exportParams: {
        type: 0,
        subType: 1,
        start: "",
        end: "",
        checkListDTO: {},
        serialNumsList: "",
        serialNums: ''
      }
    })
    function timeChange(time) {
      if (time) {
        state.exportParams.start = moment(time[0]).format('YYYY-MM-DD 00:00:00')
        state.exportParams.end = moment(time[1]).format('YYYY-MM-DD 23:59:59')
      } else {
        state.exportParams.start = ''
        state.exportParams.end = ''
      }
    }
    function close() {
      state.show = false
      setTimeout(() => {
        ctx.emit('close')
      }, 500)
    }

    function ok() {
      const { type, subType } = state.exportParams
      const fetchArray = [{
        type: 1,
        fetch: verifyCheckExport
      }, {
        type: 2,
        fetch: paymentCheckExport
      }]
      if (type == 0 && subType == 2 && !props.selectList.length) {
        return ElMessage.warning({ message: '请选择需要导出的订单' })
      }
      if (type == 1 && state.date == null)
        return ElMessage.warning({ message: '请选择需要导出的日期' })
      if (type == 2 && !state.exportParams.serialNumsList) {
        return ElMessage.warning({ message: '请输入需要导出的'+ props.exportType === 2 ? '流水号' : '对账单号' })
      }
      // if (props.selectList.length && type != 2) state.exportParams.serialNums = props.selectList.join(',')
      state.exportParams.checkListDTO = props.seachParams
      state.exportParams.serialNums = type == 0 ? props.selectList?.join(',') : state.exportParams.serialNumsList
      // 付款单导出
      // status 状态 1 待审核 2已审核
      // state.exportParams.status = props.status || 1
      const fetchFunc = fetchArray.find(item => item.type === props.exportType).fetch
      fetchFunc(state.exportParams).then(res => {
        if (res.data) {
          close()
          window.open(res.data)
        }
      })
    }
    return {
      ...toRefs(state),
      close,
      ok,
      timeChange
    }
  }
}
</script>

<style lang="scss" scoped>
.box {
  ::v-deep(.el-dialog__body) {
    padding-top: 0;
  }
}
</style>
