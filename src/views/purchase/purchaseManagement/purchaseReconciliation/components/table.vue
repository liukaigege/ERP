<template>
  <div class="pageTableReconciled">
    <el-table :data="props.data" ref="tableRef" @selection-change="emit('select', $event)" tooltip-effect="dark" :key="props.status">
      <el-table-column type="selection" width="60" align="center"></el-table-column>
      <el-table-column label="商品信息" prop="receiptOrders" width="350" align="center">
        <template #default="{ row }">
          <div class="checkImg">
            <div>
              <el-popover placement="right-start" trigger="hover" width="auto">
                <el-image style="width: 200px; height: 200px" :src="props.status == 0?row.mainImg:row.skuImage" fit="contain"></el-image>
                <template #reference>
                  <el-image style="width: 60px; height: 60px;" :src="props.status == 0?row.mainImg:row.skuImage" fit="contain"></el-image>
                </template>
              </el-popover>
              <!-- <img style="width: 60px; height: 60px" :src="props.status == 0?row.mainImg:row.skuImage" /> -->
              <p>{{ props.status == 0?row.customization==1?'定制':'普通':row.goodsType==1?'定制':'普通' }}商品</p>
            </div>
            <div style="margin-left: 16px; text-align: left" class="skuFont">
              <div style="display:flex;">
                <p class="tagClass" :title="props.status !== 0?row.sku:row.skuCode">
                  {{ props.status !== 0?row.sku:row.skuCode }}
                </p>
                <!-- <p v-for="item in row.remarkTypes" :key="item">{{item.word}}</p> -->
                <el-popover placement="top" :width="800" trigger="hover" v-for="item in props.status !== 0?row.remarkTypes:row.packageRemarkTypes" :key="item" @after-enter="getRemarkDetail(row.id, item.id)">
                  <template #reference>
                    <div :style="{ backgroundColor: item.color }" class="remarkClass" size="small">{{item.word}}</div>
                  </template>
                  <el-table :data="remarkList" tooltip-effect="dark" :header-cell-style="{ background: '#F5F7FA', color: '#000', 'text-align': 'center' }" :cell-style="{ 'text-align': 'center' }" fit>
                    <el-table-column min-width="100" property="remark" show-overflow-tooltip label="内容"></el-table-column>
                    <el-table-column width="180" property="createTime" label="时间"></el-table-column>
                    <el-table-column property="remarkTypeName" label="类型"></el-table-column>
                    <el-table-column property="createByName" label="操作人"></el-table-column>
                    <el-table-column label="操作">
                      <template #default="{row}">
                        <el-button type="text" @click="editRemark(row,row.id)">编辑</el-button>
                        <el-button type="text" style="color:#FD4C60;" @click="deleteRemark(row.id)">删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-popover>
                <!-- <p>
									<el-tag v-for="item in row.remarkTypes" :key="item" :style="{ backgroundColor: item.color }" class="remarkClass" size="small">{{item.word}}</el-tag>
								</p> -->
              </div>
              <p class="tagClass" :title="row.goodsName">{{ row.goodsName}}</p>
              <span v-for="v in row.skuCn" :key="v.id">{{v.spe}}:{{v.speVal}}&nbsp;&nbsp;</span>
              <p>{{props.status !== 0? row.goodsCategoryName:row.categoryName }}</p>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="采购信息" prop="ReconciliationNumber" width="280px" align="center">
        <template #default="{ row }">
          <p>{{ row.purchaseOrderNumber }}</p>
          <p>下单时间：{{ row.submitTime }}</p>
          <p>审批时间：{{ row.auditTime }}</p>
          <p>采购员：{{ row.purchaseUserName }}</p>
        </template>
      </el-table-column>
      <el-table-column label="供应商信息" prop="supplier" align="center" min-width="100">
        <template #default="{ row }">
          <el-popover placement="top" width="auto" trigger="hover">
            <template #reference>
              <p class="textOverflow">【{{ props.status !== 0?row.partnerTypeName:{'1':'合作供应商','2':'1688','3':'淘宝','4':'拼多多'}[row.supplierType] }}】{{row.supplierName}}</p>
            </template>
            <p class="textOverflow">【{{ props.status !== 0?row.partnerTypeName:{'1':'合作供应商','2':'1688','3':'淘宝','4':'拼多多'}[row.supplierType] }}】{{row.supplierName}}</p>
          </el-popover>

          <p>{{ row.thirdId }}</p>
          <p>{{{"1":'预付','2':'账期',"3":"货到付款","4":"款到发货"} [row.settlementType] }}{{row.settlementValue}}
            <span v-if="row.settlementType==1">{{{'1':'%','2':'元'}[row.settlementUnit]}}</span>
            <span v-if="row.settlementType==2">天</span>
            </p>
          <div v-if="props.status !== 0">
					<p class="textOverflow" v-for="logis in row.logisticsList" :key="logis.name" :title="`${logis.name}:${logis.trackNum}`">{{ logis.name }}:{{ logis.trackNum }}</p>
          </div>
				</template>
			</el-table-column>
			<el-table-column label="采购数量" prop="purchaseQuantity" width="200px" align="center" v-if="props.status == 0"></el-table-column>
			<el-table-column label="待入库数量" prop="notWarehousedNum" width="250px" align="center" v-if="props.status == 0">
				<template #default="{row}">
					<p v-if="row.customization==1&&row.notWarehousedNum" style="color:#409eff; cursor:pointer;" @click="jumpOrder(row)">{{row.notWarehousedNum}}</p>
					<p v-else>{{row.notWarehousedNum}}</p>
				</template>
			</el-table-column>
			<el-table-column label="入库信息" prop="rukuxinxi" width="280px"   align="center" v-if="props.status != 0">
				<template #default="{row}">
					<p>{{ row.putInStorageNo }}</p>
					<p>入库时间:{{ row.putInStorageTime }}</p>
					<p>{{ row.putInStorageWarehouseName }}</p>
					<p>入库员：{{ row.putInStorageUserName }}</p>
				</template>
			</el-table-column>
			<el-table-column label="入库数量/入库金额" prop="rukshuliang" align="center" width="150px" v-if="props.status != 0">
				<template #default="{row}">
					<!-- {{ row.putInStorageQuantity }} /
					{{ row.putInStoragePrice }} -->
					<span v-if="row.goodsType==1&&row.putInStorageQuantity" style="color:#409eff;cursor:pointer;" @click="jumpOrder(row)">{{ row.putInStorageQuantity }}</span>
					<span v-else>{{ row.putInStorageQuantity }}</span>
					<span>/￥{{ row.putInStoragePrice }}</span>
				</template>
			</el-table-column>
			<el-table-column label="付款状态" prop="paymentStatus" align="center" width="100px" v-if="props.status == 2">
        <template #default="{ row }">
          <div v-if="row.applyStatus==2&&row.paymentStatus==2">已付款</div>
          <div v-if="row.applyStatus==2&&row.paymentStatus==1">未付款</div>
          <div v-if="row.applyStatus==2&&!row.paymentStatus">-</div>
        </template>
      </el-table-column>
			<el-table-column label="操作" align="center"  :width="props.status == 2?'150px':'230px'" fixed="right">
				<template #default="{ row }">
					<el-button type="text" @click="lookPurchaseOrder(row)">查看采购订单</el-button>
					<div v-if="status == 1">
						<el-button v-permission="'purchaseReconciliation_singleApplyRreconciliation:btn'" v-if="row.applyStatus==0" type="text" @click="router.push({ name: 'applyReconciliation',params:{id:[row.id]} })">申请对账</el-button>
						<el-button v-if="row.applyStatus==1" type="text" :disabled="true">对账中</el-button>
					</div>
				</template>
			</el-table-column>
		</el-table>
		<!-- 备注弹框 -->
		<el-dialog title="采购备注" width="500px" v-model="dialogRemark" custom-class="myDialog" :close-on-click-modal="false" :destroy-on-close="true" @close="closeRemark">
			<div class="headRemark">
				<el-form :model="form" :rules="rules" ref="formRef">
					<el-form-item label="备注类型:" prop="buttonStatus">
						<el-radio-group v-model="form.buttonStatus">
							<el-radio v-for="item in remarkButtonList" :key="item" :label="item.id">{{item.name}}</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item >
            <span style="color:#606266;margin-top:-40px;margin-right:10px">备注内容:</span>
						<el-input type="textarea" v-model="form.remarks" style="width:380px" show-word-limit maxlength="100" />
					</el-form-item>
				</el-form>
			</div>
			<!-- 底部 -->
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="closeRemark">取 消</el-button>
					<el-button type="primary" @click="submit">确 定</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { onMounted, reactive, toRefs, defineEmits } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import {
  editRemarks,//编辑备注
  deleteRemarks,
  getRemarkTypes,
  queryPurchaseVerifyRemarkDetail,//备注回显
  saveStayWarehousesRemark,//待入库编辑保存
  queryPurchaseVerifyRemarkList,
  deleteStayWarehousesRemark,//待入库删除备注
  getStayWarehousesRemarks,//待入库备注列表
} from '../api/api'
const store = useStore()
// 操作的变量
const data = reactive({
  formRef: null,
  remarkList: [],
  dialogRemark: false,
  remarkButtonList: [],
  form: {
    buttonStatus: '',
    remarks: ''
  },
  remarkId: ''
})
const rules = {
  buttonStatus: [{ required: true, message: '请选择备注类型', trigger: 'blur' }]
}
const router = useRouter()
const props = defineProps({
  status: Number,
  data: Array
})
onMounted(() => {


})
function openRemark() {
  let params = {
    useScope: props.status === 0 ? '5' : '4'
  }
  getRemarkTypes(params).then(res => {
    data.remarkButtonList = res.data
  })
}
const { remarkList, dialogRemark, form, remarkButtonList, formRef } = toRefs(data)
const emit = defineEmits(['select', 'remarkUpdate'])

