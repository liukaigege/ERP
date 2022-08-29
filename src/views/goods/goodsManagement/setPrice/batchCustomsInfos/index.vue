<template>
	<div>
		<ErpNav title="批量修改报关信息" routeOpt='/goods/goodsManagement/setPrice' :goBack="cancel" />
		<div class="pageView">
			<vxe-table :tree-config="tableTreeConfig" :span-method="rowspanMethod" :data="tableData" :auto-resize="true" keep-source align="center" :height="tableH" :edit-config="{trigger: 'click', mode: 'row'}" :loading="loading" :export-config="{}" highlight-hover-row :edit-rules="validRules" ref="myTable">
				<vxe-column field="photoUrl" title="图片" tree-node width="120">
					<template #default="{ row }">
						<el-popover placement="right-start" trigger="hover" width="auto" v-if="row.photoUrl">
							<el-image style="width: 200px; height: 200px" :src="row.photoUrl" fit="contain"></el-image>
							<template #reference>
								<el-image style="width: 60px; height: 60px" :src="row.photoUrl" fit="contain"></el-image>
							</template>
						</el-popover>
						<div v-else class="trHead">
							<div class="left">
								<span>商品名称: {{row.goodsName}}</span>
								<span style="margin-left: 10px">商品编码: {{row.code}}</span>
							</div>
							<div class="right" @click="delEvent(row.goodsId)">
								<el-button type="text" class="el-icon-delete" :disabled="tableData.length == 1" />
							</div>
						</div>
					</template>
				</vxe-column>
				<vxe-column field="sku" title="商品SKU"></vxe-column>
				<vxe-column field="expectPrice" title="建议售价(USD)">
					<template #default="{ row }">
						<div v-if="row.expectPrice">${{row.expectPrice}}</div>
					</template>
				</vxe-column>
				<vxe-column field="nameCn" title="中文报关名" :edit-render="{name: '$input', props: {type: 'text', placeholder: '请输入', maxlength: '80', clearable: true}}"></vxe-column>
				<vxe-column field="nameEn" title="英文报关名" :edit-render="{name: '$input', props: {type: 'text', placeholder: '请输入', maxlength: '80', clearable: true}}"></vxe-column>
				<vxe-column field="weight" title="重量(g)" :edit-render="{name: '$input', props: {type: 'float', placeholder: '请输入', min: 0, max: 9999.99, step: 1, clearable: true}}"></vxe-column>
				<vxe-column field="price" title="价格(USD)" :edit-render="{name: '$input', props: {type: 'float', placeholder: '请输入', min: 0, max: 9999.99, step: 1, clearable: true}}"></vxe-column>
				<vxe-column field="material" title="材质" :edit-render="{name: '$input', props: {type: 'text', placeholder: '请输入', maxlength: '60', clearable: true}}"></vxe-column>
				<vxe-column field="purpose" title="用途" :edit-render="{name: '$input', props: {type: 'text', placeholder: '请输入', maxlength: '60', clearable: true}}"></vxe-column>
				<vxe-column field="customsCode" title="海关编码" :edit-render="{name: '$input', props: {type: 'text', placeholder: '请输入', maxlength: '20', clearable: true}}"></vxe-column>
				<vxe-column title="报关属性" width="170">
					<template #default="{ row, _rowIndex, $rowIndex }">
						<div class="formBox" v-if="row.id">
							<div style="text-align: left; position:relative; margin-bottom: 5px">
								<el-checkbox v-model="row.checked1" @change="checkboxChange(row, true)">含电</el-checkbox>
							</div>
							<div style="text-align: left; margin-bottom: 5px">
								<el-checkbox v-model="row.checked2" @change="checkboxChange(row)">含非液体化妆品</el-checkbox>
							</div>
							<div style="text-align: left;">
								<el-checkbox v-model="row.checked3" @change="checkboxChange(row)">特货（敏感货）</el-checkbox>
							</div>
							<el-select size="small" v-model="row.select" placeholder="请选择" style="width: 80px;" class="mySelect" @change="checkboxChange(row)">
								<el-option label="内电" :value="0"></el-option>
								<el-option label="纯电" :value="1"></el-option>
							</el-select>
						</div>
					</template>
				</vxe-column>
				<vxe-column title="操作">
					<template #default="{ row }">
						<div class="operation" v-if="row.id">
							<el-dropdown>
								<el-button type="text">批量填充</el-button>
								<template #dropdown>
									<el-dropdown-menu>
										<el-dropdown-item @click="bitchEvent(0, row)">所有商品</el-dropdown-item>
										<el-dropdown-item @click="bitchEvent(1, row)">相同商品</el-dropdown-item>
									</el-dropdown-menu>
								</template>
							</el-dropdown>
						</div>
					</template>
				</vxe-column>
			</vxe-table>
		</div>
		<div class="footer">
			<div class="left"></div>
			<div class="right">
				<el-button  @click="cancel">取消</el-button>
				<el-button type="primary"  style="margin-left: 16px" @click="affirm">确定</el-button>
			</div>
		</div>
	</div>
