<template>
  <div class="logistics-box">
    <vxe-table :data="info" ref='tableRef' v-bind='freightOptions'>
      <vxe-column field="speVal" title="规格值" tree-node min-width="100">
        <template #default="{ row,$rowIndex }">
          <template v-if="row.skus?.length">
            <div class="row-box">
              <div class="item-box">
                <div class="item" :title="row.goodsName">
                  <label>商品名称：</label>
                  <span>{{row.goodsName}}</span>
                </div>
                <div class="item">
                  <label>商品编码：</label>
                  <span>{{row.goodsId}}</span>
                </div>
              </div>
              <el-popconfirm title="确定移除当前商品吗" @confirm="del($rowIndex)">
                <template #reference>
                  <i class="el-icon-delete"></i>
                </template>
              </el-popconfirm>
            </div>
          </template>
          <template v-else>
            <span class="isNew" v-if="row.isAdd== 1">新</span>
            <span>{{row.speVal}}</span>
          </template>
        </template>
      </vxe-column>
      <vxe-column field="goodLwh" width="150">
        <template #header>
          <div>商品体积cm<sup>3</sup></div>
        </template>
        <template #default="{ row }">
          <div>
            {{row.purchaseLWH}}
          </div>
        </template>
      </vxe-column>
      <vxe-column title="SKU开关" width="100" v-if="!isSpecial">
        <template #header>
          <span>SKU开关</span>
          <el-tooltip effect="dark" content="针对暂时空运不到的商品SKU可进行关闭，关闭后仍可继续报价并保留报价信息" placement="top">
            <i style="font-size: 14px" class="el-icon-question"></i>
          </el-tooltip>
        </template>
        <template #default="{row}">
          <el-switch v-model="row.skuSwitch" :active-value='1' :inactive-value='0' :disabled="row.skuStatus || row.lgtStatch == 1"></el-switch>
        </template>
      </vxe-column>
      <vxe-column title="报价开关" width="100" v-if="!isSpecial">
        <template #header>
          <span>报价开关</span>
          <el-tooltip effect="dark" content="针对不符合要求的商品SKU可拒绝报价，关闭后报价信息可不填" placement="top">
            <i style="font-size: 14px" class="el-icon-question"></i>
          </el-tooltip>
        </template>
        <template #default="{row}">
          <el-switch v-model="row.lgtSwitch" :active-value='1' :inactive-value='0' :disabled="row.puhSwitch === 0 || row.lgtStatch == 1" @change='setStatus($event,row)'></el-switch>
        </template>
      </vxe-column>
      <vxe-column field="length" title="长(cm)" width="70">
      </vxe-column>
      <vxe-column field="width" title="宽(cm)" width="70">
      </vxe-column>
      <vxe-column field="height" title="高(cm)" width="70">
      </vxe-column>
      <vxe-column field="vWeight" width="210">
        <template #header>
          <div class="heavy-header">
            <div>
              <span class="required">*</span>
              <span>体积重（g）</span>
            </div>
            <el-select size="small" style="width: 100px" v-model="weight">
              <el-option value="5000"></el-option>
              <el-option value="6000"></el-option>
              <el-option value="7000"></el-option>
              <el-option value="8000"></el-option>
              <el-option value="10000"></el-option>
            </el-select>
          </div>
        </template>
        <template #default='{row}'>
          <div>{{calcWeight(row) }}</div>
        </template>
      </vxe-column>
      <vxe-column field="purchaseWeight" title="重量(kg)" width="120" :formatter="fmtWeight"> </vxe-column>
      <vxe-colgroup title="预估运费（CNY）">
        <vxe-column field="freightUsa" title="美国" width="100" :edit-render="{name: '$input',immediate: true,props: {type:'float', min:0 ,max:9999.99, controls:false}}">
        </vxe-column>
        <vxe-column field="freightCan" title="加拿大" width="100" :edit-render="{name: '$input',props: {type: 'float',min: 0,max: 9999.99,controls: false}}"> </vxe-column>
        <vxe-column field="freightEur" title="欧洲" width="80" :edit-render="{name: '$input',props: {type: 'float',min: 0,max: 9999.99,controls: false}}"> </vxe-column>
        <vxe-column field="freightEatus" title="欧美" width="80" :edit-render="{name: '$input',props: {type: 'float',min: 0,max: 9999.99,controls: false}}"> </vxe-column>
      </vxe-colgroup>
      <vxe-column title="组合品" min-width="150" width="100">
        <template #default="{row}">
          <el-button type="text" v-if="row.combineType == 2" @click="openRelation(row)">查看</el-button>
        </template>
      </vxe-column>
      <vxe-column title="操作" width="150">
        <template #default="{row}">
          <div>
            <el-dropdown size='samll' @command='batchSet($event,info)'>
              <span class="el-dropdown-link">
                批量填充
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item :command="{row: row,type: 1}" :disabled='row.lgtSwitch == 0 || row.lgtStatch == 1'>同一商品</el-dropdown-item>
                  <el-dropdown-item :command="{row: row,type: 2}" :disabled='row.lgtSwitch == 0 || row.lgtStatch == 1'>所有商品</el-dropdown-item>
                  <el-dropdown-item :command="{row: row,type: 3}" :disabled='row.lgtSwitch == 0 || row.lgtStatch == 1'>同一参数</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </template>
      </vxe-column>
    </vxe-table>
    <relation-dialog v-if="showRelation" :info="relationInfo" @close="showRelation = false"></relation-dialog>
  </div>
