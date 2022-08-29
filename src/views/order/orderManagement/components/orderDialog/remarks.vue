<!--
 * @Descripttion: 备注
 * @version: 
 * @Author: 朱涛
 * @Date: 2021-07-15 17:01:59
 * @LastEditors: 朱涛
 * @LastEditTime: 2021-08-22 14:48:34
-->

<template>
  <div>
    
    <el-dialog :title="dialogTitle" v-model="dialogVisible" :width="width" @close="close">
       <div class="remarks">
         <el-form :model="form" style="width:80%">
           <el-form-item label="备注类型：" class="setLineHeight">
              <el-radio-group v-model="form.type" class="radioBox">
                <el-radio class="radioItem" :label="item.id" v-for="(item,index) in remarkNames" :key="index">{{item.name}}</el-radio>
              
              </el-radio-group>
           </el-form-item>
           <el-form-item label="备注内容：">
            <el-input
            type="textarea"
            :rows="3"
            placeholder="请输入内容"
            maxlength="100"
            v-model="form.content">
          </el-input>
             </el-form-item>

         </el-form>

       </div>
      <template #footer >
        <span class="dialog-footer">
          <el-button  @click="cancel"
            >取 消</el-button 
          >
          <el-button type="primary"  @click="dialogHandOk"
            :loading="loading"
            >确 定</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, toRefs, getCurrentInstance, onMounted,inject } from 'vue'
import {remarkTypeNames,saveRemark,getRemarkTypes} from '@/api/order/orderManagement.js'
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
        default:'30%'
      },
      data:{
        type:Object,
        default:null
      },
    },
    setup(props,context){
      const {proxy} = getCurrentInstance()
      const formOptions = inject('formOptions')
      // 获取的formOptions 组件
      const orderTable = inject('orderTable')
      const data = reactive({
            remarkNames:[],
            form:{
              type:null,
              content:''
            },
            loading:false
      })

      const dialogHandOk = () => {
            data.loading = true
            const {packageIds} = props.data
            const {type,content} = data.form
            if(!type){
              proxy.$message.warning('请选择备注类型')
              return 
            }
            const param = {
              packageIds,
              typeId:type,
              content:content
            }
            saveRemark(param).then(res=>{
              if(res.code == 200){
                proxy.$message.success(res.message)
                formOptions.value.init()
                cancel()
              }
            }).finally(v=>{
              console.log(v)
              data.loading = false
            })
      } 

      
      const getRemark = () =>{
        getRemarkTypes({useScope:'0'}).then(res=>{
          if(res.code == 200){
            data.remarkNames = res.data
            data.remarkNames[0] ? data.form.type =  data.remarkNames[0].id : ''
          }
        })
      } // 获取备注

      const close = () =>{
        proxy.$parent.dialogVisible = false
        data.form = proxy.rest(data.form,{type:data.remarkNames[0] ? data.remarkNames[0].id :null})
     }
      const cancel = () =>{
          proxy.$parent.dialogVisible = false
          data.form = proxy.rest(data.form,{type:data.remarkNames[0] ? data.remarkNames[0].id :null})
      }

      onMounted(()=>{
        getRemark()
      })
      return {
        ...toRefs(data),
        dialogHandOk,
        cancel,
        close
      }
    }    
  }
</script>


<style lang="scss" scoped>
  :deep(.el-dialog__body){
    padding: 0;
  }
  .remarks{
    padding: 10px 20px;
      :deep(.el-radio){
        line-height: 36px;
      }
  }
  .radioBox{
    width: 100%;
  }
  .radioItem{
    width: 19%;
  }
</style>