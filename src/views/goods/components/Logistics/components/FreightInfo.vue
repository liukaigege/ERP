<template>
	<div class="logistics-box">
		<div class="title">运费信息</div>
		<div class="content">
			<div class="form-box" v-if="isEdit && !isSpecial">
				<el-form  label-width='100px'>
					<el-form-item label="预估运费：" class="item-form" >

							<el-form-item>
								<template #label>
									<el-checkbox v-model="freightState.freightUsa.status">美国：</el-checkbox>
								</template>
								<erp-number-input placeholder="请输入" v-model="freightState.freightUsa.value" :min=0.01 :max="9999.99" :precision='2'>
									<template #append>CNY</template>
								</erp-number-input>
							</el-form-item>
							<el-form-item label-width='110px'>
								<template #label>
									<el-checkbox v-model="freightState.freightCan.status">加拿大：</el-checkbox>
								</template>
								<erp-number-input placeholder="请输入" v-model="freightState.freightCan.value" :min=0.01 :max="9999.99" :precision='2'>
									<template #append>CNY</template>
								</erp-number-input>
							</el-form-item>
							<el-form-item>
								<template #label>
									<el-checkbox v-model="freightState.freightEur.status">欧洲：</el-checkbox>
								</template>
								<erp-number-input placeholder="请输入" v-model="freightState.freightEur.value" :min=0.01 :max="9999.99" :precision='2'>
									<template #append>CNY</template>
								</erp-number-input>
							</el-form-item>
							<el-form-item>
								<template #label>
									<el-checkbox v-model="freightState.freightEatus.status">欧美：</el-checkbox>
								</template>
								<erp-number-input placeholder="请输入" v-model="freightState.freightEatus.value" :min=0.01 :max="9999.99" :precision='2'>
									<template #append>CNY</template>
								</erp-number-input>
							</el-form-item>
							<el-form-item class="aside-item">
								<el-button type="primary" @click="batchFill">批量填充</el-button>
							</el-form-item>

					</el-form-item>
				</el-form>
			</div>
			<div class="attr-box">
				<div>
					<label>特殊属性：</label>
					<ul class="attr-info" v-if="info.attr">
						<li v-for="item in info.attr?.split(',')" :key="item">{{item}}</li>
					</ul>
					<span v-else>无</span>
				</div>
				<div>
					<label>重量筛选：</label>
					<el-input-number v-model="minWeight" :min="0"  style="width: 100px" placeholder="最小重量" :controls="false"></el-input-number>
					<span> - </span>
					<el-input-number v-model="maxWeight" :min="0"  style="width: 100px" placeholder="最大重量" :controls="false"></el-input-number>
					<el-button type="primary" @click="filterWeight"  style="margin-left: 15px">筛选</el-button>
					<el-button @click="reset" >重置</el-button>
				</div>
			</div>
			<vxe-table :data="tableData" v-bind='freightOptions' :editConfig="editConfig">
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
				<vxe-column field="purchaseLWH" title="" min-width="150" v-if='isQuoted'>
					<template #header>
						<div>商品体积cm<sup s>3</sup></div>
					</template>
				</vxe-column>
				<vxe-column title="SKU开关" width="100" v-if="!isSpecial">
					<template #header>
						<span>SKU开关</span>
						<el-tooltip effect="dark" content="针对暂时空运不到的商品SKU可进行关闭，关闭后仍可继续报价并保留报价信息" placement="top">
							<i style="font-size: 14px" class="el-icon-question"></i>
						</el-tooltip>
					</template>
					<template #default='{row}'>
						<el-switch v-if='isEdit && isQuoted' v-model="row.skuSwitch" :active-value='1' :inactive-value='0' :disabled="row.skuStatus || row.lgtStatch == 1"></el-switch>
						<div v-else>{{row.skuSwitch==1 ? '开启': '关闭'}}</div>
					</template>
				</vxe-column>
				<vxe-column title="报价开关" width="100" v-if="!isSpecial && isQuoted">
					<template #header>
						<span>报价开关</span>
						<el-tooltip effect="dark" content="针对不符合要求的商品SKU可拒绝报价，关闭后报价信息可不填" placement="top">
							<i style="font-size: 14px" class="el-icon-question"></i>
						</el-tooltip>
					</template>
					<template #default='{row}'>
						<el-switch v-model="row.lgtSwitch" :active-value='1' :inactive-value='0' :disabled="row.puhSwitch === 0 || row.lgtStatch == 1" @change='setStatus($event,row)'></el-switch>
					</template>
				</vxe-column>
				<vxe-colgroup title="包装体积">
					<vxe-column field="length" title="长（cm）" width="90">
					</vxe-column>
					<vxe-column field="width" title="宽（cm）" width="90">
					</vxe-column>
					<vxe-column field="height" title="高（cm）" width="90">
					</vxe-column>
				</vxe-colgroup>
				<vxe-column min-width="200">
					<template #header>
						<div class="heavy-header">
							<div>
								<span class="required">*</span>
								<span>体积重（kg）</span>
							</div>
							<el-select size="small" style="width: 85px" v-model="weight">
								<el-option value="5000"></el-option>
								<el-option value="6000"></el-option>
								<el-option value="7000"></el-option>
								<el-option value="8000"></el-option>
								<el-option value="10000"></el-option>
							</el-select>
						</div>
					</template>
					<template #default='{row}'>
						<div>{{calcWeight(row) }} </div>
					</template>
				</vxe-column>
				<vxe-column field="purchaseWeight" title="重量（kg）" min-width="100" :formatter="fmtWeight"></vxe-column>
				<vxe-colgroup title="预估运费（CNY）">
					<vxe-column field="freightUsa" title="美国" width="100" :edit-render="{name: '$input',immediate: true,props: {type:'float', min:0.01 ,max:9999.99, controls:false}}"></vxe-column>
					<vxe-column field="freightCan" title="加拿大" width="100" :edit-render="{name: '$input',props: {type: 'float',min: 0.01,max: 9999.99,controls: false}}"> </vxe-column>
					<vxe-column field="freightEur" title="欧洲" width="80" :edit-render="{name: '$input',props: {type: 'float',min: 0.01,max: 9999.99,controls: false}}"> </vxe-column>
					<vxe-column field="freightEatus" title="欧美" width="80" :edit-render="{name: '$input',props: {type: 'float',min: 0.01,max: 9999.99,controls: false}}"> </vxe-column>
				</vxe-colgroup>
				<vxe-column title="组合品" min-width="150" v-if="info.combineType == 2" width="100">
					<template #default="{row}">
						<el-button type="text" @click="openRelation(row)">查看</el-button>
					</template>
				</vxe-column>
			</vxe-table>
		</div>
		<relation-dialog v-if="showRelation" :info ="relationInfo" @close="showRelation = false"></relation-dialog>
	</div>
