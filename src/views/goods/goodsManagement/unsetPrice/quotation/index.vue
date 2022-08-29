<template>
<div>
  <erpNav title="申请报价结果" :routeOpt="routeOpt" ref="erpNavRef" />
  <div class="tableBox">
    <div style="display:flex;justify-content: space-between;align-items:center">
      <div>
        <p>共{{count}}个商品，其中：</p>
        <p>{{successStrip}}个申请报价成功</p>
        <p class="tips-d">{{count - successStrip}}个商品存在相似被拦截，可【申请商品权限】或【继续申请报价】</p>
      </div>
      <div>
        <el-button type="primary" size="small" @click="batchApply">申请报价</el-button>
      </div>
    </div>
    <el-table ref="tableRef" :data="tableData" border :header-cell-style="{color:'#000'}" @select-all="selectAllEvent" @select="selectChangeEvent">
      <el-table-column type="selection" width="60" align="center" :selectable="selectable"></el-table-column>
      <el-table-column prop="img" label="图片" align="center" width="150px">
        <template #default="{row}">
          <div class="flex-item-c">
            <el-image :src="row.mainImgUrl" fit="contain" style="width:80px;height:80px"></el-image>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="img" label="商品名称" align="center">
        <template #default="{row}">
          <p class="textOverflow_2" :title="row.nameEn">
            {{row.nameEn}}
          </p>
        </template>
      </el-table-column>
      <el-table-column prop="categoryName" label="品类" align="center"></el-table-column>
      <el-table-column prop="" label="结果" align="center">
        <template #default="{row}">
          <p style="color:#555555A5" v-if="row.historyStatus == '1'">已申请报价</p>
          <p style="color:#D9001B" v-if="row.historyStatus == '0'">申请报价商品存在相似品</p>
          <p style="color:#D9001B" v-if="row.historyStatus == '2'">相似品<span style="color:#555555A5">（已申请报价）</span></p>
          <p style="color:#D9001B" v-if="row.historyStatus == '3'">相似品<span style="color:#555555A5">（已开通权限，可复制商品编码在【{{row.goodsPosition}}】中搜索查看该激活商品）</span></p>
        </template>
      </el-table-column>
      <el-table-column prop="" label="操作" align="center">
        <template #default="{row}">
          <div class="column">
            <el-button type="text"  @click="openDialog(row)" v-if="row.historyStatus=='0'">查看申请权限</el-button>
            <!-- <el-button type="text"  @click="applyCheck(row)" v-if="row.historyStatus=='0'">继续申请报价</el-button> -->
            <el-button type="text"  v-copy="row.authId" v-if="row.historyStatus == '3'">复制商品编码</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <beSimilar v-if="beSimilarShow" @closeEvent="beSimilarShow = false" :data="checkData" @success="openSuccess" />
  <success v-if="successShow" @closeEvent="successShow = false" :data="checkData" />
</div>
</template>

<script>
import erpNav from '@/components/erpNav/index.vue'
import { computed, onMounted, reactive, toRefs } from 'vue'
import beSimilar from './components/beSimilar.vue'
import success from './components/success.vue'
import { quotationApplyCheck } from '@/api/goods/quotedPrice.js'
import { storage } from '@/utils/storage.js'
import { ElMessage } from 'element-plus'
export default {
  name: 'unsetPriceQuotation',
  components: { erpNav, beSimilar, success },
  setup() {
    const state = reactive({
      routeOpt: {
        path: '/goods/goodsManagement/unsetPrice'
      },
      tableData: [],
      count: 0,
      successStrip: 0,
      checkData: {},
      beSimilarShow: false,
      successShow: false,
      selectList: [],
      erpNavRef:null,
      tableRef:null
    })
    onMounted(() => {
      state.tableData = JSON.parse(storage.get('quotation'))
      state.count = state.tableData.length
      state.successStrip = state.tableData.filter(item => item.historyStatus == '1').length
    })

    function openDialog(row) {
      state.checkData = row
      state.beSimilarShow = true
    }

    function applyCheck(row) {
      quotationApplyCheck({
        goodsIds: [row.goodsId]
      }).then(res => {
        row.historyStatus = '2'
        changeStorage()
      })
    }

    function changeStorage() {
      storage.set('quotation', JSON.stringify(state.tableData))
    }

    function openSuccess() {
      changeStorage()
      state.successShow = true
    }

    function selectAllEvent(e) {
      state.selectList = e
    }

    function selectChangeEvent(e) {
      state.selectList = e
    }

    function batchApply() { // 批量报价
      if (!state.selectList.length) return ElMessage.error('请选择相似品')
       quotationApplyCheck({
        goodsIds: state.selectList.map(item=>item.goodsId)
      }).then(res => {
        // state.selectList.forEach(item=>{
        //   item.historyStatus = '2'
        // })
        // changeStorage()
        // state.tableRef.clearSelection()
        // state.selectList = []
        ElMessage.success('申请报价成功')
        state.erpNavRef.go()
      })
    }

    function selectable(row) {
      return row.historyStatus == '0'
    }
    return {
      ...toRefs(state),
      openDialog,
      applyCheck,
      openSuccess,
      selectAllEvent,
      selectChangeEvent,
      batchApply,
      selectable
    }
  }
}
</script>

<style lang="scss" scoped>
.tableBox {
  margin-top: 24px;
  padding: 16px;
  background-color: #fff;
}

.tips-d {
  color: #D9001B;
  margin-bottom: 8px;
}

.flex-item-c {
  display: flex;
  align-items: center;
  justify-content: center;
}

.column {
  display: flex;
  flex-direction: column;

  .el-button+.el-button {
    margin-left: 0;
  }
}
</style>
