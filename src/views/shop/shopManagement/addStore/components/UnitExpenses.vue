<template>
<el-card class="box-card" shadow="never">
    <template #header>
        <div class="card-header">
            <span>插件开支</span>
            <a href="javascript:;" class="el-icon-plus" @click="createUnit"> 添加</a>
        </div>
    </template>

    <el-form :model="formData" ref="formRef" :rules="rules" label-width="120px" :inline="true" >
        <div class="form" v-for="(item,index) in formData" :key="index">
            <div class="flex-form-item">
                <el-form-item label="插件名称:" :prop="index+'.name'" :rules="rules.name">
                    <el-input v-model="item.name" class="w310"  maxlength="10"></el-input>
                </el-form-item>
                <el-form-item label="插件费用:" :prop="index+'.fee'" :rules="rules.fee">
                    <el-input type="number" v-model="item.fee" class="w204" ></el-input>
                    <el-select v-model="item.company" class="w98" @change="item.fee=''">
                        <el-option label="美元" :value="0"></el-option>
                        <el-option label="元" :value="1"></el-option>
                    </el-select>
                    <el-popconfirm title="确认删除吗?" @confirm="delRow(index)">
                        <template #reference>
                            <a href="javascript:;" class="float-right">删除</a>
                        </template>
                    </el-popconfirm>
                </el-form-item>
            </div>
            <div class="flex-form-item">
                <el-form-item label="有效期:" :prop="index+'.date'" :rules="rules.date">
                    <el-date-picker v-model="item.date" unlink-panels  type="daterange" range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期" class="w310" @change="time=>dateChange(time,item)">
                    </el-date-picker>
                </el-form-item>
            </div>
        </div>
    </el-form>
</el-card>
</template>

<script>
import { reactive, toRefs, watch } from 'vue'
import moment from 'moment'
import { checkNumber_2 } from '@/utils/ruleOptions.js'
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
            formData: [],
            formRef: []
        })

        const rules = {
            name: [{ required: true, message: '请输入插件名称', trigger: 'blur' }],
            date: [{ required: true, message: '请选择时间段', trigger: 'blur' }],
            fee: [{ required: true, message: '请输入金额', trigger: 'blur' }, {
                validator: (rule, value, callback) => {

                    if (state.formData[rule.field.split('.')[0]].company == 1) {
                        if (value < 0 || value > 9999999.99) {
                            return callback('请输入0到9999999.99之间的数字')
                        } else {
                            return callback()
                        }
                    } else {
                        if (value < 0 || value > 999999.99) {
                            return callback('请输入0到999999.99之间的数字')
                        } else {
                            return callback()
                        }
                    }
                },
                trigger: ['blur', 'change']
            }, { validator: checkNumber_2, trigger: ['blur', 'change'] }],
        }

        watch(() => props.isResetShop, val => {
            if(val){
                state.formData = []
                console.log(state.formData);
            }
        })

        function createUnit() {
            let obj = {
                name: '', //插件名称
                fee: '', //续费金额
                date: '', //时间
                company: 0, //单位
                startTime: '',
                endTime: ''
            }
            state.formData.push({ ...obj })
        }

        function delRow(e) {
            state.formData.splice(e, 1)
        }

        function dateChange(time, item) {
            item.startTime = moment(time[0]).format('YYYY-MM-DD 00:00:00')
            item.endTime = moment(time[1]).format('YYYY-MM-DD 23:59:59')
        }

        watch(() => props.is_Submit, val => {

            if (val) {
                state.formRef.validate().then(res => {
                    ctx.emit('submitStatus', 'unit', state.formData)
                }).catch(res => {
                    ctx.emit('submitStatus', 'unit', false)
                })

            }
        })
        return {
            ...toRefs(state),
            createUnit,
            delRow,
            dateChange,
            rules,
        }
    }
}
</script>

<style lang="scss" scoped>
.form+.form {
    border-top: 1px solid #e4e7ed;
    padding-top: 18px;
}
</style>
