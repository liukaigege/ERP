<template>
	<div class="logistics-box" v-if="!isQuoted">
		<ul class="title detail-box">
			<li class="item">
				<label>物流报价人：</label>
				<div>{{info.createBy}}</div>
			</li>
			<li class="item">
				<label>首次报价时间：</label>
				<div>{{info.firstCreateTime}}</div>
			</li>
			<li class="item">
				<label>物流报价时间：</label>
				<div>{{info.createTime}}</div>
			</li>
			<li class="item">
				<label>报价备注：</label>
				<el-input v-model="info.remark" placeholder="请输入" style="width: 500px" v-if="isEdit" :maxlength="500"></el-input>
				<el-tooltip effect="dark" content="" placement="top" v-else>
					<template #content>
						<div>{{info.remark}}</div>
					</template>
					<div class="remark-box">{{info.remark}}</div>
				</el-tooltip>

			</li>
		</ul>
	</div>
</template>
<script>
	export default {
		props: {
			isQuoted: Boolean,
			isEdit: Boolean,
			info: Object
		}
	}
</script>
<style lang="scss" scoped>
	.detail-box {
		display: flex;
		color: rgba(0, 0, 0, 0.85);
		border-bottom: none !important;
		.item {
			display: flex;
			align-items: center;
			white-space: nowrap;
			label: {
				color: #606266;
			}
		}
		.item + .item {
			display: flex;
			margin-left: 25px;
		}
		.remark-box {
			overflow: hidden;
			text-overflow: ellipsis;
			max-width: 1000px;
		}
	}
</style>