</template>
<script>
import { ref, nextTick, reactive, toRefs } from "vue"
import erpNumberInput from '@/components/erpNumberInput/index.vue'
import { freightOptions } from '../composables/tableOptions'
import { batchSet } from '../composables/handle'
import RelationDialog from '@/views/components/RelationDialog.vue'
export default {
  props: {
    isEdit: Boolean,
    isQuoted: Boolean,
    info: Object,
    isSpecial: Boolean
  },
  components: { erpNumberInput, RelationDialog },
  setup(props, ctx) {
    let weight = ref(6000)
    let tableRef = ref(null)
    let state = reactive({
      showRelation: false,
      relationInfo: {}
    })
    function validate() {
      return tableRef.value.validate(true)
    }
    function del(index) {
      ctx.emit('del', index)
    }
    function setStatus(v, row) {
      if (row.lgtSwitch === 0) {
        nextTick(() => {
          row.skuSwitch = 0
        })
      }
    }
    function calcWeight(row) {
      let { length, width, height } = row
      if (length && width && height) return ((length * width * height) / weight.value).toFixed(2)
      return ''
    }
    function fmtWeight({ row }) {
      return (row.purchaseWeight / 1000).toFixed(3)
    }
    function openRelation(row) {
      state.showRelation = true
      state.relationInfo = {
        way: 'detail', // 可选值：detail 查看关联 edit 修改关联 add 新增关联
        mainGoodsId: row.goodsId, // 关联组合品商品编码 way 为 edit 和 detail 时必传
        mainSkuId: row.skuId, // 关联组合品的某条skuId way 为 edit 和 detail 时必传
        childGoodsIdList: [],
        goodsSkuCombinationRelation: []
      }
    }

    return {
      freightOptions,
      weight,
      del,
      batchSet,
      validate,
      tableRef,
      setStatus,
      calcWeight,
      fmtWeight,
      openRelation,
      ...toRefs(state)
    }
  }
}

</script>
<style lang="scss" scoped>
.row-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-left: 20px;
  .el-icon-delete {
    cursor: pointer;
    font-size: 14px;
    margin-right: 25px;
    color: rgba(0, 0, 0, 0.45);
  }
}
.isNew {
  background: red;
  color: #fff;
  margin-right: 5px;
  padding: 3px 5px;
}
.el-dropdown-link {
  color: #1890ff;
  cursor: pointer;
}
.item-box {
  display: flex;
  flex-grow: 1;
  white-space: nowrap;
  align-items: center;
  margin-right: 60px;
  .item:first-child {
    width: 900px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .item + .item {
    margin-left: 40px;
  }
  :deep(.el-button) {
    margin-left: 15px;
  }
}
.heavy-header {
  display: flex;
  justify-content: center;
  align-items: center;
}
.item-form {
  margin-bottom: 0;
}
.form-box {
  border-bottom: 1px dashed #e9e9e9;
  ::v-deep(.el-form-item__content) {
    width: 180px;
  }
}
.required {
  color: #f56c6c;
}
</style>
