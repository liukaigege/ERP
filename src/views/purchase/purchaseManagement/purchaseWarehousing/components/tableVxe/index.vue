<template>
  <div class="tabel">
    <vxe-table
      highlight-hover-row
      border
      auto-resize
      max-height="600"
      align="center"
      ref="xTable1"
      :data="data"
      :span-method="colspanMethod"
      :cell-style="cellStyle"
    >
      <vxe-column field="supplierType" width="600" title="商品信息">
        <template #header><span>商品信息</span> </template>
        <template #default="{ row }">
          <div class="cell-header" v-if="row.orderItemsFlag">
            <div class="cell-header--id">{{ row.id }}</div>
            <div class="cell-header--supplierName">
              供应商:【{{ row.supplierType }}】{{ row.supplierName }}
            </div>
            <div class="cell-header-submitTime">
              下单时间： {{ row.submitTime }}
            </div>
          </div>
          <div v-else class="mainImg">
            <div class="left">
              <el-popover placement="right-start" trigger="hover" width="auto">
                <el-image
                  style="width: 200px; height: 200px"
                  :src="row.orderItem.mainImg"
                  fit="contain"
                ></el-image>
                <template #reference>
                  <el-image
                    style="width: 70px; height: 70px"
                    :src="row.orderItem.mainImg"
                    fit="contain"
                  ></el-image>
                </template>
              </el-popover>
            </div>
            <div class="center">
              <el-tooltip placement="top-start">
                <template #content>
                  <p style="cursor: pointer" v-copy="row.orderItem.goodsName">
                    复制
                  </p>
                </template>
                <h3 :title="row.orderItem.goodsName">
                  {{ row.orderItem.goodsName }}
                </h3>
              </el-tooltip>
              <div class="labelTag">{{ row.orderItem.skuValue }}</div>
              <div>
                {{ row.orderItem.skuId }}
              </div>
            </div>
            <div class="right">
              X
              <span class="purchaseQuantity"
                >{{ row.orderItem.purchaseQuantity }} </span
              ><span v-if="row.orderItem.notWarehousedNum">
                - {{ row.orderItem.notWarehousedNum }}</span
              >
            </div>
          </div>
        </template>
      </vxe-column>

      <vxe-column field="storageTime" title="最新入库时间">
        <template #default="{ row }">
          <p
            v-for="(item, index) in storageTimeList(row.orderItem.storageTime)"
            :key="index"
          >
            {{ item }}
          </p>
        </template>
      </vxe-column>
      <vxe-column title="入库信息" field="areaNums">
        <template #default="{ row }">
          <div class="areaNums">
            <p v-for="(item, index) in row.orderItem.areaNums" :key="index">
              <span>{{ item.name }}</span
              >:<span>{{ item.num }}</span>
            </p>
          </div>
        </template>
      </vxe-column>
      <vxe-column title="操作" class-name="option" width="200">
        <template #default="{ row, rowIndex, columnIndex }">
          <el-button type="text"  @click="openDetail"
            >详情</el-button
          >
        </template>
      </vxe-column>
    </vxe-table>
  </div>
</template>

