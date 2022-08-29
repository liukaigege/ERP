<!--
 * @Descripttion: 
 * @version: 
 * @Author: 韦剑
 * @Date: 2021-07-29 09:54:38
 * @LastEditors: 朱涛
 * @LastEditTime: 2021-08-05 16:11:05
-->
<template>
  <el-dialog title="同步订单" v-model="ifShow" :width="800" custom-class="myDialog" :close-on-click-modal="false" :destroy-on-close="true" @close="closeEvent">
    <div class="contentView">
      <el-progress :show-text="false" :stroke-width="20" :percentage="100" :status="status" :indeterminate="indeterminate" style="width: 70%"></el-progress>
      <div class="content">
        <div class="status">状态：{{statusText}}</div>
        <div class="detail" v-if="progressInfo.length > 0">
          <div class="label">详情：</div>
          <div class="right">
            <p class="progressMsg" v-for="(item, index) in progressInfo" :key="index">{{item}}</p>
          </div>
        </div>
      </div>
		</div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeEvent" >关 闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { reactive, ref, toRefs, onMounted,inject } from 'vue'
import { ElMessage } from 'element-plus'
import { standard, syncLog } from '@/api/order/orderManagement.js'
export default {
  emits: ['closeEvent'],
	setup(props, context) {
    const formOptions = inject('formOptions')
    // 获取的formOptions 组件
		let ifShow = ref(true)
    let timer = ref(null)
    let state = reactive({
      progressInfo: [],
      statusText: '同步中...',
      params: {},
      status: '',
      indeterminate: true
    })
    let closeEvent = () => {
      clearInterval(timer)
      context.emit('closeEvent')
      if(state.status == 'success') formOptions.value.init(1)
     
    }

    let getSyncOrder = () => {
      return new Promise((resolve, reject) => {
        standard().then(res => {
          if (res.code == 200) {
            resolve(res.data)
          } else {
            state.statusText = '同步失败！'
            state.status = 'exception'
            state.indeterminate = false
            ElMessage.error(res.msg)
          }
        })
      })
    }

    let getSyncProgress = () => {
      getSyncOrder().then((data) => {
        state.params = {
          executorAddress: data.executorAddress,
          fromLineNum: data.fromLineNum,
          logId: data.logId,
          triggerTime: data.triggerTime
        }
        timer = setInterval(() => {
          syncLog(state.params).then(res => {
            if (res.code == 200) {
              let { logContent, end, toLineNum } = JSON.parse(res.data)
              if (logContent) {
                state.progressInfo.push(logContent)
                console.log(logContent)
              }
              if (end) {
                state.statusText = '同步完成！'
                state.status = 'success'
                state.indeterminate = false
                ElMessage.success({ message: '同步订单结束！', type: 'success' });
                clearInterval(timer)
              } else {
                state.params.fromLineNum = toLineNum + 1 + ''
              }
            } else {
              state.statusText = '同步失败！'
              state.status = 'exception'
              state.indeterminate = false
              ElMessage.error('订单同步失败！')
              clearInterval(timer)
            }
          })
        }, 1000) 
      })
    }

    onMounted(() => {
  
      getSyncProgress()
    })

		return {
			ifShow,
      timer,
      ...toRefs(state),
      closeEvent,
		}
	}
}
</script>

<style lang="scss" scoped>
  .contentView{
    height: 300px;
    padding-top: 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
    .content{
      width: 70%;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      .status{
      margin-top: 10px;
      }
      .detail{
        margin-top: 10px;
        display: flex;
        width: 100%;
        .label{
          width: 50px;
        }
        .right{
          flex: 1;
          height: 200px;
          overflow-y: scroll;
          
          p{
            white-space: pre-line;
          }
        }
      }
    }
  }
</style>