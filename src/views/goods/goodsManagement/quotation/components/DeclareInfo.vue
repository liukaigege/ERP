<template>
  <div class="declare-box">
    <vxe-table ref="tableRef" :data="info" v-bind="declareOptions">
      <vxe-column title="规格值" width="150" tree-node>
        <template #default="{ row, $rowIndex }">
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
              <div class="item-box">
                <label>备注：</label>
                <el-input placeholder="请输入备注内容" v-model="row.remark" :maxlength="500"></el-input>
                <el-popconfirm title="确定移除当前商品吗" @confirm="del($rowIndex)">
                  <template #reference>
                    <i class="el-icon-delete"></i>
                  </template>
                </el-popconfirm>
              </div>
            </div>
          </template>
          <template v-else>
            <span class="isNew" v-if="row.isAdd== 1">新</span>
            <span>{{row.speVal}}</span>
          </template>

        </template>
      </vxe-column>
      <vxe-column field="name" title="建议售价（USD）" width="150">
        <template #default="{row}">
          <div> {{calcPrice(row)}}</div>
        </template>
      </vxe-column>
      <vxe-column field="nameCn" title="中文报关名" :edit-render="{name: '$input',props: {maxlength: 80}}"></vxe-column>
      <vxe-column field="nameEn" title="英文报关名" :edit-render="{name: '$input',props: {maxlength: 80}}"></vxe-column>
      <vxe-column field="weight" width="150" title="重量（g）" :edit-render="{name: '$input',props: {type: 'float',min: 0,max: 99999.99,controls: false}}"></vxe-column>
      <vxe-column field="price" width="150" title="价格（USD）" :edit-render="{name: '$input',props: {type: 'float',min: 0,max: 9999.99,controls: false}}"></vxe-column>
      <vxe-column field="material" title="材质" :edit-render="{name: '$input',props: {maxlength: 60}}"></vxe-column>
      <vxe-column field="purpose" title="用途" :edit-render="{name: '$input',props: {maxlength: 60}}"></vxe-column>
      <vxe-column field="customsCode" title="海关编码" :edit-render="{name: '$input',props: {maxlength: 20}}"></vxe-column>
      <vxe-column title="报关属性" width="220" :showOverflow='false'>
        <template #default="{row}">
          <div class="declare-content">
            <div class="declare-item">
              <el-checkbox v-model="row.isElectric" @change="setRow(row,'electricType',$event)">含电</el-checkbox>
              <el-select size='small' v-model="row.electricType" @change="setRow(row)">
                <el-option label='内电' value="含电内电"> </el-option>
                <el-option label='纯电' value="含电纯电"></el-option>
              </el-select>
            </div>
            <el-checkbox v-model="row.isLiquid" @change="setRow(row)">含非液体化妆品</el-checkbox>
            <el-checkbox v-model="row.isSpecial" @change="setRow(row)">特货 (敏感货)</el-checkbox>
          </div>
        </template>
      </vxe-column>
      <vxe-column title="操作" width="200 ">
        <template #default="{ row,}">
          <div>
            <el-dropdown size='samll' @command='batchSet($event,info)' :disabled='row.lgtSwitch == 0'>
              <span class="el-dropdown-link">
                批量填充
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item :command="{row: row,type: 4}" :disabled='row.lgtSwitch == 0 || row.lgtStatch == 1'>同一商品</el-dropdown-item>
                  <el-dropdown-item :command="{row: row,type: 5}" :disabled='row.lgtSwitch == 0 || row.lgtStatch == 1'>所有商品</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </template>
      </vxe-column>
    </vxe-table>
  </div>
</template>
<script>
import { ref } from "vue"
import { declareOptions } from '../composables/tableOptions'
import { batchSet } from '../composables/handle'
export default {
  props: {
    isEdit: Boolean,
    info: Object,
    rate: [Number, String]
  },
  setup(props, ctx) {
    let tableRef = ref(null)
    function validate() {
      return tableRef.value.validate(true)
    }
    function setRow(row, key, $event) {
      if (key) {
        if ($event) row[key] = '含电内电'
        else row[key] = ''
      }
      let attr = [row.isLiquid ? attrObj.isLiquid : '', row.isSpecial ? attrObj.isSpecial : '', row.isElectric && row.electricType ? row.electricType : '']
      row.attr = attr.filter(item => item).join(',')
    }
    function del(index) {
      ctx.emit('del', index)
    }
    function calcPrice(row) {
      let { purchasePrice, freightUsa } = row
      console.log(purchasePrice, freightUsa, props.rate)
      if (purchasePrice && freightUsa) {
        return ((Number(purchasePrice) + Number(freightUsa)) * props.rate / 0.48).toFixed(2)
      }
      return ''
    }

    return {
      declareOptions,
      tableRef,
      del,
      validate,
			batchSet,
      setRow,
      calcPrice
    }
  }
}

</script>
<style lang="scss" scoped>
.row-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .el-icon-delete {
    width: 150px;
    cursor: pointer;
    font-size: 14px;
    margin-left: 15px;
    color: rgba(0, 0, 0, 0.45);
  }
}
.isNew {
  background: red;
  color: #fff;
  margin-right: 5px;
  padding: 3px 5px;
}

.item-box {
  display: flex;
  flex-grow: 1;
  white-space: nowrap;
  align-items: center;
  .item:first-child {
    width: 700px;
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
.required {
  color: #f56c6c;
}

.declare-item {
  display: flex;
  align-items: center;
  margin-right: 15px;
  padding: 5px 0;
  ::v-deep(.el-select) {
    margin-left: 10px;
    width: 90px;
  }
}
.el-dropdown-link {
  color: #1890ff;
  cursor: pointer;
}
.declare-content {
  text-align: left;
}
</style>
