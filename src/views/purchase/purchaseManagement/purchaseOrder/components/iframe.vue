<template>
	<el-dialog title="物流轨迹" v-model="ifShow" :width="800" custom-class="myDialog" :close-on-click-modal="false" :destroy-on-close="true" @close="closeEvent">
		<div class="contentView">
      <!-- <iframe class="iframe" :src="`https://m.kuaidi100.com/app/query?nu=${props.trackNum}`" :frameborder="false"></iframe> -->
      <iframe class="iframe" :src="`https://www.kuaidi100.com/chaxun?com=&nu=${props.trackNum}`" :frameborder="false"></iframe>
		</div>
	</el-dialog>
</template>

<script setup>
  import { reactive, toRefs } from 'vue'
  import { ElMessage } from 'element-plus'
  let state = reactive({
    ifShow: true
  })
  let props = defineProps({
    trackNum: {
      type: String,
      default: ''
    }
  })
  const emit = defineEmits(['closeEvent'])
  // 关闭弹框
  let closeEvent = (refresh = false) => {
    state.ifShow = false
    setTimeout(() => {
      emit('closeEvent', refresh)
    }, 500)
  }

  let { ifShow } = toRefs(state)
</script>

<style lang="scss" scoped>
.iframe{
  width: 100%;
  height: 700px;
}
</style>