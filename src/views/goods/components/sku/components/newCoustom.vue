<template>
	<div class="newCoustom">
		<div class="newCoustomForm">
			<el-form :model="form" :rules="rules" ref="formRef" >
				<el-form-item label="是否为定制品:" prop="enableCustom">
					<el-radio-group :disabled="isCustom ? isCustom :tableDisabled" v-model="form.enableCustom" @change="v=> v ==0 ? form.enableContainFitting =0 :''">
						<el-radio :label="1">是</el-radio>
						<el-radio :label="0">否</el-radio>
					</el-radio-group>
				</el-form-item>

				<el-form-item
					label="请选择定制类型:"
					prop="goodsCustomTypeList"
					v-if="form.enableCustom === 1"
				>
					<el-checkbox-group :disabled="tableDisabled" v-model="form.goodsCustomTypeList">
						<el-checkbox :label="1" >定制图片</el-checkbox>
						<el-checkbox :label="2" >定制文本</el-checkbox>
					</el-checkbox-group>
				</el-form-item>

				<el-form-item
					label="是否含有配件:"
					prop="enableContainFitting"
					v-if="form.enableCustom === 1"
				>
					<el-radio-group :disabled="tableDisabled" v-model="form.enableContainFitting">
						<el-radio :label="1">是</el-radio>
						<el-radio :label="0">否</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
		</div>
		<!--表单-->

		<div class="btns" v-show="form.enableContainFitting === 1 && form.enableCustom === 1">
			<el-button type="primary" @click="_ => (addDialogVisible = true)" :disabled ="tableDisabled || isAdd" >
				添加配件</el-button
			>
			<el-button @click="delParts"  :disabled ="tableDisabled || isAdd"> 删除配件</el-button>
		</div>
		<!-- 按钮-->

		<div
			class="tables"
			v-show="form.enableContainFitting === 1 && form.enableCustom === 1"
		>
			<vxe-table
				border
				show-overflow
				align="center"
				height="400"
				ref="tableRef"
				:row-config="{ height: 80 }"
				:data="goodsCustomFittingList"
				:column-config="{ resizable: false }"
				:edit-config="{ trigger: 'click', mode: 'cell' ,}"
				:edit-rules="validRules"
				@checkbox-all="selectAllChangeEvent"
				@checkbox-change="selectChangeEvent"
			>
				<vxe-column type="checkbox" width="60"></vxe-column>
				<vxe-column field="nameCn" :edit-render="{ name: '$input' }">
					<template #header="{ row }">
						配件中文名称
						<p>
							<el-button type="text" @click="translate('nameEn')" :disabled="tableDisabled"
								>翻译并填充英文</el-button
							>
						</p>
					</template>
					<template #edit="{ row }">
						<vxe-input v-model="row.nameCn" type="text" :disabled="tableDisabled" maxlength='50'></vxe-input>
					</template>
					<template #default="{ row }">
						<vxe-input v-model="row.nameCn" type="text" :disabled="tableDisabled" maxlength='50'></vxe-input>
					</template>
				</vxe-column>

				<vxe-column field="nameEn" :edit-render="{ name: '$input' }">
					<template #header="{ row }">
						配件英文名称
						<p>
							<el-button type="text" @click="translate('nameCn')" :disabled="tableDisabled"
								>翻译并填充中文</el-button
							>
						</p>
					</template>
					<template #edit="{ row }">
						<vxe-input v-model="row.nameEn" type="text" :disabled="tableDisabled" maxlength='50'></vxe-input>
					</template>
					<template #default="{ row }">
						<vxe-input v-model="row.nameEn" type="text" :disabled="tableDisabled" maxlength='50'></vxe-input>
					</template>
				</vxe-column>

				<vxe-column field="imageUrl" title="图片">
					<template #default="{ row, rowIndex }">
						<div class="imgBox">
							<div>
								<div
									class="selectImg"
									@click="selectImgTbale(row, rowIndex)"
									v-if="!row.imageUrl && !disabled"
								>
									<i class="el-icon-plus"></i>
								</div>
								<div class="imgItem" v-else>
									<img :src="row.imageUrl" alt="" />
									<div class="mask" v-if="!disabled&&!tableDisabled"></div>
									<div class="icons" v-if="!disabled&&!tableDisabled">
										<i class="el-icon-delete" @click="delImg(rowIndex)"></i>
									</div>
								</div>
							</div>
						</div>
					</template>
				</vxe-column>

				<vxe-column
					field="material"
					title="材质"
					:edit-render="{ autofocus: '.vxe-input--inner' ,disabled:true}"
				>
					<template #edit="{ row }">
						<vxe-input v-model="row.material" type="text" :disabled="tableDisabled" maxlength='50'></vxe-input>
					</template>
					<template #default="{ row }">
						<vxe-input v-model="row.material" type="text" :disabled="tableDisabled" maxlength='50'></vxe-input>
					</template>
				</vxe-column>

				<vxe-column
					field="remark"
					title="商品备注"
					:edit-render="{ autofocus: '.vxe-input--inner' }"
				>
					<template #edit="{ row }">
						<vxe-input v-model="row.remark" type="text" :disabled="tableDisabled" maxlength='50'></vxe-input>
					</template>
					<template #default="{ row }">
						<vxe-input v-model="row.remark" type="text" :disabled="tableDisabled" maxlength='50'></vxe-input>
					</template>
				</vxe-column>
			</vxe-table>
		</div>
