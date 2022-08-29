<template>
  <div>
    <div class="pageView">
      <div class="purchaseInfo">
        <div class="item">
          <div class="name">仓库</div>
          <div class="value">{{warehouseName}}</div>
        </div>
        <div class="item">
          <div class="name">经办人</div>
          <div class="value">{{userName}}</div>
        </div>
        <div class="item" v-if="serialNumber">
          <div class="name">{{type==1?"运单号":"采购单号"}}</div>
          <div class="value">{{serialNumber}}</div>
        </div>
        <div class="item">
          <div class="name">入库类型</div>
          <div class="value">采购入库</div>
        </div>
      </div>
    </div>
    <div class="pageView mgr_top">
      <Table checkedKey="purchaseOrderNumber" :columns="columns" :border="true" :tableData="storageList" fieldName="detailList" ref="tableRef">
        <template v-slot:extraHeader="{row}">
          <div class="extraHeader">
            <div class="left">
              <span>采购单号: {{row.purchaseOrderNumber}}</span>
              <span>采购员: {{row.purchaseUserName}}</span>
              <span>采购备注: {{row.purchaseRemark}}</span>
            </div>
          </div>
        </template>
        <template v-slot:skuImg="{row}">
          <div class="skuImg">
            <el-popover placement="right-start" trigger="hover" width="auto">
              <el-image style="width: 200px; height: 200px" :src="row.skuImg" fit="contain"></el-image>
              <template #reference>
                <el-image style="width: 70px; height: 70px;" :src="row.skuImg" fit="contain"></el-image>
              </template>
            </el-popover>
            <div class="tag1" v-if="row.goodAttribute == 2">相似</div>
            <div class="tag2" v-if="row.goodAttribute == 3">替代</div>
          </div>
        </template>
        <template v-slot:goodsName="{row}">
          <div class="goodsName lines-overflow" :title="row.goodsName">{{row.goodsName}}</div>
          <div class="sku textOverflow" :title="row.skuId">{{row.skuId}}</div>
          <div class="textOverflow" :title="row.skuCode">{{row.skuCode}}</div>
        </template>
        <template v-slot:skuValue="{row}">
          <div class="lines-overflow" :title="row.skuValue">{{ row.skuValue }}</div>
        </template>
        <template v-slot:orderId="{row}">
          <el-tooltip placement="top" :offset="10">
            <template #content>
              <a style="color: #fff" v-copy="row.orderId">复制</a>
            </template>
            <div class="orderId">{{ row.orderId }}</div>
          </el-tooltip>
        </template>
        <template v-slot:qrCode="{row}">
          <el-tooltip placement="top" :offset="10">
            <template #content>
              <a style="color: #fff" v-copy="row.qrCode">复制</a>
            </template>
            <div class="qrCode">{{row.qrCode}}</div>
          </el-tooltip>
        </template>
        <template v-slot:customValue="{row}">
          <el-popover placement="left-end" trigger="hover" width="auto">
            <div class="customValueList" v-for="(v,i) in row.customValue" :key="i">
              <p v-if="isImgString(v.value)">
                {{v.field}}：
                <el-popover placement="right-start" trigger="hover" width="auto">
                  <el-image style="width: 200px; height: 200px" :src="v.value" fit="contain"></el-image>
                  <template #reference>
                    <el-icon style="font-size: 20px;position: relative;top: 3px;">
                      <PictureFilled />
                    </el-icon>
                  </template>
                </el-popover>
              </p>
              <p v-else>{{v.field}}：{{v.value}}</p>
            </div>
            <template #reference>
              <div class="customValueContainer">
                <div class="customValueList" v-for="(v,i) in row.customValue" :key="i">
                  <p v-if="isImgString(v.value)">
                    {{v.field}}：
                    <el-popover placement="right-start" trigger="hover" width="auto">
                      <el-image style="width: 200px; height: 200px" :src="v.value" fit="contain"></el-image>
                      <template #reference>
                        <el-icon style="font-size: 20px;position: relative;top: 3px;">
                          <PictureFilled />
                        </el-icon>
                      </template>
                    </el-popover>
                  </p>
                  <p v-else>{{v.field}}：{{v.value}}</p>
                </div>
              </div>
            </template>
          </el-popover>
        </template>
        <template v-slot:purchaseQuantity="{row}">
          <div>{{row.purchaseQuantity}}</div>
        </template>
        <template v-slot:inStoreInfo="{row}">
          <div>
            <span style="display: inline-block; width: 60px;">已入库</span>
            <span style="display: inline-block; width: 60px;">{{row.arrivalQuantity}}</span>
          </div>
          <div>
            <span style="display: inline-block; width: 60px;">未入库</span>
            <span style="display: inline-block; width: 60px;">{{row.unArrivalQuantity}}</span>
          </div>
        </template>
        <template v-slot:operation="{row}">
          <div class="operation">
            <el-button type="text" style="cursor: pointer" v-if="row.unArrivalQuantity != 0 && row.importStatus != 1" @click="checkQrcode(row)">立即入库</el-button>
            <el-button type="text" style="cursor: not-allowed" disabled v-else-if="row.unArrivalQuantity == 0 && row.importStatus != 1">入库已完成</el-button>
            <el-button type="text" style="cursor: not-allowed" disabled v-else="row.unArrivalQuantity != 0 && row.importStatus == 1">价格未导入</el-button>
          </div>
        </template>
      </Table>
    </div>
    <div class="footer">
      <el-button @click="cancel">取消</el-button>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, onMounted } from 'vue'
