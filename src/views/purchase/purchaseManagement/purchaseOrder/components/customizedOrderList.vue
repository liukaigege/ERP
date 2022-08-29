<template>
  <div>
    <erp-nav title='订单信息' :goBack="goBack"></erp-nav>
    <div class="table-warp" v-setHeight:minHeight='80'>
      <vxe-table @checkbox-change="checkboxChange" :data="tableData" align="center" ref='batchTableRef'>
        <vxe-column type="checkbox" width='40' :class-name="setSkuClass"></vxe-column>
        <vxe-column width="100" :show-overflow="false">
        </vxe-column>
        <vxe-column align="left" title="SKU" min-width="230" :class-name="setSkuClass">
        </vxe-column>
        <vxe-column field="price" title="单价(￥)" width="100">
        </vxe-column>
        <vxe-column field="purchaseCount" title="采购数量" width="100">
        </vxe-column>
        <vxe-column field="purchaseAmount" title="金额(￥)" width="100">
        </vxe-column>
        <vxe-column field="" title="配件金额(￥)" width="120">
        </vxe-column>
        <vxe-column field="storageCount" title="到货数量" width="100">
        </vxe-column>
        <vxe-column field="storageAmount" title="到货金额(￥)" min-width="120">
        </vxe-column>
        <vxe-column field="payAmount" title="已付(￥)" width="100"></vxe-column>
        <vxe-column field="remainAmount" title="剩余可申请金额(￥)" min-width="150">
        </vxe-column>
        <vxe-column field='applyAmount' width="250">
        </vxe-column>
      </vxe-table>
    </div>
    <erp-footer>
      <div class="footer">
      </div>
    </erp-footer>
  </div>
</template>
<script>
import erpNav from '@/components/erpNav/index.vue'
import erpFooter from '@/components/erpFooter/index.vue'
import { useRouter, useRoute } from 'vue-router'
import { reactive, ref, computed, toRefs } from 'vue'
import { ElMessage } from 'element-plus'
import { QuestionFilled } from '@element-plus/icons-vue'
export default {
  components: { erpNav, erpFooter, QuestionFilled },
  setup(props) {
    const router = useRouter()
    const route = useRoute()

    function goBack() {
      router.go(-1)
    }

    return {
      goBack
    }
  }
}

</script>
<style lang="scss" scoped>
.table-warp {
  margin-top: 25px;
  background-color: #fff;
  padding: 25px;
}
.number-flex {
  display: flex;
  .number-flex-button {
    width: 15%;
    margin-left: 5%;
    color: #409eff;
    line-height: 32px;
    cursor: pointer;
  }
}
.footer {
  display: flex;
  justify-content: space-between;
  padding: 0 25px;
}
</style>