</template>

<script>
	import { ref, reactive, toRefs, onMounted, nextTick } from 'vue'
	import { useRoute, useRouter } from 'vue-router'
	import { ElMessageBox, ElMessage } from 'element-plus';
	import { _debounce } from '@/utils/tool.js'
	import { customsInfo, editCustomsInfo } from '@/api/goods/quotedPrice.js'
	import ErpNav from '@/components/erpNav/index.vue';
	export default {
		components: {
			ErpNav
		},
		setup() {
			let route = useRoute()
			let router = useRouter()
			let myTable = ref(null)
			let state = reactive({
				tableData: [],
				tableTreeConfig: {
					children: 'skuList',
				},
				loading: false,
				tableH: '610'
			})

			let validRules = {
				nameCn: [
					{
						required: true,
						validator({ cellValue, row }) {
							if (row.id) {
								if (cellValue !== 0 && !cellValue) return new Error('请输入中文报关名')
							}
						}
					}
				],
				nameEn: [
					{
						required: true,
						validator({ cellValue, row }) {
							if (row.id) {
								if (cellValue !== 0 && !cellValue) return new Error('请输入英文报关名')
							}
						}
					}
				],
				weight: [
					{
						required: true,
						validator({ cellValue, row }) {
							if (row.id) {
								if (cellValue !== 0 && !cellValue) return new Error('请输入重量')
							}
						}
					}
				],
				price: [
					{
						required: true, validator({ cellValue, row }) {
							if (row.id) {
								if (cellValue !== 0 && !cellValue) return new Error('请输入价格')
							}
						}
					}
				]
			}

			let rowspanMethod = ({ row, columnIndex }) => {
				if (row.skuList?.length) {
					if (columnIndex == 0) {
						return { rowspan: 1, colspan: 12 }
					} else {
						return { rowspan: 0, colspan: 0 }
					}
				}
			}

			// 返回
			let cancel = () => {
				ElMessageBox.confirm('确认取消？', '提示', {
					confirmButtonText: '确认',
					cancelButtonText: '取消',
					type: 'warning',
				})
					.then(() => {
						router.push({
              path: '/goods/goodsManagement/setPrice'
            })
					})
				
			}

			// 确认
			let affirm = _debounce(async () => {
				const errMap = await myTable.value.validate(true).catch(errMap => errMap)
				if (errMap) {
					ElMessage.error('信息填写错误，提交失败')
					return false;
				}
        let list = []
        state.tableData.forEach(item => {
          item.skuList.forEach(it => {
            if (it.weight) it.weight = parseFloat(it.weight)
            if (it.price) it.price = parseFloat(it.price)
            list.push(it)
          })
        })
				editCustomsInfo({ list }).then(res => {
					if (res.code == 200) {
						ElMessage.success({ message: '提交成功！', type: 'success' })
            router.push({
              path: '/goods/goodsManagement/setPrice'
            })
					} else {
						ElMessage.error(res.message)
					}
				})
			})

			// 批量填充
			let bitchEvent = _debounce((type, itemInfo) => {
				let id = itemInfo.id
				let parentIndex
				state.tableData.forEach((item, index) => {
					item.skuList.some(it => {
						if (id == it.id) {
							parentIndex = index
							return true
						}
					})
				})
				function batch(item) {
					item.nameCn = itemInfo.nameCn
					item.nameEn = itemInfo.nameEn
					item.weight = itemInfo.weight
					item.purpose = itemInfo.purpose
					item.material = itemInfo.material
					item.price = itemInfo.price
					item.customsCode = itemInfo.customsCode
					item.attr = itemInfo.attr
				}
				state.tableData.forEach((item, index) => {
					item.skuList.forEach(it => {
						if (type == 1) { // 相同商品
							if (parentIndex == index && it.id !== id) {
								batch(it)
							}
						} else { // 所有商品
							if (it.id !== id) {
								batch(it)
							}
						}
					})

				})
				initFun(state.tableData)
				ElMessage.success({ message: '操作成功！', type: 'success' })
			})

			// 报关属性发生变化时
			let checkboxChange = ({ id, checked1, select }, bole) => {
        console.log(id, checked1)
				state.tableData.forEach(item => {
					item.skuList.forEach(it => {
            if (bole && it.id == id) it.select = checked1 ? 0 : null
						let attr = []
						if (it.checked1 && it.select == 0) attr.push('含电内电')
						if (it.checked1 && it.select == 1) attr.push('含电纯电')
						if (it.checked2) attr.push('含非液体化妆品')
						if (it.checked3) attr.push('特货（敏感货）')
						it.attr = attr.join(',')
					})
				})
			}

			let initFun = (data) => {
				data.forEach(item => {
					item.skuList.forEach(it => {
						let attr = it.attr
						if (attr) {
							it.checked1 = attr.indexOf('含电') == -1 ? false : true
							it.checked2 = attr.indexOf('含非液体化妆品') == -1 ? false : true
							it.checked3 = attr.indexOf('敏感') == -1 ? false : true
							it.select = attr.indexOf('内电') !== -1 ? 0 : attr.indexOf('纯电') !== -1 ? 1 : 0 // 若为undefind则默认为内电
						}
					})
				})
				return data
			}

			let getCustomsInfo = () => {
				console.log(route.query.goodsId)
				let goodsIds = route.query.goodsId.split(',')
				customsInfo({ goodsIds }).then(res => {
					if (res.code == 200) {
						state.tableData = initFun(res.data)
						nextTick(() => {
							myTable.value.setAllTreeExpand(true)
						})
					}
				})
			}

			let delEvent = (goodsId) => {
				state.tableData = state.tableData.filter(item => item.goodsId !== goodsId)
			}

			onMounted(() => {
				getCustomsInfo()
				state.tableH = document.body.clientHeight - 320 + ''

			})

			return {
				...toRefs(state),
				validRules,
				myTable,
				rowspanMethod,
				affirm,
				cancel,
				checkboxChange,
				bitchEvent,
				delEvent
			}
		}
	}
