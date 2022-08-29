<!--
 * @Descripttion:
 * @version:
 * @Author: 江澎涛
 * @Date: 2021-07-26 18:13:56
 * @LastEditors: 江澎涛
 * @LastEditTime: 2021-08-20 10:23:42
-->
<template>
<div class="container">
    <div class="unitBox">
        <div class="row-1">
            <div class="left">
                <div style="margin-right:16px">
                    状态：<el-select v-model="value" placeholder="请选择"  style="width: 120px; margin: 0 0 0 0px" clearable @clear="value='全部'">
                    <el-option v-for="item in selectForm" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
                </div>
                备注类型：
                <el-select v-model="useScope" placeholder="请选择"  style="width: 120px; margin: 0 0 0 0px" clearable @clear="useScope=''">
                    <el-option label="全部" :value="''"></el-option>
                    <el-option label="订单" value="0"></el-option>
                    <el-option label="商品" value="1"></el-option>
                    <el-option label="采购" value="2"></el-option>
										<el-option label="待入库" value="5"></el-option>
                    <el-option label="采购对账" value="4"></el-option>
                </el-select>
                <el-button type="primary"  style="margin-left: 16px" @click="getTableData"> 查询</el-button>
            </div>
            <div class="logs">
                <span @click="logShow = true">操作日志</span>
            </div>
        </div>
    </div>
    <div class="row-2">
        <div class="left">
            <el-button type="primary"  @click="batchStatusHandler(1)" v-if="authPath('btn:open')">批量开启</el-button>
            <el-button type="primary"  @click="batchStatusHandler(0)" style="margin-left:16px" v-if="authPath('btn:close')">批量关闭</el-button>
        </div>
        <div class="right">
            <el-button type="primary"  @click="editRow()" v-if="authPath('btn:add')">新增备注</el-button>
        </div>
    </div>
    <div class="tableBox">
        <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" :header-cell-style="{ background: 'rgb(250, 250, 250)'}" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column label="备注名称" width="120">
                <template #default="scope">{{ scope.row.name }}</template>
            </el-table-column>
            <el-table-column label="图标" width="200">
                <template #default="scope">
                    <span :style="{
              backgroundColor: scope.row.color,
              display: 'inline-block',
              width: '20px',
              height: '20px',
              color: '#fff',
              textAlign: 'center',
							borderRadius:'4px',
							lineHeight:'20px'
            }">{{ scope.row.word }}</span>
                </template>
            </el-table-column>
            <el-table-column label="图标颜色">
                <template #default="scope">
                    {{ scope.row.color }}
                    <span :style="{
              backgroundColor: scope.row.color,
              display: 'inline-block',
              width: '20px',
              height: '20px',
              color: scope.row.color,
              textAlign: 'center'
            }">{{ scope.row.word }}</span>
                </template>
            </el-table-column>
            <el-table-column label="图标文字">
                <template #default="scope">{{ scope.row.word }}</template>
            </el-table-column>
            <el-table-column label="拣货单显示">
                <template #default="scope">
                    {{scope.row.pick?"已开启":"未开启"}}
                </template>
            </el-table-column>
            <el-table-column label="使用范围">
                <template #default="scope">
                    {{useScopeFn(scope.row)}}
                </template>
            </el-table-column>

            <el-table-column label="状态" width="150" v-if="authPath('table:status')">
                <template #default="scope">
                    <el-switch v-model="scope.row.enabled"></el-switch>
                    <div @click="status(scope.row)" class="maskBox"></div>
                </template>
            </el-table-column>
            <el-table-column label="创建时间">
                <template #default="scope">
                    {{ filterTime(scope.row.createTime) }}
                </template>
            </el-table-column>
            <el-table-column label="创建人">
                <template #default="scope">
                    {{ scope.row.createUser }}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="120" v-if="authPath('table:edit')">
                <template #default='scoped'>
                    <div class="editbox">
                        <span @click="editRow(scoped.row)">编辑</span>
                        <span @click="delRow(scoped.row)">删除</span>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <div class="flex-pagination page-fixed">
            <div></div>
            <el-pagination @size-change="tableSizeChange" @current-change="tableCurrentChange" :current-page="tableCurrent" :page-sizes="[10, 20, 30, 40,100]" :page-size="tableSize" layout="total, sizes, prev, pager, next, jumper" :total="tableTotal">
            </el-pagination>
        </div>

        <!-- 添加修改 -->
        <edit-dialog :formData="formData" v-if="newShow" @getTableData="getTableData" />
        <!-- 日志 -->
        <log-dialog v-if="logShow" />

    </div>
</div>
</template>

