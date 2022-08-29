<!--
 * @Descripttion: Vango ERP
 * @version: 1.0
 * @Author: zhangzhifang
 * @Date: 2021-07-09 10:56:27
 * @LastEditors: 江澎涛
 * @LastEditTime: 2021-08-21 11:15:29
-->
 <template>
	<div class="headDialog">
		<el-dialog title="提示" v-model="dialogRemarks" custom-class="myDialog" width="30%" :close-on-click-modal="false" :destroy-on-close="true" @close="closeDialog">
			<div style="margin-bottom:24px">
				<span class="el-icon-warning"></span>
				<span>{{message}}</span>
			</div>
			<div class="headFoot" v-show="!cancelList">
				<el-form>
					<el-form-item label="备注:">
						<el-input type="textarea" v-model="remarks" show-word-limit maxlength="140" />
					</el-form-item>
				</el-form>
			</div>
			<template #footer>
				<span class="dialog-footer">
					<el-button  @click="closeDialog">取 消</el-button>
					<el-button type="primary"  @click="handOkRemarks">确 定</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>
<script>
	import { reactive, toRefs } from 'vue'
	export default {
		props: {
			message: {
				type: String,
				default: ''
			},
			cancelList: {
				type: Boolean,
				default: false
			}
		},
		emits: ['closeDialog', 'handOkRemarks'],
		setup(props, context) {
			const cancelList = props.cancelList
			const state = reactive({
				remarks: '',
				dialogRemarks: true
			})
			const closeDialog = () => {
				context.emit('closeDialog')
			}
			const handOkRemarks = () => {
				context.emit('handOkRemarks', state.remarks)
			}
			return { ...toRefs(state), closeDialog, handOkRemarks, cancelList }
		}
	}
</script>
<style scoped lang="scss">
.headDialog {
	margin-left: 29px;
	.el-icon-warning {
		color: #f5b70d;
		font-size: 20px;
   
	}
	.headDialog .headFoot {
		margin-top: 20px;
	}

	:deep(.el-dialog__title) {
		font-size: 18px !important;
	}
	.el-dialog__body {
		padding: 16px 24px;
		padding-top: 0px;
	}

	.el-dialog__header {
		border: 1px solid #ebebeb;
	}
	.el-textarea__inner {
		height: 100px;
	}
}
</style>