</template>
<script>
	import { ref, watch, nextTick, reactive, toRefs, watchEffect } from "vue";
	import erpNumberInput from '@/components/erpNumberInput/index.vue'
	import batchFillAbles from '../composables/batchFillAbles'
	import { freightOptions } from '../composables/tableOptions'
	import { ElMessage } from 'element-plus'
	import RelationDialog from '@/views/components/RelationDialog.vue'
	export default {
		props: {
			isEdit: Boolean,
			isSpecial: Boolean,
			isQuoted: Boolean,
			info: Object
		},
		components: { erpNumberInput, RelationDialog },
		setup(props) {
			let tableRef = ref(null)
			let weight = ref(6000)

			watch(() => props.isEdit, () => {
				editConfig.enabled = props.isEdit
				tableRef.value.refreshColumn()
			})
			let filterState = reactive({
				minWeight: undefined,
				maxWeight: undefined,
				tableData: [],
				showRelation: false,
        relationInfo: {}
			})
			watchEffect(() => {
				let data = props.info
				filterState.tableData = data.skus
			})
			let editConfig = {
				trigger: 'click', mode: 'cell', enabled: props.isEdit, activeMethod({ row }) {
					return row.lgtSwitch === 1 && (row.lgtStatch !== 1 || !props.isQuoted) || props.isSpecial
				}
			}
			let { freightState } = batchFillAbles(props.isQuoted)
			function filterWeight() {
				filterState.tableData = props.info.skus.filter(item => {
					if (filterState.minWeight && filterState.maxWeight) return item.purchaseWeight >= filterState.minWeight * 1000 && item.purchaseWeight <= filterState.maxWeight * 1000
					if (filterState.minWeight) return item.purchaseWeight >= filterState.minWeight * 1000
					if (filterState.maxWeight) return item.purchaseWeight <= filterState.maxWeight * 1000
					return true
				})
			}
			function reset() {
				filterState.maxWeight = undefined
				filterState.minWeight = undefined
				filterState.tableData = props.info.skus
			}
			function batchFill() {
				if (Reflect.ownKeys(freightState).every(key => !freightState[key].status)) {
					ElMessage({
						message: '请选择左侧批量填充参数',
						type: 'error',
					})
					return
				}
				filterState.tableData?.forEach(item => { //
					Reflect.ownKeys(freightState).forEach(key => {
						if (freightState[key].status && item.lgtSwitch === 1 && (item.lgtStatch !== 1 || !props.isQuoted)) {
							item[key] = freightState[key].value
						}
					})
				})
			}
			function setStatus(v, row) {
				if (row.lgtSwitch === 0) {
					nextTick(() => {
						row.skuSwitch = 0
					})
				}
			}
			function calcWeight(row) {
				let { length, width, height } = row
				if (length && width && height) return ((length * width * height) / weight.value).toFixed(2)
				return ''
			}
			function fmtWeight({ row }) {
				return (row.purchaseWeight / 1000).toFixed(3)
			}
			function openRelation(row) {
				filterState.showRelation = true
				filterState.relationInfo = {
					way: 'detail', // 可选值：detail 查看关联 edit 修改关联 add 新增关联
					mainGoodsId: props.info.goodsId, // 关联组合品商品编码 way 为 edit 和 detail 时必传
					mainSkuIds: [row.skuId], // 关联组合品的某条skuId way 为 edit 和 detail 时必传
          childGoodsIdList: [] ,
          goodsSkuCombinationRelation: []
				}
			}
			return {
				tableRef,
				weight,
				batchFill,
				freightState,
				freightOptions,
				setStatus,
				calcWeight,
				editConfig,
				...toRefs(filterState),
				filterWeight,
				reset,
				fmtWeight,
				openRelation
			}
		}
	}

</script>
<style lang="scss" scoped>
	.heavy-header {
		display: flex;
		justify-content: center;
		padding: 5px 0;
	}
	.item-form {
		margin-bottom: 0;
	}
	.isNew {
		background: red;
		color: #fff;
		margin-right: 5px;
		padding: 3px 5px;
	}
	.attr-box {
		display: flex;
		margin-bottom: 15px;
		justify-content: space-between;
		label {
			color: #606266;
		}
		.attr-info {
			display: flex;
			li + li {
				margin-left: 15px;
			}
		}
	}
	.form-box {
		border-bottom: 1px dashed #e9e9e9;
		margin-bottom: 20px;
    padding-bottom: 15px;

		.aside-item {
			flex-grow: 1;
			text-align: right;
		}
	}
</style>
