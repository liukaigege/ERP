<template>
<!-- 基本信息 -->
<el-dialog title="修改店铺状态" v-model="show" width="480px" @close="close" :close-on-click-modal="false">
    <el-form :model="formData" ref="formRef" :rules="rules" :inline="false" >
        <el-form-item label="店铺状态：">
            <el-switch v-model="formData.shopStatus"></el-switch>
        </el-form-item>
        <el-form-item label="停用时间：" v-if="!formData.shopStatus" prop="endTime">
            <el-date-picker v-model="formData.endTime" type="datetime" placeholder="请选择停用时间">
            </el-date-picker>
        </el-form-item>
    </el-form>
    <template #footer>
        <el-button @click="close" >取消</el-button>
        <el-button  type="primary" @click="changeStatus">确定</el-button>
    </template>
</el-dialog>
</template>

<script>
import { onMounted, reactive, toRefs } from 'vue'
import { shopStatus } from '@/api/goods/shop.js'
import { ElMessage } from 'element-plus'
import moment from 'moment'
export default {
    props: {
        data: {}
    },
    emits: ['detail', 'closeEvent'],
    setup(props, context) {
        const state = reactive({
            show: false,
            formData: {
                shopStatus: props.data.shopStatus == 0 ? false : true,
                endTime: ''
            },
            formRef: ''
        })

        const rules = {
            endTime: [{ required: true, message: '请选择停用时间', trigger: 'blur' }]
        }

        onMounted(() => {
            state.show = true
        })

        function close() {
            state.show = false
            setTimeout(() => {
                context.emit('closeEvent', 'statusDialogShow')
            }, 500)
        }

        function changeStatus() {
            let data = {
                shopStatus: state.formData.shopStatus ? 1 : 0,
                shopId: props.data.shopId,
                endTime: moment(state.formData.endTime).format('YYYY-MM-DD HH:mm:ss')
            }
            console.log(data);
            state.formRef.validate().then(res => {

                shopStatus(data).then(res => {
                    ElMessage.success('修改成功！')
                    context.emit('detail')
                    close()
                })
            })

        }
        return {
            ...toRefs(state),
            close,
            changeStatus,
            rules
        }
    }
}
</script>

<style lang="scss" scoped>
.el-form {
    margin-left: 30px;
}

.el-dialog {
    padding: 0 80px;
}
</style>
