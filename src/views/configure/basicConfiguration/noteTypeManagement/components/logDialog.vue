<!--
 * @Descripttion: 
 * @version: 
 * @Author: 江澎涛
 * @Date: 2021-08-16 15:16:07
 * @LastEditors: 江澎涛
 * @LastEditTime: 2021-08-16 16:13:16
-->
<template>
        <!-- 操作日志弹出框 -->
        <el-dialog title="操作日志" width="860px" v-model="logShow" @close="close" :close-on-click-modal="false">
            <el-table :data="logData" stripe height="500">
                <el-table-column label="时间" prop="createTime">
                    <template #default="scope">
                        <span style="color:#108EE9">{{filterTime(scope.row.createTime)}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作人" prop="userName">
                </el-table-column>
                <el-table-column label="操作" prop="content">
                </el-table-column>
            </el-table>

            <el-pagination
                @size-change="logSizeChange"
                @current-change="logCurrentChange"
                :current-page="logCurrent"
                :page-sizes="[10, 20, 30, 40,100]"
                :page-size="logSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="logTotal"
                small>
            </el-pagination>
        </el-dialog>

</template>

<script>
import { getCurrentInstance, onMounted, reactive, toRefs } from 'vue'
import { checkUserLogs } from '@/api/logs.js'
import { filterTime } from '../composable/index.js'

export default {
    setup(){
        const {proxy} = getCurrentInstance()
        const state = reactive({
            logShow:false,
            logCurrent:1,
            logSize:10,
            logTotal:0,
            logData: []
        })
        onMounted(()=>{
            state.logShow = true
            getLog()
        })
        // 日志
        const getLog = () => {
            checkUserLogs({
                type: 'ORDER_BZLXGL',
                page: {
                    pageNo: state.logCurrent,
                    pageSize: state.logSize
                }
            }).then(res => {
                state.logData = res.data.dataList
                state.logTotal = res.data.page.totalCount
            })
        }

        const close = ()=>{
            state.logShow = false
            setTimeout(() => {
                proxy.$parent.logShow = false
            }, 500);
        }

        const logSizeChange = e => {
            state.logSize = e
            state.logCurrent = 1
            getLog()
        }

        const logCurrentChange = e => {
            state.logCurrent = e
            getLog()
        }


        return {
            ...toRefs(state),
            logSizeChange,
            logCurrentChange,
            filterTime,
            close
        }
    }
}
</script>

<style>

</style>