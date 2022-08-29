<template>
<!-- 批量填充组件 -->
<div>

  <div class="batch-input-container" v-if="setpActive==1">
    <div class="batch-input-item">
      <el-checkbox v-model="selects.weight">重量:</el-checkbox>
      <erp-number-input :precision="2" :min="0.01" :max="99999.99" class="batch-input" v-model="output.weight">
        <template #append>g</template>
      </erp-number-input>
    </div>
    <div class="batch-input-item">
      <el-checkbox v-model="selects.length">长:</el-checkbox>
      <erp-number-input :precision="2" :min="0.01" :max="999.99" class="batch-input" v-model="output.length">
        <template #append>cm</template>
      </erp-number-input>
    </div>
    <div class="batch-input-item">
      <el-checkbox v-model="selects.width">宽:</el-checkbox>
      <erp-number-input :precision="2" :min="0.01" :max="999.99" class="batch-input" v-model="output.width">
        <template #append>cm</template>
      </erp-number-input>
    </div>
    <div class="batch-input-item">
      <el-checkbox v-model="selects.height">高:</el-checkbox>
      <erp-number-input :precision="2" :min="0.01" :max="999.99" class="batch-input" v-model="output.height">
        <template #append>cm</template>
      </erp-number-input>
    </div>
  </div>
  <div class="batch-input-container" v-else>
    <div class="batch-input-item">
      <el-checkbox v-model="selects.purchaseWeight">重量:</el-checkbox>
      <erp-number-input :precision="2" :min="0.01" :max="99999.99" class="batch-input" v-model="output.purchaseWeight">
        <template #append>g</template>
      </erp-number-input>
    </div>
    <div class="batch-input-item">
      <el-checkbox v-model="selects.purchaseLength">长:</el-checkbox>
      <erp-number-input :precision="2" :min="0.01" :max="999.99" class="batch-input" v-model="output.purchaseLength">
        <template #append>cm</template>
      </erp-number-input>
    </div>
    <div class="batch-input-item">
      <el-checkbox v-model="selects.purchaseWidth">宽:</el-checkbox>
      <erp-number-input :precision="2" :min="0.01" :max="999.99" class="batch-input" v-model="output.purchaseWidth">
        <template #append>cm</template>
      </erp-number-input>
    </div>
    <div class="batch-input-item">
      <el-checkbox v-model="selects.purchaseHeight">高:</el-checkbox>
      <erp-number-input :precision="2" :min="0.01" :max="999.99" class="batch-input" v-model="output.purchaseHeight">
        <template #append>cm</template>
      </erp-number-input>
    </div>
  </div>
  <div class="batch-input-container mt-20">
    <div class="batch-input-item" v-if="setpActive == 1">
      <el-checkbox v-model="selects.price">默认采购价:</el-checkbox>
      <erp-number-input v-if="setpActive==1" :precision="2" :min="0.01" :max="9999999.99" class="batch-input" v-model="output.price">
        <template #append>CNY</template>
      </erp-number-input>
    </div>
    <div class="batch-input-item" v-else>
      <el-checkbox v-model="selects.purchasePrice">默认采购价:</el-checkbox>
      <erp-number-input :precision="2" :min="0.01" :max="9999999.99" class="batch-input" v-model="output.purchasePrice">
        <template #append>CNY</template>
      </erp-number-input>
    </div>
    <div class="batch-input-item">
      <el-checkbox v-model="selects.purchaseRemark">报价备注:</el-checkbox>
      <el-input class="batch-input" v-if="setpActive==1" maxlength="500" type="text" v-model="output.purchaseRemark"></el-input>
      <el-input class="batch-input" v-else maxlength="500" type="text" v-model="output.remark"></el-input>
    </div>
    <div class="batch-input-item">
      <el-checkbox v-model="selects.purchaseLink">采购链接:</el-checkbox>
      <el-input class="batch-input"  maxlength="300" type="text" v-model="output.purchaseLink"></el-input>
    </div>
    <div class="batch-input-item" v-if="setpActive==1">
      <el-checkbox v-model="selects.purchaseBy">采购员:</el-checkbox>
      <el-button :disabled="!selects.purchaseBy" @click="showPurchaseUserDialog = true" type="text">{{!output.purchaseBy ? '未设置' : output.purchaseByUser}}</el-button>
    </div>
    <el-button class="batch-input-button" type="primary" @click="batchInput">批量填充</el-button>
  </div>
  <purchase-user-dialog v-if="showPurchaseUserDialog" @close="changePurchaseBy"></purchase-user-dialog>
</div>
</template>

<script>
import { reactive, toRefs, watch } from 'vue'
import { ElMessage } from 'element-plus'
import ErpNumberInput from '@/components/erpNumberInput/index.vue'
import PurchaseUserDialog from './PurchaseUserDialog.vue'

export default {
  components: { ErpNumberInput, PurchaseUserDialog },
  props: {
    defaultSelect: {
      type: Boolean,
      default: true
    },
    showLink: {
      type: Boolean,
      default: true
    },
    showRemark: {
      type: Boolean,
      default: true
    },
    setpActive: {
      type: Number,
      default:1
    }
  },
  setup(props, ctx) {
    const state = reactive({
      output: {
        weight: '',
        length: '',
        width: '',
        height: '',
        price: '',
        purchaseLink: '',
        purchaseRemark: '',
        purchaseBy: '',
        purchaseByUser: '',
        // 第二份
        purchaseWeight: '',
        purchaseLength: '',
        purchaseWidth: '',
        purchaseHeight: '',
        remark:'',
      },
      selects: {
        weight: props.defaultSelect,
        length: props.defaultSelect,
        width: props.defaultSelect,
        height: props.defaultSelect,
        price: props.defaultSelect,
        purchaseLink: props.defaultSelect,
        purchaseRemark: props.defaultSelect,
        purchaseBy: props.defaultSelect,
        purchaseByUser: props.defaultSelect,
        purchaseWeight: props.defaultSelect,
        purchaseLength: props.defaultSelect,
        purchaseWidth: props.defaultSelect,
        purchaseHeight: props.defaultSelect,
        remark: props.defaultSelect,
        purchasePrice:props.defaultSelect
      },
      showPurchaseUserDialog: false
    })

    watch(() => state.selects.purchaseBy, _ => {
      state.selects.purchaseByUser = state.selects.purchaseBy
    })

    watch(()=>props.setpActive,val=>{
      state.output.purchaseLink = ''
    })

    function changePurchaseBy(flag, obj) {
      if (flag) {
        Object.assign(state.output, obj)
      }
      state.showPurchaseUserDialog = false
    }

    function batchInput() {
      const idx = Object.keys(state.selects).findIndex(key => state.selects[key])
      if (idx === -1) {
        ElMessage.error({ message: '请选择左侧批量填充参数' })
        return false
      }
      const obj = {}
      Object.keys(state.selects).map(key => {
        if (state.selects[key]) {
          obj[key] = state.output[key]
        }
      })
      ctx.emit('submitBatch', obj)
    }

    return {
      ...toRefs(state),
      batchInput,
      changePurchaseBy
    }
  }
}
</script>

<style lang="scss" scoped>
.batch-input-container {
  display: flex;
  align-items: center;

  .batch-input-item {
    display: flex;
    align-items: center;
    margin-right: 10px;

    .batch-input {
      width: 160px;
    }

    :deep(.el-checkbox) {
      margin-right: 10px;
    }
  }
}
</style>
