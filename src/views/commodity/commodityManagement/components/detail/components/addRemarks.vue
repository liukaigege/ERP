<template>
<el-dialog title="添加备注" width="640px" v-model="show" @close="close" :close-on-click-modal="false">
  <el-form :model="form" :inline="false"  ref="formRef">
    <el-form-item label="备注类型:" prop="remarkTypeId" :rules="{required:true,message:'请选择备注类型',trigger:'blur'}">
      <el-radio v-model="form.remarkTypeId" :label="item.id" v-for="item in typeData" :key="item.id">{{item.name}}</el-radio>
    </el-form-item>
    <el-form-item label="备注内容:" prop="content" :rules="{required:true,message:'请输入备注内容',trigger:'blur'}">
      <el-input v-model="form.content" placeholder="请输入..." type="textarea"  clearable :rows="4" maxlength="500"></el-input>
    </el-form-item>
  </el-form>

  <template #footer>
    <el-button  type="primary" @click="close">取消</el-button>
    <el-button  type="primary" @click="submit">确定</el-button>
  </template>
</el-dialog>
</template>

<script>
import { onMounted, reactive, toRefs, ref } from 'vue'
import { getRemarkTypes } from '@/api/order/orderManagement.js'
import { useRoute } from 'vue-router'
import { remarkAdd, remarkUpdate } from '@/api/commodity.js'
import { ElMessage } from 'element-plus'
export default {
  emits: ['closeEvent', 'search'],
  props: {
    data: {}
  },
  setup(props, ctx) {
    const route = useRoute()
    const state = reactive({
      show: true,
      typeData: [],
      form: {
        remarkTypeId: null,
        content: null,
        goodsId: route.query.goodsId,
        id:props.data?.id
      }
    })
    let formRef = ref(null)

    function close() {
      state.show = false
      setTimeout(() => {
        ctx.emit('closeEvent', 'remarksDialog')
      }, 500)
    }

    onMounted(() => {
      if (props.data) {
        state.form.remarkTypeId = props.data.typeId
        state.form.content = props.data.content
      }
      getRemarkTypes({ useScope: '1' }).then(res => {
        state.typeData = res.data
      })
    })

    function submit() {
      formRef.value.validate().then(res => {
        if (props.data) {
          remarkUpdate(state.form).then(res => {
            ElMessage.success('备注修改成功')
            ctx.emit('search')
            close()

          })
        } else {
          remarkAdd(state.form).then(res => {
            ElMessage.success('备注添加成功')
            ctx.emit('search')
            close()
            
          })
        }

      })
    }
    return {
      ...toRefs(state),
      close,
      submit,
      formRef
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep(.el-radio) {
  margin: 0;
  width: 25%;
}
</style>
