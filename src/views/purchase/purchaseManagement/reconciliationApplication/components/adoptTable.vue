<template>
	<!-- 草稿 -->
	<div class="headAdoptTable">
		<vxe-table highlight-hover-row auto-resize align="center" max-height="600" ref="xTable1" :data="tabelData" @checkbox-all="selectAllEvent" @checkbox-change="selectChangeEvent">
			<vxe-column type="checkbox" width="60"></vxe-column>
			<vxe-column title="对账单号" field="serialNumber" min-width="150"></vxe-column>
			<vxe-column title="供应商" field="supplierName"  show-overflow min-width="120"></vxe-column>
			<vxe-column title="结算方式" field="settlementTypeName" width="120">
				<template #default="{row}">
					<p v-if="row.settlementType == '2'">账期({{row.settlementValue}}天)
          </p>
					<span v-else>
						{{{"1":'预付',"3":"货到付款","4":"款到发货"}[row.settlementTypeName]}}
            <span v-if="row.settlementType==1">({{row.settlementValue}}{{{'1':'%','2':'元'}[row.settlementUnit]}})</span>
        </span>
      </template>
      </vxe-column>
			<vxe-column title="采购单数" field="purchaseQuantity" width="100"></vxe-column>
			<vxe-column title="入库单数" field="putInStorageQuantity" width="100"></vxe-column>
			<vxe-column title="SKU种类" field="skuQuantity" width="100"></vxe-column>
			<vxe-column title="对账商品数" field="goodsQuantity" width="100"></vxe-column>
			<vxe-column title="对账金额" field="totalAmount" width="100">
        <template #default="{row}">
        <div >¥{{row.totalAmount?row.totalAmount:'0'}}</div>
        </template>
      </vxe-column>
			<vxe-column title="创建时间" field="createTime" width="100">
        <template #default="{row}">
        <div :class="!timeLimt(row.createTime)?'redColor':''">{{row.createTime}}</div>
        </template>
      </vxe-column>
			<vxe-column title="申请人" field="createByName" width="100"></vxe-column>
			<vxe-column title="回执文件" field="fileQuantity" width="100"></vxe-column>
			<vxe-column title="操作" width="320" fixed="right">
				<template #default="{row}">
         <div class="tableOption">
					<el-button type="text" v-permission="'reconciliationApplication_singleAudit:btn'" @click="resubmit(row.id,1)">提交审核</el-button>
            	<UploadImg ref="uploadImg" :data="[]" id="uploadImg" moduleName="spe" :addNameWithSize="true" :isTrigger="true" :showFileList="false" :isCompress="true" :isNoFilieList="true" @getFileList="getImgList"  :limit="10" :maxSize="20" :notAcceptedType="notAcceptedType">
						<template #trigger>
							<el-button type="text" @click="clearn(row.id)" >上传回执</el-button>
						</template>
					</UploadImg>
					<!-- <el-button type="text">打印</el-button> -->
					<el-button type="text" @click="jumpEdit(row.id)">编辑</el-button>
					<el-popconfirm icon="el-icon-info" title="是否删除对账单？" @confirm="deleteList(row)">
						<template #reference>
							<el-button type="text" style="color:#FD4C60;" v-permission="'reconciliationApplication_singleDelete:btn'">删除</el-button>
						</template>
					</el-popconfirm>
          </div>
				</template>
			</vxe-column>
		</vxe-table>
	</div>
</template>

<script>
	import { reactive, toRefs, watch, ref } from 'vue'
	import UploadImg from '@/components/uploadImg/index.vue'
	import { queryBatchDelete, queryBatchUploadReceipt } from '../api/api.js'
	import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
	export default {
		props: {
			checkType: {
				type: Number,
				default: 0
			},
			tabelData: { // 列表数据
				type: Array,
				default: () => []
			},
			notAcceptedType: {
				Type: Array,
				default: ['jpg', 'jpeg', 'png', 'bmp']
			}
		},
		components: {
			UploadImg
		},
		emits: ['selecDataList', 'deleteInit','batchApprove','updateList'],
		setup(props, context) {
			const router = useRouter()
			const uploadImg = ref(null)
			const state = reactive({
				xTable1: null,
				settlementTypeNameList: [{

				}],
				checkData: [],//选择表格数据
				imgList: [],//图片集合
        imgId: '',
			})
			//监听头部按钮改变清空选择框
			watch(() => props.checkType, val => {
				// state.xTable1.refreshColumn()
				// state.xTable1.clearCheckboxRow()
			})
			function selectAllEvent({ checked, records }) {
				state.checkData = records.map(item => item.id)
				context.emit('selecDataList', state.checkData)
			}
			function selectChangeEvent({ checked, records }) {
				state.checkData = records.map(item => item.id)
				context.emit('selecDataList', state.checkData)
			}
			//跳转详情
			function jumpEdit(id) {
				router.push({ name: 'reconciliationEdit',params:{id:id} })
			}
			//提交审核
			function resubmit(id,type) {
				context.emit('batchApprove',id,type)
			}
			//删除
			function deleteList(row) {
				//  queryBatchDelete({ids:[row.id]}).then(res=>{
				//    console.log(res);
				//    context.emit('deleteInit')
				//  })
				context.emit('deleteInit', row.id)
			}
			//图片
			function clearn(id) {
				state.imgList = []
				state.imgId = id
				resertUpload()
			}
			function resertUpload() {
				uploadImg.value.resert()
			}
			function getImgList(val) {
				if (state.imgList.length >= 10) {
					ElMessage.error('最多可添加10张图片')
					return false
				}
				val = val.filter(val => val != undefined)
				state.imgList = val.map(item => item.fileUrl)
				console.log(state.imgList,'图片');
        if(state.imgList.length==0) return
				let params = {
					id: state.imgId,
					urlList: state.imgList
				}

				queryBatchUploadReceipt(params).then(res => {
					// ElMessage.success('操作成功')
          context.emit('updateList')
				})
			}
     function timeLimt(data = '2021-11-25 17:09:00'){
       const inTimestamp = new Date(data).getTime()
       const nowTimestamp = new Date().getTime()
       if(inTimestamp+(1*24*60*60*1000)>=nowTimestamp){
         return true
       }else{
         return false
       }
     }
			return {
				...toRefs(state),
				selectAllEvent,
				selectChangeEvent,
				resubmit,
				jumpEdit,
				deleteList,
				uploadImg,
				clearn,
				getImgList,
        timeLimt
			}

		}
	}
</script>

<style lang="scss" scoped>
.headAdoptTable {
	background: #fff;
	padding: 16px;
	margin-top: 24px;
	margin-bottom: 60px;
  .redColor{
    color: #f56c6c;
  }
	.tableOption {
		display: flex;
		justify-content: space-between;
		padding: 0 10px;
		::v-deep(.el-button + .el-button) {
			margin: 0;
		}
	}
}
</style>>
