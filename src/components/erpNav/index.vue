<template>
	<div class="erp-nav">
		<div class="nav-title-box">
			<i class="el-icon-arrow-left" @click="goBack" v-if="goBack"></i>
			<i class="el-icon-arrow-left" @click="go" v-else></i>
			<div class="nav-title">{{title}}</div>
			<slot/>
		</div>
	</div>
	<div class="erp-empty-box"></div>
</template>
<script>
	import { useStore } from 'vuex'
	import { computed } from 'vue'
	import { useRouter } from 'vue-router'
	export default {
		props: {
			title: {
				type: String,
				required: true
			},
			routeOpt: {
				type: [String, Object],
			},
			goBack: { // 自定义返回按钮操作，传入函数
				type: Function,
				required: false
			},
		},
		setup(props) {
			let store = useStore()
			let router = useRouter()
			let sideBarWidth = computed(() => store.state.menu.sideBarWidth)
			function go() {
				router.push(props.routeOpt)
			}
			return {
				go,
				sideBarWidth
			}
		}
	}
</script>
<style lang="scss" scoped>
	.erp-empty-box {
		margin-top: -23px;
		height: 75px;
	}
	.erp-nav {
		background: #fff;
		position: fixed;
		left: v-bind(sideBarWidth);
		right: 0;
		top: 111px;
		transition: left 1s;
		border-top: 1px solid #e8e8e8;
		z-index: 15;
		.nav-title-box {
			height: 75px;
			display: flex;
			align-items: center;
			padding-left: 20px;
		}
		.nav-title {
			color: rgba(0, 0, 0, 0.85);
			font-size: 20px;
			font-weight: 500;
			text-align: center;
			flex-grow: 1;
		}
		.el-icon-arrow-left {
			cursor: pointer;
			font-size: 20px;
		}
	}
</style>