<!--
 * @Descripttion: 切换支付
 * @version: 
 * @Author: 朱涛
 * @Date: 2021-07-15 17:01:59
 * @LastEditors: 韦剑
 * @LastEditTime: 2021-08-13 17:48:24
-->

<template>
  <div>
    <el-dialog :title="dialogTitle" v-model="dialogVisible" :width="480" :close-on-click-modal="false" :destroy-on-close="true" @close="close">
      <div>
        <el-form  :model="form" :rules="rules" label-width="130px" ref="formRef">
          <el-form-item label="选择支付方式:" prop="payType">
             <el-cascader
              v-model="form.payType"
              :options="options"
              :props="props"
              @change="handleChange"
              style="width: 100%">
            </el-cascader>
          </el-form-item>
          <el-form-item label="订单金额(USD):" prop="payPrice">
            <el-input-number :precision="2" v-model="form.payPrice" controls-position="right" :min="0" :max="999999.99" style="width: 100%"></el-input-number>
          </el-form-item>
        </el-form>
      </div>
      <template #footer >
        <span class="dialog-footer">
          <el-button  @click="cancel">取 消</el-button>
          <el-button type="primary"  @click="dialogHandOk">保 存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, toRefs, getCurrentInstance, onMounted, ref, inject } from 'vue'
import { paymethods, paymentStatus } from '@/api/order/orderManagement.js'
import { ElMessage } from 'element-plus'
  export default {
    props:{
      dialog:{
        type:Object,
        default:null
      },
      dialogTitle:{
        type:String,
        default:'提示'
      },
      dialogVisible:{
        type:Boolean,
        default:false
      },
      width:{
        type:String,
        default:'480'
      },
      data:{
        type:Object,
        default:true
      }
    },
    setup(props,context){
      const {proxy} = getCurrentInstance()
      const formOptions = inject('formOptions')
      console.log(props.data)
      let state = reactive({
        form: {
          payType: '',
          payPrice: undefined
        },
        options: [],
        props: { 
          expandTrigger: 'hover',
          value: 'paymentType',
          label: 'paymentType',
          children: "paymentMethods"
        },
        rules: {
          payType: [
            { required: true, message: '请选择支付方式', trigger: 'blur' }
          ],
          payPrice: [
            { required: true, message: '请填写订单金额', trigger: 'blur' }
          ]
        }
      })
      let formRef = ref(null)
      const dialogHandOk = () => {
        formRef.value.validate((valid) => {
          if (valid) {
            let params = {
              packageId: props.data.packageIds,
              paymentType: state.form.payType[0],
              paymentMethod: state.form.payType[1],
              totalPrice: state.form.payPrice
            }
            paymentStatus(params).then(res => {
              if (res.code == 200) {
                ElMessage.success({ message: '变更成功', type: 'success' })
              } else {
                ElMessage.error(res.message)
              }
              formOptions.value.init()
              close()
            }).catch(err => {
            
              close()
            })
          } else {
            ElMessage.error('信息填写错误，提交失败')
          }
        })
      }
      
      let getPaymethods = () =>{
        paymethods().then(res => {
          if (res.code == 200) {
            res.data.forEach(item => {
              let arr = []
              item.paymentMethods.forEach(it => {
                arr.push({
                  paymentType: it,
                })
              })
              item.paymentMethods = arr
            })
            console.log(res.data)
            state.options = res.data
          }
        })
      }
      let handleChange = (value) => {
        formRef.value.clearValidate(['payType'])
        console.log(value);
      }

      onMounted(() => {
        getPaymethods()
      })

      const close = () =>{
        proxy.$parent.dialogVisible = false
      }

      const cancel = () =>{
        proxy.$parent.dialogVisible = false
      }

      return {
        ...toRefs(state),
        formRef,
        dialogHandOk,
        cancel,
        close,
        handleChange
      }
    }    
  }
</script>


<style lang="scss" scoped>

</style>