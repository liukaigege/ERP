<!--
 * @Descripttion: 'addRemark.vue 新增/修改备注'
 * @version: 2.0
 * @Author: 王新国
 * @Date: 2021-09-18 00:00:00
 * @LastEditors: 王新国
 * @LastEditTime: 2021-09-18 00:00:00
-->
<template>
  <div class="addRemark">
    <el-dialog
      title="商品备注"
      v-model="show"
      width="640px"
      :close-on-click-modal="closeModal"
      :before-close="cancelFn"
    >
      <el-form :model="form">
        <el-form-item label="备注类型:">
          <el-radio-group v-model="form.remarkTypeId">
            <el-radio
              v-for="item in form.radioList"
              :key="item.id"
              :label="item.id"
              >{{ item.name }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注内容:">
          <el-input
            type="textarea"
            :rows="3"
            placeholder="请输入内容"
            :maxlength="100"
            show-word-limit
            v-model="form.content"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancelFn" >取 消</el-button>
          <el-button type="primary" @click="sureFn" 
            >确 定</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import { reactive, toRefs, toRaw } from 'vue'
import { getRemarkNames } from '@/api/order/orderDetail.js'
import { batchAddRemark, addRemark } from '../composables/api.js'
import { ElMessage } from 'element-plus'

export default {
  props: {
    data: {
      type: Object,
      default: {
        content: '',
        remarkTypeId: ''
      }
    },
    goodsId:{
      type:String,
      default:''
    },
    id:{
      type:Number,
      default:0
    }
  },
  setup(props, context) {
    const { remarkTypeId, content } = props.data
    const state = reactive({
      closeModal: false,
      show: true,
      form: {
        remarkTypeId,
        radioList: [],
        content
      },
    })

    
    //获取备注类型数据
    getRemarkNames({useScope:'1'})
      .then(res => {
        if (res.code == 200) {
          state.form.radioList = res.data
        } else {
          ElMessage.warning({ message: res.message })
        }
      })
     

    function cancelFn() {
      context.emit('cancel', false)
    }
    function sureFn() {
      if( !state.form.remarkTypeId ) return ElMessage.warning({ message: '请选择备注类型' })
      if( !state.form.content ) return ElMessage.warning({ message: '请填写备注内容' })
      if(props.id){
        //修改
        addRemark({ remarkTypeId:state.form.remarkTypeId, content:state.form.content, id:props.id})
          .then(res => {
          if (res.code == 200) {
            ElMessage.success({ message: res.message })
            context.emit('cancel', false)
          } 
        })
     
      }else{
        //新增
        batchAddRemark({ remarkTypeId:state.form.remarkTypeId, content:state.form.content, goodsId:props.goodsId })
          .then(res => {
          if (res.code == 200) {
            ElMessage.success({ message: res.message })
            context.emit('cancel', false)
          } 
        })
       
      }
    }
    return {
      ...toRefs(state),
      cancelFn,
      sureFn
    }
  }
}
</script>
<style lang="scss" scoped>
:deep(.el-dialog__body) {
  padding-top: 10px;
}
:deep(.el-radio) {
  margin: 0px 10px 8px 0;
  min-width: 22%;
}
</style>