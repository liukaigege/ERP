<template>
	<el-card class="box-card" shadow="never">
		<template #header>
			<div class="card-header">
				<span>税务设置</span>
			</div>
		</template>
		<el-form :model="formData" ref="formRef" :rules="rules" label-width="120px" :inline="true" >
			<div class="flex-form-item">
				<el-form-item label="欧盟VAT账号:" prop="euVat">
					<el-select v-model="formData.euVat" class="w310">
						<el-option value="IM2500010798"> </el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="英国VAT账号">
					<el-input v-model="formData.ukVat" class="w310"  maxlength="20"></el-input>
				</el-form-item>
			</div>
		</el-form>
	</el-card>
</template>

<script>
	import { reactive, toRefs, watch } from 'vue'
	import { checkNumOrWords } from '@/utils/ruleOptions.js'
	export default {
		props: {
			is_Submit: {
				type: Boolean
			},
			isResetShop: Boolean
		},
		emits: ['submitStatus'],
		setup(props, ctx) {
			const state = reactive({
				formData: {
					euVat: '', //欧盟
					ukVat: '' //英国
				},
				formRef: ''
			})

			const rules = {
				euVat: [
					{ required: true, message: '请输入欧盟VAT账号', trigger: ['blur','change'] },
					{ validator: checkNumOrWords, trigger: "blur" }
				],
			}
			watch(() => props.isResetShop, val => {
				if (val) {
					state.formData = {
						euVat: '', //欧盟
						ukVat: '' //英国
					},
						console.log(state.formData);
				}
			})
			watch(() => props.is_Submit, val => {
				if (val) {
					state.formRef.validate().then(res => {
						ctx.emit('submitStatus', 'tax', state.formData)
					}).catch(res => {
						ctx.emit('submitStatus', 'tax', false)
					})
				}
			})
			return {
				...toRefs(state),
				rules
			}
		}
	}
</script>

<style>
</style>
