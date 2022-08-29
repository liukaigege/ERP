<template>
  <div class="page">
    <div class="headBox">采购单信息</div>
    <div class="contentBox">
      <el-form  :inline="true" :label-width="110">
        <div class="myform">
          <el-form-item label="采购单号:">
            <el-input
              v-model="route.query.purchaseOrderNumber"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="商品SKU种类:">
            <el-input v-model="props.info.skuQuantity" disabled></el-input>
          </el-form-item>
          <el-form-item label="采购数量:">
            <el-input v-model="props.info.purchaseQuantity" disabled></el-input>
          </el-form-item>
          <el-form-item label="采购类型:">
            <el-select v-model="props.info.type" style="width: 140px" disabled>
              <el-option
                :label="item.label"
                :value="item.value"
                v-for="(item, index) in purchaseTypeOptions"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="供应商:">
            <el-input v-model="props.info.supplier.name" disabled></el-input>
          </el-form-item>
          <el-form-item label="平台订单号:">
            <el-input v-model="props.info.thirdId" disabled></el-input>
          </el-form-item>
          <el-form-item label="创建时间:">
            <el-input v-model="props.info.createTime" disabled></el-input>
          </el-form-item>
          <el-form-item label="下单时间:">
            <el-input v-model="props.info.submitTime" disabled></el-input>
          </el-form-item>
          <el-form-item label="采购员:">
            <el-input v-model="props.info.purchaseUserName" disabled></el-input>
          </el-form-item>
          <el-form-item label="应付总额:">
            <el-input v-model="props.info.totalAmount" disabled><template #append>￥</template></el-input>
          </el-form-item>
          <el-form-item label="运费:" v-if="!['0', '1', '2'].includes(route.query.status)">
            <el-input v-model="props.info.fee" disabled><template #append>￥</template></el-input>
          </el-form-item>
          <el-form-item label="折扣:" v-if="!['0', '1', '2'].includes(route.query.status)">
            <el-input v-model="props.info.discount" disabled><template #append>￥</template></el-input>
          </el-form-item>
          <el-form-item label="已付总额:" v-if="!['0', '1', '2'].includes(route.query.status)">
            <el-input v-model="props.info.paidAmount" disabled><template #append>￥</template></el-input>
          </el-form-item>
          <el-form-item label="结算方式:">
            <el-select v-model="props.info.settlementType" style="width: 140px" disabled>
              <el-option :label="item.label" :value="item.value" v-for="(item, index) in settlementTypeOptions" :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="税率:">
            <el-input v-model="props.info.taxRate" disabled><template #append>%</template></el-input>
          </el-form-item>
          <el-form-item label="实付金额:">
            <el-input v-model="props.info.actualPaidAmount" disabled><template #append>￥</template></el-input>
          </el-form-item>
          <!-- 1688下显示 -->
          <el-form-item label="1688账号:" v-if="props.info.supplier.partnerType == 2">
            <el-input v-model="props.info.accountNo" disabled></el-input>
          </el-form-item>
          <el-form-item label="收货地址:" v-if="props.info.supplier.partnerType == 2">
            <el-input v-model="props.info.address" disabled></el-input>
          </el-form-item>
          <el-form-item label="备货团队:" v-if="props.info.type == 2">
            <el-input v-model="props.info.toDeptName" disabled></el-input>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { reactive, toRefs, computed } from 'vue'
import { useRoute } from 'vue-router'
let route = useRoute()
let props = defineProps({
  info: {
    type: Object,
    default: {}
  }
})
let supplierType = computed(() => {
  return type => {
    switch (type) {
      case 1:
        return '合作供应商'
      case 2:
        return '1688'
      case 3:
        return '淘宝'
      case 4:
        return '拼多多'
    }
  }
})
// 采购类型（1缺货采购、2备货采购、3多发入库）
let purchaseTypeOptions = [
  {
    label: '缺货采购',
    value: 1
  },
  {
    label: '备货采购',
    value: 2
  },
  {
    label: '多发入库',
    value: 3
  }
]
let settlementTypeOptions = [
  {
    label: props.info.settlementValue
      ? `预付${props.info.settlementValue}${
          props.info.settlementUnit == 1 ? '%' : '元'
        }`
      : '预付',
    value: 1
  },
  {
    label: `账期${props.info.settlementValue}天`,
    value: 2
  },
  {
    label: '货到付款',
    value: 3
  },
  {
    label: '款到发货',
    value: 4
  }
]
let state = reactive({})
</script>

<style lang="scss" scoped>
.page {
  background-color: #fff;
  margin-bottom: 24px;
  border-radius: 2px;
  .headBox {
    padding: 0 24px;
    height: 55px;
    line-height: 55px;
    color: rgba(0, 0, 0, 0.85);
    font-size: 16px;
    border-bottom: 1px solid #e9e9e9;
  }
  .contentBox {
    padding: 18px 24px 0 24px;
    .myform {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      .el-form-item {
        width: 32%;
      }
    }
    .el-input {
      width: 310px;
    }
  }
}
</style>