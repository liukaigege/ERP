<template>
	<div>
		<el-card shadow="never" class="none-border-card">
			<el-form :model="filterForm" class="filter-el-form" inline @submit.prevent>
				<el-form-item prop="originalCurrency">
					<el-input  clearable type="text" :input-style="{ width: '400px' }"
							  v-model="filterForm.originalCurrency" placeholder="请输入币种"></el-input>
				</el-form-item>
				<el-button  type="primary" @click="search">搜索</el-button>
			</el-form>
		</el-card>
		<el-card shadow="never" class="none-border-card mt-20">
			<el-radio-group  v-model="filterForm.baseCurrency" @change="search">
				<el-radio-button label="CNY">原币 -> 人民币</el-radio-button>
				<el-radio-button label="USD">原币 -> 美元</el-radio-button>
			</el-radio-group>
			<el-table class="mt-20" :data="tableData" border empty-text="未搜索到该币种">
				<el-table-column type="index" label="序号" width="70px"></el-table-column>
				<el-table-column label="币种关系">
					<template #default="scope">
						{{ scope.row.originalCurrency }} -> {{ scope.row.baseCurrency }}
					</template>
				</el-table-column>
				<el-table-column prop="rate" label="汇率"></el-table-column>
				<el-table-column prop="createTime" label="更新时间"></el-table-column>
				<el-table-column label="历史记录">
					<template #default="scope">
						<el-button type="text" @click="openHistoryDialog(scope)">查看</el-button>
					</template>
				</el-table-column>
			</el-table>
			<history-dialog v-if="exchange" :show="showHistoryDialog" @close="closeHistoryDialog" :exchange="exchange"/>
			<div class="flex-pagination page-fixed">
				<div></div>
				<el-pagination
					@size-change="handleSizeChange"
					@current-change="handleCurrentChange"
					:current-page="pagination.currentPage"
					:page-sizes="pagination.pageSizes"
					:page-size="pagination.pageSize"
					layout="total, sizes, prev, pager, next, jumper"
					:total="pagination.totalCount">
				</el-pagination>
			</div>
		</el-card>
	</div>
</template>

<script>
import {reactive, toRefs} from 'vue'
import {getExchangeRataListPage} from '@/api/financial.js'
import { erpElTable } from 'hooks'
import HistoryDialog from './components/HistoryDialog.vue'

export default {
	name: 'FinancialExchange',
	components: {HistoryDialog},
	setup() {
		const state = reactive({
			filterForm: {
				originalCurrency: '',
				baseCurrency: 'CNY'
			},
			radio: 0,
			showHistoryDialog: false,
			exchange: ''
		})

		const erpEltableOpts = erpElTable(getExchangeRataListPage, state.filterForm)

		const openHistoryDialog = scope => {
			state.exchange = scope.row.originalCurrency + '$+' + scope.row.baseCurrency
			state.showHistoryDialog = true
		}

		const closeHistoryDialog = _ => {
			state.exchange = null
			state.showHistoryDialog = false
		}

		return {
			...toRefs(state),
			...erpEltableOpts,
			openHistoryDialog,
			closeHistoryDialog
		}
	}
}
</script>

<style lang="scoped">
</style>
