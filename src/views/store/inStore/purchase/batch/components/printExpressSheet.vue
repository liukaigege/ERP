<template>
  <el-dialog title="出库打单" v-model="ifShow" :width="800" custom-class="myDialog" :close-on-click-modal="false" :destroy-on-close="true" @close="closeEvent">
    <div class="printExpressSheetView">
      <el-form class="flex">
        <el-form-item label="订单筛选:">
          <el-select v-model="logisticsValue" placeholder="请选择" @change="logisticsChange">
            <el-option
              v-for="item in logistics"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="packageTypeValue" placeholder="请选择需求类型" style="margin-left: 16px; width: 140px" @change="packageTypeChange">
            <el-option
              v-for="item in packageType"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <div class="total">数量: <span style="color: #f81e0f">{{ tableData.length }}</span></div>
      </el-form>
      <el-table :data="tableData" style="width: 100%" :header-cell-style="{background:'#F5F7FA',color:'#000','text-align': 'center'}"
      :cell-style="{'text-align': 'center'}" tooltip-effect="dark" @selection-change="handleSelectionChange" v-loading="isLoading" element-loading-text="数据正在加载中..." ref="tableRef">
        <el-table-column type="expand">
          <template #default="props">
            <div class="list">
              <div class="item" v-for="(item, index) in props.row.goodsInfo" :key="index">
                <el-image style="width: 60px; height: 60px;" :src="item.mainImg" fit="contain"></el-image>
                <div class="right">
                  <div class="textOverflow" :title="item.goodsName">{{item.goodsName}}</div>
                  <div class="textOverflow" :title="item.goodsSku">{{item.goodsSku}}</div>
                  <div>{{item.speVal}}</div>
                </div>
                <div class="count">X{{item.goodsQuantity}}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="包裹号" prop="packageId"></el-table-column>
        <el-table-column label="下单时间" prop="createTime"></el-table-column>
        <el-table-column label="物流渠道" align="left">
          <template #default="scoped">
            <div class="logisticsColumn">
              <span>{{scoped.row.logistics}}</span>
              <i class="el-icon-document" :style="{ 'color': scoped.row.printCount == 0 ? '#939598' : '#1890ff' }"></i>
            </div>
          </template>
        </el-table-column>
      </el-table>
		</div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeEvent" >取 消</el-button>
        <el-button type="primary" @click="submitEvent"  :disabled="packageIdArr.length == 0" :loading="loading">打 单</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { reactive, ref, toRefs, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { logisticsList, packageList, printExpressSheet } from '@/api/store.js'
export default {
	props: {
    ivtPurchaseDetailId: {
      type: Array,
      default: []
    },
    type: {
      type: Number,
      default: 0
    },
    purchaseType: {
      type: Number,
      default: 0
    }
	},
	emits: ['closeEvent', 'affirmEvent'],
	setup(props, context) {
    let ifShow = ref(true)
    let state = reactive({
      ivtPurchaseDetailId: props.ivtPurchaseDetailId,
      logistics: [
        {
          value: '',
          label: '全部物流渠道'
        }
      ],
      logisticsValue: '',
      packageType: [
        {
          value: '',
          label: '全部包裹类型'
        },
        {
          value: '1',
          label: '单品单数'
        },
        {
          value: '2',
          label: '单品多数'
        },
        {
          value: '3',
          label: '多品多数'
        }
      ],
      packageTypeValue: '',
      tableData: [],
      multipleSelection: [],
      isLoading: false,
      packageIdArr: [], // 可打单的包裹id
      loading: false,
      createdStatus: 0
    })

    let tableRef = ref(null)
    
    // 获取包裹列表
    let getPackageList = () => {
      let params = {
        ivtPurchaseDetailIds: state.ivtPurchaseDetailId.join(','),
        logistics: state.logisticsValue,
        packageType: state.packageTypeValue,
        type: props.purchaseType
      }
      packageList(params).then(res => {
        if (res.code == 200) {
          // 批量打单过滤已打单包裹
          if (props.type == 1) {
            state.tableData = res.data.filter(item => item.printCount == 0)
            if (state.createdStatus == 0) {
              let listLogistics = []
              state.packageIdArr = []
              state.tableData.forEach(item => {
                if (!listLogistics.includes(item.logistics)) {
                  listLogistics.push(item.logistics)
                }
              })
              let logisticsArr = [
                {
                  value: '',
                  label: '全部物流渠道'
                }
              ]
              listLogistics.forEach(item => {
                let obj = {
                  value: item,
                  label: item
                }
                logisticsArr.push(obj)
              })
              state.logistics = logisticsArr
              state.createdStatus = 1
            }
          } else {
            state.tableData = res.data
          }
          tableRef.value.toggleAllSelection() // 默认全部勾选
        }
      })
    }

    // 获取物流渠道列表
    let getLogisticsList = () => {
      state.isLoading = true
      let params = {
        ivtPurchaseDetailIds: state.ivtPurchaseDetailId.join(','),
        type: props.purchaseType
      }
      logisticsList(params).then(res => {
        if (res.code == 200) {
          state.isLoading = false
          res.data.forEach(item => {
            let obj = {
              value: item,
              label: item
            }
            state.logistics.push(obj)
          })
          getPackageList()
        }
      })
    }

    onMounted(() => {
      getLogisticsList()
    })

    // 物流渠道发生变化
    let logisticsChange = () => {
      getPackageList()
    }

    // 包裹类型发生变化
    let packageTypeChange = () => {
      getPackageList()
    }
    
    let handleSelectionChange = (val) => {
      console.log(val)
      state.multipleSelection = val;
    }

    watch(() => state.multipleSelection, (newVal) => {
      state.packageIdArr = []
      newVal.forEach(item => {
        if (item.printCount !== null) state.packageIdArr.push(item.packageId)
      })
    })

    let closeEvent = () => {
      context.emit('closeEvent')
    }

    let submitEvent = () => {
      state.loading = true
      let packageIds = state.packageIdArr.join(',')
      printExpressSheet({ packageIds, source: 1 }).then(res => {
        state.loading = false
        if (res.code == 200) {
          let { errorCount, pdfUrl, successCount, uuid } = res.data
          if (successCount > 0 && pdfUrl) {
            window.open(pdfUrl)
          }
          let expressSheetStatus = {
            errorCount,
            successCount,
            uuid,
            ifPrintSuccess: pdfUrl ? true : false
          }
          context.emit('closeEvent', expressSheetStatus)
        }
      }).catch(err => {
        state.loading = false
      })
    }
		return {
      ifShow,
      tableRef,
      ...toRefs(state),
      logisticsChange,
      packageTypeChange,
      handleSelectionChange,
      closeEvent,
      submitEvent
		}
	}
}
</script>

<style lang="scss" scoped>
  .printExpressSheetView{
    max-height: 560px;
    overflow-y: scroll;
    .logisticsColumn{
      position: relative;
      i {
        position: absolute;
        right: 10px;
        top: 4px;
      }
    }
    .list{
      display: flex;
      flex-wrap: wrap;
      .item{
        width: 50%;
        height: 60px;
        display: flex;
        justify-content: space-between;
        padding-left: 20px;
        font-size: 14px;
        color: rgba(0,0,0,.45);
        .right{
          width: 180px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .count{
          width: 40px;
          text-align: center;
          line-height: 60px;
        }
      }
      .item:nth-of-type(2n-1){
        border-right: 1px solid #eee;
      }
    }
  }
  .flex {
    display: flex;
    justify-content: space-between;
    .total{
      margin: 5px 10px 0 0;
    }
  }
  
</style>