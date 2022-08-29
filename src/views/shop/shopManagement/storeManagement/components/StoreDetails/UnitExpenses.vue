<template>
<el-card class="box-card unitExpenses" shadow="never">
  <template #header>
    <div class="card-header">
      <span>插件开支</span>
      <a href="javascript:;" class="el-icon-plus" @click="unitDialogShow=true" v-if="data.shopStatus!=0"> 编辑</a>
    </div>
  </template>
  <div v-for="(item,index) in data.shopPlugin" :key="index" :class="['form','unitExpenses'+index]" class="formBox">
    <el-form :model="item" ref="form" label-width="120px" :inline="true">
      <div class="flex-form-item">
        <el-form-item label="插件名称:">
          <el-input v-model="item.name" class="w310" disabled></el-input>
          <a href="javascript:;" class="click-a" @click="openDetail(item)">明细<i :class="item.unitDetail?'el-icon-arrow-up':'el-icon-arrow-down'"></i></a>
        </el-form-item>
        <el-form-item label="有效期:">
          <el-input v-model="item.endTime" disabled class="w310"></el-input>
          <a href="javascript:;" class="float-right" @click="delRow(index)" v-if="item.isDel==0">删除</a>
        </el-form-item>
      </div>
    </el-form>
    <DetailsTable :tableData="item.tableData" :tableKey="['name','validity','fee']" @detail="detail" :tableName="['插件名称','有效期','费用']" isDelete :isOpen="item.unitDetail" :className="'unitExpenses'+index" :type="{api:pluginLogDel,callback:detailData,data,item}" />
  </div>
  <AddUnitDialog v-if="unitDialogShow" @closeEvent="closeEvent" :data="data" @detail="detail" />

</el-card>
</template>

<script>
import { onMounted, reactive, toRefs, watch } from 'vue'
import DetailsTable from './components/DetailsTable.vue'
import AddUnitDialog from './components/AddUnitDialog.vue'
import { shopPluginMsg, pluginLogDel } from '@/api/goods/shop.js'
export default {
  components: { DetailsTable, AddUnitDialog },
  props: {
    data: {
      type: Object,
      default: {}
    }
  },
  emits: ['detail'],
  setup(props, context) {

    const state = reactive({
      data: props.data,
      unitDialogShow: false
    })

    watch(() => props.data, val => {
      console.log(val, '插件');
    }, { deep: true })

    function delRow(e) {
      state.data.splice(e, 1)
    }
    // 弹出框关闭事件
    function closeEvent(key) {
      state[key] = false
    }

    function openDetail(item) {
      item.unitDetail = !item.unitDetail
      if (item.unitDetail) {
        detailData(item)
      }
    }

    function detailData(item) {
      shopPluginMsg({ shopId: props.data.shopId, pluginId: item.id }).then(res => {
        item.tableData = res.data
      })
    }

    function detail() {
      context.emit('detail')
    }
    return {
      ...toRefs(state),
      detail,
      delRow,
      closeEvent,
      openDetail,
      pluginLogDel,
      detailData
    }
  }
}
</script>

<style lang="scss" scoped>
.form+.form {
  padding-top: 18px;
}
</style>
