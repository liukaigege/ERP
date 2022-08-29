<template>
<el-card class="box-card platformExpenses" shadow="never">
    <template #header>
        <div class="card-header" ref="card">
            <span>平台开支</span>
        </div>
    </template>
    <div class="formBox">
        <el-form :model="data" :ref="(el)=>formRules = el" label-width="120px" >
            <div class="flex-form-item">
                <el-form-item label="平台套餐:">
                    <el-input v-model="data.shopPlatterName"  disabled class="w310"></el-input>
                    <a href="javascript:;" class="click-a" @click="platformDialogShow=true" v-if="data.shopStatus!=0">更改</a><a href="javascript:;" class="click-a" @click="openDetail">明细 <i :class="platformDetails?'el-icon-arrow-up':'el-icon-arrow-down'"></i></a>
                </el-form-item>
                <el-form-item label="到期时间:">
                    <el-input v-model="data.shopPlatterEndTime"  disabled class="w310"></el-input>
                </el-form-item>
            </div>
            <DetailsTable isSec :tableData="tableData" :tableKey="['name','validity','feeProp','type','amount']" :tableName="['平台套餐','有效期','手续费(%)','付款方式','费用']" @detail="detail" isDelete :isOpen="platformDetails" :className="'platformDetails'" :type="{api:platterLogDel,callback:detailData,data}" />
            <div class="flex-form-item">
                <el-form-item label="平台手续费:">
                    <el-input v-model="data.shopPlatterFeeProp"  class="w204" disabled></el-input>
                    <el-button type="info" plain  disabled class="w98">%</el-button>
                </el-form-item>
            </div>
        </el-form>
    </div>
    <PlatformDialog v-if="platformDialogShow" @closeEvent="closeEvent" :data="data" @detail="detail" />
</el-card>
</template>

<script>
import { onMounted, reactive, toRefs } from 'vue'
import DetailsTable from './components/DetailsTable.vue'
import PlatformDialog from './components/PlatformDialog.vue'
import { shopPlatterMsg, platterLogDel } from '@/api/goods/shop.js'
export default {
    components: { DetailsTable, PlatformDialog },
    props: {
        data: {
            type: Object
        }
    },
    emits: ['detail'],
    setup(props, context) {
        onMounted(()=>{
            console.dir(document.querySelector('.card-header'));
            console.dir(state.card);
        })
        const state = reactive({
            tableData: [],
            data: props.data,
            formRules: '',
            platformDialogShow: false, // 域名修改
            platformDetails: false,
            card:''
        })
        // 弹出框关闭事件
        function closeEvent(key) {
            state[key] = false
        }

        function openDetail() {
            state.platformDetails = !state.platformDetails
            if (state.platformDetails) {
                detailData()
            }
        }

        function detailData() {
            shopPlatterMsg({ shopId: props.data.shopId }).then(res => {
                state.tableData = res.data
            })
        }

        function detail() {
            state.platformDetails = false
            context.emit('detail')
        }
        return {
            ...toRefs(state),
            closeEvent,
            openDetail,
            detail,
            platterLogDel,
            detailData

        }
    }
}
</script>

<style>

</style>
