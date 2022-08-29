<!--
* @Descripttion: Vango ERP inventoryOutStore 盘亏出库
* @version: 1.0
* @Author: 王新国
* @Date: 2021-11-01 15:16:38
* @LastEditors: 王新国
* @LastEditTime: 2021-11-01 17:07:46
-->
<template>
  <div>
    <div class="formContainer">
      <el-form
        :model="form"
        class="demo-form-inline demo-ruleForm"
        :inline="true"
        style="width: 80%"
      >
        <el-row :gutter="20">
          <el-col :span="4">
            <el-form-item label="出库仓库:"> 万众智谷仓库 </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="出库类型:"> 盘亏出库 </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="盘点编号:">
              <div>{{ inventoryCheckNumber }}</div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-button @click="goBack(-1)">关闭</el-button>
    </div>
    <div class="tableContainer">
      <vxe-table border align="center" ref="tableRef" :data="list">
        <vxe-column title="商品信息">
          <template #default="{ row }">
            <div class="goodsInfo">
              <div>
                <el-popover
                  placement="right-start"
                  trigger="hover"
                  width="auto"
                >
                  <el-image
                    style="width: 200px; height: 200px"
                    :src="row.url"
                    fit="contain"
                  ></el-image>
                  <template #reference>
                    <el-image
                      style="width: 67px; height: 67px"
                      :src="row.url"
                      fit="contain"
                    ></el-image>
                  </template>
                </el-popover>
              </div>
              <div>
                <el-tooltip placement="top" :offset="10">
                  <template #content>
                    <span style="color: #fff" v-copy="row.nameCn">复制</span>
                  </template>
                  <p class="goodsName twoLine" :title="row.nameCn">
                    {{ row.nameCn }}
                  </p>
                </el-tooltip>
                <p
                  class="goodsSku twoLine"
                  v-if="row.speVal"
                  :title="
                    JSON.parse(row.speVal).reduce(
                      (prev, cur) => prev + cur.spe + ':' + cur.speVal + ' ',
                      ''
                    )
                  "
                >
                  {{
                    JSON.parse(row.speVal).reduce(
                      (prev, cur) => prev + cur.spe + ':' + cur.speVal + ' ',
                      ''
                    )
                  }}
                </p>
              </div>
            </div>
          </template>
        </vxe-column>
        <vxe-column title="商品SKU" width="250">
          <template #default="{ row }">
            <p class="twoLine" :title="row.sku">{{ row.sku || '-' }}</p>
            <p class="twoLine" :title="row.skuId">{{ row.skuId || '-' }}</p>
          </template>
        </vxe-column>
        <vxe-column title="货架位" width="150">
          <template #default="{ row }">
            <p :title="row.shelfSpace">{{row.shelfSpace ? '拣货区 ' : ''}}{{ row.shelfSpace || '-' }}</p>
          </template>
        </vxe-column>
        <vxe-column title="库存量" width="150">
          <template #default="{ row }">
            <p :title="row.inventoryNum">{{ row.inventoryNum ?? '-' }}</p>
          </template>
        </vxe-column>
        <vxe-column title="实际盘点数" width="150">
          <template #default="{ row }">
            <p :title="row.nowInventoryNum">{{ row.nowInventoryNum ?? '-' }}</p>
          </template>
        </vxe-column>
        <vxe-column title="盘点误差" width="150">
          <template #default="{ row }">
            <p :title="row.differenceNum" :style="row.differenceNum ? 'color:red;' : ''">
              {{row.differenceNum ? '盘亏' : ''}} {{ row.differenceNum ?? '-' }}
            </p>
          </template>
        </vxe-column>
        <vxe-column title="出库数量" width="150">
          <template #default="{ row }">
            <p :title="0 - row.differenceNum">{{ 0 - row.differenceNum ?? '-' }}</p>
          </template>
        </vxe-column>
      </vxe-table>
    </div>
    <ErpFooter>
      <div class="footerContainer">
        <div class="paginationContainer">
          <el-pagination
            :total="totalNumber"
            :current-page="form.page.pageNo"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-sizes="[100, 200, 300, 400, 500]"
            layout="total, sizes, prev, pager, next, jumper"
            :page-size="form.page.pageSize"
          ></el-pagination>
        </div>
        <div class="submitContainer">
          <span>出库备注:</span>&nbsp;
          <el-input
            style="width: 500px"
            v-model="remark"
            placeholder="请输入出库备注"
            maxlength="100"
          />&nbsp;&nbsp;
          <el-button type="primary" @click="submitFn">确认出库</el-button>
        </div>
      </div>
    </ErpFooter>
		<ProgressDialog v-if="progressDialogShow" :pageType="-7" :uuid="uuid" @closeBack="progressDialogBack"/>
  </div>
