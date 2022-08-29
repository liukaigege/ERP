<template>
	<el-dialog title="处理进度" v-model="showDialog" width="640px" @close="close">
		<el-progress :text-inside="true" :stroke-width="14" :percentage="progress" status="success"></el-progress>
	</el-dialog>
</template>

<script>
	import { reactive, toRefs ,watch  } from 'vue'
	export default {
		props: {
			progress: {
				default: 0
			}
		},
		emits: ['closeEvent'],
		setup(props, ctx) {
			const state = reactive({
				showDialog: true
			})
			watch(() => props.progress, val => {
				if (val == 100) {
					setTimeout(() => {
						close()
					}, 700);
				}
			})
			//关闭弹框事件
			function close() {
				state.showDialog = false
				setTimeout(() => {
					ctx.emit('closeEvent')
				}, 500);

			}
			return {
				...toRefs(state),
				close
			}
		}
	}
</script>

<style>
</style>