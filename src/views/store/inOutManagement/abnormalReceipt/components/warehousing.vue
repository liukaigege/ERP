<template>
<el-dialog v-model="show" width="540px" :close-on-click-modal="false" @close="close(null)">
  <div class="title">
    <i class="el-icon-warning" style="color:#FAAD14;font-size:21px"></i>
    <p style="font-size:16px">请将采购单号 {{data.newPurchaseOrderNumber}} 复制至【扫码入库】模块入库</p>
  </div>
  <p class="tips">若此单号已完成入库操作，点击【已处理】</p>
  <div class="text">
    <p style="width:50px">备注：</p>
    <el-input type="textarea" placeholder="" v-model="formData.remark" maxlength="100"  clearable :rows="4"></el-input>
  </div>
  <template #footer>
    <el-button @click="close(null)" >取消</el-button>
    <el-button type="primary"  @click="processed">已处理</el-button>
  </template>
</el-dialog>
</template>

<script>
import { inject, reactive, toRefs } from 'vue'
import { exceptionProcess } from '../composables/api.js'
import { ElMessage } from 'element-plus'
export default {
  props: {
    data: {}
  },
  emits: ['closeEvent'],
  setup(props, ctx) {
    const state = reactive({
      show: true,
      formData: {
        serialNumber: props.data.serialNumber,
        remark: '',
        trackInfo: ''
      }
    })

    function close(e) {
      state.show = false
      setTimeout(() => {
        ctx.emit('closeEvent', 'warehousingShow')
        if (e) {
          changeTabs()
        }
      }, 500)
    }

    let changeTabs = inject('changeTabs')

    function processed() {
      exceptionProcess(state.formData).then(res => {
        ElMessage.success(res.message)
        setTimeout(() => {
          close(true)
        }, 500);
      })

    }

    return {
      ...toRefs(state),
      close,
      processed
    }
  }
}
</script>

<style lang="scss" scoped>
.title {
  display: flex;
  align-items: center;
  padding-left: 16px;
  color: #000;
  margin-bottom: 12px;
}

.el-icon-warning {
  margin-right: 8px;
}

.tips {
  margin-bottom: 24px;
  padding-left: 45px;
}

.text {
  display: flex;
  padding-left: 10px;
}
</style>
