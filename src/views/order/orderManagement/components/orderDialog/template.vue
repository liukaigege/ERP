<!--
 * @Descripttion: 弹框模板
 * @version: 
 * @Author: 朱涛
 * @Date: 2021-07-15 17:01:59
 * @LastEditors: 朱涛
 * @LastEditTime: 2021-08-05 10:00:34
-->

<template>
  <div>
    
    <el-dialog :title="dialogTitle" v-model="dialogVisible" :width="width" @close="close"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    >
       12321
      <template #footer >
        <span class="dialog-footer">
          <el-button  @click="cancel"
            >取 消</el-button 
          >
          <el-button type="primary"  @click="dialogHandOk"
            >确 定</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, toRefs, getCurrentInstance } from 'vue'
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
    },
    setup(props,context){
      const {proxy} = getCurrentInstance()
      const data = reactive({
          
      })

      const dialogHandOk = () => {
       
      }

      const close = () =>{
        proxy.$parent.dialogVisible = false
     }
      const cancel = () =>{
          proxy.$parent.dialogVisible = false
      }

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

</style>