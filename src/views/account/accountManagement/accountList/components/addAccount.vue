<!--
* @Descripttion: Vango ERP addAccount 新增账号
* @version: 1.0
* @Author: 王新国
* @Date: 2021-11-01 15:16:38
* @LastEditors: 王新国
* @LastEditTime: 2021-11-01 17:07:46
-->
<template>
  <el-dialog
    :title="operationData == null ? '新增账号' : '编辑账号'"
    v-model="dialogVisible"
    width="480px"
    @closed="handleClose"
    :close-on-click-modal="false"
  >
    <div>
      <el-form
        ref="formRef"
        :model="form"
        label-width="100px"
        :rules="rules"
        @keyup.enter="ok"
      >
        <el-form-item label="账号平台：" prop="platform">
          <el-select
            v-model="form.platform"
            placeholder="请选择账号平台"
            clearable
            style="width: 340px"
            :disabled="!operationData == ''"
          >
            <el-option label="PayPal" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="PayPal名称：" prop="name">
          <el-input
            v-model.trim="form.name"
            clearable
            placeholder="请输入PayPal名称"
            :disabled="!operationData == ''"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="PayPal账号：" prop="account">
          <el-input
            class="shortInput"
            v-model.trim="form.account"
            clearable
            placeholder="请输入PayPal账号"
            :disabled="!operationData == ''"
          ></el-input>
          <el-button
            type="text"
            @click="addAccountListFn"
            :disabled="form.accountList.length > 3"
            >添加</el-button
          >
        </el-form-item> -->
        <el-form-item
          v-for="(v, i) in form.accountList"
          :key="v.tempId"
          :prop="'accountList' + (i + 1)"
          :label="i === 0 ? 'PayPal账号：' : ''"
        >
          <el-input
            :class="v.isAdd || i === 0 ? 'shortInput' : ''"
            v-model.trim="v.value"
            clearable
            placeholder="请输入PayPal账号"
            :disabled="!v.isAdd"
          ></el-input>
          <el-button
            type="text"
            @click="addAccountListFn"
            v-if="i === 0"
            :disabled="form.accountList.length > 4"
            >添加</el-button
          >
          <el-button
            class="redBtn"
            type="text"
            v-if="v.isAdd && i !== 0"
            @click="deleteListFn(v.tempId)"
            >删除</el-button
          >
        </el-form-item>
        <el-form-item label="PayPal编号：">
          <el-input-number
            v-model="form.number"
            placeholder="请输入PayPal编号"
            :precision="0"
            style="width: 340px"
            :max="9999"
            :controls="false"
          >
          </el-input-number>
        </el-form-item>
        <el-form-item label="交易手续费：" prop="fee">
          <el-input
            v-model="form.fee"
            clearable
            placeholder="请输入交易手续费"
            type="number"
          >
            <template #append>%</template>
          </el-input>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="ok">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { reactive, toRefs } from 'vue'
