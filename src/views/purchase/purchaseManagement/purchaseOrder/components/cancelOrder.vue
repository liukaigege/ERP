<template>
	<el-dialog title="取消订单" v-model="ifShow" :width="640" custom-class="myDialog" :close-on-click-modal="false" :destroy-on-close="true" @close="closeEvent">
		<div class="contentView">
			<el-form  :model="form" label-width="100px" :rules="rules" ref="formRef">
        <el-form-item label="取消原因:" prop="reason">
					<el-select v-model="form.reason" style="width: 200px" clearable>
            <el-option :label="item.label" :value="item.value" v-for="(item, index) in reasonType" :key="index"></el-option>
          </el-select>
				</el-form-item>
        <el-form-item label="退款金额:" prop="amount">
				  <el-input-number v-model="form.amount"  style="width: 200px" clearable :controls="false" :min="0" :max="props.payPrice" :precision="2" ></el-input-number>
				</el-form-item>
				<el-form-item label="备注:" prop="remark">
					<el-input type="textarea" placeholder="请输入备注" v-model="form.remark" maxlength="30" rows="4" show-word-limit clearable />
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
import { reactive, toRefs, ref } from 'vue'
import { purchaseCancelReduction } from '@/api/purchase/purchase.js'
import { ElMessage } from 'element-plus'
  let props = defineProps({
    purchaseId: {
      type: Number,
      default: null
    },
    payPrice: {
      type: Number,
      default: 0
    },
    purchaseOrderNumber: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      default: null
    }
  })
  let state = reactive({
    ifShow: true,
    form: {
      id: props.purchaseId,
      type: 1,
      purchaseOrderNumber: props.purchaseOrderNumber,
      status: props.status,
      reason: 1,
      amount: undefined,
      remark: ''
    },
    loading: false
  })
  let reasonType = [
    {
      label: '断货',
      value: 1
    },
    {
      label: '换货',
      value: 2
    },
    {
      label: '退货',
      value: 3
    },
    {
      label: '无效',
      value: 4
    },
    {
      label: '其他',
      value: 5
    }
  ]
  let rules = {
    reason: { required: true, message: '请输入取消原因', trigger: 'blur' },
  }
  let formRef = ref(null)
  const emit = defineEmits(['closeEvent'])
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
    formRef.value.validate((valid) => {
      if (valid) {
        state.loading = true
        purchaseCancelReduction(state.form).then(res => {
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