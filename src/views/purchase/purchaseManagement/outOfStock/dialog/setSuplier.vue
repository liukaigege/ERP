<!--
 * @Descripttion: 设置供应商
 * @version:
 * @Author: 朱涛
 * @Date: 2021-07-15 17:01:59
 * @LastEditors: 朱涛
 * @LastEditTime: 2021-08-05 10:00:34
-->

<template>
	<div>
		<el-dialog
			title="设置供应商"
			v-model="dialogVisible"
			width="30%"
			@close="close"
			:close-on-click-modal="false"
			:close-on-press-escape="false"
		>
			<div class="container">
				<el-form v-model="form" :inline="true"  :rules='rules'>
					<el-form-item label="请选择供应商：" prop='supplierId'>
						<el-cascader
							v-model="form.supplierId"
							:options="supllierList"
							:props="{
								expandTrigger: 'hover',
								children: 'childs',
								value: 'id',
								label: 'name'
							}"
							clearable
							filterable
							placeholder="全部"
							style="width: 400px"
						></el-cascader>
					</el-form-item>
					<el-form-item>
						<el-checkbox @change='setSupplier'>设为默认供应商</el-checkbox>
					</el-form-item>
				</el-form>
			</div>

			<template #footer>
				<span class="dialog-footer">
					<el-button  @click="cancel">取 消</el-button>
					<el-button type="primary"  @click="dialogHandOk" :disabled="!form.supplierId" >确 定</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup>
import {reactive, toRefs, defineProps, defineEmits, onMounted, watch} from 'vue'
import { getSupplier, setSuplier } from '../hooks/hooks'
const props = defineProps({
	query: Object
})

const emit = defineEmits(['cancel', 'ok'])
watch(()=>props.query,(a,b)=>{
			if(a.supplierId) data.form.supplierId = a.supplierId

},{deep:true})
const data = reactive({
	supllierList: [],
	dialogVisible: true,
	form: {
		supplierId: null,
		adminSupplierType:null
	},
	rules:{
		supplierId:[{required:true,message:'供应商不能为空',trigger:'blur'}]
	}
})
const { supllierList, dialogVisible, form ,rules} = toRefs(data)

function dialogHandOk() {
	const {selectedList, type} = props.query

	const { supplierId,adminSupplierType } = data.form
	let idList = []
	selectedList?.forEach(item => {
		if(item.idList&&item.idList.length){
			idList = [...idList,...item.idList]
		}else{
			idList.push(item.id)
		}
	})

	const param = {
		type,
		idList,
		supplierId: supplierId?.length > 1 ? supplierId[1] : supplierId[0],
		adminSupplierType
	}
	setSuplier(param, res => {
		if (res) {
			cancel()
			emit('ok')
		}
	})
}

function close() {
	cancel()
}

function cancel() {
	data.dialogVisible = false
	setTimeout(() => {
		emit('cancel')
	}, 500)
}

function setSupplier(val){
		if(val){
			data.form.adminSupplierType = 1
		}else {
			data.form.adminSupplierType = null
		}

} // 设置成默认供应商


onMounted(() => {

	getSupplier(val => {
		data.supllierList = val
		console.log(props.query)
		if(props.query.supplierId?.length>0) data.form.supplierId = props.query.supplierId
	})
})
</script>

<style lang="scss" scoped>
.flex {
	display: flex;
	align-items: flex-start;
}

.titles {
	font-size: 16px;
	font-family: PingFangSC-Regular, PingFang SC;
	color: rgba(0, 0, 0, 0.85);
}
.radioList {
	padding: 24px 112px;
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	.radioItem {
		width: 50%;
		margin-bottom: 14px;
	}
}
</style>
