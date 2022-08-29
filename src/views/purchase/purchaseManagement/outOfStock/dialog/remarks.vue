<template>
	<el-dialog
		title="SKU备注"
		v-model="dialogVisible"
		width="35%"
		@close="close"
		:close-on-click-modal="false"
		:close-on-press-escape="false"
	>
		<div class="remarks">
			<el-form :model="form" style="width: 90%" :rules='rules' >
				<el-form-item label="备注类型：" class="setLineHeight" prop='type'>
					<el-radio-group v-model="form.type" class="radioBox">
						<el-radio
							class="radioItem"
							:label="item.id"
							v-for="(item, index) in remarkNames"
							:key="index"
							>{{ item.name }}</el-radio
						>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="备注内容：">
					<el-input
						style='width: 520px'
						type="textarea"
						:rows="3"
						placeholder="请输入内容"
						maxlength="100"
						v-model="form.content"
					>
					</el-input>
				</el-form-item>
			</el-form>
		</div>
		<template #footer>
			<span class="dialog-footer">
				<el-button  @click="cancel">取 消</el-button>
				<el-button
					type="primary"

					@click="dialogHandOk"
					:loading="loading"
					>确 定</el-button
				>
			</span>
		</template>
	</el-dialog>
</template>

<script setup>
import {
	reactive,
	toRefs,
	defineProps,
	onMounted,
	defineEmits,
	watch
} from 'vue'
import {ElMessage} from 'element-plus'
import {getRemarkTypes} from '@/api/order/orderManagement.js'
import { setReamrkList } from '../hooks/hooks.js'
const props = defineProps({
	query: Object,
	status:{
			type:String,
			default:'0' // 0普通商品 1定制商品
		},
})
console.log(props.query.customization)
const emit = defineEmits(['cancel', 'ok'])
const data = reactive({
	remarkNames: [],
	form: {
		type: null,
		content: ''
	},
	loading: false,
	dialogVisible: true,
	rules:{
		type:[{required:true,message:'备注类型不能为空',trigger:'blur'}]
	}
})
const { remarkNames, form, loading, dialogVisible,rules } = toRefs(data)


function dialogHandOk() {

	const { type, content } = data.form
	if (!type) return ElMessage.error('请选择备注类型!')
	const { selectedList } = props.query
	let purchaseSuggestRemarkList = []
	if (selectedList?.length > 0) {
		selectedList.map(item => {
			if(item.idList&&item.idList.length){
				item.idList.forEach(v=>{
					let param = {
						id: props.query?.editItem?.id || null,
						suggestId: v,
						remarkTypeId: type,
						remark: content,
						skuId:item.skuId,
						customization:props.query.customization
					}
					purchaseSuggestRemarkList.push(param)
				})
			}else{
				let param = {
					id: props.query?.editItem?.id || null,
					suggestId: item.id,
					remarkTypeId: type,
					remark: content,
					skuId:item.skuId,
					customization:props.query.customization
				}
				purchaseSuggestRemarkList.push(param)
			}
		})
		setReamrkList({ purchaseSuggestRemarkList }, res => {
			if (res) {
				cancel()
				emit('ok')
			}
		})
	}
}

function getRemark(callBack) {
	getRemarkTypes({ useScope: '2' }).then(res => {
		if (res.code == 200) {
			data.remarkNames = res.data
			data.remarkNames[0] ? (data.form.type = data.remarkNames[0].id) : ''
			callBack()
		}
	})
} // 获取备注


onMounted(() => {
	getRemark(()=>{
		const {editItem} = props.query
		if(editItem){
			const {remarkTypeId,remark} = editItem
			console.log(data.remarkNames)
			if(data.remarkNames.some(v=>v.id === remarkTypeId)){
				data.form.type = remarkTypeId
			}
			data.form.content = remark
		}
	})



})

function close() {
	cancel()
}

function cancel() {
	data.dialogVisible = false
	setTimeout(() => {
		emit('cancel')
	}, 500)
}

</script>

<style scoped></style>
