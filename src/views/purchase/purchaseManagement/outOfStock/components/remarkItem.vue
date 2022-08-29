<template>
	<div class="remarkContent">
		<el-table :data="query.item.remarkList">
			<el-table-column prop="remark" label="内容" align="center" min-width="300">
				<template #default='{row}'>
				 <!-- <span :title='row.remark'>	{{row.remark?.length >8 ? row.remark.slice(0,8)+'...' :row.remark }}</span> -->
         <span>{{row.remark}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="createTime" label="时间" align="center" width="170"/>
			<el-table-column prop="name" label="类型" align="center" width="90" />
			<el-table-column prop="createUserName" label="操作人" align="center" width="80"></el-table-column>
			<el-table-column prop="options" label="操作" align="center" >
				<template #default="scope">
					<div class="options">
            <el-button type="text"  @click='edit(scope.row)' :disabled='showOptions(scope.row)'>编辑</el-button>
					  <el-button type="text"  style="color:red;margin-left: 0" @click="del(scope.row)" :disabled='showOptions(scope.row)'>删除</el-button>
          </div>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<script setup>
import {defineProps, toRefs, reactive, onMounted, defineEmits} from 'vue'
import {deleteRemark} from '@/api/purchase/outOfStock.js'
import { storage } from '../../../../../utils/storage'
const props = defineProps({
	query: Object
})

const emits = defineEmits(['refresh','editRemark'])

const data = reactive({})

function del(row) {
	const idList = [row.id]
	deleteRemark({idList}).then(res => {
		if (res.code === 200) emits('refresh')
	})
} // 删除备注


function showOptions(row){
 return storage.get('ERP_USERINFO')?.userId !== row.createBy

} // 是否开启编辑


function edit(row){
	 emits('editRemark',row)
} // 编辑


onMounted(() => {

})


</script>

<style scoped lang="scss">
.options{
  display: flex;
  flex-direction: column;
}
</style>