<!--		<el-button @click="validate">test</el-button>-->
		<!--表格-->
		<NewAddParts
			ref="newAddParts"
			v-if="addDialogVisible"
			@showSelectImg="showSelectImg"
			@cancel="() => (addDialogVisible = false)"
			@add="addParts"

		/>
		<!--		新增配件-->

		<SelectImg
			:dialogVisible="dialogVisible"
			:multiple="multiple"
			v-if="dialogVisible"
			:skuQuery="skuQuery"
			@selectImg="selectImg"
		/>
		<!--		选择图片-->
	</div>
</template>

<script setup>
import {
	reactive,
	toRefs,
	ref,
	defineExpose,
	defineProps,
	defineEmits,
	onMounted,
	watch,
	computed,
	inject
} from 'vue'
import {useRoute} from  'vue-router'
import NewAddParts from '@/views/goods/components/sku/components/newAddParts.vue'
import SelectImg from '@/views/goods/components/sku/components/selectImg.vue'
import {
	translateAll,
	rules,
	validRules,
	options
} from '@/views/goods/components/sku/hooks/newCoustomOptions.js'
import { confirm,deepCopy } from '@/utils/tool.js'
import { ElMessage } from 'element-plus'
const props = defineProps({
	modelValue: Object,
	isCustom:false,
	isAdd:false
})
const emits = defineEmits([])
const { name :routeName} = useRoute()
const {disabled,columns} = options[routeName] ||  {}
const isDisabled = inject('isDisabled')

const data = reactive({
	dialogVisible: false,
	skuQuery: null,
	multiple: false,
	addDialogVisible: false,
	form: {
		enableCustom: 0,
		goodsCustomTypeList: '',
		enableContainFitting: 0
	},
	goodsCustomFittingList: [],
	selectedList: [] // 选中的数据
})
const { form, goodsCustomFittingList, multiple, addDialogVisible, skuQuery, dialogVisible } = toRefs(data)
const newAddParts = ref(null)
const tableRef = ref(null)
const formRef = ref(null)
const tableDisabled = computed(()=>{
		if(isDisabled) return isDisabled
		return disabled || false
})

watch(
	() => props.modelValue,
	a => {
		if (a) {
			// console.log(a, 'newCustom')
			init()
		}
	},
	{ deep: true }
)



function selectAllChangeEvent(val) {
	data.selectedList = tableRef.value.getCheckboxRecords()?.map(v => v._X_ID)
} // 批量选择

function selectChangeEvent(val) {
	data.selectedList = tableRef.value.getCheckboxRecords()?.map(v => v._X_ID)
} // 单条选择

function showSelectImg(val) {
	if (val) {
		data.skuQuery = val
		data.multiple = val.multiple
		data.dialogVisible = true
	}
} // 新增弹框打开图片选择框

function emitData(){
const {enableCustom,goodsCustomTypeList,enableContainFitting} = data.form
	const val = {
		goodsCustomFittingList:data.goodsCustomFittingList,
		enableCustom,
		goodsCustomTypeList,
		enableContainFitting
	}
	emits("update:modelValue", val);

}

function selectImgTbale(row, rowIndex) {
	data.skuQuery = { row, rowIndex, type: 1 }
	data.multiple = false
	data.dialogVisible = true
} // table 选择图片

