<template>
  <el-form-item class="mt-20" label="商品品类：">
    <el-cascader :disabled="!edit" v-model="categoryId"  :options="categoryOptions" :props="{ value: 'id', label: 'name', children: 'child' }" style="width: 300px"></el-cascader>
    <el-button v-if="!edit" class="ml-10" @click="edit = true" type="primary" >更改品类</el-button>
    <template v-else>
      <el-button class="ml-10" type="primary"  @click="save">保存</el-button>
      <el-button @click="cancelSave" >取消</el-button>
    </template>
  </el-form-item>
</template>

<script>
import { reactive, toRefs } from 'vue'
import { getCategoryTreeById, saveChangeCategory } from '@/api/goods/quotation'
import { ElMessage } from 'element-plus'
import { findPathbyId } from 'tool'

export default {
  props: ['id', 'goodsId'],
  setup(props) {
    const state = reactive({
      oldCategoryId: [],
      categoryId: [],
      categoryOptions: [],
      edit: false
    })

    getCategoryTreeById({ categoryId: props.id }).then(r => {
      state.categoryOptions = r.data
      state.categoryId = findPathbyId(state.categoryOptions, props.id)
      state.oldCategoryId = state.categoryId
    })

    function cancelSave() {
      state.edit = false
      state.categoryId = state.oldCategoryId
    }

    function save() {
      const categoryId = state.categoryId[state.categoryId.length - 1]
      const goodsId = props.goodsId
      saveChangeCategory({
        goodsId,
        categoryId,
        checkStatus: 0
      }).then(r => {
        state.edit = false
        state.oldCategoryId = state.categoryId
        ElMessage.success({ message: '品类更换成功' })
      })
    }

    return {
      ...toRefs(state),
      cancelSave,
      save
    }
  }
}
</script>