function lookPurchaseOrder(row) {
  window.open(location.origin + '/#/purchase/purchaseManagement/purchaseOrder?purchaseOrderNumber=' + row.purchaseOrderNumber + '&status=null')
}
//跳转标准订单
function jumpOrder(row) {
  let params = {
    searchText: row.orderId,
    searchType: 'orderId',
    status: 999
  }
  localStorage.setItem('jumpInformation', JSON.stringify(params))
  window.open(location.origin + '/#/order/orderManagement/index')
}
//备注详情
function getRemarkDetail(id, remarkId) {
  if (props.status === 0) {
    getStayWarehousesRemarks({ remarkTypeId: remarkId, id: id }).then(res => {//待入库备注列表
      data.remarkList = res.data
    })
  } else {
    queryPurchaseVerifyRemarkList({ remarkTypeId: remarkId, purchaseVerifyItemId: id }).then(res => {
      console.log(res, 'res')
      data.remarkList = res.data
    })
  }

}
//编辑备注
function editRemark(row, id) {
  if (props.status === 0) {
    getRemarkTypes({ useScope: '5' }).then(res => {
      data.remarkButtonList = res.data
      data.form.buttonStatus = row.remarkTypeId - 0
      data.form.remarks = row.remark
      data.dialogRemark = true
    })
  } else {
    openRemark()
    queryPurchaseVerifyRemarkDetail({ id: id }).then(res => {
      data.form.buttonStatus = res.data.remarkTypeId
      data.form.remarks = res.data.remark
      data.dialogRemark = true
      // console.log(res,'res');
    })
  }

  data.remarkId = id

}
function closeRemark() {
  data.dialogRemark = false
}
//确定事件
function submit() {
  data.formRef.validate().then(() => {
    if (props.status === 0) {
      let params = {
        id: data.remarkId,
        typeId: data.form.buttonStatus,
        content: data.form.remarks
      }
      saveStayWarehousesRemark(params).then(res => {
        ElMessage.success('操作成功')
        data.dialogRemark = false
        emit('remarkUpdate', true)
      })
    } else {
      let params = {
        id: data.remarkId,
        remarkTypeId: data.form.buttonStatus,
        remark: data.form.remarks
      }
      editRemarks(params).then(res => {
        ElMessage.success('操作成功')
        data.dialogRemark = false
        emit('remarkUpdate', true)
      })
    }

  })
}
//删除备注
function deleteRemark(id) {
  ElMessageBox.confirm('确认删除该条备注?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
				"close-on-click-modal":false,
				"close-on-press-escape":false
  }).then(() => {
    if (props.status === 0) {
      deleteStayWarehousesRemark({ id: id }).then(res => {//待入库删除备注
        ElMessage.success('操作成功')
        data.dialogRemark = false
        emit('remarkUpdate', true)
      })
    } else {
      deleteRemarks({ id: id }).then(res => {
        ElMessage.success('操作成功')
        data.dialogRemark = false
        emit('remarkUpdate', true)
      })
    }
  })
}
</script>

<style lang="scss" scoped>
.pageTableReconciled {
  margin-top: 16px;
  background: #fff;
  padding: 24px;
  margin-bottom: 60px;

  .checkImg {
    display: flex;
  }
  .remarkClass {
    color: #fff;
    margin-left: 5px;
    border-radius: 4px;
    padding: 0px 5px;
  }
  .skuFont {
    width: 230px;
    .tagClass {
      overflow: hidden;
      white-space: nowrap; //表示不换
      text-overflow: ellipsis; //加省略号;
    }
  }
}
</style>
