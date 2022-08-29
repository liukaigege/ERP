<template>
	<el-dialog title="同步订单" v-model="ifShow" :width="640" custom-class="myDialog" :close-on-click-modal="false" :destroy-on-close="true" @close="closeEvent">
		<div class="contentView">
      <el-progress :text-inside="true" :stroke-width="20" :percentage="percentage" :status="resultData.code == '200' ? 'success' : 'exception'" style="width: 70%"></el-progress>
      <div class="content">
        <div class="status" v-if="indeterminate">状态：同步中..</div>
        <div class="status" v-else>状态：{{resultData.code == '200' ? '同步成功！' : '同步失败！'}}</div>
        <div class="detail" v-if="!indeterminate">
          <div v-if="resultData.code == '200'">详情：同步成功！共同步成功{{resultData.syncSuccessSize}}条数据！</div>
          <div v-if="resultData.code == '400'">详情：同步失败！共同步成功{{resultData.syncSuccessSize}}条数据,同步失败{{resultData.syncFailSize}}条数据！</div>
          <div v-if="resultData.code == '400'" style="margin: 10px 0 5px 0">失败原因：</div>
          <div v-if="resultData.code == '400'" v-html="resultData.msg" class="reason"></div>
        </div>
      </div>
    </div>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="cancelEvent" >关闭</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup>
  import { ref, reactive, toRefs, onMounted } from 'vue'
  import { ElMessage } from 'element-plus'
  import { syncOrder, basicProgress, getSyncResult } from '@/api/purchase/purchase.js'
  import { getuuid } from '@/utils/tool.js'
  const emit = defineEmits(['closeEvent'])
  let state = reactive({
    ifShow: true,
    indeterminate: true,
    percentage: 0,
    resultData: {
      code: '200',
      msg: '',
      syncFailSize: null,
      syncSuccessSize: null,
      syncTotal: null
    },
    timer: null
  })

  let getResult = (uuid) => {
    getSyncResult({ uuid }).then(res => {
      state.indeterminate = false
        if (res.code == 200) {
          state.resultData = res.data
          if (res.data.code === '200') {
            ElMessage.success({ message: '同步成功！', type: 'success' })
          } else {
            ElMessage.error('订单同步失败！')
          }
        } else {
          ElMessage.error('订单同步失败！')
        }
    })
  }

  let getProgress = (uuid) => {
    state.timer = setInterval(() => {
      basicProgress({ uuid }).then(res => {
        if (res.code == 200) {
          state.percentage = res.data.percent
          if (res.data.percent == 100) {
            getResult(uuid)
            state.indeterminate = false
            clearInterval(state.timer)
          }
        } else {
          ElMessage.error('订单同步失败！')
          state.indeterminate = false
          clearInterval(state.timer)
        }
      }).catch(err => {
        state.indeterminate = false
        clearInterval(state.timer)
      })
    }, 500)
  }

  // 同步订单
  let syncOrdering = () => {
    let params = {
      uuid: getuuid()
    }
    syncOrder(params).then(res => {
      if (res.code == 200) {
        getProgress(params.uuid)
      } else {
        state.indeterminate = false
        ElMessage.error('订单同步失败！')
      }
    }).catch(err => {
      state.indeterminate = false
    })
  }

 

  // 关闭弹框
  let closeEvent = (refresh = false) => { // refresh为true则刷新列表
    clearInterval(state.timer)
    state.ifShow = false
    setTimeout(() => {
      emit('closeEvent', refresh)
    }, 500)
  }

  // 取消回调
  let cancelEvent = () => {
    closeEvent()
  }

  onMounted(() => {
    syncOrdering()
  })

  let { percentage, ifShow, indeterminate, resultData } = toRefs(state)
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
      width: 100%;
      .reason{
        max-height: 200px;
        overflow: auto;
      }
    }
  }
}
</style>