import { useStore } from 'vuex'
import { PictureFilled } from '@element-plus/icons-vue'
import Table from '../batch/components/elTable/index.vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import { inStorageList, purchaseSearch } from '@/api/store.js'
import { renderCustomInfo, isImgString } from '@/utils/tool.js'
export default {
  components: {
    Table,
    PictureFilled
  },
  setup() {
    let route = useRoute()
    let router = useRouter()
    let batchNum = route.query.batchNum
    let store = useStore()
    let state = reactive({
      columns: [
        {
          title: '图片',
          key: 'skuImg',
          width: '100px',
        },
        {
          title: '货品名称/SKU',
          key: 'goodsName',
          width: '220px',
        },
        {
          title: '规格值',
          key: 'skuValue',
          width: '180px',
        },
        {
          title: '订单号',
          key: 'orderId',
          width: '180px',
        },
        {
          title: '二维码ID',
          key: 'qrCode',
          width: '150px',
        },
        {
          title: '定制属性',
          key: 'customValue',
          width: '302px',
        },
        {
          title: '采购数量',
          key: 'purchaseQuantity',
          width: '80px',
        },
        {
          title: '入库信息',
          key: 'inStoreInfo',
          width: '120px',
        },
        {
          title: '操作',
          key: 'operation',
          width: '90px',
        },
      ],
      loading: false,
      serialNumber: "",
      userName: "",
      warehouseName: "万众智谷仓库",
      type: 1,
      storageList: []
    })

    // 获取入库信息
    const getStorageList = () => {
      inStorageList({ serialNumber: batchNum, warehouseId: 1 }).then(res => {
        if (res.code == 200) {
          const { purchaseOrderList, serialNumber, userName, warehouseName, type } = res.data
          state.serialNumber = serialNumber
          state.userName = userName
          state.warehouseName = warehouseName
          state.type = Number(type)
          purchaseOrderList.forEach(item => {
            item.detailList.forEach(son => {
              son.skuValue = JSON.parse(son.skuValue)
              if (typeof son.skuValue == 'object' && son.skuValue) {
                son.skuValue = son.skuValue.map(val => val.speVal).join('-')
              }
              if (son.customValue) {
                const copyCustomValue = JSON.parse(son.customValue)
                son.customValue = renderCustomInfo(copyCustomValue, 2)
              } else {
                son.customValue = []
              }
            })

          })
          state.storageList = purchaseOrderList
        }
      }).catch(err => {
        clearTimeout(err.timeId)
        if (err.code == 200002) {
          ElMessage.success("入库已完成")
          router.push('/store/instore/purchase')
        }
      })
    }

    //取消
    const cancel = () => {
      ElMessageBox.confirm('取消将会清除界面输入数据，是否继续', '警告', {
        confirmButtonText: '继续',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          router.replace('/store/instore/purchase')
        })
    }

    const checkQrcode = async ({ qrCode }) => {
      const params = {
        ivtPurchaseDetailId: JSON.parse(qrCode).ivtPurchaseDetailId,
        warehouseId: 1,
        flag: 0
      }
      const result = await purchaseSearch(params)
      if (result.code != 200) return
      store.dispatch('store/setPurchaseInfoActions', result.data)
      const { num, arrivalNum } = result.data.mainGoodsInfo
      if (num - arrivalNum == 0) { // 全部入库直接跳转面单信息界面
        router.push({
          path: '/store/inStore/qualityTesting/expresSheetInfo',
          query: {
            type: 0
          }
        })
      } else { // 存在未入库跳转质检
        router.push({
          name: 'QualityTesting',
          query: {
            batchNum
          }
        })
      }
    }

    onMounted(() => {
      getStorageList()
    })

    return {
      ...toRefs(state),
      cancel,
      getStorageList,
      renderCustomInfo,
      isImgString,
      checkQrcode
    }
  }
}
</script>


<style lang="scss" scoped>
.pageView {
  .lines-overflow {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }
  margin-bottom: 50px;
  .purchaseInfo {
    display: flex;
    height: 54px;
    border: 1px solid #ebeef5;
    border-right: none;
    color: rgba(0, 0, 0, 0.65);
    .item {
      display: flex;
      justify-content: space-between;
      flex: 1;
      .name {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 40%;
        background-color: #f5f7fa;
      }
      .value {
        display: flex;
        flex: 1;
        justify-content: center;
        align-items: center;
        border-left: 1px solid #ebeef5;
        border-right: 1px solid #ebeef5;
      }
    }
  }
  .extraHeader {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 46px;
    background-color: #f5f7fa;
    font-size: 14px;
    padding: 0 20px;
    span {
      margin-right: 16px;
    }
  }
  a {
    font-size: 14px;
    color: #1e93ff;
  }
  .sku,
  .goodsName {
    padding: 0 16px;
  }
  .sku {
    font-weight: bold;
  }
  .orderId {
    padding: 10px;
  }
}
.mgr_top {
  margin-top: 24px;
}
.footer {
  position: fixed;
  width: 100%;
  bottom: 0;
  right: 0;
  z-index: 1000;
  width: calc(100% - var(--sideBarWidth));
  height: 52px;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 10px 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
.operation {
  display: flex;
  flex-direction: column;
  .el-button {
    margin-left: 0;
    min-height: 20px;
    padding: 4px;
  }
}

.qrCode {
  padding: 0 20px;
}
.skuImg {
  position: relative;
}
.tag1,
.tag2 {
  position: absolute;
  left: 71px;
  top: -5px;
  border-radius: 4px;
  padding: 0 2px;
  background-color: #fff;
}
.tag1 {
  color: #f6a439;
  border: 1px solid #f6a439;
}
.tag2 {
  color: #da1931;
  border: 1px solid #da1931;
}
.customValueContainer {
  text-align: center;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  width: max-content;
  margin: 0 auto;
}
</style>