</template>
<script>
import { reactive, toRefs } from 'vue'
import ErpFooter from '@/components/erpFooter/index.vue'
import { useRoute, useRouter } from 'vue-router'
import { inventoryOutStoreData } from '../composables/data'
import { queryInventoryResultList, putInOrTakeOutStorageApi } from '../composables/api'
import { ElMessage, ElMessageBox } from 'element-plus'
import ProgressDialog from '../components/progressDialog.vue'
export default {
  components: { ErpFooter, ProgressDialog },
  setup() {
    const inventoryQueryData = sessionStorage.getItem('inventoryquerydata')
      ? JSON.parse(sessionStorage.getItem('inventoryquerydata'))
      : {
          searchType: null,
          searchText: null,
          inventoryStatus: null,
          sortName: null,
          sortType: null
        }
    const router = useRouter()
    const route = useRoute()
    // 盘点编号
    const { inventoryCheckNumber, tableType, inventoryType } = route.query
    const { form } = inventoryOutStoreData
    const state = reactive({
      form,
      totalNumber: 0,
      list: [], //列表数据
      remark: null,
			progressDialogShow:false,
			uuid:null
    })
    initFn()
    function initFn() {
      // 查询列表
      const obj = { ...inventoryQueryData, inventoryCheckNumber, ...state.form, handlerType:2 }
      queryInventoryResultList(obj).then(res => {
        if (res.code === 200) {
          state.list = res.data.dataList.map(v => {
            if (v.price === null) v.price = v.purchasePrice
            return v
          })
          state.totalNumber = res.data.page.totalCount
        } else ElMessage.warning({ message: res.message })
      })
    }

    function handleSizeChange(val) {
      state.form.page.pageSize = val
      initFn()
    }

    function handleCurrentChange(val) {
      state.form.page.pageNo = val
      initFn()
    }
    function goBack(pageNo = -1) {
			if(pageNo === -1){
				router.push({
          name: 'InventoryResult',
					query:{ inventoryCheckNumber, tableType, inventoryType }
        })
			}else{
				router.push({
          name: 'WarehouseInventory',
					params:{ backType:4 }
        })
			}
    }
		function submitFn(){
			const { areaId, warehouseId } = state.form
			const timestamp = new Date().getTime() + ''
			const obj = {
				inventoryCheckNumber,//盘点编号
				type:-7,//出入库类型详细 5盘盈入库 -7盘亏出库
				areaId,//分区Id
				warehouseId,//仓库id
				remark:state.remark,//备注
				uuid:timestamp//uuid，用于获取进度条
			}
			putInOrTakeOutStorageApi(obj)
				.then(res => {
					if(res.code == 200) {
						state.uuid = timestamp
						state.progressDialogShow = true
					}
					else ElMessage.warning({ message: res.message })
				})
		}
		function progressDialogBack(val){
			state.progressDialogShow = val
			goBack(-2)
		}
    return {
      ...toRefs(state),
      goBack,
			submitFn,
      handleSizeChange,
			progressDialogBack,
      handleCurrentChange,
      inventoryCheckNumber
    }
  }
}
</script>
<style lang='scss' scoped>
.formContainer {
  display: flex;
  justify-content: space-between;
  background-color: #fff;
  box-sizing: border-box;
  padding: 20px 20px 0;
}

.oneLine {
  white-space: nowrap;
  overflow: hidden;
  -o-text-overflow: ellipsis;
  text-overflow: ellipsis;
}
.twoLine {
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}
.tableContainer {
  background-color: #fff;
  box-sizing: border-box;
  padding: 20px;
  .goodsInfo {
    display: flex;
    .goodsName {
      text-align: left;
      max-width: 500px;
      margin-left: 15px;
    }
    .goodsSku {
      max-width: 500px;
      text-align: left;
      margin-left: 15px;
    }
  }
}
.footerContainer {
  padding: 0 20px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>

