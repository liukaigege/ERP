<template>
<div class="contaner">
    <div class="search">
        <el-form ref="form" :inline="true"  @keyup.enter="search">
            <el-form-item label="品类:" >
                <elSelectTree :data="treeData" :treeProps="treeProps"  :multiple="false" :checkStrictly="true" @ok="checkTree" :defaultCheckedKeys="defaultCheckedKeys" />
            </el-form-item>
            <el-form-item label="搜索内容:">
                <el-input v-model="searchData.name" placeholder="请输入规格名称" @change="e=>searchData.name = e.trim()"  clearable></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary"  @click="search">查询</el-button>
            </el-form-item>
        </el-form>
    </div>
    <div class="elbutton">
        <el-button  @click="deleteRow(tableSelect)" v-permission="'common-spe_del-batch:btn'">批量删除</el-button>
        <el-button type="primary"  @click="openDialog(null)" v-permission="'common-spe_add:btn'">新增规格</el-button>
    </div>
    <div class="tableBox">
        <el-table :data="tableData" :header-cell-style="{color:'#000',textAlign:'center'}" @selection-change="e=>tableSelect = e">
            <el-table-column type="selection" align="center">
            </el-table-column>
            <el-table-column label="规格名称" prop="nameCn" width="200" align="center">
                <template #default="scope">
                    <span class="danrow">{{scope.row.nameCn}}</span>
                </template>
            </el-table-column>
            <el-table-column label="英文名称" prop="nameEn" width="200" align="center">
                <template #default="scope">
                    <span class="danrow" :title="scope.row.nameEn">{{scope.row.nameEn}}</span>
                </template>
            </el-table-column>
            <el-table-column label="规格属性" align="center">
                <template #default="scope">
                    <span class="danrow" :title="formatterSpe(scope.row)">{{formatterSpe(scope.row)}}</span>
                </template>
            </el-table-column>
            <el-table-column label="所属品类" align="center">
                <template #default="scope">
                    <span class="danrow">{{formatterCate(scope.row)}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="110">
                <template #default="scope">
                    <div class="util">
                        <span @click="openDialog(scope.row.id)" class="edit" v-permission="'common-spe_edit:btn'">编辑</span>
                        <el-popconfirm title="确认要删除吗？" @confirm="deleteRow(scope.row.id)">
                            <template #reference>
                                <a href="javascript:;" class="danger" v-permission="'common-spe_del:btn'">删除</a>
                            </template>
                        </el-popconfirm>
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <!-- 分页器 -->
    <div class="flex-pagination page-fixed">
        <div>

        </div>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.currentPage" :page-sizes="[10, 20, 30, 40, 100]" :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pagination.totalCount">
        </el-pagination>
    </div>
    <skuItem v-if="show" :id="edit_id" @close="show = false" @search="search()" />

</div>
</template>

<script>
import { onActivated, onMounted, reactive, toRefs } from 'vue'
import skuItem from './components/skuItem.vue'
import { erpElTable } from '@/utils/hooks.js'
import { speList, rulecClassify, speDelete } from '@/api/goods/rules.js'
import elSelectTree from '@/components/elSelectTree/index.vue'
import { ElMessage } from 'element-plus'
import { useRoute } from 'vue-router'

export default {
    name: 'commonSpecifications',
    components: { skuItem, elSelectTree },
    setup() {
        const state = reactive({
            edit_id: '',
            show: false,
            tableSelect: '',
            treeData: [],
            treeProps: {
                value: 'id', // ID字段名
                label: 'name', // 显示名称
                children: 'childss', // 子级字段名
            },
            searchData: {
                categoryId: '',
                name: ''
            },
            defaultCheckedKeys: []
        })
        const route = useRoute()
        const {
            tableData,
            pagination,
            search,
            handleSizeChange,
            handleCurrentChange
        } = erpElTable(speList, state.searchData)
        onMounted(() => {
            rulecClassify().then(res => {
                state.treeData = res.data
            })

        })

        onActivated(() => {
            console.log(route.params.categoryId);
            if (route.params.categoryId) {
                state.searchData.categoryId = route.params.categoryId
                state.defaultCheckedKeys = route.params.categoryId.split(',')
                search()
            }
        })

        function checkTree(e) {
            state.searchData.categoryId = e
        }

        function formatterCate(row) {
            let arr = []
            row.categoryList?.forEach(item => {
                arr.push(item.categoryName)
            })
            return arr.join(',')
        }

        function formatterSpe(row) {
            let arr = []
            row.valueList?.forEach(item => {
                arr.push(item.valCn)
            })
            return arr.join(',')
        }

        function openDialog(id) {
            state.show = true
            state.edit_id = id
        }

        function deleteRow(id) {
            let str = []
            if (!Array.isArray(id)) {
                str.push(id)
            } else {
                id.forEach(item => {
                    str.push(item.id)
                })
            }
            console.log(str.join(','));
            if (!str.join(',')) return ElMessage.error('请选择要删除的规格！')
            speDelete({ idList: str }).then(res => {
                ElMessage.success('删除成功！')
                search()
            })

        }
        return {
            ...toRefs(state),
            tableData,
            pagination,
            search,
            handleCurrentChange,
            handleSizeChange,
            checkTree,
            formatterCate,
            formatterSpe,
            openDialog,
            deleteRow
        }
    }
}
</script>

<style lang="scss" scoped>
.search {
    padding: 24px;
    background-color: #fff;
    padding-bottom: 6px;
}

.elbutton {
    display: flex;
    justify-content: space-between;
    margin: 24px 0 16px 0;

    .el-button+.el-button {
        margin-left: 16px;
    }
}

.tableBox {
    padding: 24px 30px;
    background-color: #fff;
}

.danrow {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap
}

.util {
    display: flex;
    justify-content: space-around;
}

.edit {
    color: #1890FF;
    cursor: pointer;
}

.danger {
    color: #FD4C60;
    cursor: pointer;
}
</style>
