<template>
<el-card class="box-card" shadow="never">
    <template #header>
        <div class="card-header">
            <span>平台开支</span>
        </div>
    </template>
    <el-form :model="formData" ref="formRef" :rules="rules" label-width="120px" :inline="true" >
        <div class="flex-form-item">
            <el-form-item label="套餐名称:" prop="name">
                <el-input v-model="formData.name" class="w310"  maxlength="10"></el-input>
            </el-form-item>
            <el-form-item label="平台服务费:" prop="feeProp">
                <el-input v-model="formData.feeProp" class="w204" ></el-input>
                <el-button class="w98" type="info" plain  disabled>%</el-button>
            </el-form-item>
        </div>
        <div class="flex-form-item">
            <el-form-item label="套餐费用:" prop="amount">
                <el-input v-model="formData.amount " class="w204" ></el-input>
                <el-select class="w98"  v-model="formData.company">
                    <el-option label="美元" :value="0"></el-option>
                    <el-option label="元" :value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="有效期:" prop="date">
                <el-date-picker v-model="formData.date" unlink-panels  type="datetimerange" range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="defaultTime" class="w310" @change="dateChange">
                </el-date-picker>
            </el-form-item>
        </div>
        <div class="flex-form-item">
            <el-form-item label="付款方式:" prop="type">
                <el-radio-group v-model="formData.type">
                <el-radio label="0" >月付</el-radio>
                <el-radio label="1" >年付</el-radio>
                </el-radio-group>
            </el-form-item>
        </div>
    </el-form>
</el-card>
</template>

<script>
import { reactive, toRefs, watch } from 'vue'
import moment from 'moment'
import { requiredValue, moneyRules, fee } from '@/views/shop/shopRules/rules.js'
export default {
    props: {
        is_Submit: {
            type: Boolean
        },
        isResetShop:Boolean
    },
    emits: ['submitStatus'],
    setup(props, ctx) {
        const state = reactive({
            formData: {
                name: '', //套餐名称
                feeProp: '', //手续费
                company: 0, // 钱币类型
                date: '', //有效期
                amount: '', //费用
                type: '', // 付款方式
                startTime: '',
                endTime: ''
            },
            formRef: '',
            defaultTime: [ new Date('', '', '', '00', '00', '00'), new Date('', '', '', '23', '59', '59')]
        })
        const rules = {
            name: [requiredValue('请输入套餐名称')],
            amount: moneyRules(state.formData, '请输入金额'),
            feeProp: fee('请输入手续费'),
            type: [requiredValue('请选择支付方式')],
            date:[requiredValue('请选择有效期')],
        }
        watch(() => props.is_Submit, val => {
            if (val) {
                state.formRef.validate().then(res => {
                    ctx.emit('submitStatus', 'platform', state.formData)
                }).catch(res => {
                    ctx.emit('submitStatus', 'platform', false)

                })
            }
        })

        watch(() => props.isResetShop, val => {
            if (val) {
                state.formData = {
                name: '', //套餐名称
                feeProp: '', //手续费
                company: 0, // 钱币类型
                date: '', //有效期
                amount: '', //费用
                type: '', // 付款方式
                startTime: '',
                endTime: ''
            }
                console.log(state.formData);
            }
        })

        function dateChange(time) {
            state.formData.startTime = moment(time[0]).format('YYYY-MM-DD HH:mm:ss')
            state.formData.endTime = moment(time[1]).format('YYYY-MM-DD 23:59:59')
            console.log(state.formData);
        }
        return {
            ...toRefs(state),
            rules,
            dateChange
        }
    }
}
</script>

<style>

</style>
