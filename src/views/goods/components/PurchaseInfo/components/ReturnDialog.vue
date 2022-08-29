<template>
  <el-dialog v-model="show" :width="600" title="拒绝报价" :close-on-click-modal="false" :close-on-press-escape="false" @close="closeDialog(false)">
    <el-form :model="form" ref="formRef" :rules="rules">
      <el-form-item prop="reason" label="拒绝原因:" required>
        <el-radio-group v-model="form.reason">
          <el-radio v-for="(value, key) in radios[reasonType]" :key="key" :label="key">{{value}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="remark" label="原因:">
        <el-input type="textarea" maxlength="500" v-model="form.remark"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="justify-end-div">
        <el-button  @click="closeDialog(false)">取消</el-button>
        <el-button  type="primary" @click="submitReason">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { reactive, toRefs } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { rejectQuoteBatch, rejectQuote, validateGoodsStatus } from '@/api/goods/quotation.js'
import { _debounce } from 'tool'

export default {
  emits: ['close'],
  props: {
    selections: {
      type: Array,
      default: [],
      required: true
    },
    reasonType: {
      type: String,
      default: ''
    },
    batchType: {
      type: String,
      default: 'batch'
    }
  },
  setup(props, { emit }) {
    const router = useRouter()
    const route = useRoute()
    const state = reactive({
      show: true,
      form: {
        reason: props.reasonType === 'purchase' ? 'XXBQ' : 'KYJY',
        status: props.reasonType === 'purchase' ? '1' : '2',
        goodsIds: props.selections,
        remark: ''
      },
      rules: {
        reason: [{ required: true, message: '请选择拒绝原因' }],
        remark: [{
          validator(rule, value, callback) {
            state.form.reason === 'QT' && !value ? callback(new Error(rule.message)) : callback()
          }, message: '请填写拒绝原因'
        }, { max: 500, message: '最多输入500个字符' }]
      },
      radios: {
        purchase: {
          XXBQ: '信息不全',
          SPCW: '商品信息错误',
          MYHY: '没有货源',
          QT: '其他'
        },
        logistic: {
          KYJY: '空运禁用品',
          QT: '其他'
        }
      },
      formRef: null
    })

    function closeDialog(refresh) {
      state.show = false
      emit('close', refresh)
    }

    function submitReason() {
      _debounce(() => {
        state.formRef.validate(val => {
          if (val) {
            const form = JSON.parse(JSON.stringify(state.form))
            const reason = state.radios[props.reasonType][form.reason]
            form.reason = reason
            if (form.remark) {
              form.reason = [reason, form.remark].join(' ')
            }
            delete form.remark
            validateGoodsStatus({
              type: props.reasonType === 'purchase' ? 1 : 2,
              goodsIdList: form.goodsIds
            }).then(r => {
              if (r.data?.result) {
                if (props.batchType === 'batch') {
                  rejectQuoteBatch(form).then(r => {
                    ElMessage.success({ message: '操作成功，已拒绝报价' })
                    closeDialog(true)
                  })
                } else {
                  form.goodsId = form.goodsIds[0]
                  delete form.goodsIds
                  rejectQuote(form).then(r => {
                    ElMessage.success({ message: '操作成功，已拒绝报价' })
                    closeDialog(true)
                  })
                }
              } else {
                ElMessageBox.confirm('该商品已被其他用户已完成采购报价流程！', '提示', {
                  confirmButtonText: '确认并退出',
                  closeOnClickModal: false,
                  closeOnPressEscape: false,
                  showCancelButton: false,
                  showClose: false
                }).then(_ => {
                  closeDialog(true)
                  if (route.name !== 'Quotation') {
                    router.push({ name: 'Quotation' })
                  }
                })
              }
            })
          }
        })
      })()
    }

    return {
      ...toRefs(state),
      closeDialog,
      submitReason
    }
  }
}
</script>

<style lang="scss" scoped>
.justify-end-div {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
</style>
