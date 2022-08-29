<template>
<el-dialog title="修改套餐" v-model="show" width="640px" @close="close" :close-on-click-modal="false">
  <template #title>
    <div class="title">
      <a href="javascript:;" :class="{active:active =='platformRenew'}" @click="active = 'platformRenew'">套餐续费</a>
      <a href="javascript:;" :class="{active:active =='platformChange'}" @click="active = 'platformChange'">套餐变更</a>
    </div>
  </template>
  <component :is="active" ref="componentRef" :data="data" />

  <template #footer>
    <el-button @click="close">取消</el-button>
    <el-button type="primary" @click="submit">确定</el-button>
  </template>
</el-dialog>
</template>

<script>
import { onMounted, reactive, toRefs,provide } from 'vue'
import platformChange from '@/views/shop/shopManagement/storeManagement/components/renewDialog/components/StoreChange.vue'
import platformRenew from '@/views/shop/shopManagement/storeManagement/components/renewDialog/components/StoreRenew.vue'
export default {
  emits: ['closeEvent', 'detail'],
  props: {
    data: {
      type: Object
    }
  },
  components: {
    platformRenew,
    platformChange
  },
  setup(props, context) {
    const state = reactive({
      componentRef: null,
      show: false,
      active: 'platformRenew'
    })

    onMounted(() => {
      state.show = true
      props.data.platterName = props.data.shopPlatterName
      props.data.platTime = props.data.shopPlatterEndTime
    })
    provide('close',close)
    provide('search',detail)
    function detail(){
      context.emit('detail')
    }
    function close() {
      state.show = false
      setTimeout(() => {
        context.emit('closeEvent', 'platformDialogShow')
      }, 500)
    }

    function submit() {
        state.componentRef.submit(true)
    }
    return {
      ...toRefs(state),
      close,
      submit
    }
  }
}
</script>

<style lang="scss" scoped>
:deep(.w360) {
  width: 360px !important;
}

.el-date-editor--datetimerange.el-input__inner {
  width: 360px !important;
}

:deep(.w243) {
  width: 243px !important;
}

:deep(.w109) {
  width: 109px !important;
  margin-left: 8px;
}

.el-dialog {
  padding: 0 80px;
}

.title {
  a {
    font-size: 18px;
    margin-right: 30px;
    color: #000;
  }

  .active {
    color: #1890ff
  }

}
</style>
