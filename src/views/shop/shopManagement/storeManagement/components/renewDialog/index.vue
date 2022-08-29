<template>
<div class="renew-dia-box">
  <el-dialog title="续费" width="640px" v-model="show" @close="close" :close-on-click-modal="false">
    <template #title>
      <span :class="{blue:titleActive =='renew',btnCur:true}" @click="titleChange('renew')">续费</span>
      <span :class="{blue:titleActive =='change',btnCur:true}" @click="titleChange('change')">变更</span>
    </template>

    <el-tabs v-model="tabsActive">
      <el-tab-pane :label="item.label" :name="item.component" v-for="item in tabs[titleActive]" :key="item.label">
      </el-tab-pane>
    </el-tabs>
    <component :is="tabsActive" :data="data" ref="componentRef" :upDataRow="upDataRow"/>
    <template #footer>
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="submit(false)">确定并继续</el-button>
      <el-button type="primary" @click="submit(true)">确定</el-button>
    </template>
  </el-dialog>
</div>
</template>

<script>
import { reactive, toRefs,provide } from 'vue'
import DomainRenew from './components/DomainRenew.vue'
import DomainChange from './components/DomainChange.vue'
import StoreRenew from './components/StoreRenew.vue'
import StoreChange from './components/StoreChange.vue'
import UnitRenew from './components/UnitRenew.vue'
import UnitChange from './components/UnitChange.vue'
import {shopManagmentList } from '@/api/goods/shop.js'
export default {
  components: { DomainRenew, StoreRenew, UnitRenew, DomainChange, StoreChange, UnitChange },
  props: {
    data: {
      default: null
    }
  },
  emits: ['close', 'search'],
  setup(props, context) {
    const state = reactive({
      tabsActive: 'DomainRenew',
      titleActive:'renew',
      show: true,
      componentRef:null
    })

    const tabs = {
      renew: [
        { label: '域名续费', component: 'DomainRenew' },
        { label: '套餐续费', component: 'StoreRenew' },
        { label: '插件续费', component: 'UnitRenew' }
      ],
      change: [
        { label: '域名变更', component: 'DomainChange' },
        { label: '套餐变更', component: 'StoreChange' },
        { label: '插件新增', component: 'UnitChange' }
      ]
    }

    function close() {
      state.show = false
      setTimeout(() => {
        context.emit('close')
      }, 500);
    }

    provide('close',close)
    function submit(isClose) {
        state.componentRef.submit(isClose)
    }

    function titleChange(val){
      state.titleActive = val
      if(val=='renew'){
        state.tabsActive = 'DomainRenew'
      }else{
        state.tabsActive = 'DomainChange'

      }
    }

    function upDataRow(){
       shopManagmentList({
              page: {
                pageNo: 1,
                pageSize: 10
              },
              shopId: props.data.shopId,
              searchType: '', // 搜索类别
              keyword: '', // 搜索内容
              source: '', // 平台
              authorStatus: '', //授权状态
              leader: '',
              useDept: '',
              shopStatus: '',
              sortName: 's.open_time',
              type: 'desc',
              payment: '',
              method: '',
              account: ''
            }).then(res => {
              Object.keys(props.data).forEach(key=>{
                props.data[key] = res.data.dataList[0][key]
              })
              props.data.domainEndTime = props.data.domainEndTime.split(' ')[0]
            })
    }
    return {
      ...toRefs(state),
      close,
      submit,
      tabs,
      titleChange,
      upDataRow
    }
  }
}
</script>

<style lang="scss" scoped>
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

.blue {
  color: #1890ff;
}

.btnCur {
  font-size: 18px;
  margin-right: 16px;
  cursor: pointer;
}
</style>
