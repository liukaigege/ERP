<template>
<el-dialog :title="message[title]" width="640px" v-model="show" @close="closeEvent" :close-on-click-modal="false">
    <div class="formBox">
        <el-form :model="formData" ref="formRef" :rules="rules" label-width="110px" :inline="false" >
            <el-form-item label="支付方式:" prop="creditCard" v-if="title==0">
                <el-cascader v-model="value" :disabled="!formData.status" clearable :options="payData.creditCard" :props="{value:'name',label:'name',children:'children'}" class="w360" @change="payChange"></el-cascader>
            </el-form-item>
            <el-form-item label="支付方式:" :prop="title==1?'paypalName':'account'" v-else>
                <el-select v-model="formData[title==1?'paypalName':'account']" class="w360" :disabled="!formData.status" @change="()=>title==1?formData.fee=10:false" :filterable="title==1">
                    <el-option v-for="item in title==1?payData.payPal:title==2?payData.Alipay:payData.Payssion" :key="item.name" :label="item.name" :value="item.name">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="收款手续费:" prop="fee">
                <el-input type="number" v-model="formData.fee" class="w243"  :disabled="!formData.status || title==1"></el-input>
                <el-button type="info" plain  class="w109" disabled>% </el-button>
            </el-form-item>
            <el-form-item label="使用时间:" prop="startTime">
                <el-date-picker v-model="formData.startTime" class="w360"  type="datetime" @change="changeTime($event,'startTime')" :disabled="!paymentChange">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="状态:">
                <el-switch v-model="formData.status" :disabled="paymentChange">
                </el-switch>
            </el-form-item>
            <el-form-item label="停用时间:" v-if="!formData.status" prop="endTime">
                <el-date-picker v-model="formData.endTime" class="w360" type="datetime" @change="changeTime($event,'endTime')">
                </el-date-picker>
            </el-form-item>
        </el-form>
    </div>

    <template #footer>
        <el-button @click="closeEvent" >取消</el-button>
        <el-button type="primary"  @click="submit">确定</el-button>
    </template>
</el-dialog>
</template>

