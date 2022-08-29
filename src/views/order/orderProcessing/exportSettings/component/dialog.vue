<template>
<div class="dialog-box">
    <el-dialog :close-on-click-modal="false" :title="dialogNum == 1 ? '新增模板' : '编辑模板'" v-model="isShow" width="800px" @close="closeDialog">
        <div class="input-box">
            <span style="color:red">*</span> 模板名称：<el-input placeholder="请输入模板名称" style="width: 300px"  maxlength="30" v-model="tempName"></el-input>
        </div>
        <div style="padding: 10px; height: 400px; overflow-y: scroll">
            <draggable
                class="list-group"
                tag="transition-group"
                :component-data="{tag: 'ul', type: 'transition-group', name: !drag ? 'flip-list' : null }"
                v-model="list"
                v-bind="dragOptions"
                @start="drag = true"
                @end="drag = false"
                item-key="nameCn">
                <template #item="{ element }">
                    <li class="list-group-item" style="width:100%">
                        <i :class="element.fixed ? 'fa fa-anchor' : 'glyphicon glyphicon-pushpin'" @click="element.fixed = !element.fixed" aria-hidden="true"></i>
                        <!-- 子集 -->
                        <el-row class="row">
                            <el-col :span="3">
                                <span class="font-w">{{ element.nameCn }}</span>
                                <el-checkbox :indeterminate="element.indeterminate" v-model="element.checkAll" :key="element.name" @change="handleCheckAllChange(element)">全选</el-checkbox>
                            </el-col>
                            <el-col :span="21">
                                <draggable class="list-group" tag="transition-group" :component-data="{tag: 'ul', type: 'transition-group',name: !drag ? 'flip-list' : null}"
                                    v-model="element.list"
                                    v-bind="dragOptions"
                                    @start="drag = true"
                                    @end="drag = false"
                                    :item-key="itemKey"
                                    :group="element.nameCn">
                                    <template #item="{ element: item }">
                    <li class="list-group-item">
                        <i :class="item.fixed ? 'fa fa-anchor': 'glyphicon glyphicon-pushpin'" @click="item.fixed = !item.fixed" aria-hidden="true"></i>
                        <el-checkbox-group v-model="element.listAll" @change="handleCheckedCitiesChange($event, element)">
                            <el-checkbox :label="item.nameEn" :key="item.nameCn" style="margin:3px">
                                {{ item.nameCn }}
                            </el-checkbox>
                        </el-checkbox-group>
                    </li>
                </template>
            </draggable>
            </el-col>
            </el-row>
            <!-- 子集 -->
            </li>
            </template>
            </draggable>
        </div>

        <template #footer>
            <el-button  @click="closeDialog">取消</el-button>
            <el-button type="primary"  @click="editOrAdd">确定</el-button>
        </template>
    </el-dialog>
</div>
</template>

<script>
import { reactive, ref, toRefs, computed, onMounted, watch } from 'vue'
import draggable from 'vuedraggable'
import { exportAdd, exportEdit } from '@/api/order/orderProcessing'
import { ElMessage } from 'element-plus'

