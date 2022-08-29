<template>
	<el-dialog title="驳回审核" v-model="ifShow" :width="640" custom-class="myDialog" :close-on-click-modal="false" :destroy-on-close="true" @close="closeEvent">
		<div class="contentView">
			<el-form  :model="form" :rules="rules" ref="formRef">
				<el-form-item label="驳回原因:" prop="remark">
					<el-input type="textarea" placeholder="请输入驳回原因" v-model="form.remark" maxlength="30" rows="4" show-word-limit />
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
  import { purchaseExamine } from '@/api/purchase/purchase.js'
  let props = defineProps({
    purchaseId: {
      type: Array,
      default: []
    }
  })
  const emit = defineEmits(['closeEvent'])
  let state = reactive({
    ifShow: true,
    form: {
      ids: props.purchaseId,
      type: 3,
      remark: ''
    },
    loading: false
  })
  let rules = {
    remark: { required: true, message: '请输入驳回原因', trigger: 'blur' },
  }
  let formRef = ref(null)
  // 关闭弹框
  let closeEvent = (refresh = false) => {
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
    state.form.remark = state.form.remark.trim()
    formRef.value.validate((valid) => {
      if (valid) {
        state.loading = true
        purchaseExamine(state.form).then(res => {
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
  let { ifShow, form, loading } = toRefs(state)
</script>

<style lang="scss" scoped>
</style>
