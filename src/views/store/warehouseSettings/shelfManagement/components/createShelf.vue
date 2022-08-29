<template>
	<div class="createShelf">
		<el-dialog :title="typeJump=='edit'?'编辑货架':'创建货架'" v-model="dialogShelf" width="480px" custom-class="myDialog" :close-on-click-modal="false" :destroy-on-close="true" :before-close="closeDialog" @close="closeDialog">
			<el-form :rules="rules" :model="form" ref="formRef">
				<el-form-item label="货架名称:" prop="name">
					<el-input maxlength="10" placeholder="请输入货架名称" style="width:354px"  v-model="form.name"></el-input>
				</el-form-item>
				<el-form-item label="所属仓库:" prop="warehouseId">
					<el-select :disabled="typeJump=='edit'" style="width:354px" v-model="form.warehouseId" >
						<el-option :label="item.warehouseName" :value="item.id" v-for="item in storeList" :key="item.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="所属分区:" prop="areaId">
					<el-select style="width:354px" :disabled="typeJump=='edit'" v-model="form.areaId" >
						<el-option :label="item.name" :value="item.id" v-for="item in areaList" :key="item.id"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button  @click="closeDialog">取 消</el-button>
					<el-button  type="primary" @click="submit">确 定</el-button>

				</span>
			</template>

		</el-dialog>
	</div>
</template>

<script>
	import { onMounted, reactive, ref, toRefs } from 'vue'
	import {
		getWareHouse //仓库管理页面查询
	} from '@/api/store.js'
	import {
		getStoreArea //分区列表查询
	} from '@/api/store/warehouseSettings.js'
	import {
		getAddShelf, //Z202.新增货架
        editAddShelf,//Z204.编辑货架
	} from '@/api/store/warehouseSettings.js'
import { ElMessage } from 'element-plus'
	export default {
		props: {
			typeJump: {
				type: String
			},
			rows: {
				type: Object,
				default: {}
			}
		},
		emits: ['closeDialog'],//关闭和取消返回父页面的事件
		setup(props, context) {
			//表单验证
			const rules = {
				name: [
					{ required: true, message: '请输入货架名称', trigger: 'blur' },
				],
				warehouseId: [
					{ required: true, message: '请选择所属仓库', trigger: 'change' },
				],
				areaId: [
					{ required: true, message: '请选择所属分区', trigger: 'change' },
				]
			}
			const formRef = ref(null)
			const state = reactive({
				dialogShelf: true,
				form: {
					name: '',
					warehouseId: 1,
					areaId: props.rows.areaId
				},
				storeList: [],//仓库列表
				areaList: []//分区列表
			})
            function init(){
             if(props.typeJump=='edit'){
                 state.form.name=props.rows.shelfName
               state.form.areaId= props.rows.areaId 
             }
            }
            onMounted(()=>{
                init()
            })
			//获取仓库的接口
			getWareHouse({ page: { pageNo: 1, pageSize: 10 } }).then(res => {
				state.storeList = res.data.dataList
				state.form.warehouseId = state.storeList[0].id
			})
			//分区接口
			getStoreArea({ warehouseId: state.form.warehouseId }).then(res => {
				console.log(res);
				state.areaList = res.data
                
			})
			//提交事件
			function submit() {
				formRef.value.validate().then(() => {
					//校验tijaio
					if (props.typeJump == 'add') {//新增页面
						const obj = Object.assign({}, state.form)
                      getAddShelf(obj).then(res => {
                         ElMessage.success('新增成功') 
                        context.emit('closeDialog',true)
                      })
					}else{//编辑
                    const obj = Object.assign({}, state.form)
                       obj.shelfId=props.rows.id
                       editAddShelf(obj).then(res => {
                            ElMessage.success('修改成功')
                            context.emit('closeDialog',true)
                       })
                    }
				})
			}
			//关闭弹框事件
			function closeDialog() {
				state.dialogShelf = false
				context.emit('closeDialog',false)
			}
			return {
				...toRefs(state),
				closeDialog,
				rules,
				submit,
                formRef
			}
		}
	}
</script>

<style lang="scss" scoped>
.createShelf {
	:deep(.el-dialog__title) {
		font-weight: 500;
	}
}
</style>