<template>
	<el-dialog title="配件信息" v-model="ifShow"  :width="1000" custom-class="myDialog" :close-on-click-modal="false" :destroy-on-close="true" @close="close">
		<div class="contentView">
			<vxe-table keep-source :scroll-y="{ enabled: true, gt: 20 }" :max-height="480" :data="tableData" border :edit-config="{ trigger: 'click', mode: 'row', showStatus: true }" align="center" ref="tableRef">
				<vxe-column title="主件信息" width="250px">
					<template #default="{row}">
						<div class="info-box">
							<div class="img-box">
								<el-popover placement="right-start" trigger="hover" width="auto">
									<el-image style="width: 200px; height: 200px" :src="row.mainImg" fit="contain"></el-image>
									<template #reference>
										<el-image style="width: 80px; height: 80px" :src="row.mainImg" fit="contain"></el-image>
									</template>
								</el-popover>
							</div>
							<div class="item-info">
								<div>{{row.sku}}</div>
								<div>{{row.currency}} {{row.price}}</div>
								<!-- <div>x {{row.quantity}}</div> -->
								<div>x {{row.purchaseQuantity}}</div>
							</div>
						</div>
					</template>
				</vxe-column>
				<vxe-column title="订单号" field="orderId"></vxe-column>
				<!-- <vxe-column title="" width="200">
					<template #header>
						<span style="color:red">*</span>
						配件名称
					</template>
					<template #default="{row}">
						<div v-for="item in row.partsRels" :key="item.partsId" class="item-box">
							<el-input disabled v-model="item.partsName"></el-input>
						</div>
					</template>
				</vxe-column>
				<vxe-column title="" width="150">
					<template #header>
						<span style="color:red">*</span>
						配件数量
					</template>
					<template #default="{row}">
						<div v-for="item in row.partsRels" :key="item.partsId" class="item-box">
							<el-input-number disabled v-model="item.partsNum" style="width:120px" :controls="false"></el-input-number>
						</div>
					</template>
				</vxe-column>
				<vxe-column title="" width="150">
					<template #header>
						<span style="color:red">*</span>
						配件单价
					</template>
					<template #default="{ row }">
						<div v-for="(item,index) in row.partsRels" :key="index" class="item-box">
							<div class="del-box">
								<el-input-number disabled v-model="item.partsPrice" style="width:120px" :controls="false"></el-input-number>
							</div>
						</div>
					</template>
				</vxe-column> -->
        	<vxe-column title="" width="150">
					<template #header>
						<!-- <span style="color:red">*</span> -->
						配件金额（¥）
					</template>
					<template #default="{ row }">
						<el-input v-if="row.importStatus==3||row.importStatus==1" disabled v-model="row.partTotalPrice" style="width:120px" :controls="false"></el-input>
            <el-input-number v-if="row.importStatus==0" disabled  style="width:120px" :controls="false"></el-input-number>
					</template>
				</vxe-column>
        <vxe-column title="更新时间">
          <template #default="{ row }">
          <div>{{row.importDate}}</div>
          <div>{{row.importUser}}</div>
          </template>
        </vxe-column>
			</vxe-table>
		</div>
	</el-dialog>
</template>

<script>
	import { onMounted, reactive, ref, toRefs } from 'vue'
	import { partsRelForm } from '@/api/purchase/purchase'
	import { ElMessage } from 'element-plus'
	export default {
		props: {
			partId: {
				type: Number,
				default: ''
			},
		},
		emits: ['closeEvent'],
		setup(props, context) {
			let state = reactive({
				ifShow: true,
				tableData: [],
			})
			// 关闭弹框
			let close = (refresh = false) => {
				state.ifShow = false
				setTimeout(() => {
					context.emit('closeEvent',)
				}, 500)
			}
			onMounted(() => {
				query()
			})
			function query() {
				partsRelForm({ itemId: props.partId }).then(res => {
          res.data.forEach(item=>{
            if(item.importStatus==1) return item.partTotalPrice='-'
          })
					state.tableData = res.data
				})
			}

			return {
				...toRefs(state),
				close,
			}
		}
	}
</script>

<style lang="scss" scoped>
.contentView {
	::v-deep(.el-input__inner) {
		text-align: center;
	}
	.info-box {
		display: flex;
		align-items: center;
	}
	.del-box {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.img-box {
		display: flex;
		align-items: center;
		margin-right: 15px;
		padding: 5px 0;
	}
	.item-info {
		text-align: left;
	}
	.item-box + .item-box {
		margin-top: 10px;
	}
	.edit + .edit {
		margin-top: 8px;
	}
	:deep(.el-radio) {
		margin-right: 16px;
	}
}
</style>
