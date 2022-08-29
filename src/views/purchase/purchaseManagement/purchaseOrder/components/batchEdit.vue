<template>
  <el-dialog v-model="show" title="批量修改" width="480px" @close="closeEvent" :close-on-click-modal="false" :destroy-on-close="true">
    <el-form>
      <el-form-item label="单价：" label-width="90px">
        <el-switch v-model="priceSwitch" :active-value="true" :inactive-value="false" style="margin-right:8px" :disabled="!!(partsFrontSwitch&&partSwitch)"></el-switch>
        <el-input-number v-model="price" :min="0" :max="99999.99" :step="1" :controls="true" :precision="2" :disabled="!priceSwitch"> </el-input-number>
      </el-form-item>
      <el-form-item label="商品属性：" label-width="90px">
        <el-switch v-model="attrSwitch" :active-value="true" :inactive-value="false" style="margin-right:8px"></el-switch>
        <el-select v-model="goodAttribute" style="width:150px" :disabled="!attrSwitch">
          <el-option label="原品" :value="1" />
          <el-option label="相似品" :value="2" />
          <el-option label="替代品" :value="3" />
        </el-select>
      </el-form-item>
      <el-form-item label="数量：" label-width="90px" v-if="customization == 0">
        <el-switch v-model="countSwitch" :active-value="true" :inactive-value="false" style="margin-right:8px"></el-switch>
        <el-input-number v-model="purchaseQuantity" :min="1" :precision="0" style="width: auto" :max="99999" :disabled="!countSwitch"> </el-input-number>
      </el-form-item>
      <el-form-item label="配件金额：" label-width="90px" v-else>
        <el-switch v-model="partsFrontSwitch" :active-value="true" :inactive-value="false" style="margin-right:8px"></el-switch>
        <el-switch v-model="partSwitch" :active-value="true" :inactive-value="false" :disabled="!partsFrontSwitch"></el-switch>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="closeEvent">取消</el-button>
      <el-button type="primary" @click="ok">确定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { onMounted, reactive, toRefs, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
export default {
  props: {
    editRef: {},
  },
  emits: ['close'],
  setup(props, ctx) {
    const route = useRoute()
    const { type, customization } = route.query // type: 1草稿编辑 2未通过编辑 3再次购买 4处理异常
    const state = reactive({
      priceSwitch: false,
      price: 0,
      countSwitch: false,
      purchaseQuantity: 1,
      attrSwitch: false,
      goodAttribute: 1,
      show: true,
      partsFrontSwitch: false,
      partSwitch: false
    })

    watch(() => state.price, (value) => {
      if (customization && !value) state.partSwitch = true
    })
    watch(() => state.partSwitch, (value) => {
      if (customization && value && state.partsFrontSwitch) state.priceSwitch = false
    })
    watch(() => state.partsFrontSwitch, (value) => {
      if (customization && value && state.partSwitch) state.priceSwitch = false
    })

    function closeEvent() {
      state.show = false
      setTimeout(() => {
        ctx.emit('close')
      }, 500)
    }

    function ok() {
      let obj = {}
      if (state.priceSwitch) {
        if (state.price) obj.price = obj.copyPrice = state.price
        else obj.price = 0
      }
      if (customization == 0 && state.countSwitch) obj.purchaseQuantity = state.purchaseQuantity
      if (state.attrSwitch) obj.goodAttribute = state.goodAttribute
      if (customization == 1 && state.partsFrontSwitch) obj.partSwitch = state.partSwitch ? 1 : 0
      if (!Object.keys(obj).length) return ElMessage.error('请打开至少一个开关')
      if (!obj.price && customization == 1 && state.priceSwitch) obj.partSwitch = 1
      let selects = props.editRef.getCheckboxRecords(true)
      selects.forEach(item => {
        item = Object.assign(item, obj)
        if (customization == 1) {
          item.price = !obj.partSwitch ? item.copyPrice : 0
        }
      })
      closeEvent()
    }
    return {
      ...toRefs(state),
      closeEvent,
      ok,
      customization
    }
  }
}
</script>

<style lang="scss" scoped>
.flex {
  display: flex;
  align-items: center;
  margin: 0 0 12px 24px;
}
</style>
