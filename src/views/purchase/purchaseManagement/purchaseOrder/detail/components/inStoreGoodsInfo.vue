<template>
	<div class="page">
		<div class="headBox">入库记录</div>
		<div class="contentBox">
			<vxe-table v-bind="tableOptions" :data="props.info" ref="tableRef" :scroll-y="{enabled: false}">
				<vxe-column field="createTime" title="时间"></vxe-column>
				<vxe-column field="trackNumber" title="运单号">
					<template #default="{ row }">
						<div>{{row.trackNumber ?? '-'}}</div>
					</template>
				</vxe-column>
				<vxe-column field="inputNum" title="入库件数"></vxe-column>
				<vxe-column title="入库SKU X 数量">
					<template #default="{ row }">
						<div v-for="(item, index) in row.skuList" :key="index">{{item.sku}} X {{item.numbers}}</div>
					</template>
				</vxe-column>
				<vxe-column v-if="customization == 1" field="itemOrderRelId" title="二维码ID"></vxe-column>
			</vxe-table>
		</div>
	</div>
</template>

<script setup>
	import { reactive, toRefs, shallowReactive } from 'vue'
	import { useRoute } from 'vue-router'
	let route = useRoute()
	let { customization } = route.query
	let props = defineProps({
		info: {
			type: Array,
			default: []
		}
	})
	let tableOptions = shallowReactive({
		border: 'inner',
		autoResize: true,
		keepSource: true,
		align: 'center',
		highlightHoverRow: true
	})
</script>

<style lang="scss" scoped>
	.page {
		background-color: #fff;
		margin-bottom: 24px;
		border-radius: 2px;
		.headBox {
			padding: 0 24px;
			height: 55px;
			line-height: 55px;
			color: rgba(0, 0, 0, 0.85);
			font-size: 16px;
			border-bottom: 1px solid #e9e9e9;
		}
		.contentBox {
			padding: 16px 24px;
		}
	}
</style>