<script>
import { onMounted, reactive, toRefs, watch, watchEffect } from 'vue'
import { changeShopCreditCard, changeShopPaypal, changeShopLocation, paymentSelect } from '@/api/goods/shop.js'
import { requiredValue, fee, moneyRules } from '@/views/shop/shopRules/rules.js'
import moment from 'moment'
import { deepCopy } from '@/utils/tool.js'
import { ElMessage } from 'element-plus'
export default {
    emits: ['closeEvent', 'detail'],
    props: {
        title: {},
        data: {
            type: Object,
            default: {}
        }
    },
    setup(props, context) {
        const state = reactive({
            show: false,
            formRef: '',
            formData: {
                shopId: props.data.shopId,
                status: true,
                creditCard: '',
                account: '', //账号
                paypalName: '', //paypal账号
                location: '',
                startTime: '',
                endTime: '',
                fee: ''
            },
            value: [props.data.creditCardName, props.data.creditCardAccount],
            payData: {},
            paymentChange: false,
            oldTime: ''
        })

        watchEffect(() => {
            if (props.title == 0) {
                state.formData.fee = props.data.creditCardFee
                state.formData.account = props.data.creditCardAccount
                state.formData.creditCard = props.data.creditCardName
                state.oldTime = state.formData.startTime = props.data.creditCardStartTime
            }
            if (props.title == 1) {
                state.formData.fee = props.data.paypaFee
                state.formData.paypalName = props.data.paypalName
                state.oldTime = state.formData.startTime = props.data.payPalStartTime
            }
            if (props.title == 2) {
                state.formData.fee = props.data.Alipay.locationFee
                state.formData.location = 'Alipay'
                state.formData.account = props.data.Alipay.locationAccount
                state.oldTime = state.formData.startTime = props.data.Alipay.locationStartTime
            }
            if (props.title == 3) {
                state.formData.fee = props.data.Payssion.locationFee
                state.formData.location = 'Payssion'
                state.formData.account = props.data.Payssion.locationAccount
                state.oldTime = state.formData.startTime = props.data.Payssion.locationStartTime

            }
        })
        const message = ['修改信用卡支付', '修改PayPal支付', '修改Alipay', '修改Payssion']

        const rules = {
            creditCard: [requiredValue('请选择信用卡号')],
            paypalName: [requiredValue('请选择paypal账号')],
            fee: fee('请输入手续费'),
            startTime: [requiredValue('请选择使用时间')],
            endTime: [requiredValue('请选择停用时间')],
            account: [requiredValue('请选择账号')]
        }

        watch(() => state.formData, val => {
            // 监听支付方式和手续费是否发生改变，如果改变则禁用状态按钮
            switch (props.title) {
                case 0:
                    state.paymentChange = state.formData.fee != props.data.creditCardFee || state.formData.account != props.data.creditCardAccount || state.formData.creditCard != props.data.creditCardName
                    break;
                case 1:
                    state.paymentChange = state.formData.fee != props.data.paypaFee || state.formData.paypalName != props.data.paypalName
                    break;
                case 2:
                    state.paymentChange = state.formData.fee != props.data.Alipay.locationFee || state.formData.account != props.data.Alipay.locationAccount
                    break;
                case 3:
                    state.paymentChange = state.formData.fee != props.data.Payssion.locationFee || state.formData.account != props.data.Payssion.locationAccount
                    break;
            }

        }, { deep: true })

        onMounted(() => {
            state.show = true
            paymentSelect().then(res => {

                res.data.forEach(item => {
                    if (item.type) {
                        item.children = []
                    } else {
                        item.type = res.data.filter(val => val.id == item.pid)[0].name
                    }
                })

                const payData = {
                    creditCard: res.data.filter(item => item.type == 1),
                    payPal: res.data.filter(item => item.type == 'paypal'),
                    Alipay: res.data.filter(item => item.type == 'Alipay'),
                    Payssion: res.data.filter(item => item.type == 'Payssion')
                }

                payData.creditCard.forEach(item => {
                    item.children = res.data.filter(val => val.pid == item.id)
                })

                state.payData = payData
            })
        })

        function closeEvent() {
            state.show = false
            setTimeout(() => {
                context.emit('closeEvent', 'paymentDialogShow')
            }, 500)
        }

        function payChange(e) {
            console.log(e, state.value);
            if (Array.isArray(e)) {
                state.formData.creditCard = e[0]
                state.formData.account = e[1]
            } else {
                state.formData.creditCard = null
                state.formData.account = null
            }

        }

        function changeTime(e, key) {
            state.formData[key] = moment(e).format('YYYY-MM-DD HH:mm:ss')
            console.log(state.formData);
        }

        function submit() {
            state.formRef.validate().then(res => {
                if(!state.paymentChange&&state.formData.status) return ElMessage.error('请进行更改')
                if (state.paymentChange && new Date(state.formData.startTime).getTime() <= new Date(state.oldTime).getTime()) {
                   return  ElMessage.error('请输入正确的使用时间')
                }
                if(!state.formData.status && new Date(state.formData.endTime).getTime() <= new Date(state.formData.startTime).getTime()){
                    return ElMessage.error('请输入正确的使用时间')
                }
                state.formData.status = state.formData.status ? 1 : 0
                if (props.title == 0) {
                    changeShopCreditCard(state.formData).then(res => {
                        ElMessage.success('信用卡修改成功')
                        context.emit('detail',props.title+1)
                        closeEvent()
                    })
                }
                if (props.title == 1) {
                    changeShopPaypal(state.formData).then(res => {
                        ElMessage.success('paypal修改成功')
                        context.emit('detail',props.title+1)
                        closeEvent()
                    })
                }
                if (props.title > 1) {
                    changeShopLocation(state.formData).then(res => {
                        ElMessage.success('修改成功')
                        context.emit('detail',props.title+1)
                        closeEvent()
                    })
                }
            })
            setTimeout(() => state.formData.status = state.formData.status == 1 ? true : false, 1)
        }
        return {
            ...toRefs(state),
            closeEvent,
            payChange,
            rules,
            changeTime,
            submit,
            message,
        }
    }
}
</script>

<style lang="scss" scoped>
:deep(.w360) {
    width: 360px;
}

:deep(.w243) {
    width: 243px;
}

:deep(.w109) {
    width: 109px;
    margin-left: 8px;
}

.formBox {
    color: blue;
}
</style>
