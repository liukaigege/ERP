<template>
	<div class="logistics-box">
		<div class="title">报关信息</div>
		<div class="content">
			<div class="form-box" v-if="isEdit">
				<el-form label-width='150'  v-if="isEdit &&!isSpecial">
					<el-row class="item-form">
						<el-form-item>
							<template #label>
								<el-checkbox v-model="declareState.nameCn.status">中文报关名：</el-checkbox>
							</template>
							<el-input placeholder="请输入" v-model="declareState.nameCn.value" maxlength="80"></el-input>
						</el-form-item>
						<el-form-item>
							<template #label>
								<el-checkbox v-model="declareState.nameEn.status">英文报关名：</el-checkbox>
							</template>
							<el-input placeholder="请输入" maxlength="80" v-model="declareState.nameEn.value"></el-input>
						</el-form-item>
						<el-form-item>
							<template #label>
								<el-checkbox v-model="declareState.weight.status">重量：</el-checkbox>
							</template>
							<erp-number-input placeholder="请输入" v-model="declareState.weight.value" :min=0.01 :max="99999.99" :precision='2'>
								<template #append>g</template>
							</erp-number-input>
						</el-form-item>
						<el-form-item>
							<template #label>
								<el-checkbox v-model="declareState.price.status">价格：</el-checkbox>
							</template>
							<erp-number-input placeholder="请输入" v-model="declareState.price.value" :min=0.01 :max="999999.99" :precision='2'>
								<template #append>USD</template>
							</erp-number-input>
						</el-form-item>
						<el-form-item>
							<template #label>
								<el-checkbox v-model="declareState.material.status">材质：</el-checkbox>
							</template>
							<el-input placeholder="请输入" maxlength="60" v-model="declareState.material.value"></el-input>
						</el-form-item>
					</el-row>
					<el-row class="item-form">
						<el-form-item>
							<template #label>
								<el-checkbox v-model="declareState.purpose.status">用途：</el-checkbox>
							</template>
							<el-input placeholder="请输入" maxlength="60" v-model="declareState.purpose.value"></el-input>
						</el-form-item>
						<el-form-item>
							<template #label>
								<el-checkbox v-model="declareState.customsCode.status">海关编码：</el-checkbox>
							</template>
							<el-input placeholder="请输入" maxlength="20" v-model="declareState.customsCode.value"></el-input>
						</el-form-item>
						<el-form-item class="long-item">
							<template #label>
								<el-checkbox v-model="declareState.attr.status">报关属性：</el-checkbox>
							</template>
							<div class="declare-box">
								<div class="declare-item">
									<el-checkbox v-model="declareState.attr.value.isElectric" @change="setElectricType">含电</el-checkbox>
									<el-select size='small' v-model="declareState.attr.value.electricType">
										<el-option value="含电内电" label="内电"></el-option>
										<el-option value="含电纯电" label="纯电"></el-option>
									</el-select>
								</div>
								<el-checkbox v-model="declareState.attr.value.isLiquid">含非液体化妆品</el-checkbox>
								<el-checkbox v-model="declareState.attr.value.isSpecial">特货 (敏感货)</el-checkbox>
							</div>
						</el-form-item>
						<el-form-item class="aside-item">
							<el-button type="primary" @click="batchFill">批量填充</el-button>
						</el-form-item>
					</el-row>
				</el-form>
			</div>
			<vxe-table :data="info.skus" v-bind="declareOptions" :editConfig="editConfig">
				<vxe-column field="speVal" title="规格值" min-width="150" v-if="!isSpecial">
					<template #default='{row}'>
						<span class="isNew" v-if="row.isAdd== 1">新</span>
						<span>{{row.speVal}}</span>
					</template>
				</vxe-column>
				<vxe-column title="商品中文名称" min-width="150" v-else>
					<template #default>
						<span>{{info.goodsName || info.goodsNameEn}}</span>
					</template>
				</vxe-column>
				<vxe-column title="建议售价（USD）" width="150">
					<template #default="{row}">
						<div> {{calcPrice(row)}}</div>
					</template>
				</vxe-column>
				<vxe-column field="nameCn" title="中文报关名" :edit-render="{name: '$input',props: {maxlength: 80}}" min-width="120"></vxe-column>
				<vxe-column field="nameEn" title="英文报关名" :edit-render="{name: '$input',props: {maxlength: 80}}" min-width="120"></vxe-column>
				<vxe-column field="weight" width="150" title="重量（g）" :edit-render="{name: '$input',props: {type: 'float',min: 0.01,max: 99999.99,controls: false}}"></vxe-column>
				<vxe-column field="price" width="150" title="价格（USD）" :edit-render="{name: '$input',props: {type: 'float',min: 0.01,max: 9999.99,controls: false}}">
				</vxe-column>
				<vxe-column field="material" title="材质" min-width="80" :edit-render="{name: '$input',props: {maxlength: 60}}"></vxe-column>
				<vxe-column field="purpose" title="用途" min-width="80" :edit-render="{name: '$input',props: {maxlength: 60}}"></vxe-column>
				<vxe-column field="customsCode" title="海关编码" min-width="80" :edit-render="{name: '$input',props: {maxlength: 20}}"></vxe-column>
				<vxe-column title="报关属性" width="200" :showOverflow='false'>
					<template #default="{row}">
						<div class="declare-content">
							<div class="declare-item">
								<el-checkbox v-model="row.isElectric"  :disabled="isDisabled(row)" @change="setRow(row,true)">含电</el-checkbox>
								<el-select size='small' style="width: 150px" v-model="row.electricType" :disabled="isDisabled(row)" @change="setRow(row)">
									<el-option value="含电内电" label="内电"></el-option>
									<el-option value="含电纯电" label="纯电"></el-option>
								</el-select>
							</div>
							<el-checkbox v-model="row.isLiquid"  :disabled="isDisabled(row)" @change="setRow(row)">含非液体化妆品</el-checkbox> <br/>
							<el-checkbox v-model="row.isSpecial"  :disabled="isDisabled(row)" @change="setRow(row)">特货(敏感货)</el-checkbox>
						</div>
					</template>
				</vxe-column>
			</vxe-table>
		</div>
	</div>
