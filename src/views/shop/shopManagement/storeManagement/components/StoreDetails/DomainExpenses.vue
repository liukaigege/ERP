<template>
<el-card class="box-card domainExpenses" shadow="never">
    <template #header>
        <div class="card-header">
            <span>域名开支</span>
        </div>
    </template>
    <div class="formBox">
        <el-form :model="data" ref="formRef"  class="form" label-width="120px">
            <div class="flex-form-item">
                <el-form-item label="域名:">
                    <el-input v-model="data.domain"  disabled class="w310" maxlength="50"></el-input>
                    <a href="javascript:;" class="click-a" @click="domainDialogShow = true" v-if="data.shopStatus!=0">更改</a>
                    <a href="javascript:;" class="click-a" @click="openDetail">明细 <i :class="domainDetails ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i></a>
                </el-form-item>
                <el-form-item label="到期时间:">
                    <el-input v-model="data.domainEndTime"  disabled class="w310"></el-input>
                </el-form-item>
            </div>
            <DetailsTable :tableData="tableData" :tableKey="['domain','validity','openTime','closeTime','fee']" :tableName="['域名','有效期','启用时间','停用时间','费用']" isDelete :isOpen="domainDetails" :className="'domainDetails'" :type="{api:domainLogDel,callback:detailData,data}" @detail="detail"/>
        </el-form>
    </div>
    <!--  -->
    <DomainDialog :data="data" v-if="domainDialogShow" @closeEvent="closeEvent" @detail="detail" />
</el-card>
</template>

<script>
import { reactive, toRefs } from 'vue'
import DetailsTable from './components/DetailsTable.vue'
import DomainDialog from './components/DomainDialog.vue'
import { shopDomainMsg ,domainLogDel} from '@/api/goods/shop.js'
export default {
    components: { DetailsTable, DomainDialog },
    props: {
        data: {
            type: Object
        },
    },
    emits: ['detail'],
    setup(props, context) {
        const state = reactive({
            tableData:[],
            data: props.data,
            formRef: '',
            domainDialogShow: false, // 域名修改
            domainDetails: false
        })
        // 弹出框关闭事件
        function closeEvent(key) {
            state[key] = false
        }

        function detail() {
            state.domainDetails = false
            context.emit('detail')
        }

        function openDetail() {
            state.domainDetails = !state.domainDetails
            if(state.domainDetails){
            detailData()
            }
        }

        function detailData(){
                shopDomainMsg({shopId:props.data.shopId}).then(res=>{
                state.tableData = res.data
            })
        }


        return {
            ...toRefs(state),
            closeEvent,
            detail,
            openDetail,
            detailData,
            domainLogDel
        }
    }
}
</script>

<style>
</style>
