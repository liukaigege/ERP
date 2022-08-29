<template>
<!-- 域名开支 域名更改弹框 -->
<el-dialog title="修改域名" v-model="show" width="640px" @close="close" :close-on-click-modal="false">
  <template #title>
    <div class="title">
      <a href="javascript:;" :class="{active:active =='domainRenew'}" @click="active='domainRenew'">域名续费</a>
      <a href="javascript:;" :class="{active:active =='domainChange'}" @click="active = 'domainChange'">域名变更</a>
    </div>
  </template>
    
    <div class="renew-dia-box">
      <component :is="active" ref="componentRef" :data="data"/>
    </div>

  <template #footer>
    <el-button @click="close">取消</el-button>
    <el-button type="primary" @click="submit">确定</el-button>
  </template>
</el-dialog>
</template>

<script>
import { onMounted, provide, reactive, toRefs } from 'vue'
import domainChange from '@/views/shop/shopManagement/storeManagement/components/renewDialog/components/DomainChange.vue'
import domainRenew from '@/views/shop/shopManagement/storeManagement/components/renewDialog/components/DomainRenew.vue'
export default {
  props: {
    data: {}
  },
  components:{domainRenew,domainChange},
  emits: ['closeEvent', 'detail'],
  setup(props, context) {
    const state = reactive({
      show: false,
      active: 'domainRenew',
      componentRef:null
    })


    onMounted(() => {
      state.show = true
    })

    provide('close',close)
    provide('search',detail)
    function close() {
      state.show = false
      setTimeout(() => {
        context.emit('closeEvent', 'domainDialogShow')
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
  width: 360px !important;
}

:deep(.w243) {
  width: 243px;
}

:deep(.w109) {
  width: 109px;
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
.renew-dia-box {
  :deep(.el-dialog__body) {
    padding: 0;
  }

  :deep(.el-tabs__item) {
    height: 52px;
    line-height: 52px;
    font-size: 16px;
    margin: 0 20px;
    padding: 0;
  }

  :deep(.w360) {
    width: 360px !important;

    .el-input__inner {
      width: 360px !important;
    }
  }

  :deep(.w243) {
    width: 243px !important;
  }

  :deep(.w109) {
    width: 109px !important;
    margin-left: 8px;
  }
}
</style>
