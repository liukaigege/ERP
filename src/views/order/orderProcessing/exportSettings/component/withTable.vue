<template>
<div>
    <div class="btnBox">
        <el-button type="primary"  @click="deleteRow(delarr)">批量删除</el-button>
        <el-button type="primary"  @click="(isShow = true), (dialogNum = 1)">新增模板</el-button>
    </div>
    <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        :header-cell-style="{
        background: 'rgb(250, 250, 250)',
        color: '#606266',
      }"
        @selection-change="handleSelectionChange"
        class="tableBox">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="name" label="模板名称" width="150"></el-table-column>
        <el-table-column prop="field" label="字段信息" :formatter="tempFilter">

        </el-table-column>
        <el-table-column label="操作" width="120">
            <template #default="scoped">
                <div class="editmode">
                    <a href="javascript:;" @click="(isShow = true), (dialogNum = 2), (temp.name = scoped.row.name),(temp.id = scoped.row.id),tempFilter(scoped.row,1)">编辑</a>
                    <a href="javascript:;" @click="deleteRow(scoped.row)">删除</a>
                </div>
            </template>
        </el-table-column>
    </el-table>
    <div class="flex-pagination page-fixed">
        <div>
            <span @click="selectClick" :style="{
           backgroundColor:delarr.length ? 'rgb(64, 158, 255)': '#fff',
           display:'inline-block',
           width:'16px',
           height:'16px',
           border:'1px solid #eee',
           textAlign:'center',
           margin:'0 10px'
         }" class="el-icon-check"></span>
            <span :style="{color:delarr.length ? 'rgb(64, 158, 255)': 'unset',}">已选择{{ delarr.length }}条</span>
        </div>
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 30, 40, 100]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
    </div>

    <!-- 新增模板和编辑模板 -->
    <Withdialog
        :isShow="isShow"
        :dialogNum="dialogNum"
        @closeDialog="closeDialog"
        :temp="temp"
        :itemlist="itemlist"
        v-if="itemlist.length"
        @getlist="getlist" />
</div>
</template>

<script>
import { reactive, ref, toRefs } from 'vue'
import Withdialog from './dialog.vue'
import { exportTemplateList, exportItem, exportDel } from '@/api/order/orderProcessing'
import { onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
export default {
    components: { Withdialog },
    name: 'withTable',
    setup() {
        const state = reactive({
            tableData: [],
            temp: {
                id: '',
                list: [],
                name: '',
                sort: []
            },
            isShow: false,
            dialogNum: 1,
            itemlist: [],
            delid: [],
            delarr: [],
            total: 0,
            currentPage: 1,
            pageSize: 10,

        })

        onMounted(() => {
            getlist()
            getExportItem()
        })

        const handleSelectionChange = el => {
            state.delarr = [...el]
            console.log(el);
            console.log(state.delarr);
        }
        const closeDialog = () => {
            state.isShow = false
            state.dialogNum = 1
            state.temp = {}
        }

        const deleteRow = el => {
            let str = ''
            // 判断是否是数组？
            if (Array.isArray(el)) {
                el.forEach(item => {
                    state.delid.push(item.id)
                })
                str = '批量'
            } else {
                state.delid.push(el.id)
                str = ''
            }
            // 判断是否选中
            if (state.delid.length == 0) {
                ElMessage.warning('请选择模板')
                return
            }
            // 询问是否删除
            ElMessageBox.confirm(`是否${str}删除`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(res => {
                const data = { ids: state.delid.join(',') }

                exportDel(data).then(res => {
                    getlist()
                    ElMessage.success(res.message)
                    state.delarr = []
                    state.delid = []
                }).catch(err => {
                    state.delid = []
                   
                })
            })
        }

        // 过滤器
        const tempFilter = (row, column) => {
            let e = row.field
            if (!e) return false
            let aut = e
            e = e.split('|')
            let arr = []
            let sort = []
            // 将当前行中的关键字提取出来
            e.forEach((item, index) => {
                e[index] = e[index].split(':')
                sort.push(e[index][0])
                e[index] = e[index][1].split(',')
                arr.push(...e[index])
            })

            let arr2 = []
            // 将所有选项提取出来
            state.itemlist.forEach(item => {
                arr2.push(...item.list)
            })
            let arr3 = []
            // 判断根据arr 或取 arr2中的值
            arr.forEach(item => {
                arr2.forEach(value => {
                    if (value.nameEn == item) {
                        arr3.push(value)
                    }
                })
            })
            if (column == 1) {
                console.log(column, '=============================================')
                state.temp.list = [...arr3]
                state.temp.sort = [...sort]
                state.temp.row = aut.split('|')

            }
            // 替换 arr3 中的值
            arr3.forEach((item, index) => {
                arr3[index] = item.nameCn
            })
            return arr3.join(',')
        }

        // 获取列表事件 
        const getlist = () => {
            const data = {
                page: {
                    pageNo: state.currentPage,
                    pageSize: state.pageSize
                }
            }
            exportTemplateList(data).then(res => {
                state.tableData = res.data.dataList
                state.total = res.data.page.totalCount
            })
        }
        // 获取弹出框选项
        const getExportItem = () => {
            exportItem().then(res => {
                state.itemlist = ref(res.data)
                console.log(state.itemlist);
            })
        }

        const handleSizeChange = e => {
            state.pageSize = e
            state.pageNo = 1
            getlist()
        }

        const handleCurrentChange = e => {
            state.currentPage = e
            getlist()
        }

        function selectClick() {
          if(state.tableData.length)  document.querySelector('thead .el-checkbox').click()
        }
        return {
            ...toRefs(state),
            handleSelectionChange,
            closeDialog,
            deleteRow,
            tempFilter,
            handleSizeChange,
            handleCurrentChange,
            getlist,
            selectClick
        }
    }
}
</script>

<style lang="scss" scoped>
.btnBox {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
}

:deep(.el-table__header-wrapper) {
    .el-table__header {
        border: 1px solid rgb(232, 232, 232);
        box-sizing: border-box;
        width: unset;
    }

    .cell {
        color: #000;
    }

    th:nth-child(n + 2) {
        text-align: center;
    }

    th {
        border-bottom: 0;
    }
}

:deep(.el-table__body) {
    .el-table_1_column_2 .cell {
        text-align: center;
    }
}

.editmode {
    display: flex;
    justify-content: space-between;

    a:last-child {
        color: #fd4c60;
    }

    a {
        color: #359eff;
        text-decoration: none;
    }
}

.el-icon-check {
    color: #fff;
}
</style>
