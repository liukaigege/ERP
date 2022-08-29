<!--
* @Descripttion: Vango ERP 盘盈入库 inventoryInStore
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
            <el-form-item label="入库仓库:"> 万众智谷仓库 </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="入库分区:"> 拣货区 </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="入库类型:"> 盘盈入库 </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="盘点编号:">
              <div>{{ inventoryCheckNumber }}</div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-button @click="goBack(-1)">关闭</el-button>
    </div>
    <div class="btnContainer">
      <el-button type="primary" @click="changePrice">批量填充</el-button>
    </div>
    <div class="tableContainer">
      <vxe-table
        border
        align="center"
        ref="tableRef"
        :data="list"
        @checkbox-change="handleSelectionChange"
        @checkbox-all="handleSelectionAll"
      >
        <vxe-column type="checkbox" width="50"></vxe-column>
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
                  v-if="row.speVal && row.speVal.length"
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
        <vxe-column title="商品SKU" width="180">
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
            <p
              :title="row.differenceNum"
              :style="row.differenceNum ? 'color:#67C23A;' : ''"
            >
              {{row.differenceNum ? '盘盈 +' : ''}}{{ row.differenceNum ?? '-' }}
            </p>
          </template>
        </vxe-column>
        <vxe-column title="入库数量" width="150">
          <template #default="{ row }">
            <p :title="row.differenceNum">{{ row.differenceNum ?? '-' }}</p>
          </template>
        </vxe-column>
        <vxe-column title="入库单价（CNY）" width="150">
          <template #default="{ row }">
            <p>{{ row.purchasePrice ?? '-' }}</p>
            <el-input-number
              style="width: 100px"
              v-model="row.price"
              :min="0"
              :max="9999999.99"
              :controls="false"
              :precision="2"
							@blur="ok(row)"
            />
          </template>
        </vxe-column>
      </vxe-table>
    </div>
    <ErpFooter>
      <div class="footerContainer">
        <div class="selectContainer">
          已选
          <span class="footerContainerNumber">{{
            selectedList?.length || 0
          }}</span>
          条
        </div>
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
          <span>入库备注:</span>&nbsp;
          <el-input
            style="width: 500px"
            v-model="remark"
            placeholder="请输入入库备注"
            maxlength="100"
          />&nbsp;&nbsp;
          <el-button type="primary" @click="submitFn">确认入库</el-button>
        </div>
      </div>
    </ErpFooter>
		<PriceEditDialog v-if="priceEditDialogShow" :selectList="selectedList" @changeBack="changePriceBack"/>
		<ProgressDialog v-if="progressDialogShow" :pageType="5" :uuid="uuid" @closeBack="progressDialogBack"/>
  </div>
</template>
<script>
import { reactive, toRefs } from 'vue'
import ErpFooter from '@/components/erpFooter/index.vue'
import { useRoute, useRouter } from 'vue-router'
import { inventoryInStoreData } from '../composables/data'
import { queryInventoryResultList, batchFillPriceApi, putInOrTakeOutStorageApi } from '../composables/api'
import { ElMessage, ElMessageBox } from 'element-plus'
import PriceEditDialog from '../components/priceEditDialog.vue'
import ProgressDialog from '../components/progressDialog.vue'
import { deepCopy } from 'tool'
export default {
  components: { ErpFooter, PriceEditDialog, ProgressDialog },
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
    const { form } = inventoryInStoreData
    const state = reactive({
      form,
      totalNumber: 0,
      wareHouseArea: [], //入库分区列表
      list: [], //列表数据
			tempList:[],
      selectedList: [], //已选数据
      remark: null,
			priceEditDialogShow:false,
			progressDialogShow:false,
			uuid:null
    })

    initFn()
    function initFn() {
      // 查询列表
      const obj = { ...inventoryQueryData, inventoryCheckNumber, ...state.form,handlerType:1 }
      queryInventoryResultList(obj).then(res => {
        if (res.code === 200) {
          state.list = res.data.dataList.map(v => {
            if (v.price === null) v.price = v.purchasePrice
            return v
          })
					state.tempList = deepCopy(state.list)
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
		function handleSelectionChange(val){
			if(val.checked) state.selectedList.push(val.row)
			else state.selectedList = state.selectedList.filter(v => v.id != val.row.id)
		}
		function handleSelectionAll(val){
			if(val.checked) state.list.forEach(v=>{ if(!state.selectedList.some(it => it.id == v.id)) state.selectedList.push(v) })
			else state.selectedList = state.selectedList.filter(v => !state.list.some(it => it.id == v.id ))
		}

		function changePrice(){
			if(state.selectedList?.length) state.priceEditDialogShow = true
			else ElMessage.warning({ message: '请选择商品!' })
		}

		function changePriceBack(val){
			if(!!val){
				state.list.forEach(v=>{
					if(state.selectedList.some(it => it.id === v.id)) v.price = val.price
				})
				state.tempList = state.list
			}
			state.priceEditDialogShow = false
		}

		function submitFn(){
			const { areaId, warehouseId } = state.form
			const timestamp = new Date().getTime() + ''
			const obj = {
				inventoryCheckNumber,//盘点编号
				type:5,//出入库类型详细 5盘盈入库 -7盘亏出库
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
		function ok(row){
			const obj = state.tempList.filter(v=>v.id == row.id)[0]
			if(obj && obj.price != row.price){
				batchFillPriceApi({price:row.price, ids:[row.id]})
					.then(res => {
						if(res.code == 200) state.tempList.filter(v=>{ if(v.id == row.id) v.price = row.price})
						else ElMessage.warning({ message: res.message })
					})
			}
		}
		function progressDialogBack(val){
			state.progressDialogShow = val
			goBack(-2)
		}
    return {
      ...toRefs(state),
			ok,
      goBack,
			submitFn,
			changePrice,
			changePriceBack,
      handleSizeChange,
			handleSelectionAll,
			progressDialogBack,
      handleCurrentChange,
      inventoryCheckNumber,
			handleSelectionChange,
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
.btnContainer {
  box-sizing: border-box;
  padding: 20px 0;
}
.tableContainer {
  background-color: #fff;
  box-sizing: border-box;
  padding: 20px;
  .goodsInfo {
    display: flex;
    .goodsName {
      text-align: left;
      max-width: 370px;
      margin-left: 15px;
    }
    .goodsSku {
      max-width: 370px;
      text-align: left;
      margin-left: 15px;
    }
  }
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
.footerContainer {
  padding: 0 20px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .footerContainerNumber {
    color: #419eff;
  }
  .selectContainer {
    flex: 1;
  }
  .paginationContainer {
    flex: 2;
    text-align: left;
  }
  .submitContainer {
    flex: 3;
    text-align: right;
  }
}
</style>
