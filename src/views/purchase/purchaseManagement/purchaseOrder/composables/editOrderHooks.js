import { reactive, onMounted } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { orderEditDetail } from '@/api/purchase/order.js'
import { useRoute, useRouter } from 'vue-router'
import { fmtAddress } from './comFun.js'
export default function () {
	let info = reactive({})
	const route = useRoute()
	const router = useRouter()
	onMounted(() => {
		getDetail()
	})
	function getDetail(ids = []) {
		let { id, type, customization } = route.query
		orderEditDetail({ id, type, customization, delRelIds: ids }).then(res => {
			info = Object.assign(info, res.data)
			//  type：1草稿编辑 2未通过编辑 3再次购买 4处理异常
			if (type == 3) info.type = 2 // 再次购买 默认
			if (type == 3 || type == 4) {
				info.toDeptId = ''
			}
			info.orderItems?.forEach(item => {
				item.copyPrice =
					item.price || item.lastPurchasePrice || item.purchasePrice
				item.type = info.type
				item.count = item.suggestQuantity * 1 + item.purchaseQuantity * 1
			})
			info.address = fmtAddress(info.address)
		})
	}

	function initAddress() {
		info.addressId = ''
		info.address = ''
	}
	function setType(v) {
		info.settlementValue = v == 2 ? '30' : '' // 账期 默认为 30天
		info.settlementUnit = v == 1 ? '1' : '' // 预付默认为 %
	}

	return {
		info,
		setType,
		initAddress,
		getDetail
	}
}
