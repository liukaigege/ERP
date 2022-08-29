<template>
<el-card class="box-card" shadow="never">
    <template #header>
        <div class="card-header">
            <span>域名开支</span>
        </div>
    </template>
    <el-form :model="formData" ref="formRef" :rules="rules" label-width="120px" >
        <div class="flex-form-item">
            <el-form-item label="主域名:" prop="domain2">
                <el-input v-model.trim="formData.domain2" class="w310"  maxlength="200" @input="(e)=>formData.domain2 = e.replace(/[ ]|[\r\n]/g,'')"></el-input>
            </el-form-item>
            <el-form-item label="域名费用:" prop="fee">
                <el-input v-model="formData.fee" class="w204" ></el-input>
                <el-select v-model="formData.company" class="w98" @change="formData.fee=''">
                    <el-option label="美元" :value="0"></el-option>
                    <el-option label="元" :value="1"></el-option>
                </el-select>
            </el-form-item>
        </div>
        <div class="flex-form-item">
            <el-form-item label="有效期:" prop="date">
                <el-date-picker v-model="formData.date" unlink-panels  type="daterange" range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期" class="w310" @change="timeChange">
                </el-date-picker>
            </el-form-item>
        </div>
    </el-form>
</el-card>
</template>

<script>
import { reactive, toRefs, watch } from 'vue'
import moment from 'moment'
import { requiredValue, moneyRules, ruleUrl } from '@/views/shop/shopRules/rules.js'
export default {
    props: {
        is_Submit: {
            type: Boolean
        },
        isResetShop: Boolean
    },
    emits: ['submitStatus'],
    setup(props, ctx) {
        const state = reactive({
            formData: {
                domain:'',
                domain2: '',
                fee: '',
                date: '',
                startTime: '',
                endTime: '',
                company: 1
            },
            formRef: '',
        })
        watch(() => props.isResetShop, val => {
            if (val) {
                state.formData = {
                    domain:'',
                    domain2: '',
                    fee: '',
                    date: '',
                    startTime: '',
                    endTime: '',
                    company: 1
                }
                console.log(state.formData);
            }
        })
        // 监听提交校验事件
        watch(() => props.is_Submit, val => {
            if (val) {
                state.formRef.validate().then(res => {
                    state.formData.domain = 'https://' + state.formData.domain2
                    ctx.emit('submitStatus', 'domain', state.formData)
                }).catch(res => {
                    ctx.emit('submitStatus', 'domain', false)
                })
            }
        })
        const rules = {
            domain2: ruleUrl('请输入主域名',1,state.formData),
            fee: moneyRules(state.formData, '请输入金额'),
            date: [requiredValue('请选择有效期')]
        }

        function timeChange(time) { // 时间格式处理 精确到秒
            if (time) {
                state.formData.startTime = moment(time[0]).format('YYYY-MM-DD 00:00:00')
                state.formData.endTime = moment(time[1]).format('YYYY-MM-DD 23:59:59')
            }
            console.log(state.formData);
        }

        return {
            ...toRefs(state),
            timeChange,
            rules,
        }
    }
}
</script>

<style>

</style>
