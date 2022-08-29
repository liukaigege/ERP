<template>
<div class="tableBox">
  <el-table :data="tableData" border :header-cell-style="{textAlign:'center',color:'#000000'}" :cell-style="{textAlign:'center'}" @selection-change="handleSelectionChange">
    <el-table-column type="selection" width="55"></el-table-column>
    <el-table-column prop="serialNumber" label="异常单号" width="200">
      <template #default="{row}">
        <p>{{row.serialNumber}}</p>
        <p>{{row.createTime}}</p>
      </template>
    </el-table-column>
    <el-table-column prop="info" label="商品信息" width="450">
      <template #default="{row}">
        <div class="box">
          <div class="img">
            <el-popover placement="right" width="auto" trigger="hover">
              <el-image :src="row.skuImage" fit="contain" style="width:250px;height:250px"></el-image>
              <template #reference>
                <el-image :src="row.skuImage" fit="contain" style="width:70px;height:70px"></el-image>
              </template>
            </el-popover>
          </div>
          <div class="context">
            <p class="col" :label="row.goodsName" :title="row.goodsName" style="color:#000000">{{row.goodsName}}</p>
            <p style="color:#000000">{{row.spe}}</p>
            <p>{{row.skuId}}</p>
            <p>{{row.skuCode}}</p>
          </div>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="type" label="异常类型" width="100">
      <template #default="{row}">
        {{
         type[row.type]
        }}
      </template>
    </el-table-column>
    <el-table-column prop="purchaseOrderNumber" label="采购单号" width="180">
    </el-table-column>
    <el-table-column prop="logisticsId" label="物流单号">
    </el-table-column>
    <el-table-column prop="instockInfo" label="入库信息" width="200">
      <template #default="{row}">
        <p v-for="item in row.instockInfo" :key="item">{{item}}</p>
      </template>
    </el-table-column>
    <el-table-column prop="purchaseAudit" label="采购审核">
      <template #default="{row}">
        {{purchaseAudit[row.purchaseAudit]}}
        <p v-if="row.newPurchaseOrderNumber">新采购单：{{row.newPurchaseOrderNumber}}</p>
      </template>
    </el-table-column>
    <el-table-column prop="processingUserName" label="处理人" v-if="activeTabs == '1'">
      <template #default="{row}">
        <p>{{row.processingUserName}}</p>
        <p>{{row.processingTime}}</p>
      </template>
    </el-table-column>
    <el-table-column prop="id" label="操作" width="90">
      <template #default="{row}">
        <el-button type="text"  v-if="row.purchaseAudit!=1 && activeTabs=='0'" style="color:#1890FF" @click="handle(row)" v-permission="'goHandle'">去处理</el-button>
        <el-button type="text"   v-if="row.purchaseAudit!=1 && activeTabs=='1'" style="color:#1890FF" @click="handle(row)">查看详情</el-button>
      </template>
    </el-table-column>
  </el-table>
  <returnDoods v-if="returnGoodsShow" @closeEvent="closeEvent" :data="dialogData" />
  <warehousing v-if="warehousingShow" @closeEvent="closeEvent" :data="dialogData" />
  <info v-if="infoShow" @closeEvent="closeEvent" :data="dialogData" />
</div>
</template>

<script>
import { reactive, toRefs } from 'vue'
import returnDoods from './returnGoods.vue'
import warehousing from './warehousing.vue'
import info from './info.vue'
export default {
  components: { returnDoods, warehousing, info },
  emits:['checkChange'],
  props: {
    tableData: {},
    activeTabs: {}
  },
  setup(props, ctx) {
    const state = reactive({
      returnGoodsShow: false,
      warehousingShow: false,
      infoShow: false,
      dialogData: null
    })

    let purchaseAudit = {
      1: '待审核',
      2: '多发入库',
      3: '多发退货'
    }
    let type = { 1: '入库缺货', 2: '多收', 3: '多发入库',4:'质检异常' }

    function handle(row) {
      console.log(row.purchaseAudit);

      if (props.activeTabs == 1) {
        state.infoShow = true
      } else {
        switch (row.purchaseAudit) {
          case 3:
            state.returnGoodsShow = true
            break;
          case 2:
            state.warehousingShow = true
            break;
        }
      }
      state.dialogData = row
    }

    function closeEvent(key) {
      state[key] = false
    }

    function handleSelectionChange(e){
      ctx.emit('checkChange',e.map(item=>item.serialNumber))
    }
    return {
      ...toRefs(state),
      handle,
      closeEvent,
      purchaseAudit,
      type,
      handleSelectionChange
    }
  }
}
</script>

<style lang="scss" scoped>
.box {
  display: flex;
  align-items: center;

  .img {
    margin-right: 12px;
    position: relative;
    display: flex;
    align-items: center;
    .smallImg {
      width: 70px;
      height: 70px;
    }

    .bigImg {
      position: absolute;
      display: none;
      width: 250px;
      height: 250px;
      border: 1px solid #e8e8e8;
      z-index: 5;
      top: 0;
      left: 0;
      margin-top: -125px;
      margin-left: 125px;
    }

    &:hover {
      .bigImg {
        display: block;
      }
    }
  }

  .context {
    text-align: left;
  }
}

.tableBox {
  transition: all .4s;
}

.col {
  width: 330px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

::v-deep(.el-table) {
  overflow: unset;

  .cell {
    overflow: unset;
  }

  .el-table__body-wrapper {
    overflow: unset;
  }

  .el-table__body {
    width: 100%;
  }
}
</style>
