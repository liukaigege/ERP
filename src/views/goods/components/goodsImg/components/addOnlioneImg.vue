

<template>
  <div>
    
    <el-dialog :title="dialogTitle" v-model="dialogVisible" :width="width" @close="close"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    >

        <div class="addImg">
            <p v-if="multiple">请输入在线图片地址，可一行一个地址批量添加</p>
            <p v-if="!multiple">请输入在线图片地址</p>
            <el-input @blur="blurInput" v-if="multiple" type="textarea" v-model="addressList" placeholder="请输入图片在线地址,必须以http://或者https://开头" rows="8"></el-input>
            <el-input @blur="blurInput" v-if="!multiple" v-model="addressList" placeholder="请输入图片在线地址,必须以http://或者https://开头" ></el-input>
            <div v-if="showErrorMessage" class="color-danger">请输入图片链接</div>

        </div>

      <template #footer >
        <span class="dialog-footer">
          <el-button  @click="cancel"
            >取 消</el-button 
          >
          <el-button type="primary"  @click="dialogHandOk" :disabled="!addressList"
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
        default:'30%'
      },
      multiple:{
         type:Boolean,
        default:true
      }
    },
    setup(props,context){
      const {proxy} = getCurrentInstance()
      const data = reactive({
          addressList:null,
          showErrorMessage: false
      })

            function isNull( str ){
        if ( str == "" ) return true;
        var regu = "^[ ]+$";
        var re = new RegExp(regu);
        return re.test(str);
        } // 判断是否为空或者空格

      const dialogHandOk = () => {
        if(isNull(data.addressList)) {
              proxy.$message.error('请输入正确内容')
              data.addressList = null
              return
            } 
        const list = data.addressList.split(/[(\r\n)\r\n]+/)
        uploadResource({urls:[...new Set(list)]}).then(res=>{
          if(res.code == 200){
            context.emit('uploadOnline',res.data)
            cancel()
          }
        })
      }

      const close = () =>{
        data.addressList = ''
        proxy.$parent.dialogVisible = false
     }
      const cancel = () =>{
        data.addressList = ''
          proxy.$parent.dialogVisible = false
      }

      function blurInput() {
        data.showErrorMessage = !data.addressList
      }

      return {
        ...toRefs(data),
        dialogHandOk,
        cancel,
        close,
        blurInput
      }
    }    
  }
</script>


<style lang="scss" scoped>

.addImg{
  p{
    margin-bottom: 20px;
  }
}
</style>