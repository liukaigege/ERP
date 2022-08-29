<template>
<div>
  <erpNav title="商品详情" :routeOpt="{name:'commodityManagement',params: { username: 'eduardo' }}" />
  <div class="tabsBox">
    <el-tabs v-model="activeName">
      <el-tab-pane label="商品信息" name="commodityInfo"></el-tab-pane>
      <el-tab-pane label="供应商信息" name="supplierInfo"></el-tab-pane>
      <el-tab-pane label="库存信息" name="stockInfo"></el-tab-pane>
      <el-tab-pane label="备注信息" name="remarksInfo"></el-tab-pane>
      <el-tab-pane label="日志" name="journal"></el-tab-pane>
    </el-tabs>
    <div class="btnBox">
      <el-button type="primary"  v-if="activeName == 'supplierInfo' && !supplierInfoEdit" @click="supplierInfoEditEvent" v-permission="'editSupplier'">编辑供应商</el-button>
      <el-button type="primary"  v-if="activeName == 'supplierInfo' && supplierInfoEdit" @click="supplierSubmit">保存</el-button>
      <el-button type="primary"  v-if="activeName == 'supplierInfo' && supplierInfoEdit" @click="supplierCancel">取消编辑</el-button>
      <el-button type="primary"  v-if="activeName == 'remarksInfo'" @click="remarksDialog = true" v-permission="'addRemark'">添加备注</el-button>
    </div>
  </div>
  <div style="margin-top:64px">
    <component :is="activeName" ref="supplier"></component>
  </div>
  <addRemarks v-if="remarksDialog" @closeEvent="close" @search="remSearch"/>
</div>
</template>

<script>
import erpNav from '@/components/erpNav/index.vue'
import commodityInfo from './components/detail/commodityInfo.vue' //商品信息
import supplierInfo from './components/detail/supplierInfo.vue' //供应商信息
import stockInfo from './components/detail/stockInfo.vue' // 库存信息
import remarksInfo from './components/detail/remarksInfo.vue' // 备注信息
import journal from './components/detail/journal.vue' // 日志
import addRemarks from './components/detail/components/addRemarks.vue'
import { provide, reactive, toRefs, ref, onMounted } from 'vue'
import { ElMessageBox,ElMessage} from 'element-plus'

export default {
  components: { erpNav, commodityInfo, supplierInfo, stockInfo, remarksInfo, journal, addRemarks },
  setup() {
    
    const state = reactive({
      activeName: "commodityInfo",
      remarksDialog: false, // 添加备注弹框
      supplier: null ,// 供应商的ref
    })


    let supplierInfoEdit = ref(false)
    provide('supplierInfoEdit', supplierInfoEdit)
    function close(key) {
      state[key] = false
    }

    function supplierCancel() {
      ElMessageBox.confirm( '确定取消编辑将会清除编辑数据！',
        '取消编辑',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error',
        }).then(res=>{
          supplierInfoEdit.value = false
          state.supplier.resetData()
        })
      
    }

    function supplierSubmit() {
      state.supplier.supplierUp()
    }

    function supplierInfoEditEvent() {
      if(state.supplier.data.length){
        supplierInfoEdit.value = true
      }else{
        ElMessage.error('无可编辑项')
      }

    }
    function remSearch(){
     state.supplier.search()
    }
    return {
      ...toRefs(state),
      close,
      supplierInfoEdit,
      supplierCancel,
      supplierSubmit,
      supplierInfoEditEvent,
      remSearch
    }
  }
}
</script>

<style lang="scss" scoped>
.tabsBox {
  z-index: 99;
  position: fixed;
  left: var(--sideBarWidth);
  width: calc(100% - var(--sideBarWidth));
  top: 186px;

  ::v-deep(.el-tabs__header) {
    background-color: #fff;

    .el-tabs__item {
      padding-left: 20px;
      font-size: 16px;
    }
  }

  .btnBox {
    position: absolute;
    right: 24px;
    top: 0;
  }
}
</style>