export default {
    name: 'Dialog',
    emits: ['closeDialog', 'createTemp', 'clearTemp', 'editTepm', 'getlist'],
    components: {
        draggable
    },
    props: {
        dialogNum: {
            required: true
        },
        isShow: {
            required: true
        },
        temp: {
            type: [Object]
        },
        itemlist: {
            required: true
        }
    },
    setup(props, { attrs, emit }) {
        const state = reactive({
            drag: false,
            isShow: props.isShow,
            tempName: '', //模板名称
            //   弹窗数据
            list: [...props.itemlist],

        })
        onMounted(() => {
            console.log(state.list);
        })
        const closeDialog = () => {
            emit('closeDialog')
            emit('clearTemp')
            //去除历史遗留
            for (let index = 0; index < state.list.length; index++) {
                state.list[index].listAll = []
                state.list[index].indeterminate = false
                state.list[index].checkAll = false
                state.tempName = ''
            }
        }

        //全选事件
        const handleCheckAllChange = row => {
            const flag = row.listAll.length === row.list.length
            row.listAll = flag ? [] : row.list.map(item => item.nameEn)
            row.indeterminate = false
            console.log(row.listAll, 'listall');
        }

        //复选框事件
        const handleCheckedCitiesChange = (e, row) => {
            console.log(e);
            const countLength = e.length
            row.checkAll = countLength === row.list.length
            row.indeterminate = countLength > 0 && row.list.length != row.listAll.length

        }

        //监听props
        watch(() => props.dialogNum, val => {
            //判断弹框模式 1为新增 2为编辑
            if (val == 2) {
                // 编辑模式
                const arr = []
                props.temp.sort.forEach(e => {
                    state.list.forEach(i => {
                        if (i.nameEn == e) {
                            arr.push(i)
                        }
                    })
                })
                const arr2 = state.list.filter(item => {
                    let flag = true
                    arr.forEach(val => {
                        if (val.nameEn == item.nameEn) flag = false
                    })
                    return flag
                })
                arr.push(...arr2)
                state.list = arr

                // 小item的排序
                console.log(props.temp.row);
                props.temp.row.forEach((item, index) => {
                    props.temp.row[index] = item.split(':')
                })
                console.log(props.temp);

                for (let index = 0; index < state.list.length; index++) {
                    props.temp.row.forEach(item => {
                        if (state.list[index].nameEn == item[0]) {
                            state.list[index].listAll = [...item[1].split(',')]
                        }
                    })
                    const utarr = []
                    state.list[index].listAll.forEach(item => {
                        state.list[index].list.forEach(val => {
                            if (item == val.nameEn) {
                                utarr.push(val)
                                val.filter = true
                            }
                        })
                    })
                    const filterArr = state.list[index].list.filter(item => !item.filter)
                    utarr.push(...filterArr)
                    console.log(utarr);
                    state.list[index].list = utarr
                    state.list[index].list.forEach(item => {
                        item.filter = false
                    })
                    // state.list[index].listAll = state.list[index].list.filter(val => {
                    //   return props.temp.list.some(item => item.nameEn == val.nameEn)
                    // })
                    // state.list[index].listAll = state.list[index].listAll.map(item=>item.nameEn)

                    const flag = state.list[index].listAll.length == state.list[index].list.length
                    if (flag) {
                        state.list[index].checkAll = true
                    } else if (state.list[index].listAll.length > 0 && !flag) {
                        state.list[index].indeterminate = true
                    }
                }
                state.tempName = props.temp.name

            } else if (val == 1) {
                //新增模式
                state.tempName = ''
            }
        })

        const itemKey = e => {
            return e
        }
        const dragOptions = computed(() => {
            return {
                animation: 200,
                group: 'description',
                disabled: false,
                ghostClass: 'ghost'
            }
        })

        const editOrAdd = e => {
            let arr = []
            for (let i = 0; i < state.list.length; i++) {
                if (state.list[i].listAll.length) {
                    let arr2 = []
                    state.list[i].list.forEach(item => {
                        state.list[i].listAll.forEach(val => {
                            if (item.nameEn == val) arr2.push(item)
                        })
                    })
                    arr2 = arr2.map(item => item.nameEn)
                    console.log(arr2);
                    state.list[i].listAll = arr2
                    arr.push(`${state.list[i].nameEn}:${state.list[i].listAll.join(',')}`)

                }
            }

            // 判断是否可以提交
            if (!arr.length && !state.tempName.trim()) {
                return ElMessage.error('请输入模板名称并勾选模板内容')
            }
            if (!state.tempName.trim()) {
                return ElMessage.error('请输入模板名称')
            }
            if (!arr.length) {
                return ElMessage.error('请选择模板内容')
            }

            const data = {
                id: props.temp.id,
                name: state.tempName,
                field: arr.join('|')
            }
            console.log(data);
            if (props.dialogNum == 1) {
                exportAdd(data).then(res => {
                    emit('getlist')
                    closeDialog()
                    ElMessage.success(res.message)
                })
            } else {
                exportEdit(data).then(res => {
                    emit('getlist')
                    closeDialog()
                    ElMessage.success(res.message)
                })
            }
        }

        return {
            ...toRefs(state),
            closeDialog,
            handleCheckAllChange,
            handleCheckedCitiesChange,
            dragOptions,
            itemKey,
            editOrAdd,

        }
    }
}
</script>

<style lang="scss" scoped>
.input-box {
    padding-bottom: 30px;
}

:deep(table) {
    border-color: #000;
}

.rowName-box {
    text-align: center;
    color: #000;

    .rowName {
        font-size: 18px;
        font-weight: 700;
        text-align: center;
    }

    :deep(.el-checkbox) {
        color: #000;
    }
}

:deep(.el-table__body) {
    .el-table_2_column_5 {
        background-color: rgb(204, 204, 204);
    }
}

:deep(.el-checkbox-group) {
    display: inline-block;
}

:deep(.el-col-3) {
    background-color: #FAFAFA;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    border-right: 1px solid #E8E8E8;

}

:deep(.el-col-21) {
    padding: 10px;
}

.font-w {
    font-weight: 600;
    font-size: 14px;
    color: #000;
}

.row {
    border: 1px solid #E8E8E8;
    margin-top: -1px;
}

//  过渡
.flip-list-move {
    transition: transform 0.5s;
}

.no-move {
    transition: transform 0.5s;
}

.ghost {
    opacity: 0.5;
    background: #c8ebfb;
}

.list-group {
    min-height: 20px;
}

.list-group-item {
    width: 20%;
    cursor: move;
    display: inline-block;
}

.list-group-item i {
    cursor: pointer;
}
</style>
