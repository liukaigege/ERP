<template>
	<div class="logistics-box" v-if="isQuoted">
		<div class="title">商品信息</div>
		<div class="content">
			<div class="img-box">
				<el-image append-to-body style="width: 100px;max-height: 130px" :infinite="false" fit="scale-down" :src="info.mainImageUrl" :preview-src-list="[info.mainImageUrl]"></el-image>
			</div>
			<el-form label-width='150'  class="info-box">
				<el-row v-if="info.collectionUrl">
					<el-col :span="24">
						<el-form-item label="采集产品链接：">
							<a class="textOverflow" target="_blank" :href="info.collectionUrl">{{info.collectionUrl}}</a>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row v-for="item in info.referenceUrls" :key="item">
					<el-col :span="24">
						<el-form-item label="参考产品链接：">
							<a class="textOverflow" target="_blank" :href="item">{{item}}</a>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-form-item label="商品中文名称:">
						<el-tooltip placement="top" trigger="hover" effect="dark" :content="info.goodsName || info.goodsNameEn">
							<template #default>
								<span class="textOverflow">{{info.goodsName || info.goodsNameEn}}</span>
							</template>
						</el-tooltip>
					</el-form-item>
				</el-row>
				<el-row>
					<el-form-item label="特殊属性：">
						<ul class="attr-info" v-if="info.attr">
							<li v-for="item in info.attr?.split(',')" :key="item">{{item}}</li>
						</ul>
						<span v-else>无</span>
					</el-form-item>
					<el-form-item label="商品形式：" style="margin-left: 25px" v-if="!isSpecial">
						<span>{{info.combineType==1? '单品': '组合品'}}</span>
					</el-form-item>
				</el-row>
				<el-row>
					<el-form-item label="采购备注：">
						<div style="word-break: break-all">{{info.purchaseRemark || '无'}}</div>
					</el-form-item>
				</el-row>
			</el-form>
		</div>
	</div>
</template>
<script>
	export default {
		props: {
			isEdit: Boolean,
			isQuoted: Boolean,
			info: Object,
			isSpecial: Boolean
		},
	}

</script>
<style lang="scss" scoped>
	.attr-info {
		display: flex;
		li + li {
			margin-left: 15px;
		}
	}
	.info-box {
		.el-form-item {
			margin-bottom: 5px;
		}
	}
	.content {
		display: flex;
		align-items: center;
		.img-box {
			margin-right: 25px;
		}
	}
</style>