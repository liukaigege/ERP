<!--
 * @Descripttion: 'gift'
 * @version: 2.0
 * @Author: 王新国
 * @Date: 2021-09-11 00:00:00
 * @LastEditors: 王新国
 * @LastEditTime: 2021-09-11 00:00:00
-->
<template>
  <div class="" style="padding: 20px 0">
    <el-table :data="list" style="width: 100%" :border="true">
      <el-table-column
        prop="mainImgUrl"
        label="主图"
        width="100"
        align="center"
      >
        <template #default="{ row }">
          <div style="position: relative">
            <el-popover placement="right-start" trigger="hover" width="auto">
              <el-image
                style="width: 200px; height: 200px"
                :src="row.mainImgUrl"
                fit="contain"
              ></el-image>
              <template #reference>
                <el-image
                  style="width: 70px; height: 70px"
                  :src="row.mainImgUrl"
                  fit="contain"
                >
                  <template #error>
                    <div class="image-slot">
                      <el-image
                        style="width: 70px; height: 70px"
                        fit="contain"
                        :src="errorImage"
                      />
                    </div>
                  </template>
                </el-image>
              </template>
            </el-popover>
            <div
              style="
                position: absolute;
                top: 0;
                right: 0;
                padding: 1px 4px;
                border-radius: 2px;
                background: #1e93ff;
                font-size: 12px;
                color: #fff;
              "
            >
              赠
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="skuCode" label="商品SKU" align="center">
        <template #default="{ row }">
          <el-tooltip placement="top" effect="light">
            <template #content>
              <p style="cursor: pointer" v-copy="row.skuCode">复制</p>
            </template>
            <p>{{ row.skuCode }}</p>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        prop="goodsQuantity"
        label="数量"
        width="190"
        align="center"
      >
        <template #default="{ row }">
          <el-input-number
            v-model="row.goodsQuantity"
            controls-position="right"
            :min="1"
            :max="999"
            @blur="blurChangeNum(row)"
            :precision="0"

          ></el-input-number>
        </template>
      </el-table-column>
      <el-table-column prop="skuValueEn" label="规格" align="center">
        <template #default="{ row }">
          <div class="clearfix goodsInfo" v-if="row.skuValueEn&&row.skuValueEn.length">
            <p v-for="(item,index) in JSON.parse(row.skuValueEn)" :key="index">
              {{ item.spe }}:{{ item.speVal }}
            </p>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="declareAmount"
        label="单品成本价（￥）"
        width="150"
        align="center"
      >
        <template #default="{ row }">
          <el-input
            v-model="row.declareAmount"

            style="width: 100px"
            :readonly="true"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="warehouse" label="仓库" width="180" align="center">
        <template #default="{ row }">
          <el-select
            v-model="row.warehouseId"
            placeholder="请选择"

            style="width: 150px"
          >
            <el-option
              v-for="item in warehouseList"
              :key="item.warehouseId"
              :label="item.warehouseName"
              :value="item.warehouseId"
            >
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="skuId" label="操作" width="100" align="center">
        <template #default="{ row }">
          <el-button
            type="text"
            style="color: red"

            @click="delFn(row.skuId)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { reactive, watch, toRefs } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { warehouseList } from '@/assets/js/staticData.js'
// import { delFn } from '../composables/gift.js'
import { deepCopy } from '@/utils/tool.js'
export default {
  props: {
    data: {
      type: Array,
      default: []
    }
  },
  setup(props, context) {
    console.log(1111,props.data)
    const state = reactive({
      list: props.data
    })
    //删除备注
    function delFn(skuId) {
      ElMessageBox.confirm('确认删除商品？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          props.data = props.data.filter(v => skuId != v.skuId)
          state.list = state.list.filter(v => skuId != v.skuId)
          context.emit('del', state.list)
          ElMessage.success({
            message: '删除成功!'
          })
        })

    }
    function blurChangeNum(item) {
      if (item.goodsQuantity === undefined) {
        item.goodsQuantity = 1
      }
    }
    watch(
      () => props,
      () => {
        state.list = props.data
      },
      { deep: true }
    )
    return {
      ...toRefs(state),
      delFn,
      warehouseList,
      blurChangeNum
    }
  }
}
</script>
<style lang="scss" scoped>
.goodsImage {
  max-height: 70px;
  max-width: 70px;
}
</style>
