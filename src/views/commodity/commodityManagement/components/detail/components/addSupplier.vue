<template>
<el-dialog title="添加供应商" width="480px" @close="close" v-model="show">
  <el-tabs v-model="tabsActive" tab-position="top" @tab-click="tabsChange">
    <el-tab-pane label="1688" name="2" />
    <el-tab-pane label="淘宝" name="3" />
    <el-tab-pane label="拼多多" name="4" />
    <el-tab-pane label="合作供应商" name="1" />
  </el-tabs>

  <el-form :model="formData" label-width="80px" :inline="false"  ref="formRef">
    <el-form-item label="供应商" prop="supplier" :rules="{required:true,message:'请选择供应商',trigger:'blur'}">
      <el-select v-model="formData.supplier" placeholder="请选择供应商" clearable filterable>
        <el-option v-for="item in options" :key="item.name" :label="item.name" :value="item.name">
        </el-option>
      </el-select>
    </el-form-item>
  </el-form>

  <template #footer>
    <el-button @click="close" >取消</el-button>
    <el-button type="primary"  @click="returnGoods">确定</el-button>
  </template>
</el-dialog>
</template>

<script>
import { onMounted, reactive, toRefs } from 'vue'
import { getSupplierList } from '@/api/purchase/supplier.js'
import { useRoute } from 'vue-router'
export default {
  emits: ['closeEvent', 'returnGoods'],
  setup(props, ctx) {
    const route = useRoute()
    const state = reactive({
      show: true,
      tabsActive: '2',
      options: [],
      formData: {
        supplier: ''
      },
      formRef: null
    })

    onMounted(() => {
      searchSupplier()
    })

    function close() {
      state.show = false
      setTimeout(() => {
        ctx.emit('closeEvent')
      }, 500);
    }

    function searchSupplier() { //查询供应商
      getSupplierList({
        page: {
          pageNo: 1,
          pageSize: 9999
        },
        partnerType: state.tabsActive,
      }).then(res => {
        state.options = res.data.dataList
      })
    }

    function tabsChange() {
      state.formData.supplier = ''
      state.options = []
      searchSupplier()
    }

    function returnGoods() {
      state.formRef.validate().then(res => {
        let supplier  = state.options.find(item=>item.name == state.formData.supplier)
        console.log(supplier);
        let obj = {
          supplierName:supplier.name,
          supplierId:supplier.id,
          skuValue: '',
          link:'',
          webAddress:supplier.webAddress,
          storeHomePage:supplier.storeHomePage,
          purchasePrice: '',
          pairInfo: null,
          partnerType: supplier.partnerType,
          minBuyQuantity: '',
          skuCode: '',
          skuId: '',
          defaultFlag: 0,
          thirdPlatformSupplierId:supplier.thirdPlatformSupplierId,
          newest:1,// 0: 默认  1： 新增供应商
          purchasePriceModify:0, // 0：默认 1：修改默认采购价
          minBuyQuantityModify:0,  // 0：默认 1：修改起订量
          oldPurchasePrice:'', // 改前默认采购价
          oldMinBuyQuantity:'', // 改前起订量
          new:true
        }
        ctx.emit('returnGoods', obj)
        close()
      })

    }
    return {
      ...toRefs(state),
      close,
      tabsChange,
      returnGoods,
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep(.el-dialog__body) {
  padding-top: 0;
}
</style>
