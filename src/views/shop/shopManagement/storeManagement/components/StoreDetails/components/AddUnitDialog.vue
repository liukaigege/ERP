<template>
<!-- 基本信息 -->
<el-dialog  v-model="show" width="640px" @close="close" :close-on-click-modal="false">
  <template #title>
    <div class="title">
      <a href="javascript:;" :class="{active:active =='pluginRenew'}" @click="active = 'pluginRenew'">插件续费</a>
      <a href="javascript:;" :class="{active:active =='pluginAdd'}" @click="active = 'pluginAdd'">插件新增</a>
    </div>
  </template>
  <component :is="active" :data="data" ref="componentRef"/>
  <template #footer>
    <el-button @click="close">取消</el-button>
    <el-button type="primary" @click="submit">确定</el-button>
  </template>
</el-dialog>
</template>

<script>
import { onMounted, provide, reactive, toRefs } from 'vue'
import pluginAdd from '@/views/shop/shopManagement/storeManagement/components/renewDialog/components/UnitChange.vue'
import pluginRenew from '@/views/shop/shopManagement/storeManagement/components/renewDialog/components/UnitRenew.vue'
export default {
  emits: ['closeEvent', 'detail'],
  props: { data: Object },
  components: { pluginAdd, pluginRenew },
  setup(props, context) {
    const state = reactive({
      show: true,
      active: 'pluginRenew',
      componentRef:''
    })
    provide('close',close)
    provide('search',detail)
    function close() {
      state.show = false
      setTimeout(() => {
        context.emit('closeEvent', 'unitDialogShow')
      }, 500)
    }
    function detail(){
        context.emit('detail')
    }
    function submit(){
        state.componentRef.submit(true)
    }
    return {
      ...toRefs(state),
      close,
      submit,
      detail
    }
  }
}
</script>

<style lang="scss" scoped>
:deep(.w360) {
  width: 360px;
}

:deep(.w243) {
  width: 243px;
}

:deep(.w109) {
  width: 109px;
  margin-left: 8px;
}

::v-deep(.el-date-editor.el-input__inner) {
  width: 360px;
}

::v-deep(.el-date-editor.el-input) {
  width: 360px;
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
