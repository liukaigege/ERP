<template>
	<el-dialog title="平台订单号" v-model="ifShow" :width="640" custom-class="myDialog" :close-on-click-modal="false" :destroy-on-close="true" @close="closeEvent">
		<div class="contentView">
      <el-form  :model="form" :rules="rules" ref="formRef">
				<el-form-item label="平台订单号:" prop="thirdId">
					<el-input v-model="form.thirdId" placeholder="请输入" clearable :maxlength="30" style="width: 300px"></el-input>
				</el-form-item>
			</el-form>
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
  import { ref, reactive, toRefs } from 'vue'
  import { ElMessage } from 'element-plus'
  import { updateThirdId } from '@/api/purchase/purchase.js'
  const props = defineProps({
    thirdId: {
      type: String,
      default: ''
    },
    purchaseId: {
      type: Number,
      default: null
    }
  })
  const emit = defineEmits(['closeEvent'])
  let state = reactive({
    ifShow: true,
    loading: false,
    form: {
      id: props.purchaseId,
      thirdId: props.thirdId
    }
  })
  let rules = {
    thirdId: { required: true, message: '请输入平台订单号', trigger: 'blur' },
  }
  let formRef = ref(null)

  // 关闭弹框
  let closeEvent = (refresh = false) => { // refresh为true则刷新列表
    state.ifShow = false
    setTimeout(() => {
      emit('closeEvent', refresh)
    }, 500)
  }

  // 取消回调
  let cancelEvent = () => {
    closeEvent()
  }

  // 确认回调
  let affirmEvent = () => {
    formRef.value.validate((valid) => {
      if (valid) {
        state.loading = true
        updateThirdId(state.form).then(res => {
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
      } else {
        ElMessage.error('信息填写错误，提交失败')
      }
    })
  }

  let { ifShow, loading, form } = toRefs(state)
</script>

<style lang="scss" scoped>

</style>