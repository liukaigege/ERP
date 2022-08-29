<template>
	<!--	新增配件弹窗-->
	<div class="newAddParts">
		<el-dialog
			:title="dialogTitle"
			v-model="show"
			:width="width"
			@close="cancel"
			:close-on-click-modal="false"
			:close-on-press-escape="false"
		>
			<el-form
				:model="form"
				style="max-width: 360px"
				label-position="right"
				label-width="150px"
				:rules="rules"
				ref="tableRef"
			>
				<el-form-item label="配件中文名称:" prop="nameCn">
					<el-input v-model.trim="form.nameCn" maxlength="50"></el-input>
					<el-button type="text" size="mini" @click="translate(form.nameCn,'nameEn')">翻译并填充英文</el-button>
				</el-form-item>
				<el-form-item label="配件英文名称:" prop="nameEn">
					<el-input v-model.trim="form.nameEn" maxlength="50"></el-input>
					<el-button type="text" size="mini" @click="translate(form.nameEn,'nameCn')">翻译并填充中文</el-button>

				</el-form-item>
				<el-form-item label="图片:" prop="imageUrl">
					<div class="imgBox">
						<div>
							<div class="selectImg" @click="showSelectImg" v-if="!form.imageUrl">
								<i class="el-icon-plus"></i>
							</div>
							<div class="imgItem" v-else>
								<img :src="form.imageUrl" alt="" />
								<div class="mask"></div>
								<div class="icons">
									<i class="el-icon-delete" @click="delImg()"></i>
								</div>
							</div>
						</div>

					</div>
				</el-form-item>
				<el-form-item label="材质:" prop="material">
					<el-input v-model="form.material" maxlength="50"></el-input>
				</el-form-item>
				<el-form-item label="备注:" prop="remark">
					<el-input v-model="form.remark" maxlength="50"></el-input>
				</el-form-item>
			</el-form>

			<template #footer>
				<span class="dialog-footer">
					<el-button @click="cancel">取 消</el-button>
					<el-button type="primary" v-debounce="dialogHandOk">确 定</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup>
import { reactive, toRefs, defineProps, defineEmits, ref,defineExpose } from 'vue'
import {ElMessage} from 'element-plus'
import {deepCopy} from '@/utils/tool.js'
import {translateSingal} from '@/views/goods/components/sku/hooks/newCoustomOptions.js'
const rule = {
	nameCn: [{ required: true, message: '请填写配件中文名称!' }],
	nameEn: [{ required: true, message: '请填写配件英文名称!' }]
}
const data = reactive({
	form: {
		nameCn: null,
		nameEn:null,
		imageUrl: null,
		material: null,
		remark: null,
		pictureId:null
	},
	rules: rule,
	show:true
})
const { form, rules,show } = toRefs(data)
const tableRef = ref(null)
const emits = defineEmits(['showSelectImg','cancel','add'])
const props = defineProps({
	dialogTitle: {
		type: String,
		default: '新增配件'
	},
	width: {
		type: String,
		default: '30%'
	}
})
defineExpose({
	form
})
function dialogHandOk() {
	Object.assign(data.form,{
		name:data.form.name?.trim(),
		remark:data.form.remark?.trim(),
		material:data.form.material?.trim(),
	})
	tableRef.value.validate(res => {
		if (res) {
			let form = deepCopy(data.form)
			emits('add',form)
			cancel()
			//success
		} else {
			return false
			//error
		}
	})
}

function translate(val,type){
	if(!val) return ElMessage.error('请输入需要翻译的内容!')
	translateSingal(val, type === 'nameCn' ? 'zh' : 'en',res=>{
			type === 'nameCn' ? data.form.nameCn = res.str : data.form.nameEn = res.str
	})
} // 翻译


function cancel() {
	data.show = false
	setTimeout(() => {
		emits('cancel')
	}, 500)
}

function showSelectImg() {
	emits('showSelectImg',{  type: 0, multiple: false })
//	type == 0 新增配件弹框
} // 打开选择图片

function delImg() {
	data.form.imageUrl = null
} // 删除图片
</script>

<style lang="scss" scoped>

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
