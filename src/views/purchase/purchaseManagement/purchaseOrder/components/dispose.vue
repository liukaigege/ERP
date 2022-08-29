<template>
  <el-dialog :title="props.type == 1 ? '入库缺货处理' : '入库多收处理'" v-model="ifShow" :width="640" custom-class="myDialog" :close-on-click-modal="false" :destroy-on-close="true" @close="closeEvent">
    <div class="contentView">
      <el-form :model="form" :rules="rules" :label-width="110" ref="formRef">
        <el-form-item label="选择处理方式:" prop="processingMode">
          <el-radio v-model="form.processingMode" :label="1" v-if="props.type == 1">补发</el-radio>
          <el-radio v-model="form.processingMode" :label="2" v-if="props.type == 1 && props.customization != 1">退款</el-radio>
          <el-radio v-model="form.processingMode" :label="4" v-if="props.type == 3">创建采购单</el-radio>
          <el-radio v-model="form.processingMode" :label="3" v-if="props.type == 3">退货</el-radio>
        </el-form-item>
        <el-form-item label="退款金额:" v-if="form.processingMode == 2" prop="processingDesc">
          <el-input-number v-model="form.processingDesc" style="width: 200px" clearable :controls="false" :min="props.totalPrice" :max="9999999.99" :precision="2"></el-input-number>
        </el-form-item>
        <el-form-item label="收件人姓名:" v-if="form.processingMode == 3" prop="receiverName">
          <el-input v-model="form.receiverName" placeholder="请输入收件人姓名" :maxlength="10" clearable style="width: 318px"></el-input>
        </el-form-item>
        <el-form-item label="手机号:" v-if="form.processingMode == 3" prop="phoneNum">
          <el-input v-model="form.phoneNum" placeholder="请输入手机号" :maxlength="11" clearable style="width: 318px"></el-input>
        </el-form-item>
        <el-form-item label="收货地址:" v-if="form.processingMode == 3" prop="shippingAddress">
          <el-input v-model="form.shippingAddress" placeholder="请输入收货地址" :maxlength="50" clearable style="width: 318px"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancelEvent">取消</el-button>
        <el-button type="primary" @click="affirmEvent" :loading="loading">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, toRefs, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { exceptionProcess } from '@/api/purchase/purchase.js'
import { deepCopy } from '@/utils/tool.js'
const props = defineProps({
  id: {
    type: Number,
  },
  type: {
    type: Number,
    default: null
  },
  totalPrice: {
    type: Number,
    default: null
  },
  serialNumber: {
    type: String,
    default: ''
  },
  customization: {
    type: Number
  }
})
const emit = defineEmits(['closeEvent'])
const router = useRouter()
let state = reactive({
  ifShow: true,
  loading: false,
  form: {
    serialNumber: props.serialNumber,
    processingMode: null,
    processingDesc: props.totalPrice,
    receiverName: '',
    phoneNum: '',
    shippingAddress: ''
  }
})
let formRef = ref(null)

let rules = {
  processingMode: { required: true, message: '请选择处理方式', trigger: 'change' },
  processingDesc: { required: true, message: '请填写退款金额', trigger: 'blur' },
  receiverName: { required: true, message: '请填写收件人姓名', trigger: 'blur' },
  phoneNum: { required: true, message: '请填写手机号', trigger: 'blur' },
  shippingAddress: { required: true, message: '请填写收货地址', trigger: 'blur' }
}

// 切换单选按钮
watch(() => state.form.processingMode, (newVal) => {
  state.form.processingDesc = props.totalPrice
  state.form.receiverName = ''
  state.form.phoneNum = ''
  state.form.shippingAddress = ''
  formRef.value.clearValidate()
}, { deep: true })

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
      if (state.form.processingMode !== 4) {
        state.loading = true
        let params = deepCopy(state.form)
        params.processingDesc = state.form.processingDesc + ''
        exceptionProcess(params).then(res => {
          state.loading = false
          if (res.code == 200) {
            ElMessage.success({ message: '操作成功！', type: 'success' })
            closeEvent(true)
          } else {
            ElMessage.error(res.message)
          }
        }).catch(err => {
          state.loading = false

        })
      } else { //创建采购单
        closeEvent()
        router.push({
          path: '/purchase/purchaseManagement/createOrder',
          query: {
            id: props.id,
            serialNumber: props.serialNumber
          }
        })
      }
    } else {
      ElMessage.error('信息填写错误，提交失败')
    }
  })
}

let { ifShow, loading, form } = toRefs(state)
</script>

<style lang="scss" scoped>
:deep(.el-radio) {
  margin-right: 20px;
}
</style>
