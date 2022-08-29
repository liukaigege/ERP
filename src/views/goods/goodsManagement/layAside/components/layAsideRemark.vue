<template>
	<el-dialog title="备注" v-model="ifShow" :width="640" custom-class="myDialog" :close-on-click-modal="false" :destroy-on-close="true" @close="closeEvent">
		<div class="contentView">
      <div>{{layAsidecause ? layAsidecause : '暂无'}}</div>
		</div>
	</el-dialog>
</template>

<script>
	import { onMounted, reactive, ref, toRefs } from 'vue'
	export default {
		props: {
			layAsidecause: {
				type: String,
				default: ''
			}
		},
		emits: ['closeEvent'],
		setup(props, context) {
			let state = reactive({
				ifShow: true,
        layAsidecause: props.layAsidecause
			})

      // 关闭弹框
			let closeEvent = () => {
        state.ifShow = false
				setTimeout(() => {
					context.emit('closeEvent')
				}, 500)
			}

			onMounted(() => {
			})

			return {
				...toRefs(state),
        closeEvent
			}
		}
	}
</script>

<style lang="scss" scoped>
.contentView{
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>