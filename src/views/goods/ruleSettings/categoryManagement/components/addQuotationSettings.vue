<template>
	<div class="headQuotation">
		<el-dialog title="报价设置" v-model="dialogQuotation" width="480px" custom-class="myDialog" :close-on-click-modal="false" :destroy-on-close="true" @close="closeDialog">
			<el-tabs v-model="actived" @tab-click="tabClick">
				<el-tab-pane name="logist" label="物流报价">
					<div class="quotationContent">
						<el-input placeholder="请输入部门名称或员工姓名" v-model.trim="keywordLogist" style="width:380px"  />
						<el-button type="primary"  @click="searchLogist">搜索</el-button>
					</div>
					<div class="treeLogist">
						<el-tree show-checkbox :data="userLogistDate" :node-key="defaultPropsLogist.value" :props="defaultPropsLogist" default-expand-all @check-change="handleUserLogist" ref="treeLogist" />
					</div>
				</el-tab-pane>
				<el-tab-pane name="purchase" label="采购报价">
					<div class="quotationContent">
						<el-input placeholder="请输入部门名称或员工姓名" v-model.trim="keywordPurchase" style="width:380px"  />
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
	import {
		categoryConfig, //品类设置（采购报价设置/物流报价设置/权限设置)
	} from '@/api/goods/rules.js'
	import { nextTick, onMounted, reactive, toRefs } from 'vue'
	import { deepCopy } from '@/utils/tool'
	import {
		shopUserList, //查询品类列表
	} from '@/api/goods/shop.js'
	import { ElMessage } from 'element-plus'
	export default {
		props: {
			settingRows: {
				type: Object,
				//    default:{}
			}
		},
		emits: ['closeQuotation'],
		setup(props, context) {
			const state = reactive({
				dialogQuotation: true,
				actived: 'logist',//tab切换，默认物流
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

			function findPathbyId(tree, id, path) {
				if (typeof path == 'undefined') {
					path = []
				}
				for (let i = 0; i < tree.length; i++) {
					let tempPath = [...path]
					tempPath.push(tree[i].deptId)
					if (tree[i].deptId === id) {
						return tempPath
					}
					if (tree[i].children) {
						let reuslt = findPathbyId(tree[i].children, id, tempPath)
						if (reuslt) {
							return reuslt
						}
					}
				}
			}
			function initData(isInit) {
                const keyword = (state.actived === 'purchase' ? state.keywordPurchase : state.keywordLogist) || 'back'
        if (isInit) {
          state.LogistSubmitData = props.settingRows.logisticsUserIdList.map(item => item + 'user')
          state.purchaseSubmitData = props.settingRows.offerUserIdList.map(item => item + 'user')
        }
				shopUserList({ keyword }).then(res => {
					state.userLogistDate = []
					state.userPurchaseDate = []
					loop(res.data)
					//物流
					loopLogistDateFilter(res.data)
					if (isInit) {
            for (let i = 0; i < state.LogistSubmitData.length; i++) {
              if (!findPathbyId(state.userLogistDate, state.LogistSubmitData[i])) {
                state.LogistSubmitData.splice(i, 1)
                i--
              }
            }
          }
					state.userLogistDate = toTree(state.userLogistDate)
					//采购
					loopPurchaseFilter(res.data)
					if (isInit) {
            for (let i = 0; i < state.purchaseSubmitData.length; i++) {
              if (!findPathbyId(state.userPurchaseDate, state.purchaseSubmitData[i])) {
                state.purchaseSubmitData.splice(i, 1)
                i--
              }
            }
          }
					state.userPurchaseDate = toTree(state.userPurchaseDate)
          nextTick(() => {
            state.treeLogist.setCheckedKeys(state.LogistSubmitData)
            state.treePurchase.setCheckedKeys(state.purchaseSubmitData)
          })
				})
			}

			//处理权限对应的物流报价的人员
			function loopLogistDateFilter(data) {
				data.forEach(item => {
          if (item.isSelect) {
						state.userLogistDate.push({
							deptId: item.deptId, deptName: item.deptName,
							children: item.userVos ? [...item.userVos] : [], parentIds: []
						})
						if (item.children) fmt(item.children, [item.deptId], 'userLogistDate')
					} else {
						if (item.children) loopLogistDateFilter(item.children)
					}
				})
			}
			function fmt(data, parentIds, type) {
				data.forEach(item => {
					if (item.isSelect) {
						state[type].push({
							deptId: item.deptId, deptName: item.deptName,
							children: item.userVos ? [...item.userVos] : [], parentIds: [...parentIds]
						})
					}
					if (item.children) fmt(item.children, [...parentIds, item.deptId], type)
				})
			}
			//处理权限对应的采购报价的人员
			function loopPurchaseFilter(data) {
				data.forEach(item => {
					if (item.isSelect) {
						state.userPurchaseDate.push({
							deptId: item.deptId, deptName: item.deptName,
							children: item.userVos ? [...item.userVos] : [], parentIds: []
						})
						if (item.children) fmt(item.children, [item.deptId], 'userPurchaseDate')
					} else {
						if (item.children) loopPurchaseFilter(item.children)
					}
				})
			}
			//处理员工接口数据
			function loop(data) {
				data.forEach(item => {
					if (item.children && item.children.length) loop(item.children);
					if (props.settingRows.goodsDeptIdList.includes(item.deptId)) item.isSelect = true
					let arr = []
					if (item.userVos && item.userVos.length) {
						item.userVos.forEach(val => {
							val.deptId = val.userId + 'user'
							val.deptName = val.fullName
							arr.push({ deptId: val.userId + 'user', deptName: val.fullName })  // user 为了避免和部门id 重复
						})
					}
					item.children = arr.concat(item.children)
				})
			}
			//调用，这里我写obj其实目的就是通过不同的键值，调用也可以不同，
			//比如你有个数据键值对是gsName,有的可能是aiName，所以 封装了下，可以对其他数据进行编辑

			//处理级联数据
			function toTree(list, obj) {
				let tree = [];
				list.forEach(item => {
					if (item.parentIds.length == 0) {
						let child = queryChildren(item, list);
						tree.push(child);
					}
				})
				return tree;
			};
			function queryChildren(parent, list) {
				let children = [];
				list.forEach(child => {
					if (child.parentIds.includes(parent.deptId) && !child.isCheck) {
						let item = queryChildren(child, list);
						children.push(item);
            child.isCheck = true
					}
				})
				if (children.length) {
					parent.children = [...parent.children, ...children];
				}
				return parent;
			}


			onMounted(() => {
				initData(true)
			})
			//物流的树点击事件
			function handleUserLogist(data, check) {
				if (data.children) return
				if (check) {
          if (!state.LogistSubmitData.some(it => it === data.deptId)) {
					  state.LogistSubmitData.push(data.deptId)
          }
				} else {
					state.LogistSubmitData = state.LogistSubmitData.filter(item => item !== data.deptId)
          // 删除时需要更新一下选中的节点列表
          state.treeLogist.setCheckedKeys(state.LogistSubmitData)
				}
			}
			//采购的树点击事件
			function handleUserPurchase(data, check) {
				if (data.children) return
				if (check) {
					if (!state.purchaseSubmitData.some(it => it === data.deptId)) {
					  state.purchaseSubmitData.push(data.deptId)
          }
				} else {
					state.purchaseSubmitData = state.purchaseSubmitData.filter(item => item !== data.deptId)
          // 删除时需要更新一下选中的节点列表
          state.treePurchase.setCheckedKeys(state.purchaseSubmitData)
				}
			}
			//弹框确定事件
			function submitForm() {
                //物流
				let LogistSubmitData = deepCopy(state.LogistSubmitData)
                
				LogistSubmitData = LogistSubmitData.map(item => Number(item.replace(/user/, '')))
                //采购
			let purchaseSubmitData = deepCopy(state.purchaseSubmitData)
				purchaseSubmitData=purchaseSubmitData.map(item => Number(item.replace(/user/, '')))
				if (!LogistSubmitData.length) {
					ElMessage.error('请选择物流数据')
				} else if (!purchaseSubmitData.length) {
					ElMessage.error('请选择采购数据')
				} else {
					//调接口
					//物流
					let Logist = {
						type: 2,
						rightType: 2,
						idList: [props.settingRows.id],
						operateType: 'UPDATE',
						rightIdList: LogistSubmitData
					}
					//采购
					let purchase = {
						type: 1,
						rightType: 2,
						idList: [props.settingRows.id],
						operateType: 'UPDATE',
						rightIdList:purchaseSubmitData
					}
					categoryConfig({ configList: [Logist, purchase] }).then(res => {
						ElMessage.success('提交成功')
						context.emit('closeQuotation', true)
					})
				}
			}
			//物流的搜索
			function searchLogist() {
				initData()
			}
			//采购的搜索
			function searchPurchase() {
				initData()
			}
      function tabClick() {
          initData()
      }
			//关闭
			function closeDialog() {
				state.dialogQuotation = false
				context.emit('closeQuotation', false)
			}
			return {
				...toRefs(state),
				closeDialog,//关闭
				submitForm,
				handleUserLogist,
				handleUserPurchase,
				searchLogist,
				searchPurchase,
                tabClick
			}
		}
	}
</script>

<style scoped lang="scss">
.headQuotation {
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