function selectImg(val) {
	const { query, url } = val
	if (query.type === 0) {
		//	 新增弹窗
		newAddParts.value.form.imageUrl = url[0].url
		newAddParts.value.form.pictureId = url[0].pictureId
		data.dialogVisible = false
	} else {
		const { rowIndex } = val.query
		Object.assign(data.goodsCustomFittingList[rowIndex], {
			imageUrl: url[0].url,
			pictureId: url[0].pictureId
		})
	}
} // 选择图片返回数据

function addParts(val) {
	Object.assign(val, { nameCn: val.nameCn, nameEn: val.nameEn })
	// val.id = data.goodsCustomFittingList.length+1
	data.goodsCustomFittingList.push(val)
	tableRef.value.loadData(data.goodsCustomFittingList)
} // 新增配件弹框返回

function delImg(index) {
	data.goodsCustomFittingList[index].imageUrl = ''
	data.goodsCustomFittingList[index].pictureId = null
} // 删除单个图片

function translate(type) {
	let arrIsNull = [],
		list = []
	data.goodsCustomFittingList?.forEach((v, index) => {
		let t = type === 'nameCn' ? 'nameEn' : 'nameCn'
		if (v[t]?.trim()) {
			list.push(v[t])
		} else {
			arrIsNull.push(index)
		}
	})
	translateAll(list, type === 'nameCn' ? 'zh' : 'en', val => {
		if (val?.length === list.length) {
			arrIsNull?.forEach(v => {
				val.splice(v, 0, null)
			})
			val.forEach((item, index) => {
				if (item) {
					data.goodsCustomFittingList[index][type] = item.str
				}
			})
		}
	})
} // 点击翻译按钮

function delParts() {
	if (data.selectedList?.length === 0)
		return ElMessage.error('请勾选需要删除的配件')
	confirm(
		'确定删除已勾选的配件?',
		() => {
			const l = data.goodsCustomFittingList.filter(v=>{
				return !data.selectedList.find(item => item ===v._X_ID)
			}) || []
			data.goodsCustomFittingList = l
			data.selectedList = []
			tableRef.value.loadData(l)
		},
		err => {
			//cancel
		}
	)
} // 删除配件

 function  validate() {
	return new  Promise(async (reslove, reject) => {
		formRef.value.validate((val)=>{
			if(!val) return	reject( '请选择定制类型!')
		})
		const {enableCustom,enableContainFitting} = data.form
		if(enableContainFitting === 1 && enableCustom === 1 && data.goodsCustomFittingList?.length ===0){
		 return	reject('配件信息不能为空!')
			// 是定制品且是有配件
		}
		tableRef.value.validate(true)
			.then(res => {
				if (res) {
					reject('配件信息校验失败!')
				} else {
					reslove('success')
				}
			})
			.catch(error => {
				reject(error)
			})
	})
} // 校验提交

function init(){
	const {
		goodsCustomFittingList,
		enableCustom,
		goodsCustomTypeList,
		enableContainFitting
	} = props.modelValue
	data.goodsCustomFittingList = goodsCustomFittingList ? deepCopy(goodsCustomFittingList) : []
	data.form = {
		enableCustom,
		goodsCustomTypeList,
		enableContainFitting
	}
console.log(goodsCustomFittingList,'11223')
}

onMounted(() => {
			init()
})
defineExpose({ dialogVisible,emitData,validate })
</script>

<style lang="scss" scoped>
.tables {
	margin: 20px 0;
}

.imgItem {
	position: relative;
	width: 60px;
	height: 60px;
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 10px auto;
	img {
		width: auto;
		height: auto;
		max-width: 60px;
		max-height: 60px;
	}
	.mask {
		position: absolute;
		width: 100%;
		height: 100%;
		max-width: 110px;
		max-height: 110px;
		top: 0;
	}
	.icons {
		display: none;
		position: absolute;
		top: 35%;
		left: 50%;
		transform: translateX(-50%);
	}
}
.imgItem:hover {
	.mask {
		background-color: rgba(0, 0, 0, 0.5);
		transition: all 0.3s;
	}
	.icons {
		display: block;
		transition: all 0.3s;
		i {
			color: white;
			font-size: 18px;
		}
	}
}
.imgBox {
	display: flex;
	align-items: center;
	justify-content: center;
}
.selectImg {
	background: rgba(0, 0, 0, 0.04);
	width: 60px;
	height: 60px;
	border: 1px solid #e8e8e8;
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 10px auto;
}
</style>
