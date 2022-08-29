<template>
    <div class="wareHouse">
        <div class="headContainer">
            <el-table :data="data" border style="width: 100%">
                <el-table-column type="index" label="序号" align="center" width="100">
                </el-table-column>
                <el-table-column prop="warehouseName" label="仓库名称" align="center">
                </el-table-column>
                <el-table-column prop="bigWarehouseName" label="所属大区仓" align="center">
                </el-table-column>
                <el-table-column prop="addressCn" label="仓库地址" align="center">
                </el-table-column>
                <el-table-column prop="dept" label="所属部门" align="center">
                </el-table-column>
                <el-table-column prop="personName" label="负责人" align="center">
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template #default="scope">
                        <span>-</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>

    </div>

</template>

<script>
import {
    getWareHouse //仓库管理页面查询
} from '@/api/store.js'
import { reactive, toRefs } from 'vue'
import { onMounted } from 'vue'
export default {
    name: 'WareHouse',
    setup() {
        const state = reactive({
            data: [],
            from: {
                pageNo: '1',
                pageSize: '10'
            }
        })

        //页面一进去时候渲染
        const init = () => {
            let params = {
                page: {
                    pageNo: state.from.pageNo,
                    pageSize: state.from.pageSize
                }

            }
            getWareHouse(params).then(res => {
                if (res.code == 200) {
                    state.data = res.data.dataList

                }
            })
        }
        onMounted(() => {
            init()
        })

        return {
            ...toRefs(state)
        }
    }
}
</script>

<style scoped lang="scss">
.wareHouse {
    .headContainer{
    background-color: #fff;
    border-radius: 2px 2px 2px 2px;
    padding: 20px 25px;
    }
}
</style>
