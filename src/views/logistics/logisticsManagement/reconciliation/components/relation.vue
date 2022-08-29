<template>
<el-dialog :title="status == 'edit'?'编辑':'关联'" v-model="show" width="480px" @close="close" :close-on-click-modal="false">
  <el-form :model="form" :rules="rules" label-width="120px" :inline="false"  ref="formRef">
    <el-form-item label="包裹号:"  prop="packageId">
      <el-input v-model.trim="form.packageId" clearable style="width:280px"  maxlength="50" :disabled="status == 'edit'"></el-input>
    </el-form-item>
    <el-form-item label="物流方式:"  prop="logist">
      <el-cascader :options="logisticList" placeholder="请选择物流方式" :disabled="status == 'edit'" :props="caProps" @change="selectedLogis" v-model="form.logist" style="width: 280px" clearable >
      </el-cascader>
    </el-form-item>
    <el-form-item label="其他物流方式:"  prop="logistics" v-if="form.logist?.[0] == 'isOther'">
      <el-input v-model="form.logisticsName" v-if="status == 'edit'" :disabled="status == 'edit'" maxlength="50" style="width:280px"   clearable></el-input>
      <el-input v-model="form.logistics" v-else  :disabled="status == 'edit'" maxlength="50" style="width:280px"   clearable></el-input>
    </el-form-item>
    <el-form-item label="运单号:"  prop="trackNumber">
      <el-input v-model.trim="form.trackNumber" clearable style="width:280px"  maxlength="50" :disabled="status == 'edit'"></el-input>
    </el-form-item>
    <el-form-item label="折前费用:"  prop="preDiscountExpenses">
      <el-input v-model.trim="form.preDiscountExpenses" clearable style="width:280px"  maxlength="50" :disabled="status == 'edit'&& tabsActive == 'reviewed' ">
        <template #append>
          CNY
        </template>
      </el-input>
    </el-form-item>
    <el-form-item label="物流费用:"  prop="logisticsFee">
      <el-input v-model="form.logisticsFee" clearable style="width:280px"  :disabled="tabsActive=='reviewed'">
        <template #append>
          CNY
        </template>
      </el-input>
    </el-form-item>
    <el-form-item label="额外费用:"  prop="additionalFee">
      <el-input v-model="form.additionalFee"  clearable style="width:280px" :disabled="isAdditionalFee">
        <template #append>
          CNY
        </template>
      </el-input>
    </el-form-item>
    <el-form-item label="物流称重:"  prop="logisticsWeight">
      <el-input v-model="form.logisticsWeight"  clearable style="width:280px"  :disabled="tabsActive=='reviewed'">
        <template #append>
          <span style="color:#F5F7FA">g</span>g<span style="color:#F5F7FA">g</span>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item label="备注:"  >
      <el-input v-model="form.remark" :rows="4" type="textarea" maxlength="200" placeholder="请输入备注" clearable style="width:280px"></el-input>
    </el-form-item>
  </el-form>
  <template #footer>
    <el-button  @click="close">取消</el-button>
    <el-button  type="primary" @click="submit">确定</el-button>
  </template>
</el-dialog>
</template>

