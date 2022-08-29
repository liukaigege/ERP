<!--
* @Descripttion: Vango ERP exportModel 选择导出格式
* @version: 1.0
* @Author: 王新国
* @Date: 2021-11-01 15:16:38
* @LastEditors: 王新国
* @LastEditTime: 2021-11-01 17:07:46
-->
<template>
  <el-dialog
    title="选择导出格式"
    v-model="dialogVisible"
    width="600px"
    @closed="handleClose"
    :close-on-click-modal="false"
  >
    <div>
      <el-radio-group v-model="exportData.type">
        <el-radio :label="1">选择日期</el-radio>
        <el-radio :label="2">按日期加时间</el-radio>
      </el-radio-group>
      <el-date-picker
        v-model="exportData.start_end"

        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="YYYY-MM-DD"
        unlink-panels
        clearable
        :disabledDate="dateFn"
        @calendar-change="changeData"
      >
      </el-date-picker>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false" >取 消</el-button>
        <el-button type="primary" @click="ok" >确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script>
import { reactive, toRefs } from 'vue'
import { ElMessage } from 'element-plus'
import { exportTrade } from '../composables/api'
import { disabledDate } from '../composables/tool'
export default {
  props: {
    list: Array
  },
  emits: ['exportModelBack'],
  setup(props, { emit }) {
    const nameList = props.list.map(v => v.name)
    const state = reactive({
      dialogVisible: true,
      exportData: {
        nameList,
        type: 1, //导出格式1 按日期 2按日期加时间
        start_end: ''
      },
      timeData: {
        time: false,
        timeSlot: 180
      }
    })
    function dateFn(time) {
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
      emit('exportModelBack', false)
    }
    function ok() {
      if (state.exportData.start_end) {
        exportTrade(state.exportData).then(res => {
          if (res.code == 200) {
            emit('exportModelBack', true)
            window.open(res.data, '_blank')
          } else {
            ElMessage.warning({ message: res.message })
          }
        })
      } else {
        ElMessage.warning({ message: '请选择时间' })
      }
    }
    return {
      ...toRefs(state),
      handleClose,
      ok,
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
</style>
