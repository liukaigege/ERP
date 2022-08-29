<!--
 * @Descripttion: Vango ERP
 * @version: 1.0
 * @Author: 朱涛（梅溪）
 * @Date: 2021-10-13 10:40:41
 * @LastEditors: 朱涛（梅溪）
 * @LastEditTime: 2021-10-24 10:32:46
-->


<template>
  <div>

    <el-dialog :title="dialogTitle" v-model="dialogVisible" :width="width" @close="close"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    >
       <div class="skuContainer">
          <p>请选择关联的主规格</p>

          <div class="box">
            <div class="item" v-for="(element,index) in query" :key="index">
              <div class="itemLeft">
                <p :title="element.fa.name" v-if="element.fa.name">{{element.fa.name.length > 7 ? element.fa.name.slice(0,7)+'...' : element.fa.name}}</p>
                <el-checkbox
                :indeterminate="showIndeter(element)"
                 v-model="element.fa.active"
                 :disabled="!routeOption.add || isDisabled"
                 @change="(val)=> checkAll(val,index)">全选</el-checkbox>
              </div>
              <div class="itemRight">
                <div class="rightCheck" v-for="(item,a) in element.child" :key="a">
                   <el-checkbox @change="val=>checkChild(val,element,index)" v-model="item.active" :disabled="!routeOption.add || isDisabled">
                     <p :title="item.name" v-if="item.name">{{item.name.length > 8 ? item.name.slice(0,8)+'...' : item.name}}</p>
                   </el-checkbox>
                </div>
              </div>
            </div>
          </div>

       </div>
      <template #footer >
        <span class="dialog-footer">
          <el-button  @click="cancel"
            >{{routeOption.add ?'取 消' :'关 闭'}}</el-button
          >
          <el-button type="primary"  @click="dialogHandOk"
            v-if="routeOption.add"
            >确 定</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, toRefs, getCurrentInstance,onMounted,inject, } from 'vue'
  export default {
    props:{
      query:{
        type:Array,
        default:[]
      },
      dialogTitle:{
        type:String,
        default:'关联主规格'
      },
      dialogVisible:{
        type:Boolean,
        default:false
      },
      width:{
        type:String,
        default:'40%'
      },
    },
    setup(props,context){
      const {proxy} = getCurrentInstance()
      const routeOption = inject('routeOption')
			const isDisabled = inject('isDisabled')
      const data = reactive({
          tableData:[]
      })

      const dialogHandOk = () => {
         console.log(props.query)
         context.emit('relationOk',props.query)
         cancel()
      }

      const close = () =>{
        proxy.$parent.showRelation = false
     }
      const cancel = () =>{
          proxy.$parent.showRelation = false
      }

    function checkAll(val,index){
      console.log(1)
        props.query[index].child?.forEach(item=>{
          item.active = val
        })
    }

    function showIndeter(element){
       let num = 0
        element.child?.map(item=>{
            if(item.active) num+= 1
        })
      if( num > 0 && num <  element.child.length) return true
      return false
    }

    function checkChild(val,element,index){
      let x =  element.child?.every(v=> v.active)
      props.query[index].fa.active = x
    }


    onMounted(()=>{
       console.log(routeOption)
       data.tableData = props.query
    })

      return {
        ...toRefs(data),
        dialogHandOk,
        cancel,
        close,
        checkAll,
        showIndeter,
        checkChild,
				isDisabled,
        routeOption
      }
    }
  }
</script>


<style lang="scss" scoped>
.box{
  margin: 10px 0;
  width: 100%;
}
.item{
  display: flex;
  // align-items: center;
  justify-content: flex-start;
  width: 100%;
  border: 1px solid #e8e8e8;
  .itemLeft{
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 18px ;
    background: #f5f7fa;
    border-right: 1px solid #e8e8e8;
    width: 15%;
    p{
      line-height: 32px;
      font-weight: bold;
      margin-bottom: 8px;
    }
  }
  .itemRight{
    width:85%;
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    .rightCheck{
      width: 20%;
      padding: 10px;
    }

  }
}
.item+.item{
      border-top: unset;
}
</style>
