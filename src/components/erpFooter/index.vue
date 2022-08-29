<template>
	<div class="erp-empty-box"></div>
	<div class="erp-footer">
		<slot></slot>
	</div>
</template>
<script>
	import { useStore } from 'vuex'
	import { computed } from 'vue'
	export default {
		props: {
			height: {
				type: String,
				default: '52px'
			}
		},
		setup() {
			let store = useStore()
			let sideBarWidth = computed(() => store.state.menu.sideBarWidth)
			return {
				sideBarWidth
			}
		}
	}
</script>
<style lang="scss" scoped>
	.erp-empty-box {
		margin-bottom: -23px;
		margin-top: 25px;
		height: v-bind(height);
	}
	.erp-footer {
		background: #fff;
		position: fixed;
		height: v-bind(height);
		line-height: v-bind(height);
		left: v-bind(sideBarWidth);
		right: 0;
		bottom: 0;
		transition: left 1s;
		z-index: 999;
	}
</style>