import { operationDataDefault } from '../composables/data'
import { editAccount } from '../composables/api'
import { ElMessage } from 'element-plus'
import { deepCopy } from '@/utils/tool'
export default {
  props: {
    operationData: {
      type: Object,
      default: null
    }
  },
  emits: ['addAccountBack'],
  setup(props, { emit }) {
    //   最多保留两位小数,值范围在0-100之间（包含0 100）
    const regularText =
      /^((?:0|[1-9][0-9]?|100)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/
    const { operationData: form } = props
    console.log('operationData', form)

    const state = reactive({
      dialogVisible: true,
      form: form ? deepCopy(form) : deepCopy(operationDataDefault),
      rules: {
        platform: [
          { required: true, message: '请选择账号平台', trigger: 'change' }
        ],
        name: [
          {
            required: true,
            min: 1,
            max: 100,
            message: '最少1个字符，最多100个字符'
          }
        ],
        // account: [
        //   { required: true, message: '请输入PayPal账号', trigger: 'blur' },
        //   { required: false, min: 0, max: 100, message: '最多100个字符' }
        // ],
        accountList1: [
          {
            required: true,
            validator(rule, value, callback) {
              let message = !state.form.accountList[0]?.value
                ? '请输入PayPal账号'
                : state.form.accountList[0]?.value?.length > 100
                ? '最多100个字符'
                : isTrue(state.form.accountList[0])
                ? 'PayPal账号不能重复！'
                : ''

              !!message ? callback(new Error(message)) : callback()
            },
            trigger: 'blur'
          }
        ],
        accountList2: [
          {
            required: false,
            validator(rule, value, callback) {
              let message =
                state.form.accountList[1]?.value?.length > 100
                  ? '最多100个字符'
                  : isTrue(state.form.accountList[1])
                  ? 'PayPal账号不能重复！'
                  : ''
              !!message ? callback(new Error(message)) : callback()
            },
            trigger: 'blur'
          }
        ],
        accountList3: [
          {
            required: false,
            validator(rule, value, callback) {
              let message =
                state.form.accountList[2]?.value?.length > 100
                  ? '最多100个字符'
                  : isTrue(state.form.accountList[2])
                  ? 'PayPal账号不能重复！'
                  : ''
              !!message ? callback(new Error(message)) : callback()
            },
            trigger: 'blur'
          }
        ],
        accountList4: [
          {
            required: false,
            validator(rule, value, callback) {
              let message =
                state.form.accountList[3]?.value?.length > 100
                  ? '最多100个字符'
                  : isTrue(state.form.accountList[3])
                  ? 'PayPal账号不能重复！'
                  : ''
              !!message ? callback(new Error(message)) : callback()
            },
            trigger: 'blur'
          }
        ],
        accountList5: [
          {
            required: false,
            validator(rule, value, callback) {
              let message =
                state.form.accountList[4]?.value?.length > 100
                  ? '最多100个字符'
                  : isTrue(state.form.accountList[4])
                  ? 'PayPal账号不能重复！'
                  : ''
              !!message ? callback(new Error(message)) : callback()
            },
            trigger: 'blur'
          }
        ],
        fee: [
          { required: true, message: '请输入交易手续费', trigger: 'blur' },
          {
            validator(rule, value, callback) {
              !regularText.test(value) || value > 100
                ? callback(new Error(rule.message))
                : callback()
            },
            message: '请输入0-100之间数字(最多保留2位小数)'
          }
        ]
      },
      formRef: null
    })

    function isTrue(data) {
      if (data.value) {
        // if (data.value == state.form.account) return true
        if (
          state.form.accountList.some(
            v => v.tempId !== data.tempId && v.value === data.value
          )
        )
          return true
        return false
      }
      return false
    }

    function handleClose() {
      emit('addAccountBack', false)
    }

    function ok() {
      state.formRef.validate(val => {
        if (val) {
          let data = { ...state.form }
          data.accountList = data.accountList
            .filter(v => !!v.value && v.isAdd)
            .map(v => v.value)
          typeof data.number == 'number' && (data.number = data.number + '')
          editAccount(data).then(res => {
            if (res.code == 200) {
              emit('addAccountBack', true)
            } else {
              ElMessage.warning({ message: res.message })
            }
          })
        }
      })
    }

    function addAccountListFn() {
      state.form.accountList.push({
        value: '',
        isAdd: true,
        tempId: Math.random()
      })
    }

    function deleteListFn(id) {
      state.form.accountList = state.form.accountList.filter(
        v => v.tempId != id
      )
    }
    return {
      ...toRefs(state),
      handleClose,
      ok,
      deleteListFn,
      addAccountListFn
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep(.el-input-number) {
  .el-input__inner {
    text-align: left;
    padding-left: 11px;
  }
}
.shortInput {
  width: 85%;
  margin-right: 15px;
}
.redBtn {
  color: var(--el-color-danger);
}
</style>
