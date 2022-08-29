<!--
 * @Descripttion: 弹框模板
 * @version: 
 * @Author: 朱涛
 * @Date: 2021-07-15 17:01:59
 * @LastEditors: 朱涛（梅溪）
 * @LastEditTime: 2021-10-15 14:25:45
-->

<template>
  <div>
    
    <el-dialog :title="dialogTitle" v-model="dialogVisible" :width="width" @close="close"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    >
       
      <div>
        
        <el-cascader v-model="categoryId" :options="query.categoryList" :props="categoryProps" :show-all-levels="false"  style="width: 340px" clearable></el-cascader>

      </div>

      <template #footer >
        <span class="dialog-footer">
          <el-button  @click="cancel"
            >取 消</el-button 
          >
          <el-button type="primary"  @click="dialogHandOk" :disabled="!categoryId"
            >确 定</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, toRefs, getCurrentInstance } from 'vue'
import ElSelectTree from '@/components/elSelectTree/index.vue'
import {setCategory} from '@/api/goods/addGoods.js'
  export default {
    props:{
      dialog:{
        type:Object,
        default:null
      },
      dialogTitle:{
        type:String,
        default:'设置品类'
      },
      dialogVisible:{
        type:Boolean,
        default:false
      },
      width:{
        type:String,
        default:'30%'
      },
      query:{
          type:Object,
         default:null
      }
    },
    components:{ElSelectTree},
    setup(props,context){
      const {proxy} = getCurrentInstance()
      const data = reactive({
            categoryId:null,
               categoryProps: {
          value: 'id',
          label: 'name',
          children: 'child',
          emitPath: false
        },
      })
       const treeProps = {
      value: 'id',
      label: 'name',
      children: 'child'
    }
      const dialogHandOk = () => {
            if(!data.categoryId) {
            proxy.$message.error('请选择品类!')
            }
            const param = {
              goodsId:props.query.goodsIds,
              categoryId:data.categoryId
            }
          setCategory(param).then(res=>{
            if(res.code == 200){
              if(res.data.success){
                context.emit('cancel',true)
                cancel()
              }else{
                
              }
                
            }
          })
      }

      const close = () =>{
        proxy.$parent.showCategory = false
     }
      const cancel = () =>{
          proxy.$parent.showCategory = false
      }
    function treeChecked(val) {
        data.categoryId = val
    }


      return {
        ...toRefs(data),
        dialogHandOk,
        cancel,
        close,
        treeChecked,
        treeProps
      }
    }    
  }
</script>


<style lang="scss" scoped>

</style>