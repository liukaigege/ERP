<!--
 * @Descripttion: 
 * @version: 
 * @Author: 江澎涛
 * @Date: 2021-08-21 08:45:02
 * @LastEditors: 江澎涛
 * @LastEditTime: 2021-08-22 14:51:13
-->
<template>
<el-dialog title="新增拦截" v-model="dialogShow" width="45%" @close="closeDialog" :close-on-click-modal='false'>
    <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="包裹号" name="0">
            <el-input type="textarea" :rows="10" placeholder="请输要拦截的包裹号，多条可用逗号或空格隔开" v-model="inputValue">
            </el-input>
        </el-tab-pane>
        <el-tab-pane label="订单号" name="1">
            <el-input type="textarea" :rows="10" placeholder="请输要拦截的订单号，多条可用逗号或空格隔开" v-model="inputValue">
            </el-input>
        </el-tab-pane>
        <el-tab-pane label="运单号" name="2">
            <el-input type="textarea" :rows="10" placeholder="请输要拦截的运单号，多条可用逗号或空格隔开" v-model="inputValue">
            </el-input>
        </el-tab-pane>
    </el-tabs>
    拦截原因：
    <el-select v-model="interceptSelect"  placeholder="请选择" style="width: 400px; margin-top: 30px">
        <el-option v-for="item in intercept" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
    </el-select>
    <el-input class="input" type="textarea" placeholder="请输入内容" v-model="textarea" maxlength="30" show-word-limit :style="{ visibility: interceptSelect == '其他' ? 'visible' : 'hidden'}"></el-input>
    <template #footer>
        <el-button  @click="dialogShow = false">取消</el-button>
        <el-button type="primary"  @click="submit" :disabled="disabled">确定</el-button>
    </template>
</el-dialog>
</template>

<script>
import { getCurrentInstance, onMounted, reactive, toRefs } from 'vue'
import { interceptSave } from '@/api/order/orderProcessing'
import { ElMessage } from 'element-plus'
import { successData } from '../composable/index.js'
export default {
    setup() {
        const { proxy } = getCurrentInstance()
        const state = reactive({
            inputValue: '',
            activeName: '0',
            interceptSelect: '',
            dialogShow: false,
            textarea: '',
            intercept: [
                { lable: '1', value: '订单拒付' },
                { lable: '2', value: '客户发起补偿申请' },
                { lable: '3', value: '发错人' },
                { lable: '4', value: '客户地址有误' },
                { lable: '5', value: '客户取消订单' },
                { lable: '6', value: '定制商品信息有误' },
                { lable: '7', value: '产品功能不符，零件缺失' },
                { lable: '8', value: '物流渠道变更' },
                { lable: '10', value: '订单退款' },
                { lable: '9', value: '其他' }
            ],
            disabled: false,
        })

        onMounted(() => {
            state.dialogShow = true
        })

        function handleClick() {
            state.interceptSelect = ''
            state.textarea = ''
        }

        function submit() {
            if (!state.inputValue.trim()) return ElMessage.error(`请输入${state.activeName==0?'包裹':state.activeName==1?'订单':'运单'}号`)
            if (state.interceptSelect == '') return ElMessage.error('请选择原因')
            if (state.textarea.trim().length == 0 && state.interceptSelect == '其他') return ElMessage.error('请输入内容!')
            const data = {
                type: +state.activeName,
                ids: state.inputValue.replace(/\n/g, ','),
                reason: state.interceptSelect != '其他' ? state.interceptSelect : state.textarea
            }
            state.disabled = true
            interceptSave(data).then(res => {
                    successData.successData = res.data
                    successData.success = true
                    successData.successData.filaure.forEach((val, index) => {
                        successData.successData.filaure[index] = val.split(':')
                    })
                    closeDialog()
                    setTimeout(() => {
                        state.disabled = false
                    }, 1000);
                })
                .catch(err => {
                  
                    setTimeout(() => {
                        state.disabled = false
                    }, 1000);
                })

        }

        function closeDialog() {
            state.dialogShow = false
            setTimeout(() => {
                proxy.$parent.dialogShow = false
            }, 500);
        }
        return {
            ...toRefs(state),
            submit,
            handleClick,
            closeDialog
        }
    }
}
</script>

<style lang="scss" scoped>
.input {
    width: 500px;
    padding-left: 73px;
    padding-top: 20px;
}
</style>