<script>
import { onMounted, reactive, toRefs, ref } from 'vue'
import { logisedit } from '../api/api.js'
import { ElMessage } from 'element-plus'
export default {
  emits: ["closeEvent", 'search'],
  props: {
    logisticList: {},
    status: {},
    data: {},
    tabsActive: {}
  },
  setup(props, ctx) {
    const state = reactive({
      show: true,
      formRef: null,
      form: {
        logist: '',
        id: props.data.id,
        packageId: "",
        trackNumber: "",
        logistics: "",
        lgtcLine: "",
        logisticsFee: "",
        additionalFee: "",
        logisticsWeight: "",
        remark: "",
        mode: "",
      },
      isAdditionalFee:false
    })
    onMounted(() => {
      if (props.status == 'edit') {
        state.form = Object.assign(state.form, props.data)
        if (props.data.logistics) state.form.logist = props.data.logistics == 'isOther' ?[props.data.logistics]:[props.data.logistics, props.data.lgtcLine]
      }
      state.form.mode = props.status == 'edit' ? 1 : 2
      state.isAdditionalFee = props.tabsActive == 'reviewed' && Boolean(state.form.additionalFee)
    })
    let caProps = {
      value: 'value',
      label: 'name',
      children: 'billWays',
    }

    const rules = {
      packageId: [
        { required: true, message: '请输入包裹号', trigger: 'blur' }
      ],
      logist: [
        { required: true, message: '请选择物流方式', trigger: ['change', 'blur'] }
      ],
      logistics:[
         { required: true, message: '请输入其他物流方式', trigger: ['change', 'blur'] }
      ],
      trackNumber: [
        { required: true, message: '请输入运单号', trigger: 'blur' }
      ],
      logisticsFee: [{ // 物流费用
        validator: (rule, value, callback) => {
          if (value) {
            let reg = new RegExp(/^(-?\d+)(\.\d+)?$/)
            if(!reg.test(value)||value<0){
              state.form.logisticsFee = 0
              return 
            }
            if (value > 9999.99) {
              state.form.logisticsFee = 9999.99
            }
            state.form.logisticsFee = Number(state.form.logisticsFee).toFixed(2)
          }
          callback()
        },
        trigger: ['blur']
      }],
      additionalFee: [{ // 额外费用
        validator: (rule, value, callback) => {
          if (value) {
            let reg = new RegExp(/^(-?\d+)(\.\d+)?$/)
            if(!reg.test(value)){
              state.form.additionalFee = 0
              return 
            }
            if (value > 9999.99) {
              state.form.additionalFee = 9999.99
            }
            if(value < -9999.99) {
             state.form.additionalFee = -9999.99
            }
            state.form.additionalFee = Number(state.form.additionalFee).toFixed(2)
          }
           callback()
        },
        trigger: ['blur']
      }],
      logisticsWeight: [{ // 物流称重
        validator: (rule, value, callback) => {
          if (value) {
            let reg = new RegExp(/^(-?\d+)(\.\d+)?$/)
            if(!reg.test(value) || value<=0){
              state.form.logisticsWeight = null
              return 
            }
            if (value > 99999) {
              state.form.logisticsWeight = 99999
            } 
            state.form.logisticsWeight = Number(state.form.logisticsWeight).toFixed(0)
          }
           callback()
        },
        trigger: ['blur']
      }],
      preDiscountExpenses: [{ // 物流费用
        validator: (rule, value, callback) => {
          if (value) {
            let reg = new RegExp(/^(-?\d+)(\.\d+)?$/)
            if(!reg.test(value)||value<0){
              state.form.preDiscountExpenses = 0
              return 
            }
            if (value > 9999.99) {
              state.form.preDiscountExpenses = 9999.99
            }
            state.form.preDiscountExpenses = Number(state.form.preDiscountExpenses).toFixed(2)
          }
          callback()
        },
        trigger: ['blur']
      }],
    }

    function close() {
      state.show = false
      setTimeout(() => {
        ctx.emit('closeEvent')
      }, 500);
    }

    function submit() {
      // return console.log(state.form);
      // if((Number(state.form.logisticsFee) + Number(state.form.additionalFee))<0){
      //   return ElMessage.error('物流费用+额外费用不能小于0')
      // }
      state.formRef.validate().then(()=>{
        let data = state.form
        if(props.status == 'edit'&& data.logistics == 'isOther'){
          data = JSON.parse(JSON.stringify(state.form))
          data.logistics = data.logisticsName
        }
        logisedit(data).then(res=>{
         ctx.emit('search')
         ElMessage.success('操作成功')
         close()
        })
      })
      
    }

    function selectedLogis(e) {
      state.form.logistics = null
      state.form.lgtcLine = null
      if(e[0] == 'isOther'){

      }else {
        state.form.logistics = e[0]
        state.form.lgtcLine = e[1]
      }
    }

    return {
      ...toRefs(state),
      close,
      submit,
      selectedLogis,
      caProps,
      rules,
    }
  }
}
</script>

<style>

</style>
