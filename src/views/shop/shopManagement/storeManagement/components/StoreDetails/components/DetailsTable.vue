<template>
<div :class="['contaner',className]">
    <el-collapse v-model="activeNames" class="collapse-table">
        <el-collapse-item name="1">
            <el-table :data="table" border :header-cell-style="{textAlign:'center'}">
                <el-table-column v-for="(item,index) in tableName" :prop="tableKey[index]" :key="tableKey[index]" :label="item" align="center">
                    <template #default="{row,$index}">
                        <span class="ov" :title="formatString(row,tableKey[index])">
                            {{formatString(row,tableKey[index])}}
                        </span>
                            <a href="javascript:;" class="danger" v-if="index==tableKey.length-1 && row.isDel==0&&$index!=table.length-1" @click="deleteButton(row)">删除</a>
                    </template>
                </el-table-column>
            </el-table>
        </el-collapse-item>
    </el-collapse>
</div>
</template>

<script>
import { reactive, toRefs, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
export default {
    name: 'DetailsTable',
    emits:['detail'],
    props: {
        componentsName: {},
        tableName: { // 表头名称
            type: Array
        },
        tableKey: { // 表头对应的字段
            type: Array
        },
        isDelete: { //是否出现删除按钮
            default: false,
            type: Boolean
        },
        isOpen: { //是否打开
            type: Boolean,
            default: false
        },
        className: { // 给一个独有的class名
            type: String
        },
        tableData: { // 渲染table的数组
            type: Array,
        },
        type: Object, // 删除接口名
        isSec:{
            type:Boolean,
            default:false
        }, // 时间显示是否显示时分秒

    },
    setup(props,ctx) {
        const state = reactive({
            tableName: props.tableName,
            tableKey: props.tableKey,
            table: props.tableData,
            isDelete: props.isDelete,
            className: props.className,
            activeNames: [],
        })

        watch(() => props.tableData, val => {
            state.table = val
        }, { deep: true })
        watch(() => props.isOpen, val => {
            openTable()
        })

        function deleteButton(e) {

            ElMessageBox.confirm(
                '确定删除这条明细吗', '删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error',
                }
            ).then(res => {
                props.type.api({ id: e.id, shopId: props.type.data.shopId }).then(res => {
                    props.type.callback(props.type.item)
                    ElMessage.success('删除成功')
                    ctx.emit('detail')
                })
            })

        }

        let flag = true
        // 设置table 显示
        function openTable() {
            if (!flag) return
            flag = false
            const collapseTable = document.querySelector(`.${state.className} .collapse-table`)
            console.log(collapseTable);
            if (collapseTable.style.display == 'block') {
                setTimeout(() => {
                    collapseTable.style.display = 'none'
                }, 300)
            } else {
                collapseTable.style.display = 'block'
            }
            setTimeout(() => {
                flag = true
            }, 300)
            document.querySelector(`.${state.className} .el-collapse-item__header`).click()
        }

        function formatString(row, key) {
            if (props.isSec && key.indexOf('Time') != -1) { // 单 时间参数保留时分秒
                return row[key] ? row[key] : '-'
            }

            if(!props.isSec && key == 'validity'){ // 双 时间区间不保留时分秒
                return  row.startTime?.split(' ')[0] +'-'+ row.endTime?.split(' ')[0] 
            }
            
            if (key == 'validity') { // 双 时间区间保留时分秒
                let str1 = row.startTime ? row.startTime + '-' : ''
                let str2 = row.endTime ? row.endTime : '-'
                return str1 + str2
            }

            if (key == 'type') return row.type == 1 ? '年付' : '月付'
            if (key == 'fee' && row.company) return (row[key] || 0) + (row.company == 1 ? '元' : '美元')
            if (key == 'fee') return (row[key] || 0) 
            if ( key == "amount") return (row[key] || 0) + (row.company == 1 ? '元' : '美元')
            if (key.indexOf('Time') != -1) return row[key] ? row[key].split(' ')[0] : '-'
            return row[key]
        }

        return {
            ...toRefs(state),
            deleteButton,
            formatString
        }
    }
}
</script>

<style lang="scss" scoped>
.dangerBox {
    position: relative;
}

.danger {
    color: #fd4c60;
    position: absolute;
    right: 10px;
}

.collapse-table {
    display: none;

    .el-table {
        border-left: 1px solid rgb(235, 238, 245) !important;
    }
}

.contaner {
    margin-bottom: 10px;
}

.el-table--border {
    border: 0 !important;
}

.ov {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
:deep(.el-collapse-item__wrap){
    border-bottom:unset;
}
</style>
