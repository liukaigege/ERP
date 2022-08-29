<template>
    <div class="headSourceChanneManagement">
        <div class="addClass">
            <el-button type="primary"  @click="add()" v-permission="'source-channel_add:btn'">新增货源渠道</el-button>
        </div>

        <!-- 表格部分 -->
        <div class="headTable">
            <el-table :data="tableData" :header-cell-style="{
          background: '#FAFAFA',
          color: '#606266'
        }">
                <el-table-column prop="name" label="货源渠道" align="center" />
                <el-table-column prop="code" label="渠道编码" align="center" />
                <el-table-column label="操作" align="center">
                    <template #default="scope">
                        <a @click="edit(scope.row)" v-permission="'source-channel_edit:btn'">编辑</a>
                         <el-popconfirm icon="el-icon-info"  title="是否确定删除该条数据？" @confirm="del(scope.row.id)">
                         <template #reference>
                                <el-button type="text" style="color:#FD4C60;margin-left:30px;" v-permission="'source-channel_del:btn'">删除</el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 分页器 -->
        <div class="flex-pagination page-fixed">
            <div></div>
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
        <!-- 新增编辑货源渠道弹框 -->
        <AddSourceChanne v-if="showAddSource"  :row='row' @closeDialog="closeDialog" @updateDialog='updateDialog' />
    </div>
</template>

<script>
import AddSourceChanne from './components/addSourceChanne'
import {
    getSourceChanne, //查询货源渠道列表
    deleteSourceChanne //删除
} from '@/api/goods/rules.js'
import { onMounted, reactive, toRefs } from 'vue'
import { erpElTable } from 'hooks'
import { ElMessage, ElMessageBox } from 'element-plus'
export default {
    name: 'sourceChanneManagement',
    components: {
        AddSourceChanne
    },
    setup() {
        const state = reactive({
            row: {}, //带过去数据
            showAddSource: false,
        })
        //初始进入页面的时候
          const erpTableOpts = erpElTable(getSourceChanne)
       
        //编辑
        function edit(val) {
            state.row = val
            state.showAddSource = true
        }
        //新增
        function add() {
            state.row={}
            state.showAddSource = true
        }
        //删除
        function del(val) {
            const params = {
                id: Number(val)
            }
            deleteSourceChanne(params).then(res => {
                ElMessage.success('删除成功')
                 erpTableOpts.search()
            })
        }
        //子页面返回的emit关闭弹框的方法
        function closeDialog(){
            state.showAddSource=false
        }
        function updateDialog(){
            state.showAddSource=false
            erpTableOpts.search()
        }
        return {
            ...toRefs(state),
            edit,
            add,
            del,
            closeDialog,
            updateDialog,
            ...erpTableOpts,
        }
    }

}
</script>

<style lang="scss" scoped>
.headSourceChanneManagement {
    position: relative;

    .addClass {
        margin-bottom: 16px;
        text-align: end;

    }

    .headTable {
        background: #fff;
        border-radius: 2px 2px 2px 0px;
        padding: 20px 30px;

    }
}
</style>
