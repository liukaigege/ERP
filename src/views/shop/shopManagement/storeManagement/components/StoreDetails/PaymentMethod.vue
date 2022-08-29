<template>
<el-card class="box-card paymentMethod" shadow="never">
    <template #header>
        <div class="card-header">
            <span>支付方式</span>
        </div>
    </template>
    <!-- 信用卡 -->
    <div class="formBox">
        <el-form :model="data" :ref="(el)=>formRules = el" label-width="120px" >
            <div class="flex-form-item">
                <el-form-item label="信用卡:">
                    <el-button type="info" plain  disabled class="w310">{{data.creditCardAccount?data.creditCardAccount:'-'}}</el-button>
                    <a href="javascript:;" class="click-a" @click="dialogShow(0)" v-if="data.shopStatus!=0">更改</a><a href="javascript:;" class="click-a" @click="openDetail(1,'paymentMethod_1','creditCardAccount')">明细 <i :class="paymentMethod_1?'el-icon-arrow-up':'el-icon-arrow-down'"></i></a>
                </el-form-item>
                <el-form-item label="收款手续费:">
                    <el-button type="info" plain  disabled class="w204">{{data.creditCardFee?data.creditCardFee:'-'}}</el-button>
                    <el-button type="info" plain  disabled class="w98">%</el-button>
                </el-form-item>
            </div>
            <DetailsTable isSec :tableData="tableData1" :tableKey="['name','startTime','endTime','fee']" :tableName="['账号','使用时间','停用时间','手续费(%)']" :isOpen="paymentMethod_1" :className="'paymentMethod_1'" @detail="detail"/>
            <!-- paypal -->
            <div class="flex-form-item">
                <el-form-item label="PayPal:">
                    <el-button type="info" plain  disabled class="w310">{{data.paypalName?data.paypalName:'-'}}</el-button>
                    <a href="javascript:;" class="click-a" @click="dialogShow(1)" v-if="data.shopStatus!=0">更改</a><a href="javascript:;" class="click-a" @click="openDetail(2,'paymentMethod_2','paypalName')">明细 <i :class="paymentMethod_2?'el-icon-arrow-up':'el-icon-arrow-down'"></i></a>
                </el-form-item>
                <el-form-item label="收款手续费:">
                    <el-button type="info" plain  disabled class="w204">{{data.paypaFee?data.paypaFee:'-'}}</el-button>
                    <el-button type="info" plain  disabled class="w98">%</el-button>
                </el-form-item>
            </div>
            <DetailsTable isSec :tableData="tableData2" :tableKey="['name','startTime','endTime','fee']" :tableName="['账号','使用时间','停用时间','手续费(%)']" :isOpen="paymentMethod_2" :className="'paymentMethod_2'" @detail="detail"/>
            <!-- 在地支付 -->
            <div class="flex-form-item">
                <el-form-item label="Alipay:">
                    <el-button type="info" plain  disabled class="w310">{{data.Alipay?.locationAccount?data.Alipay.locationAccount:'-'}}</el-button>
                    <a href="javascript:;" class="click-a" @click="dialogShow(2)" v-if="data.shopStatus!=0">更改</a><a href="javascript:;" class="click-a" @click="openDetail(3,'paymentMethod_3','Alipay')">明细 <i :class="paymentMethod_3?'el-icon-arrow-up':'el-icon-arrow-down'"></i></a>
                </el-form-item>
                <el-form-item label="收款手续费:">
                    <el-button type="info" plain  disabled class="w204">{{data.Alipay?.locationFee?data.Alipay.locationFee:'-'}}</el-button>
                    <el-button type="info" plain  disabled class="w98">%</el-button>
                </el-form-item>
            </div>
            <DetailsTable isSec :tableData="tableData3" :tableKey="['name','startTime','endTime','fee']" :tableName="['账号','使用时间','停用时间','手续费(%)']" :isOpen="paymentMethod_3" :className="'paymentMethod_3'" @detail="detail"/>
            <div class="flex-form-item">
                <el-form-item label="Payssion:">
                    <el-button type="info" plain  disabled class="w310">{{data.Payssion?.locationAccount?data.Payssion.locationAccount:'-'}}</el-button>
                    <a href="javascript:;" class="click-a" @click="dialogShow(3)" v-if="data.shopStatus!=0">更改</a><a href="javascript:;" class="click-a" @click="openDetail(4,'paymentMethod_4','Payssion')">明细 <i :class="paymentMethod_4?'el-icon-arrow-up':'el-icon-arrow-down'"></i></a>
                </el-form-item>
                <el-form-item label="收款手续费:">
                    <el-button type="info" plain  disabled class="w204">{{data.Payssion?.locationFee?data.Payssion.locationFee:'-'}}</el-button>
                    <el-button type="info" plain  disabled class="w98">%</el-button>
                </el-form-item>
            </div>
        </el-form>
        <DetailsTable isSec :tableData="tableData4" :tableKey="['name','startTime','endTime','fee']" :tableName="['账号','使用时间','停用时间','手续费(%)']" :isOpen="paymentMethod_4" :className="'paymentMethod_4'" @detail="detail"/>
    </div>
    <PaymentDialog v-if="paymentDialogShow" @closeEvent="closeEvent" :title="paymentTitle" @detail="detail" :data="data" />
</el-card>
</template>

<script>
import { reactive, toRefs, watch } from 'vue'
import DetailsTable from './components/DetailsTable.vue'
import PaymentDialog from './components/PaymentDialog.vue'
import { shopPaymentMsg } from '@/api/goods/shop.js'
export default {
    components: { DetailsTable, PaymentDialog },
    props: {
        data: {}
    },
    emits: ['detail'],
    setup(props, context) {
        const state = reactive({
            formRules: '',
            paymentDialogShow: false, // 弹出框
            paymentTitle: '', // 弹出框的title
            paymentMethod_1: false,
            paymentMethod_2: false,
            paymentMethod_3: false,
            paymentMethod_4: false,
            tableData1: [],
            tableData2: [],
            tableData3: [],
            tableData4: [],
        })
        // 弹出框关闭事件
        function closeEvent(key) {
            state[key] = false
        }


        function dialogShow(title) {
            state.paymentDialogShow = true
            state.paymentTitle = title
        }

        function detail(key) {
            
            state['paymentMethod_'+key] = false
            console.log(state.paymentMethod_1);
            context.emit('detail')
        }

        function openDetail(type, el, key) {
            // if (!props.data[key] && type < 3) {
            //     return false
            // }
            // if (!props.data[key].locationAccount && type > 2) {
            //     return false
            // }
            shopPaymentMsg({ type, shopId: props.data.shopId }).then(res => {
                state['tableData' + type] = res.data
                state[el] = !state[el]
                
                console.log(state);
            })
        }
        return {
            ...toRefs(state),
            closeEvent,
            dialogShow,
            detail,
            openDetail
        }
    }
}
</script>

<style lang="scss" scoped>
.w290 {
    width: 260px;
}
</style>
