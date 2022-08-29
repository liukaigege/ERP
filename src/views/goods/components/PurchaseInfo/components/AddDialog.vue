<template>
  <el-dialog v-model="show" :width="800" :title="type === 'main' ? '新增主件' : '新增配件'" :close-on-click-modal="false" :close-on-press-escape="false" @close="closeDialog">
    <el-form :model="form" ref="formRef" :rules="rules" label-width="100px">
      <div class="flex-justify-space">
        <el-form-item prop="name" :label="`${type === 'main' ? '主件' : '配件'}名称:`" required>
          <el-input class="same-width-input"  type="text" v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item prop="length" label="长:" required>
          <el-input type="number" @blur="changeFloat('length', 999.99, 0.01)" class="same-width-input"  v-model="form.length">
            <template #append>cm</template>
          </el-input>
        </el-form-item>
      </div>
      <div class="flex-justify-space">
        <el-form-item prop="weight" label="重量:" required>
          <el-input type="number" @blur="changeFloat('weight', 99999.99, 0.01)" class="same-width-input"  v-model="form.weight">
            <template #append>g</template>
          </el-input>
        </el-form-item>
        <el-form-item prop="width" label="宽:" required>
          <el-input type="number" @blur="changeFloat('width', 999.99, 0.01)" class="same-width-input"  v-model="form.width">
            <template #append>cm</template>
          </el-input>
        </el-form-item>
      </div>
      <div class="flex-justify-space">
        <el-form-item prop="material" label="材质:">
          <el-input class="same-width-input"  type="text" v-model="form.material"></el-input>
        </el-form-item>
        <el-form-item prop="height" label="高:" required>
          <el-input type="number" @blur="changeFloat('height', 999.99, 0.01)" class="same-width-input"  v-model="form.height">
            <template #append>cm</template>
          </el-input>
        </el-form-item>
      </div>
      <div class="flex-justify-space">
        <el-form-item prop="price" label="默认采购价:" required>
          <el-input type="number" @blur="changeFloat('price', 9999999.99, 0.01)" class="same-width-input"  v-model="form.price">
            <template #append>CNY</template>
          </el-input>
        </el-form-item>
        <el-form-item prop="purchaseLink" label="采购链接:">
          <el-input class="same-width-input"  type="text" maxlength="300" v-model="form.purchaseLink"></el-input>
        </el-form-item>
      </div>
    </el-form>
    <template #footer>
      <div class="justify-end-div">
        <el-button  @click="closeDialog">取消</el-button>
        <el-button  type="primary" @click="submitAdd">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { reactive, toRefs } from 'vue'
import ErpNumberInput from '@/components/erpNumberInput/index.vue'
export default {
  components: { ErpNumberInput },
  props: ['dialogType'],
  emits: ['addDialogSubmit', 'close'],
  setup(props, ctx) {
    const regxp1 = /^(?!0\d)\d{1,3}(\.\d{1,2})?$/
    const regxp2 = /^(?!(\s+$))/
    const state = reactive({
      show: true,
      type: props.dialogType,
      form: {
        type: props.dialogType === 'main' ? 1 : 2,
        name: null,
        length: null,
        width: null,
        height: null,
        weight: null,
        price: null,
        material: null,
        checked: false,
        purchaseLink: null
      },
      rules: {
        name: [{ required: true, message: '名称必填，最多60个字符', validator(rule, value, callback){
          value && value.length <= 60 && regxp2.test(value) ? callback() : callback(new Error(rule.message))
        }}],
        material: [{ pattern: /^(?!(\s+$))/, message: '不能全为空字符，最多30个字符', validator(rule, value, callback){
          !value || (value && regxp2.test(value) && value.length <= 30) ? callback() : callback(new Error(rule.message))
        }}],
        length: [{ required: true, validator(rule, value, callback) {
          if (regxp1.test(value) && value > 0) {
            callback()
          } else {
            callback(new Error('必填项，0以上的数值，最大999.99'))
          }
        }}],
        width: [{ required: true, validator(rule, value, callback) {
          if (regxp1.test(value) && value > 0) {
            callback()
          } else {
            callback(new Error('必填项，0以上的数值，最大999.99'))
          }
        }}],
        height: [{ required: true, validator(rule, value, callback) {
          if (regxp1.test(value) && value > 0) {
            callback()
          } else {
            callback(new Error('必填项，0以上的数值，最大999.99'))
          }
        }}],
        price: [{ required: true, validator(rule, value, callback) {
          if (/^(?!0\d)\d{1,7}(\.\d{1,2})?$/.test(value) && value > 0) {
            callback()
          } else {
            callback(new Error('必填项，0以上的数值，最大9999999.99'))
          }
        }}],
        weight: [{ required: true, validator(rule, value, callback) {
          if (/^(?!0\d)\d{1,5}(\.\d{1,2})?$/.test(value) && value > 0) {
            callback()
          } else {
            callback(new Error('必填项，0以上的数值，最大99999.99'))
          }
        }}]
      },
      formRef: null
    })

    function closeDialog() {
      state.show = false
      ctx.emit('close')
    }

    function submitAdd() {
      state.formRef.validate(val => {
        if (val) {
          ctx.emit('addDialogSubmit', state.form)
          ctx.emit('close')
        }
      })
    }

    function changeFloat(key, max, min) {
      state.form[key] = state.form[key] > max ? max : state.form[key] < min ? min : parseFloat(state.form[key]).toFixed(2)
    }

    return {
      ...toRefs(state),
      closeDialog,
      submitAdd,
      changeFloat
    }
  }
}
</script>

<style lang="scss" scoped>
.justify-end-div {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.flex-justify-space {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
  margin-top: 8px;
  .same-width-input {
    width: 200px;
  }
}
</style>
