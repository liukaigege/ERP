<!--
* @Descripttion: Vango ERP setSuplier.vue
* @version: 1.0
* @Author: 王新国
* @Date: 2021-11-01 15:16:38
* @LastEditors: 王新国
* @LastEditTime: 2021-11-01 17:07:46
-->
<template>
  <el-dialog
    title="设置供应商"
    v-model="dialogVisible"
    width="30%"
    @close="close"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <div class="container">
      <el-form v-model="form" :inline="true" :rules="rules" ref="formRef">
        <el-form-item label="请选择供应商：" prop="supplierId">
          <el-cascader
            v-model="form.supplierId"
            :options="supllierList"
            :props="{
              expandTrigger: 'hover',
              children: 'childs',
              value: 'id',
              label: 'name'
            }"
            clearable
            filterable
            placeholder="全部"
            style="width: 400px"
          ></el-cascader>
        </el-form-item>
        <!-- <el-form-item>
          <el-checkbox @change="setSupplier">设为默认供应商</el-checkbox>
        </el-form-item> -->
      </el-form>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="dialogHandOk"
          :disabled="!form.supplierId"
          >确 定</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>
<script>
import { reactive, toRefs } from 'vue'
import { getTree, modify } from '@/api/purchase/outOfStock.js'
import { ElMessage } from 'element-plus'
export default {
  props: {
    selectList: {
      type: Array,
      default: []
    },
    sigleData: {
      type: Array,
      default: []
    }
  },
  emits: ['closeBack'],
  setup(props, { emit }) {
    const state = reactive({
      supllierList: [],
      dialogVisible: true,
      form: {
        supplierId: null,
        adminSupplierType: null
      },
      rules: {
        supplierId: [
          { required: true, message: '供应商不能为空', trigger: 'blur' }
        ]
      }
    })
    getTree().then(res => {
      state.supllierList = res.data
    })
    function setSupplier(val) {
      if (val) {
        state.form.adminSupplierType = 1
      } else {
        state.form.adminSupplierType = null
      }
    }
    function dialogHandOk() {
      const idList = !props.sigleData
        ? props.selectList.map(v => v.id)
        : props.sigleData.map(v => v.id)
      const { supplierId, adminSupplierType } = state.form
      let obj = {
        type: 1,
        idList,
        supplierId: supplierId[supplierId.length - 1],
        adminSupplierType,
        partnerType: 222
      }
      state.supllierList.find(v => {
        if (v.childs.some(val => val.id == obj.supplierId)) {
          obj.partnerType = v.id
          obj.partnerTypeName = v.name
          const el = v.childs.filter(val => val.id == obj.supplierId)[0]
          obj.supplierId = el.id
          obj.supplierName = el.name
          return true
        }
      })
      emit('closeBack', obj)

      // modify(obj).then(res => {
      //   if (res.code == 200) {
      //     ElMessage.success({ message: '设置供应商成功' })
      //     emit('closeBack', true)
      //   } else {
      //     ElMessage.warning({ message: res.message })
      //   }
      // })
    }
    function close() {
      emit('closeBack', false)
    }
    return {
      ...toRefs(state),
      setSupplier,
      dialogHandOk,
      close
    }
  }
}
</script>
<style lang='scss' scoped>
</style>
