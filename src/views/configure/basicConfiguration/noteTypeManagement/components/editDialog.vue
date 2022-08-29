<!--
 * @Descripttion:
 * @version:
 * @Author: 江澎涛
 * @Date: 2021-07-17 09:49:36
 * @LastEditors: 江澎涛
 * @LastEditTime: 2021-08-25 08:53:12
-->
<template>
<el-dialog :title="formData.id?'编辑备注':'新增备注'" v-model="newShow" width="30%" @close="close" :close-on-click-modal='false'>
    <el-form :model="formData" label-width="100px" :inline="false"  :ref="ref" :rules="rules">
        <el-form-item label="使用范围："  prop="useScope">
            <el-select v-model="formData.useScope" multiple   @change="change" style="width: 250px">
                <el-option label="订单" value="0"></el-option>
                <el-option label="商品" value="1"></el-option>
                <el-option label="采购" value="2"></el-option>
								<el-option label="待入库" value="5"></el-option>
                <el-option label="采购对账" value="4"></el-option>
            </el-select>
        </el-form-item>

        <el-form-item label="备注名称："  prop="name">
            <el-input v-model="formData.name"  placeholder="请输入备注名称" style="width: 250px" maxlength="5"></el-input>
        </el-form-item>
        <el-form-item label="图标："  prop="icon">
            <span hidden>{{formData.icon}}</span>
            <span :style="{
              overflow:'hidden',
              lineHeight:'20px',
              backgroundColor: formData.color,
              display: 'inline-block',
              width: '20px',
              height: '20px',
              color: '#fff',
              textAlign: 'center',
              marginTop: '5px'
            }">{{formData.word}}</span>
        </el-form-item>
        <!-- 颜色选择器 -->
        <el-form-item  >
          <el-form-item prop="color">
            <el-input v-model="color" style="width: 130px" @focus="inputFocus" maxlength="6" @blur="inputBlur" @input="inputChange">
                <template #suffix>
                    <el-color-picker v-model="formData.color" :predefine="predefineColors" @change="colorPicker"></el-color-picker>
                </template>
            </el-input>
          </el-form-item>
            <!-- 图标文字 -->
            <el-form-item class="mini2" prop="word">
                <el-input v-model="formData.word" placeholder="请输入图标文字" style="width: 100px" class="input-p" maxlength="1"></el-input>
            </el-form-item>
        </el-form-item>
        <el-form-item label="拣货单显示：" >
            <el-switch v-model="formData.pick"> </el-switch>
            <el-tooltip class="item" effect="light" content="此开关只作用于订单备注" placement="top">

                        <i class="el-icon-question"></i>

            </el-tooltip>
        </el-form-item>
        <el-form-item label="状态：" >
            <el-switch v-model="formData.enabled"> </el-switch>
        </el-form-item>
    </el-form>

    <template #footer>
        <el-button @click="close" >取消</el-button>
        <el-button type="primary"  @click="submit">确定</el-button>
    </template>
</el-dialog>
</template>

<script>
import { reactive, toRefs, getCurrentInstance, onMounted, watch } from 'vue'
import { addEdit } from '../composable/index.js'
export default {
    name: "editDialog",
    props: {
        formData: { type: Object, default: null }
    },
    emits: ['getTableData'],
    setup(props, { emit }) {
        // 校验邮箱
        function color(rule, value, callback) {
            if (value.length == 4 || value.length == 7) {
                return callback()
            } else {
                console.log(value);
                return callback('请输入3位或6位的颜色代码')
            }
        }
        const { proxy } = getCurrentInstance()
        const state = reactive({
            newShow: false,
            ref: '',
            rules: {
                name: [
                    { required: true, message: '请输入备注名称', trigger: 'blur' }
                ],
                color: [
                    { required: true, message: '请选择颜色', trigger: 'blur' },
                    { validator: color, trigger: 'blur' }
                ],
                word: [
                    { required: true, message: '请输入图标文字', trigger: 'blur' }
                ],
                icon: [{ required: true }],
                useScope: [{ required: true, message: '请选择使用范围', trigger: ['blur'] }]
            },
            predefineColors: ['#FF4D4F', '#FAAD14', '#1890FF', '#52C41A', '#722ED1', '#43C2D6', '#8FD500'],
            formData: {},
            color: props.formData.color,

        })

        onMounted(() => {
            state.newShow = true
        })

        watch(props.formData, val => {
            state.formData = val
            state.formData.icon = '111'
        }, { deep: true, immediate: true })

        // 关闭事件
        function close() {
            state.newShow = false
            setTimeout(() => {
                proxy.$parent.newShow = false
            }, 500);
        }

        // 获取元素
        function ref(el) {
            state.ref = el
        }

        // 创建备注
        function submit() {
            console.log(state.formData);
            addEdit(state, emit)
        }

        // 颜色选择聚焦
        function inputFocus() {
            if (state.color) state.color = state.color.replace('#', '')
        }

        // 输入框失焦
        function inputBlur() {
            if (state.formData.color) {
                state.color = state.formData.color
            }
        }

        // 输入框变化
        function inputChange() {
            state.color = state.color.replace(/[\W]/ig, '')
            if (state.color) {
                state.formData.color = '#' + state.color
            } else {
                state.formData.color = ''
            }
        }

        // 颜色选择器变化
        function colorPicker(e) {
            state.color = e
        }

        function change(e) {
            if (e.length == 0) {
                state.formData.useScope = ''
                console.log(state.formData);
            }
        }
        return {
            ...toRefs(state),
            close,
            ref,
            submit,
            inputFocus,
            inputChange,
            inputBlur,
            colorPicker,
            change
        }
    }
}
</script>

<style lang="scss" scoped>
.input-p {
    :deep(.el-input__inner) {
        padding: 0 0 0 5px;
    }
}

.mini2 {
    display: inline;
    margin-left: 5px;

    :deep(.el-form-item__content) {
        display: inline;
    }

    :deep(.el-form-item__error) {
        margin-top: 10px;
    }
}
.el-icon-question{
    position: relative;
    top: -8px;
}
</style>
