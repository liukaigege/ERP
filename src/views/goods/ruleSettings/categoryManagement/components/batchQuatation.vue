<template>
	<div class="headQuotation">
		<el-dialog title="报价设置" v-model="dialogBatchQuotation" width="480px" custom-class="myDialog" :close-on-click-modal="false" :destroy-on-close="true" @close="closeDialog">
			<el-tabs v-model="actived" @tab-click="handleClick">
				<el-tab-pane name="logist" label="物流报价">
					<div class="buttonGroup">
						<el-radio-group v-model="buttonLogistState" >
							<el-radio-button label="ADD">新增</el-radio-button>
							<el-radio-button label="DELETE">减少</el-radio-button>
							<el-radio-button label="UPDATE">变更</el-radio-button>
						</el-radio-group>
					</div>
					<div class="quotationContent">
						<el-input placeholder="请输入部门名称或员工姓名" v-model="keywordLogist" style="width:380px"  />
						<el-button type="primary"  @click="searchLogist">搜索</el-button>
					</div>
					<div class="treeLogist">
						<el-tree show-checkbox :data="userLogistDate" :node-key="defaultPropsLogist.value" :props="defaultPropsLogist" default-expand-all @check-change="handleUserLogist" ref="treeLogist" />
					</div>
				</el-tab-pane>
				<el-tab-pane name="purchase" label="采购报价">
                    <div class="buttonGroup">
						<el-radio-group v-model="buttonPurchaseState" >
							<el-radio-button label="ADD">新增</el-radio-button>
							<el-radio-button label="DELETE">减少</el-radio-button>
							<el-radio-button label="UPDATE">变更</el-radio-button>
						</el-radio-group>
					</div>
					<div class="quotationContent">
						<el-input placeholder="请输入部门名称或员工姓名" v-model="keywordPurchase" style="width:380px"  />
						<el-button type="primary"  @click="searchPurchase">搜索</el-button>
					</div>
					<div class="treeLogist">
						<el-tree show-checkbox :data="userPurchaseDate" :node-key="defaultPropsLogist.value" :props="defaultPropsPurchase" default-expand-all @check-change="handleUserPurchase" ref="treePurchase" />
					</div>
				</el-tab-pane>
			</el-tabs>
			<template #footer>
				<span class="dialog-footer">
					<el-button  @click="closeDialog">取 消</el-button>
					<el-button  type="primary" @click="submitForm">确定</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script>
	import { toTree, treeToArr } from '@/utils/tool.js'
    import {
		categoryConfig, //品类设置（采购报价设置/物流报价设置/权限设置)
	} from '@/api/goods/rules.js'
	import { onMounted, reactive, toRefs } from 'vue'
	import {
		shopUserList, //查询品类列表
	} from '@/api/goods/shop.js'
import { ElMessage } from 'element-plus'
	export default {
		props: {
              selectId:{
               type:Array,
               default:[]
           }
		},
		emits: ['closeBatchQuotation'],
		setup(props, context) {
			const state = reactive({
				dialogBatchQuotation: true,
				actived: 'logist',//tab切换，默认物流
                buttonLogistState:'ADD',
				keywordLogist: '',
				treeLogist: null,
				defaultPropsLogist: {
					value: 'deptId', // ID字段名
					children: 'children',
					label: 'deptName',
				},
				userLogistDate: [],//物流的接口数据 
				LogistSubmitData: [],//采购的提交数据
				//采购
                buttonPurchaseState:'ADD',
				treePurchase: null,
				userPurchaseDate: [],
				keywordPurchase: '',
				defaultPropsPurchase: {
					value: 'deptId', // ID字段名
					children: 'children',
					label: 'deptName',
				},
				purchaseSubmitData: [],//采购的提交数据
			})
			//员工接口
			function initLogistUser() {
				shopUserList({ keyword: state.keywordLogist ? state.keywordLogist : 'back' }).then(res => {
					loop(res.data)
					state.userLogistDate = res.data
				})
			}
			//采购接口
			function initPurchseUser() {
				shopUserList({ keyword: state.keywordPurchase ? state.keywordPurchase : 'back' }).then(res => {
					loop(res.data)
					state.userPurchaseDate = res.data
				})
			}
			//处理员工接口数据
			function loop(data) {
				data.forEach(item => {
					if (item.children && item.children.length) loop(item.children)
					let arr = []
					if (item.userVos && item.userVos.length) {
						item.userVos.forEach(val => {
							arr.push({ deptId: val.userId + 'user', deptName: val.fullName })  // user 为了避免和部门id 重复
						})
					}
					item.children = arr.concat(item.children)
				})

			}
			onMounted(() => {
				initLogistUser()
			})
			//物流的树点击事件
			function handleUserLogist(data, check) {
				if (data.children) return
				if (check && !data.children) {
					state.LogistSubmitData.push(data.deptId.split('user')[0])
				} else {
					state.LogistSubmitData = state.LogistSubmitData.filter(item => item != data.deptId.split('user')[0])
				}
				console.log('state.LogistSubmitData', state.LogistSubmitData);
			}
			//采购的树点击事件
			function handleUserPurchase(data, check) {
				if (data.children) return
				if (check && !data.children) {
					state.purchaseSubmitData.push(data.deptId.split('user')[0])
				} else {
					state.purchaseSubmitData = state.purchaseSubmitData.filter(item => item != data.deptId.split('user')[0])
				}
				console.log('state.purchaseSubmitData', state.purchaseSubmitData);
			}
			//tab切换事件
			function handleClick(tab, event) {
				if (!state.userPurchaseDate.length) {
					console.log('56565');
					initPurchseUser()
				}
			}
			//弹框确定事件
			function submitForm() {
			 if(!state.LogistSubmitData.length){
                    ElMessage.error('请选择物流数据')
                }else if(!state.purchaseSubmitData.length){
                    ElMessage.error('请选择采购数据')
                }else{
                //调接口
                //采购
                let Logist={
                    type:2,
                    rightType:2,
                    idList:props.selectId,
                    operateType:state.buttonLogistState,
                    rightIdList:state.LogistSubmitData
                }
                let purchase={
                   type:1,
                    rightType:2,
                    idList:props.selectId,
                    operateType:state.buttonPurchaseState,
                    rightIdList:state.purchaseSubmitData  
                }
                categoryConfig({configList:[Logist,purchase]}).then(res => {
                    ElMessage.success('提交成功')
                    context.emit('closeBatchQuotation',true)
                    
                })
                }
			}
			//物流的搜索
			function searchLogist() {
				initLogistUser()
			}
			//采购的搜索
			function searchPurchase() {
				initPurchseUser()
			}
			//关闭
			function closeDialog() {
				state.dialogBatchQuotation = false
				context.emit('closeBatchQuotation',false)
			}
			return {
				...toRefs(state),
				closeDialog,//关闭
				submitForm,
				handleUserLogist,
				handleUserPurchase,
				handleClick,
				searchLogist,
				searchPurchase
			}
		}
	}
</script>

<style scoped lang="scss">
.headQuotation {
    .buttonGroup{
        padding:10px 0
    }
	.quotationContent {
		display: flex;
		justify-content: space-between;
	}
	.treeLogist {
		height: 350px;
		overflow: auto;
		padding-bottom: 16px;
	}
}
</style>