</template>
<script>
	import { ref, watch } from "vue";
	import erpNumberInput from '@/components/erpNumberInput/index.vue'
	import batchFillAbles from '../composables/batchFillAbles'
	import { declareOptions } from '../composables/tableOptions'
	import { ElMessage } from 'element-plus'
	export default {
		props: {
			isEdit: Boolean,
			info: Object,
			isQuoted: Boolean,
			isSpecial: Boolean,
			rate: [Number, String]
		},
		components: { erpNumberInput },
		setup(props) {
			let attrObj = {
				isLiquid: '含非液体化妆品',
				isSpecial: '特货(敏感货)',
			}
			let { declareState } = batchFillAbles(props.isQuoted)
			function batchFill() {
				if (Reflect.ownKeys(declareState).every(key => !declareState[key].status)) {
					ElMessage({
						message: '请选择左侧批量填充参数',
						type: 'error',
					})
					return
				}
				props.info.skus?.forEach(item => {
					Reflect.ownKeys(declareState).forEach(key => {
						if (declareState[key].status && item.lgtSwitch === 1 && (item.lgtStatch !== 1 || !props.isQuoted)) {
							if (key === 'attr') {
								let obj = declareState[key].value
								item['electricType'] = obj.electricType
								item['isElectric'] = obj.isElectric
								item['isLiquid'] = obj.isLiquid
								item['isSpecial'] = obj.isSpecial
								let attr = [obj.isLiquid ? attrObj.isLiquid : '', obj.isSpecial ? attrObj.isSpecial : '', obj.isElectric && obj.electricType ? obj.electricType : '']
								item.attr = attr.filter(item => item).join(',')
							} else {
								item[key] = declareState[key].value
							}

						}
					})
				})
			}
			function setElectricType(v) {
				if (v) declareState.attr.value.electricType = '含电内电'
				else declareState.attr.value.electricType = ''
			}
			function calcPrice(row) {
				let { purchasePrice, suggestPriceFactor } = row
				if (purchasePrice && suggestPriceFactor) {
					return ((Number(purchasePrice) * Number(suggestPriceFactor)) * props.rate ).toFixed(2)
				}
				return ''
			}
			function setRow(row, isElectric) {
        if (isElectric) {
					if (row.isElectric) row.electricType = '含电内电'
					else row.electricType = ''
				}
				let attr = [row.isLiquid ? attrObj.isLiquid : '', row.isSpecial ? attrObj.isSpecial : '', row.isElectric && row.electricType ? row.electricType : '']
				row.attr = attr.filter(item => item).join(',')
			}
      function isDisabled(row) {
        return !props.isEdit || !( row.lgtSwitch === 1 && (row.lgtStatch !== 1 || !props.isQuoted) || props.isSpecial)
      }
			let tableRef = ref(null)
			watch(() => props.isEdit, () => {
				editConfig.enabled = props.isEdit
				tableRef.value.refreshColumn()
			})
			let editConfig = {
				trigger: 'click', mode: 'cell', enabled: props.isEdit, activeMethod({ row }) {
					return row.lgtSwitch === 1 && (row.lgtStatch !== 1 || !props.isQuoted) || props.isSpecial
				}
			}
			return {
				declareState,
				batchFill,
				setRow,
				declareOptions,
				tableRef,
				editConfig,
				calcPrice,
				setElectricType,
        isDisabled
			}
		}
	}

</script>
<style lang="scss" scoped>
	.heavy-header {
		display: flex;
		justify-content: center;
	}
	.form-box {
		border-bottom: 1px dashed #e9e9e9;
		margin-bottom: 20px;
    padding-bottom: 20px;
	
		.aside-item {
			flex-grow: 1;
			text-align: right;
		}
	}
	.long-item {
		::v-deep(.el-form-item__content) {
			width: 460px;
		}
	}
	.isNew {
		background: red;
		color: #fff;
		margin-right: 5px;
		padding: 3px 5px;
	}
	.declare-box {
		display: flex;
		align-items: center;
		padding: 0 15px;
		height: 32px;
		border: 1px solid rgba(0, 0, 0, 0.15);

		::v-deep(.el-form-item__content) {
			width: 270px;
		}
	}
	.declare-item {
		display: flex;
		align-items: center;
		margin-right: 15px;
		::v-deep(.el-select) {
			margin-left: 10px;
			width: 90px;
		}
	}
	.declare-content {
		text-align: left;
		padding: 10px 0;
	}
</style>