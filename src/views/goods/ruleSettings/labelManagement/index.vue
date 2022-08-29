<template>
    <div class="headLabel">
        <!-- 第一部分 -->
        <div class="contentStatus">
            <span>状态:</span>
            <el-select style="margin-left:10px; width: 140px" v-model="form.status" placeholder="全部" clearable>
                <el-option label="全部" value=""></el-option>
                <el-option label="已开启" :value="1"></el-option>
                <el-option label="未开启" :value="0"></el-option>
            </el-select>
            <el-button style="margin-left: 10px" type="primary"  @click="search">查询</el-button>
        </div>
        <!-- 第二部分 -->
        <div style="margin-top:24px">
            <el-button type="primary"  @click="batchStatus(1)" v-permission="'label_open-batch:btn'">批量开启</el-button>
            <el-button style="margin-left: 10px" type="primary"  @click="batchStatus(0)" v-permission="'label_close-batch:btn'">批量关闭</el-button>
            <el-button style="float:right" type="primary"  @click="add()" v-permission="'label_add:btn'">新增标签</el-button>
        </div>
        <!-- 表格部分 -->
        <div class="headTable">
            <el-table :data="tableData" :header-cell-style="{
          background: '#FAFAFA',
          color: '#606266'
        }" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column prop="name" label="标签内容" align="center" />
                <el-table-column prop="status" label="状态" align="center">
                    <template #default="scope">
                        <div class="switchStatus">
                            <el-switch v-model="scope.row.status" active-color="#1890FF" inactive-color="#C0C0C0"></el-switch>
                            <div class="statusMasker" @click="
                  changeStatus(
                      scope.row,
                    scope.row.status,
                  )
                "></div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" align="center" />
                <el-table-column prop="createUserName" label="创建人" align="center" />
                <el-table-column label="操作" align="center">
                    <template #default="scope">
                        <a @click="edit(scope.row)" v-permission="'label_edit:btn'">编辑</a>
                        <el-popconfirm title="确定删除标签?" @confirm="del(scope.row.id)">
                        <template #reference>
                           <a style="margin-left:30px;color: #FD4C60;" v-permission="'label_del:btn'">删除</a> 
                        </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 分页器 -->
        <div class="flex-pagination page-fixed">
            <div style="position: relative;">
                <span @click="changeAll" class="checkboxStyle">
              
                </span>
                <el-checkbox v-model="checkedList" :indeterminate="isIndeterminate" >
                    已选<span style="color: #1890ff">{{selectGoodsId?selectGoodsId.length:0}}</span>条
                </el-checkbox>
            </div>
            <div>
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="pagination.currentPage"
                    :page-sizes="pagination.pageSizes"
                    :page-size="pagination.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="pagination.totalCount">
                </el-pagination>
            </div>
        </div>
        <AddLabel v-if="showAddLabel" :row="row"  @closeDialog="closeDialog" @updateDialog='updateDialog' />
    </div>
</template>

<script>
import AddLabel from './components/addLabel'
import { erpElTable } from 'hooks'
import { ElMessage, ElMessageBox } from "element-plus"
import { onMounted, reactive, toRefs } from 'vue'
import {
    getLabel, //查询标签列表
    updateStatus,//修改标签状态
    deleteLabel //删除标签
} from '@/api/goods/rules.js'
export default {
    name: 'labelManagement',
    components: {
        AddLabel
    },
    setup() {
        const state = reactive({
            row: {}, //带过去的参数
            isIndeterminate:false,
            form: {
                status: 1
            },
            showAddLabel: false, //打开新增编辑弹框
            checkedList: false,
            selectGoodsId: [],
        })
        //0.初始进去时候
         const erpTableOpts=erpElTable(getLabel,state.form,{
             dataFilter:res=>{
                 res.forEach(item=>{
                     item.status=item.status?true:false
                 })
                 return res
             }
         })
        //1.编辑时候
        function edit(row) {
            state.row = row
            state.showAddLabel = true
        }
        //1.1新增事件
        function add() {
            state.row={}
            state.showAddLabel = true
        }
        //1.2 删除事件
        function del(val){
           deleteLabel({id:val}).then(res=>{
               ElMessage.success('删除成功')
               erpTableOpts.search()
           })
        }
        //2.状态事件
        function changeStatus(row,val) {
                console.log(val,'status');
                updateStatus({
                    status:val?0:1,
                  idList:[row.id]
                }).then(res=>{
                    ElMessage.success('修改成功')
                  erpTableOpts.search()
                })
        }
        //4.表格的选择框
        function handleSelectionChange(selection) {
            state.selectGoodsId = []
            selection.forEach(v => {
                state.selectGoodsId.push(v.id)
            })
            state.checkedList = state.selectGoodsId && state.selectGoodsId.length ? true : false
             if (erpTableOpts.tableData.value.length>selection.length&&selection.length!=0){
             state.isIndeterminate=true
             }else{
                 state.isIndeterminate=false
             }
             console.log(state.selectGoodsId);
        }
        //5.批量开启/关闭
        function batchStatus(value) {
            if (state.selectGoodsId.length == 0) { return ElMessage.error('请选择标签') }
            ElMessageBox.confirm(`是否批量${value?'开启':'关闭'}?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                closeOnClickModal: false,
                closeOnPressEscape: false,
                type: 'warning',
            }).then(() => {
               //调接口
              updateStatus({
                  status:value,
                  idList:state.selectGoodsId
              }).then(res=>{
                  ElMessage.success('修改成功')
                  erpTableOpts.search()
              })
            })
        }
        //7.从子页面出来的关闭弹框的方法
        function closeDialog(){
            state.showAddLabel=false
        }
        function updateDialog(){
         state.showAddLabel=false
         erpTableOpts.search()
        }
        //8.页面底部的选择框
        function changeAll(){
            console.log(555);
              document.querySelector('thead .el-checkbox').click()
        }
        return {
            ...toRefs(state),
            edit, //编辑
            add, //添加
            changeStatus,
            ...erpTableOpts,
            handleSelectionChange,
            batchStatus,
            del,
            changeAll,//底部分页的选择框
            updateDialog,
            closeDialog// 子页面的方法
        }
    }

}
</script>

<style lang="scss" scoped>
.headLabel {
    .contentStatus {
        padding: 30px 30px;
        background: #fff;

        :deep(.el-input--suffix .el-input__inner) {
            height: 32px;
        }
    }

    .headTable {
        padding: 30px 30px;
        background: #fff;
        margin-top: 16px;
    }

    .switchStatus {
        position: relative;

        .statusMasker {
            position: absolute;
            width: 30%;
            height: 100%;
            top: 0;
            right: 35%;
            cursor: pointer;
        }
    }
    .checkboxStyle{
        position: absolute;
        width: 60%;
        height: 100%;
        top: 20%;
        right: 50%;
        z-index: 5;
        cursor: pointer;
    }
}
</style>