<script setup>
import { reactive, toRefs, onMounted, defineEmits } from 'vue'
const state = reactive({
  data: [
    {
      id: '110000',
      supplierType: '供应商类型',
      supplierName: '供应商名称',
      submitTime: '2021-11-15 14:00:56',
      orderItems: [
        {
          id: '110000',
          skuId: '商品sku',
          skuValue: '商品规格',
          goodsName: '商品名称',
          mainImg:
            'https://vango-erp-test.oss-cn-hangzhou.aliyuncs.com/import/goods/20211119/40771e4d4f5e47cb96000aa1cf864f93-o.jpg',
          purchaseQuantity: '10000',
          storageTime:
            '2021-11-15 14:00:56,2021-11-15 14:00:57,2021-11-15 14:00:58',
          areaNums: [
            {
              name: '分区名称',
              num: '分区对应的数量'
            },
            {
              name: '分区名称',
              num: '分区对应的数量'
            },
            {
              name: '分区名称',
              num: '分区对应的数量'
            },
            {
              name: '分区名称',
              num: '分区对应的数量'
            }
          ],
          notWarehousedNum: '300'
        }
      ]
    },
    {
      id: '110000',
      supplierType: '供应商类型',
      supplierName: '供应商名称',
      submitTime: '2021-11-15 14:00:56',
      orderItems: [
        {
          id: '110000',
          skuId: '商品sku',
          skuValue: '商品规格',
          goodsName: '商品名称',
          mainImg:
            'https://vango-erp-test.oss-cn-hangzhou.aliyuncs.com/import/goods/20211119/40771e4d4f5e47cb96000aa1cf864f93-o.jpg',
          purchaseQuantity: '10000',
          storageTime:
            '2021-11-15 14:00:56,2021-11-15 14:00:57,2021-11-15 14:00:58',
          areaNums: [
            {
              name: '分区名称',
              num: '分区对应的数量'
            }
          ],
          notWarehousedNum: '300'
        },
        {
          id: '110000',
          skuId: '商品sku',
          skuValue: '商品规格',
          goodsName: '商品名称',
          mainImg:
            'https://vango-erp-test.oss-cn-hangzhou.aliyuncs.com/import/goods/20211119/40771e4d4f5e47cb96000aa1cf864f93-o.jpg',
          purchaseQuantity: '10000',
          storageTime:
            '2021-11-15 14:00:56,2021-11-15 14:00:57,2021-11-15 14:00:58',
          areaNums: [
            {
              name: '分区名称',
              num: '分区对应的数量'
            }
          ],
          notWarehousedNum: '300'
        }
      ]
    }
  ]
})
// 合并单元格方法
function colspanMethod(row) {
  const { rowIndex, columnIndex } = row
  if (row.row.orderItemsFlag) {
    if (columnIndex === 0) {
      return { rowspan: 1, colspan: 4 }
    } else {
      return { rowspan: 0, colspan: 0 }
    }
  }
}

//单元格样式
function cellStyle({ row, column }) {
  if (row.orderItemsFlag) return { backgroundColor: '#FAFAFA' }
}
// 生成假数据
function getTableList() {
  let arr = []
  state.data.forEach((item, index) => {
    if (item.id) {
      arr.push({ ...item, orderItemsFlag: true })
      item.orderItems.forEach(item => {
        arr.push({ orderItem: item, orderItemsFlag: false })
      })
    }
  })
  state.data = arr
}
function storageTimeList(v) {
  return v.split(',')
}
onMounted(() => {
  getTableList()
})
const emit = defineEmits(['openDetail'])
function openDetail() {
  emit('openDetail')
}
const { data } = toRefs(state)
</script>

<style lang="scss" scoped>
.tabel {
  margin-top: 24px;
  background: #fff;
  padding: 24px 32px;
  .cell-header {
    display: flex;
    text-align: left;
    .cell-header--id {
      flex-basis: 20%;
    }
    .cell-header--supplierName {
      flex-basis: 60%;
    }
    .cell-header-submitTime {
      flex-basis: 20%;
      text-align: right;
    }
  }
  .mainImg {
    display: flex;
    .left {
      width: 70px;
      height: 70px;
      display: flex;
      align-content: center;
      justify-content: center;
      background: #fff;
      flex-basis: 70px;
      margin-right: 10px;
      position: relative;
      img {
        display: block;
        max-width: 100%;
        max-height: 100%;
      }
    }
    .center {
      width: 350px;
      flex-basis: 350px;
      text-align: left;
      h3 {
        width: 350px;
        height: 22px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.85);
        line-height: 22px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-bottom: 5px;
      }
      div {
        span {
          margin-right: 8px;
          margin-bottom: 6px;
        }
        margin-bottom: 5px;
      }
    }
    .right {
      width: 150px;
      flex-basis: 150px;
      display: flex;
      align-items: center;
      span {
        font-size: 18px;
        color: #aaaaaa;
      }
      .purchaseQuantity {
        color: #fd4c60ff;
        padding: 0 5px;
      }
    }
  }
  .areaNums {
    display: flex;
    flex-wrap: wrap;
    p {
      width: 50%;
      flex-basis: 50%;
    }
  }
}
</style>