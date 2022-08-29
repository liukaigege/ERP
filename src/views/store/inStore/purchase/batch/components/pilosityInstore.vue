<template>
	<el-dialog title="多发入库" v-model="ifShow" :width="640" custom-class="myDialog" :close-on-click-modal="false" :destroy-on-close="true" @close="closeEvent">
		<div class="contentView">
      <div class="goodsInfo">
        <div class="left">
          <el-popover placement="right-start" trigger="hover" width="auto">
            <el-image style="width: 200px; height: 200px" :src="props.pilosityInfo.mainImg" fit="contain"></el-image>
            <template #reference>
              <el-image style="width: 60px; height: 60px" :src="props.pilosityInfo.mainImg" fit="contain"></el-image>
            </template>
          </el-popover>
        </div>
        <div class="right">
          <div class="textOverflow" :title="props.pilosityInfo.goodsName">{{props.pilosityInfo.goodsName}}</div>
          <div>{{props.pilosityInfo.speVal}}</div>
          <div>{{props.pilosityInfo.goodsSku}}</div>
        </div>
      </div>
      <div class="line"></div>
      <el-form :model="form" :rules="rules" ref="formRef">
        <el-form-item label="入库数量: " prop="num">
          <el-input-number v-model="form.num" :controls="false" :min="1" :max="9999" :precision="0" placeholder="请输入" clearable  />
        </el-form-item>
      </el-form>
		</div>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="cancelEvent" >取消</el-button>
				<el-button type="primary" @click="affirmEvent"  :loading="loading">确认入库</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup>
  import { ref, reactive, toRefs } from 'vue'
  import { ElMessage } from 'element-plus'
  import { extraInstorage } from '@/api/store.js'
  const props = defineProps({
    pilosityInfo: {
      type: Object,
      default: {}
    }
  })
  const emit = defineEmits(['closeEvent', 'affirmEvent'])
  let state = reactive({
    ifShow: true,
    loading: false,
    form: {
      id: props.pilosityInfo.ivtPurchaseDetailId,
      num: undefined,
      trackNumber: props.pilosityInfo.trackNumber,
    }
  })
  let rules = {
    num: [ { required: true, message: '请输入入库数量', trigger: 'blur' } ]
  }
  let formRef = ref(null)
  // 关闭弹框
  let closeEvent = () => {
    state.ifShow = false
    setTimeout(() => {
      emit('closeEvent')
    }, 500)
  }

  // 取消回调
  let cancelEvent = () => {
    closeEvent('cancel')
  }

  // 确认回调
  let affirmEvent = () => {
    formRef.value.validate((valid) => {
      if (valid) {
        extraInstorage(state.form).then(res => {
          state.loading = false
          if (res.code == 200) {
            if (res.data.flag) {
              setTimeout(() => {
                emit('affirmEvent')
              }, 500)
              ElMessage.success({ message: '操作成功！', type: 'success' })
            } else {
              setTimeout(() => {
                emit('affirmEvent', res.data.failList)
              }, 500)
            }
          } else {
            ElMessage.error(res.message)
          }
        }).catch(err => {
          state.loading = false
        })
      } else {
        ElMessage.error('信息填写错误，提交失败')
      }
    })
  }

  let { ifShow, loading, form } = toRefs(state)
</script>

<style lang="scss" scoped>
.goodsInfo{
  display: flex;
  .left{
    margin-right: 20px;
  }
  .right{
    width: 300px;
  }
}
.line{
  border-bottom: 1px dashed #ccc;
  margin: 20px 0;
}
</style>