</script>

<style lang="scss" scoped>
.pageView {
	margin-top: 28px;
	.trHead {
		display: flex;
		justify-content: space-between;
		padding-right: 15px;
	}
	.mySelect {
		position: absolute;
		left: 60px;
		top: 0;
	}
	.formBox {
		margin: 10px 0;
		display: flex;
		flex-direction: column;
		position: relative;
    .el-checkbox{
      height: auto
    }
	}
	.operation {
		display: flex;
		flex-direction: column;
	}
	a {
		color: #000;
	}
	.right {
		:deep(.el-button) {
			padding: 0;
			height: 14px;
			min-height: 14px;
		}
	}
}
.footer {
	position: fixed;
	width: 100%;
	// bottom: 0;
	top: 100vh;
	right: 0;
	transform: translateY(-100%);
	z-index: 1000;
	width: calc(100% - var(--sideBarWidth));
	height: 52px;
	background-color: #fff;
	display: flex;
	justify-content: space-between;
	align-items: center;
	border-top: 1px solid #e8e8e8;
	padding: 0 24px;
}
:deep(.vxe-cell, .c--tooltip) {
	max-height: 90px !important;
}
:deep(.vxe-header--row) {
	background-color: #f5f7fa;
	color: #000;
}
:deep(.vxe-cell--tree-node) {
	padding-left: 0 !important;
}
</style>