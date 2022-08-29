<template>
	<div>
		<el-dialog title="更换收货地址" v-model="dialogVisible" width="800px" @closed="dialogClosed" custom-class='address-box'>
			<div>
				<el-radio-group v-model="newAddressId">
					<div v-for="item in addressList" :key="item.id" class="address-info-box">
						<el-radio :label="item.id">
							<div class="address-info">
								{{fmtAddress(item)}}
							</div>
						</el-radio>
						<div v-if="item.isDefault== 1" class="default-address">默认地址</div>
					</div>
				</el-radio-group>
			</div>
			<template #footer>
				<div class="footer">
					<el-button @click="updateAddress" type="text" >同步收货地址</el-button>
					<div class="btn-box">
						<el-button @click="dialogVisible = false" >取 消</el-button>
						<el-button type="primary" @click="ok" >确 定</el-button>
					</div>
				</div>
			</template>
		</el-dialog>
	</div>
</template>
<script>
	import { reactive, ref, toRefs } from 'vue'
	import { selectAddressByAccountId, syncAddress } from '@/api/purchase/order.js'
	import { ElMessage } from 'element-plus'
	export default {
		emits: ['close', 'change'],
		props: ['id','addressId'],  //id: 账号id，addressId： 回显地址id
		setup(props, ctx) {
			let state = reactive({
				dialogVisible: true,
				newAddressId: props.addressId
			})
			let addressList = ref([])
      
			init()
			function init() {
				selectAddressByAccountId({ accountId: props.id, accountType: 1 }).then(res => {
					addressList.value = res.data
				})
			}

			function fmtAddress(info) {
				let mobilePhone = info.mobilePhone || info.phone
				let address = [info.addressCodeText, info.townName, info.address].filter(item => item).join()
				return `(${info.fullName}) ${mobilePhone} ${address}`
			}
			function updateAddress() {
				syncAddress({ accountId: props.id }).then(() => {
					init()
				})
			}
			function dialogClosed() {
				ctx.emit('close')
			}
			function ok() {
				if (state.newAddressId) {
					let item = addressList.value.find(item => item.id == state.newAddressId)
					ctx.emit('change', { id:  item.id, address: fmtAddress(item) })
          state.dialogVisible = false
				} else {
					ElMessage({
						message: '请选择地址',
						type: 'error'
					})
				}
			}
			return {
				...toRefs(state),
				fmtAddress,
				dialogClosed,
				addressList,
				ok,
				updateAddress
			}
		}
	}
  </script>

  <style lang="scss" scoped>
	:deep(.address-box) {
		.el-radio {
			margin-bottom: 15px;
		}
		.address-info {
			width: 600px;
			white-space: break-spaces;
		}
		.address-info-box {
			display: flex;
		}

		.default-address {
			width: 100px;
			font-size: 14px;
		}
		.el-dialog__body {
			max-height: 450px;
			padding-top: 5px;
			overflow-y: auto;
		}
		.footer {
			display: flex;
			.btn-box {
				flex-grow: 1;
				text-align: right;
			}
		}
	}
</style>
  