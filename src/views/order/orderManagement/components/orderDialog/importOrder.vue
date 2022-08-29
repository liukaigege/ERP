<!--
 * @Descripttion: 导入订单
 * @version: 
 * @Author: 朱涛
 * @Date: 2021-07-15 17:01:59
 * @LastEditors: 朱涛
 * @LastEditTime: 2021-07-17 16:15:25
-->

<template>
  <div class="importOrder">
    
    <el-dialog :title="dialogTitle" v-model="dialogVisible" :width="width" @close="close">
       <UploadFile
        :limit="10"
        @getFileList="getFileList"
        :data="fileList"
      
       ></UploadFile>

      <div class="info">
       <p class="infoTitle"><i class="el-icon-warning-outline"></i> 功能说明 </p> 

       <p class="text">1、把「跟踪号」填写给对应的包裹号 </p>
       <p class="text">2、上传成功且库存充足的订单会自动移入到「待发货」 </p>
       <p class="text">3、上传成功库存不足的订单会自动移入到「待打单-缺货」</p>
       <p class="text red">注：是否扣库存未填写的默认为扣库存 </p>
       <p class="text red index" >  是否优先分配库存未填写的默认为不优先</p>
      </div>
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
  import UploadFile from '@/components/uploadFile/index.vue'
import { reactive, toRefs, getCurrentInstance } from 'vue'
  export default {
    components:{UploadFile},
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
        fileList:[]
      })

      const dialogHandOk = () => {
       
      }

      const close = () =>{
        proxy.$parent.dialogVisible = false
     }
      const cancel = () =>{
          proxy.$parent.dialogVisible = false
      }

      const getFileList = val=>{
        console.log(val)
        data.fileList = val
      }
      return {
        ...toRefs(data),
        dialogHandOk,
        cancel,
        close,
        getFileList
      }
    }    
  }
</script>


<style lang="scss" scoped>
.importOrder{
  .infoTitle{
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #606266;
    margin: 20px 0 5px 0;
  }
  .text{
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.65);
    margin-bottom: 5px;
  }
  .red{
    color: #FF3B30;
  }
  .index{
    text-indent: 23px;
  }
}

</style>