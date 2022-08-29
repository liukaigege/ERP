<!--
* @Descripttion: Vango ERP outboound 出库数量弹框
* @version: 1.0
* @Author: 王新国
* @Date: 2021-11-01 15:16:38
* @LastEditors: 王新国
* @LastEditTime: 2021-11-01 17:07:46
-->
<template>
  <div>
    <el-dialog
      title="出库数量"
      v-model="dialogVisible"
      width="800px"
      @closed="handleClose"
      :close-on-click-modal="false"
    >
      <div>
        <div class="outbooundHeader">
          <div class="headerLeft">
            <span>选择分区：</span>
            <el-select
              v-model="value"
              placeholder="请选择"
              
              clearable
              @change="changeArea"
            >
              <el-option
                v-for="item in wareHouseArea"
                :key="item.id"
                :label="item.areaName"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </div>
          <div class="headerRight">
            <span>共计 </span>
            <span class="blueColor">{{ data.data.quantity }}</span>
            <span> 件</span>
          </div>
        </div>
        <vxe-table
          ref="myTable"
          keep-source
          align="center"
          :max-height="500"
          show-overflow
          :export-config="{}"
          :scroll-y="{ enabled: true, gt: 20 }"
          highlight-hover-row
          :auto-resize="true"
          :data="data.data.detailList"
          border
        >
          <vxe-table-column field="gridName" title="货架位"> </vxe-table-column>
          <vxe-table-column field="areaName" title="所属分区">
          </vxe-table-column>
          <vxe-table-column field="availableQuantity" title="可用库存">
            <template #header>
              <div>
                <span>可用库存 </span>
                <el-tooltip placement="top-start" :offset="10">
                  <template #content>
                    <span>不包括订单占用库存</span>
                  </template>
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </div>
            </template>
          </vxe-table-column>
          <vxe-table-column title="出库数量">
            <template #default="{ row }">
              <div>
                <el-input-number
                  v-model="row.quantity"
                  controls-position="right"
                  :min="0"
                  :max="row.availableQuantity"
                  @change="quantityChange"
                  
                ></el-input-number>
              </div>
            </template>
          </vxe-table-column>
        </vxe-table>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false" 
            >取 消</el-button
          >
          <el-button type="primary" @click="ok" >确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import { reactive, toRefs } from 'vue'
import { deepCopy } from '@/utils/tool.js'
export default {
  props: {
    wareHouseArea: Array,
    outbooundData: Object
  },
  setup(props, { emit }) {
    console.log(props.outbooundData)
    const data = deepCopy(props.outbooundData)
    data.data.detailList.forEach(v => {
      if (!v.quantity) v.quantity = 0
    })
    const state = reactive({
      dialogVisible: true,
      value: null,
      data
    })
    function changeArea() {
      const obj = deepCopy(data)
      if (state.value) {
        obj.data.detailList = data.data.detailList.filter(
          v => v.areaId === state.value
        )
      }
      state.data = obj
      quantityChange()
    }
    function handleClose() {
      state.dialogVisible = false
      emit('ok', false)
    }
    function ok() {
      const obj = deepCopy(data)
      obj.data.quantity = 0
      const list = deepCopy(data).data.detailList.map(v => {
        if (state.data.data.detailList.find(val => v.gridId == val.gridId)) {
          v.quantity = state.data.data.detailList.filter(
            val => v.gridId == val.gridId
          )[0].quantity
          obj.data.quantity += v.quantity
        }
        return v
      })
      obj.data.detailList = list
      state.dialogVisible = false
      emit('ok', obj)
    }

    function quantityChange() {
      state.data.data.quantity = 0
      state.data.data.detailList.forEach(
        v => (state.data.data.quantity += v.quantity - 0)
      )
    }
    return {
      ...toRefs(state),
      handleClose,
      ok,
      quantityChange,
      changeArea
    }
  }
}
</script>
<style lang='scss' scoped>
.outbooundHeader {
  display: flex;
  margin-bottom: 20px;
  .headerLeft {
    flex: 2;
  }
  .headerRight {
    flex: 1;
    text-align: right;
    .blueColor {
      color: #1890ff;
    }
  }
}
</style>