<template>
<div class="contaner">
    <div class="title">
        <div class="skutitle">
            <span>通用SKU</span>
            <a href="javascript:;" @click=" show = true ,dialogStatus='ruleComment'" v-permission="'sku-rules_edit-common:btn'">编辑</a>
        </div>
        <p class="skucode">
            {{ruleComment}}
        </p>
        <p class="skutip">
            修改或新增SKU不会影响已经生成过的SKU，如需变更已生成的SKU请在【商品开发-已报价】列表中，点击【批量更新SKU】重新生成
        </p>
    </div>
    <!-- 搜索条件 -->
    <div class="search">
        <el-form ref="form" label-width="50px" :inline="true" @keyup.enter="search">
            <el-form-item label="品类:">
                <elSelectTree :data="categoryTree" :treeProps="treeProps"  :checkStrictly="true" @ok="categoryCheck" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary"  @click="search">查询</el-button>
            </el-form-item>
        </el-form>

    </div>
    <!-- 按钮 -->
    <div class="buttonBox">
        <div>
            <el-popconfirm icon="el-icon-info"  iconColor="red" title="SKU规则删除后，已生成SKU的商品不变更，未生成SKU的商品将使用其他匹配规则，确认要删除吗？" @confirm="deleteRule(tableSelect)">
                <template #reference>
                    <el-button  v-permission="'sku-rules_del-batch:btn'" >批量删除</el-button>
                </template>
            </el-popconfirm>
        </div>
        <el-button type="primary"  v-permission="'sku-rules_add:btn'"  @click=" show = true ,dialogStatus='addSKU'">新增SKU规格</el-button>

    </div>
    <!-- 表格 -->
    <div class="tableBox">
        <el-table :data="tableData" :header-cell-style="{color:'#000'}" @selection-change="e=>tableSelect = e">
            <el-table-column type="selection" width="50" header-align="center" align="center"></el-table-column>
            <el-table-column label="SKU规则" header-align="center" align="center">
                <template #default="scope">
                    <span class="orow" :title="scope.row.skuRule">{{scope.row.skuRule}}</span>
                </template>
            </el-table-column>
            <el-table-column label="所属品类" header-align="center" align="center" width="400">
                <template #default="scope">
                    <span class="orow" :title="scope.row.goodsCategorys">{{scope.row.goodsCategorys}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" header-align="center" width="120">
                <template #default="scope">
                    <div class="utils">

                        <a href="javascript:;" class="edit" @click="dialogStatus='editSKU';show=true;id=scope.row.id" v-permission="'sku-rules_edit:btn'">编辑</a>
                        <el-popconfirm icon="el-icon-info" iconColor="red" title="SKU规则删除后，已生成SKU的商品不变更，未生成SKU的商品将使用其他匹配规则，确认要删除吗？" @confirm="deleteRule(scope.row.id)">
                            <template #reference>
                                <a href="javascript:;" class="danger" v-permission="'sku-rules_del:btn'">删除</a>
                            </template>
                        </el-popconfirm>
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <!-- 分页器 -->
    <div class="flex-pagination page-fixed">
        <div></div>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.currentPage" :page-sizes="[10, 20, 30, 40, 100]" :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pagination.totalCount">
        </el-pagination>
    </div>
    <SkuDialog v-if="show" @close="close" @search="search" @comment="initComment" :status="dialogStatus" :id="id" />
</div>
</template>

<script>
import { nextTick, onMounted, reactive, toRefs } from 'vue'
import SkuDialog from './components/SkuDialog.vue'
import { ruleComment, ruleList, rulecClassify, ruleDel ,categoryAuthTree } from '@/api/goods/rules.js'
import elSelectTree from '@/components/elSelectTree/index.vue'
import { ElMessage } from 'element-plus'
import { erpElTable } from '@/utils/hooks.js'
export default {
    name: 'skuRulesettings',
    components: { SkuDialog, elSelectTree },
    setup() {
        const state = reactive({
            id: '',
            show: false,
            categoryId: {
                categoryId: ''
            },
            categoryTree: [],
            ruleComment: '',
            dialogStatus: '',
            treeProps: {
                value: 'id', // ID字段名
                label: 'name', // 显示名称
                children: 'child' // 子级字段名
            },
            tableSelect: ''

        })
        const {
            tableData,
            pagination,
            search,
            handleSizeChange,
            handleCurrentChange
        } = erpElTable(ruleList, state.categoryId)

        onMounted(() => {
            rulecClassify().then(res => {
                state.categoryTree = res.data
            })
            initComment()
            search()
        })

        function close() {
            state.show = false
        }

        function initComment() {
            ruleComment().then(res => { //通用sku查询
                state.ruleComment = res.data
            })
        }

        function categoryCheck(e) {
            state.categoryId.categoryId = e
            console.log(state.categoryId);
        }

        function deleteRule(id) {
            let ids = []
            if (typeof (id) == 'object') {
                id.forEach(e => {
                    ids.push(e.id)
                });
                ids = ids.join(',')
            } else {
                ids = id + ''
            }
            console.log(ids.length);
            if (!ids) return ElMessage.error('请选择SKU规则')
            ruleDel({ ids }).then(res => {
                search()
                ElMessage.success('删除成功')
            })
        }

        return {
            ...toRefs(state),
            handleSizeChange,
            handleCurrentChange,
            tableData,
            pagination,
            search,
            close,
            categoryCheck,
            deleteRule,
            initComment
        }
    }

}
</script>

<style lang="scss" scoped>
.title .skutitle {
    display: flex;
    justify-content: space-between;
    margin-bottom: 23px;

    span {
        font-size: 20px;
    }

    a {
        color: #1890FF;
        font-size: 16px;
    }
}

.title {
    background-color: #fff;
    padding: 16px;
    margin-bottom: 19px;
}

.skucode {
    font-size: 16px;
    margin-bottom: 17px;
}

.skutip {
    color: #FD4C60;
}

.search {
    padding: 24px;
    background-color: #fff;
    padding-bottom: 1px;
    border-radius: 3px;
}

.buttonBox {
    display: flex;
    justify-content: space-between;
    margin: 24px 0 16px 0;
}

.el-button+.el-button {
    margin-left: 16px;
}

.tableBox {
    padding: 24px 30px;
    background-color: #fff;
}

.edit {
    color: #1890FF;
}

.danger {
    color: #FD4C60;
}

.utils {
    display: flex;
    justify-content: space-around;
}

.orow {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