<script>
import { reactive, toRefs, watch, onMounted } from 'vue'
import editDialog from './components/editDialog.vue'
import LogDialog from './components/logDialog.vue'
import { delItem, getList, batchStatus, statusChange, filterTime } from './composable/index.js'
export default {
    name: 'NoteTypeManagement',
    components: { editDialog, LogDialog },
    setup() {
        const state = reactive({
            tableData: [],
            selectForm: [
                { value: '全部', lable: 'all' },
                { value: '已开启', lable: 'open' },
                { value: '未开启', lable: 'close' }
            ],
            formData: { // 新增弹出框
                id: '', // id
                name: '', // 备注名称
                color: '#060606', //颜色
                word: '', // 图标文字
                pick: false, // 拣货单显示
                enabled: true, // 状态
                useScope: ''
            },
            value: '已开启',
            useScope:'',
            newShow: false,
            selectId: [],
            tableSize: 10,
            tableCurrent: 1,
            tableTotal: 0,
            logShow: false,
        })

        const formData = { // 新增弹出框
            id: '', // id
            name: '', // 备注名称
            color: '#060606', //颜色
            word: '', // 图标文字
            pick: false, // 拣货单显示
            enabled: true, // 状态
            useScope: ''
        }

        onMounted(() => {
            getTableData()
        })
        //全选事件

        function handleSelectionChange(e) {
            console.log(e, '全选事件')
            const arr = []
            e.forEach(item => {
                arr.push(item.id)
            });
            state.selectId = [...arr]
        }

        function status(row) {
            statusChange(row, state)
        }

        // 批量开启/关闭
        function batchStatusHandler(value) {
            batchStatus(value, state)
        }

        // 编辑弹框
        function editRow(row) {
            if (row) state.formData = { ...row }
            console.log(state.formData.useScope);
            state.formData.useScope &&= state.formData.useScope.split(',')
            console.log(state.formData.useScope);
            state.newShow = true
        }

        watch(() => state.newShow, val => {
            if (!val) state.formData = { ...formData }
        })

        // 获取列表
        function getTableData() {
            getList(state)
        }
        // 删除事件
        function delRow(row) {
            delItem(row, state)
        }

        ///////////////////////////////////////// 分页器 //////////////////////////////////////////

        // 分页器变化
        function tableSizeChange(e) {
            state.tableSize = e
            state.tableCurrent = 1
            getTableData()
        }

        function tableCurrentChange(e) {
            state.tableCurrent = e
            getTableData()
        }

        function logOpen() {
            state.logShow = true
        }

        function useScopeFn(row){
            const useScope = [{value:0,label:'订单'},{value:1,label:'商品'},{value:2,label:'采购'},{value:4,label:'采购对账'},{value:5,label:'待入库'}]
            const arr = row.useScope?.split(',')
            let str = ''
            arr?.forEach(item=>{
                useScope.forEach(val=>{
                    if(item==val.value){
                        if(str){
                            str += '/'+val.label
                        }else{
                            str+=val.label
                        }
                    }
                })
            })
            return str
        }
        return {
            ...toRefs(state),
            handleSelectionChange,
            status,
            getTableData,
            delRow,
            batchStatusHandler,
            editRow,
            tableSizeChange,
            tableCurrentChange,
            logOpen,
            filterTime,
            useScopeFn

        }
    }
}
</script>

<style lang="scss" scoped>
.unitBox {
    margin-bottom: 24px;
    background-color: #fff;
    padding: 24px;
    padding-bottom: 1px;
}

.tableBox {
    background-color: #fff;
    margin-bottom: 32px;
    padding: 24px;
}

:deep(table) {
    .cell {
        text-align: center;
        position: relative;
    }

    thead {
        color: black;
    }
}

.row-1,
.row-2 {
    display: flex;
    justify-content: space-between;
    margin-bottom: 25px;

    .logs {
        color: rgb(127, 147, 193);

        span {
            cursor: pointer;
            line-height: 33px;
        }
    }

    .left {
        display: flex;
        align-items: center;
    }
}

:deep(.el-input__suffix) {
    .el-color-picker__trigger {
        border: 0;
    }
}

:deep(.el-form-item) {
    margin-bottom: 15px;
}

.editbox {
    display: flex;
    justify-content: space-between;

    span:last-child {
        color: #fd4c60;
    }

    span {
        cursor: pointer;
        color: #1880E7;
    }

}

.maskBox {
    position: absolute;
    width: 50px;
    height: 30px;
    left: 50%;
    top: 50%;
    z-index: 999;
    transform: translate(-50%, -50%);
    cursor: pointer;
}
</style>
