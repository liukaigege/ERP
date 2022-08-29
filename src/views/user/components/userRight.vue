<template>
<div class="container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="用户资料" name="first" class="userInfo">
            <el-form
                :model="formData"
                :ref="formRef"
                :rules="rules"
                label-width="80px"
                :inline="false"
                size="normal">
                <el-form-item label="昵称：" prop="nickname">
                    <el-input v-model="formData.nickname" maxlength="32"  style="width: 300px" clearable></el-input>
                    <span class="color-eee">用户昵称不能作为登录使用</span>
                </el-form-item>
                <el-form-item label="手机号：" prop="mobile">
                    <el-input v-model="formData.mobile"  style="width: 300px" clearable></el-input>
                    <span class="color-eee">手机号码不能重复</span>
                </el-form-item>
                <el-form-item label="性别：">
                    <el-radio v-model="formData.sex" :label="0">男</el-radio>
                    <el-radio v-model="formData.sex" :label="1">女</el-radio>
                </el-form-item>
                <el-form-item label="">
                    <el-button type="primary"  @click="submit">保存</el-button>
                </el-form-item>
            </el-form>
        </el-tab-pane>
        <el-tab-pane label="操作日志" name="second" class="rizhi">
            <el-table :data="tableData" style="width: 100%">
                <el-table-column label="行为" width="200">
                    <template #default='scope'>
                        <div class="row-one" :title="scope.row.content">
                            {{scope.row.content}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="ip" label="IP" width="180"> </el-table-column>
                <el-table-column prop="ipLocation" label="IP来源"> </el-table-column>

                <el-table-column prop="createTime" label="创建日期">
                </el-table-column>
            </el-table>
            <!-- 分页器 -->
           <div class="pageRow">
                <el-pagination
                @size-change="sizeChange"
                @current-change="currentChange"
                :current-page="currentPage"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"

                :total="total"
                :page-sizes="[10, 20, 30, 50]"
                >
            </el-pagination>
           </div>
        </el-tab-pane>
    </el-tabs>
</div>
</template>

<script>
import { reactive, toRefs, watch } from 'vue'
import {submitUserInfo , getLogs} from '../composable/index.js'
export default {
    name: 'UserRight',
    props: {
        userData: {}
    },
    emits: ['getUser'],
    setup(props, { emit }) {
        const mobile = (rule, value, callback) => {
            //这个地方判断输入的号码是否与上次一致
            const reg = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
            const flag = reg.test(value)
            if (!flag) {
                return callback('手机号格式不正确')
            } else {
                return callback()
            }
        }
        const state = reactive({
            activeName: 'first',
            formData: {
                nickname: '',
                mobile: '',
                sex: 0
            },
            rules: {
                nickname: [
                    { required: true, message: '请输入内容', trriger: 'blur' }
                ],
                mobile: [
                    { required: true, message: '请输入内容', trriger: 'blur' },
                    { validator: mobile, trigger: 'blur' }
                ]
            },
            tableData: [],
            total: 0,
            currentPage: 1,
            pageSize: 10
        })
        watch(()=>props.userData,val=>{
            state.formData.nickname = val.fullName
            state.formData.sex = +val.gender
            state.formData.mobile = val.phoneNumber
            
        })
        const handleClick = e => {
            if (state.activeName = 'second') {
                getLogs(state)
            }
        }
        // 获取表单元素
        let formR = ''
        const formRef = el => {
            formR = el
        }
        // 保存用户信息
        const submit = async () => {
            const data = {
                userId: props.userData.userId,
                fullName: state.formData.nickname,
                phoneNumber: state.formData.mobile,
                gender: state.formData.sex + ''
            }
            submitUserInfo(data,formR,emit)
         
        }
   
        const sizeChange = e => {
            state.pageSize = e
            state.currentPage = 1
            getLogs(state)
        }
        const currentChange = e => {
            state.currentPage = e
            getLogs(state)
        }
        return {
            ...toRefs(state),
            handleClick,
            submit,
            formRef,
            sizeChange,
            currentChange
        }
    }
}
</script>

<style lang="scss" scoped>
:deep(.el-tabs__nav-scroll) {
    line-height: 60px;
    padding-left: 28px;
}

:deep(.el-form-item__label) {
    padding: 0;
}

.userInfo {
    padding: 10px 0px 10px 20px;
}

.color-eee {
    color: rgb(200, 200, 200);
    margin-left: 16px;
}

:deep(.cell) {
    font-weight: normal;
    text-align: center;
}

:deep(.el-table__body .el-table_1_column_5) {
    color: rgb(28, 146, 255);

}

:deep(.el-table__body .el-table_1_column_1 .cell) {
    text-align: left;
}

:deep(.el-table__header .el-table_1_column_1 .cell) {
    text-align: left;
}

:deep(thead th) {
    background-color: rgb(250, 250, 250);
}

.rizhi {
    padding: 20px;
}

:deep(.pageRow){
   .el-pagination{
        margin: 0;
        padding-top: 10px;
        text-align: right;
    }
}

.row-one {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;

}
</style>
