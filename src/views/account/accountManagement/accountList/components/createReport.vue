<!--
* @Descripttion: Vango ERP createReport 导出报告
* @version: 1.0
* @Author: 王新国
* @Date: 2021-11-01 15:16:38
* @LastEditors: 王新国
* @LastEditTime: 2021-11-01 17:07:46
-->
<template>
  <el-dialog
    title="导出报告"
    v-model="dialogVisible"
    width="600px"
    @closed="handleClose"
    :close-on-click-modal="false"
  >
    <div style="position: relative">
      <el-tabs v-model="form.type">
        <el-tab-pane label="争议和退单" name="1"> </el-tab-pane>
        <el-tab-pane label="对账单" name="2"> </el-tab-pane>
      </el-tabs>
      <el-form ref="formRef" :model="form" label-width="120px" :rules="rules">
        <el-form-item
          label="事件状态："
          v-if="form.type == '1'"
          prop="disputeStatus"
        >
          <el-select
            v-model="form.disputeStatus"
            placeholder="请选择"

            clearable
          >
            <el-option
              v-for="item in exportTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="日期类型："
          prop="timeType"
          v-if="form.type == '2'"
        >
          <el-radio-group v-model="form.timeType">
            <el-radio :label="1">按开始时间</el-radio>
            <el-radio :label="2">按完成时间</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="日期范围：" prop="start_end">
          <el-date-picker
            v-model="form.start_end"

            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
            unlink-panels
            clearable
            style="width: 220px"
            :disabledDate="dateFn"
            @calendar-change="changeData"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="格式：">
          <el-select v-model="form.format" placeholder="请选择" >
            <el-option
              v-for="item in [{ value: 1, label: 'excel' }]"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="progress_container" v-if="percentageShow">
        <el-progress
          :percentage="percentage"
          :status="percentage == 100 ? 'success' : ''"
        ></el-progress>
        <p>{{ percentageText }}</p>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false" >取 消</el-button>
        <el-button type="primary" @click="ok" >导出报告</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script>
import { reactive, toRefs } from 'vue'
import { exportReport } from '../composables/api'
import { ElMessage } from 'element-plus'
import { exportTypeList } from '../composables/data'
import { disabledDate } from '../composables/tool'
import { deepCopy } from '@/utils/tool'
import { checkProgress } from '@/api/order/exportOrder.js'
export default {
  props: {
    list: Array
  },
  emits: ['createReportBack'],
  setup(props, { emit }) {
		console.log('==>',props.list)
    const nameList = props.list.map(v => v.name)
    const state = reactive({
      dialogVisible: true,
      form: {
        disputeStatus: '', //事件状态（type=1必填）
        format: 1, //格式 1 excel
        start_end: '', //开始时间_结束时间
        type: '1', //导出类型1 争议和退单 2对账单
        nameList,
        timeType: 1
      },
      rules: {
        start_end: [
          { required: true, message: '请选择日期范围', trigger: 'blur change' }
        ],
        disputeStatus: [
          { required: true, message: '请选择事件状态', trigger: 'blur change' }
        ],
        timeType: [
          { required: true, message: '请选择日期类型', trigger: 'blur change' }
        ]
      },
      formRef: null,
      timeData: {
        time: false,
        timeSlot: 180
      },
      percentage: 0,
      percentageText: '',
      percentageShow: false,
      timer: null
    })
    function dateFn(time) {
      if (state.form.type == 1)
        return disabledDate(time, state.timeData.timeSlot, state.timeData.time)
    }
    function changeData(val) {
      if (val[1]) {
        // 此时选择的是第二个时间
        state.timeData = {
          time: false,
          timeSlot: 180
        }
      } else {
        // 此时选的是第一个时间
        state.timeData = {
          time: val[0],
          timeSlot: 7
        }
      }
    }
    function handleClose() {
      emit('createReportBack', false)
    }
    function ok() {
      state.formRef.validate(val => {
        if (val) {
          const data = deepCopy(state.form)
          data.type = data.type - 0
          if (state.form.type == 2) data.uuid = new Date().getTime() + ''
          exportReport(data).then(res => {
            if (res.code == 200) {
              clearInterval(state.timer)
              if (state.form.type == 2) {
                state.percentageShow = true
                state.timer = setInterval(() => {
                  checkProgressFn(data.uuid, state.timer)
                }, 500)
              } else {
                emit('createReportBack', true)
                window.open(res.data, '_blank')
              }
            } else {
              ElMessage.warning({ message: res.message })
            }
          })
        }
      })
    }

    //查询进度条信息
    function checkProgressFn(uuid, timer) {
      checkProgress({ uuid }).then(res => {
        if (res.code == 200) {
          state.percentage = res.data.percent
          state.percentageText = res.data.description
          if (state.percentage == 100) {
            clearInterval(timer)
            state.percentageShow = false
            state.percentage = 0
            emit('createReportBack', true)
            window.open(res.data.url, '_blank')
          }
        } else {
          clearInterval(timer)
          ElMessage.warning({ message: res.message })
        }
      })
    }

    return {
      ...toRefs(state),
      handleClose,
      ok,
      exportTypeList,
      changeData,
      dateFn
    }
  }
}
</script>
<style lang='scss' scoped>
:deep(.el-range-separator) {
  width: 30px;
}
.progress_container {
  width: 70%;
  height: 30px;
  position: absolute;
  right: 65px;
  top: -60px;
}
</style>
