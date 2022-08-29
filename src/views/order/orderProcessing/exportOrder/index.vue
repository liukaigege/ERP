<!--
 * @Descripttion: 
 * @version: 
 * @Author: 江澎涛
 * @Date: 2021-07-23 09:41:59
 * @LastEditors: 江澎涛
 * @LastEditTime: 2021-08-22 23:32:41
-->
<template>
<div class="export-order">
    <div class="header">
        <el-form ref="form" :inline="true"  class="form">
            <el-form-item label="下单时间：" label-width="100px">
                <el-date-picker style="width: 290px" v-model="date" :default-time="defaultTime" type="daterange"  range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
            </el-form-item>
            <el-form-item label="状态："  label-width="60px" style="margin-right:0">
                <el-select v-model="select" style="width: 120px" clearable @clear="selectClear">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item  style="margin-left: 16px">
                <el-button type="primary"  @click="getOrderLost(true)">查询</el-button>
                <el-button  @click="reset" style="margin-left:16px">重置</el-button>
            </el-form-item>
        </el-form>
        <div>

        </div>
    </div>
    <div class="table-box">
        <el-table :data="tableList" :header-cell-style='{background:"rgb(240, 240, 240)",color:"#000"}'>
            <el-table-column prop="orderDate" align="center" label="下单日期"></el-table-column>
            <el-table-column prop="exportTime" align="center" label="生成时间"></el-table-column>
            <el-table-column prop="orderCount" align="center" label="订单数"></el-table-column>
            <el-table-column prop="downCount" align="center" label="下载次数"></el-table-column>
            <el-table-column label="操作" align="center">
                <template #default="scope">
                    <a href="" class="down" hidden></a>
                    <span @click="downExoprt(scope.row)" style="cursor:pointer;color:#1890FF">下载</span>
                </template>
            </el-table-column>
        </el-table>
        <div class="flex-pagination page-fixed">
            <div></div>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 40, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
    </div>

</div>
</template>

<script>
import { reactive, toRefs } from 'vue'
import moment from 'moment'
import { exoprtOrderList, exportDown, exportRename, progress } from '@/api/order/orderProcessing.js'
import { onMounted } from 'vue'




export default {
    name: 'ExportOrder',
    
    setup() {
        const state = reactive({
            defaultTime: [new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)], // 默认时间格式
            select: '未下载', // 默认选择
            options: [{ value: '全部', lable: '全部' }, { value: '未下载', lable: '未下载' }, { value: '已下载', lable: '已下载' }], //选择内容
            date: [
                moment().subtract(7, 'days').format('YYYY-MM-DD 00:00:00'), // 默认时间
                moment().subtract(1, 'days').format('YYYY-MM-DD 23:59:59') // 默认时间
            ],
            tableList: [], // 表格中的数据
            currentPage: 1,
            pageSize: 10,
            total: 0,
            dialog: false,
            show: false,
            isSearch: 0
        })

        // 每页数量变化
        const handleSizeChange = e => {
            state.currentPage = 1
            state.pageSize = e
            getOrderLost()
        }

        // 页码变换
        const handleCurrentChange = e => {
            state.currentPage = e
            getOrderLost()
        }

        //清除选择器时触发
        const selectClear = () => {
            // 设置选择器值为 全部
            state.select = '全部'
        }

        // 重置操作
        const reset = () => {
            state.select = '未下载'
            state.options = [
                { value: '全部', lable: '全部' },
                { value: '未下载', lable: '未下载' },
                { value: '已下载', lable: '已下载' }
            ]
            state.date = [
                moment().subtract(7, 'days').format('YYYY-MM-DD 00:00:00'), // 默认时间
                moment().subtract(1, 'days').format('YYYY-MM-DD 23:59:59') // 默认时间
            ]
            getOrderLost()
        }
        onMounted(() => {
            getOrderLost(true)
        })

        // 获取列表数据
        const getOrderLost = (e) => {
            if (e) {
                state.isSearch = state.select == '未下载' ? 0 : state.select == '已下载' ? 1 : ''
            }
            const obj = {
                start: state.date ? moment(state.date[0]).format('YYYY-MM-DD 00:00:00') : '',
                end: state.date ? moment(state.date[1]).format('YYYY-MM-DD 23:59:59') : '',
                status: state.isSearch,
                page: {
                    pageNo: state.currentPage,
                    pageSize: state.pageSize
                }
            }

            exoprtOrderList(obj).then(res => {
                state.tableList = res.data.dataList
                state.total = res.data.page.totalCount
            })
        }

        // 下载按钮
        const downExoprt = row => {

            exportDown({ id: row.id + '' }).then(res => {
                window.open(res.data, "_self")
                if (!row.downCount && state.tableList.length == 1 && state.currentPage > 1) {
                    state.currentPage--
                }

                if (state.isSearch == 0) return getOrderLost()
                row.downCount++

            })
        }

        return {
            ...toRefs(state),
            handleSizeChange,
            handleCurrentChange,
            getOrderLost,
            selectClear,
            reset,
            downExoprt,
        }
    }
}
</script>

<style lang="scss" scoped>
.header {
    line-height: 70px;
    padding: 0 20px 0 0;

    .form {
        height: 50px;
    }

    background-color: #fff;
    display: flex;
    justify-content: space-between;
}

:deep(.table-box) {
    position: relative;
    margin-top: 30px;
    margin-bottom: 32px;
    padding: 24px;
    background-color: #fff;
}

:deep(.el-upload--text) {
    width: 98px;
}

.el-pagination {
    margin-top: 5px;
    text-align: right;
}

.probox {
    height: 320px;
    display: flex;
    justify-content: center;
    align-items: center;

    .box {
        transform: translateY(-50%);
        width: 100%;
        height: 60px;
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
}
</style>
