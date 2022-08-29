

<template>
  <div>
    
    <el-dialog :title="dialogTitle" v-model="dialogVisible" :width="width" @close="close"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    >
       <div>
         <p>请输入YouTube URL</p>
          <el-input v-model="url" placeholder="" ></el-input>
       </div>
      <template #footer >
        <span class="dialog-footer">
          <el-button  @click="cancel"
            >取 消</el-button 
          >
          <el-button type="primary"  @click="dialogHandOk"
          :disabled="!url"
            >确 定</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, toRefs, getCurrentInstance } from 'vue'
import {uploadResource} from '@/api/goods/addGoods.js'
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
            url:null
      })
          function isNull( str ){
        if ( str == "" ) return true;
        var regu = "^[ ]+$";
        var re = new RegExp(regu);
        return re.test(str);
        } // 判断是否为空或者空格

      const dialogHandOk = () => {
            if(isNull(data.url)) {
              proxy.$message.error('请输入嵌入内容')
              data.url = null
              return
            } 
           uploadResource({urls:[data.url]}).then(res=>{
          if(res.code == 200){
             
            context.emit('uploadOnline',res.data)
            cancel()
          }
        })
      }

      const close = () =>{
        proxy.$parent.dialogVisibleVideo = false
     }
      const cancel = () =>{
          proxy.$parent.dialogVisibleVideo = false
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