<template>
	<div class="wiih">
		<div class="content">
			<el-row :gutter="20">
				<!-- 左侧 -->
				<el-col :span="11">
					<div class="catagroyClass">
						<el-tabs style="padding:20px 0 0 20px">
							<el-tab-pane label="品类" name="catagory">
							</el-tab-pane>
						</el-tabs>
						<!-- <p style="border-bottom: 2px solid #E9E9E9">品类</p> -->
						<div class="treeClass">
							<el-tree default-expand-all highlight-current :data="categoryList" :props="defaultCategory" check-strictly @node-click="handleCategory" :expand-on-click-node="false" />
						</div>
					</div>
				</el-col>
				<!-- 右侧 -->
				<el-col :span="13">
					<div class="rightClass">
						<el-tabs v-model="activedPartement" @tab-click="handleClick">
							<!-- 按部门 -->
							<el-tab-pane label="按部门" name="dept" :disabled="isDisabled">
								<span>
									<el-input placeholder="请输入部门名称" v-model="keywordDepartment" style="width:90%" />
								</span>
								<span class="buttonClass" @click="search">
									搜索
								</span>
								<div style="height:580px;overflow: auto;padding-bottom:24px">
									<div style="margin:16px 0 14px 24px" v-if="dataDepartment&&dataDepartment.length">
										<el-checkbox v-model="checked1" :disabled="checkboxDisabled" :indeterminate="isIndeterminate" label="部门名称" class="checkboxClass" @change="checkedAll"></el-checkbox>
									</div>
									<div class="treeRightClass">
										<el-tree show-checkbox :data="dataDepartment" :node-key="defaultProps.value" check-on-click-node :props="defaultProps" default-expand-all check-strictly @check-change="handleDepartmentClick" ref="treeDepartment">
										</el-tree>
									</div>
								</div>

							</el-tab-pane>
							<el-tab-pane label="按员工" name="user">
								<span>
									<el-input placeholder="请输入部门名称或员工姓名" v-model="keywordUser" style="width:90%" />
								</span>
								<span class="buttonClass" @click="searchUser">
									搜索
								</span>
								<div style="height:580px;overflow: auto;padding-bottom:24px">
									<div class="treeRightClass">
										<el-tree show-checkbox :data="userDate" node-key="deptId" check-on-click-node :props="defaultPropsUser" default-expand-all @check-change="handleUserClick" ref="tree">
										</el-tree>
									</div>
								</div>

							</el-tab-pane>
						</el-tabs>
					</div>
				</el-col>
			</el-row>
		</div>
	</div>

</template>

<script>
	import { reactive, toRefs, onMounted, watch, ref, nextTick } from 'vue'
	import { toTree, treeToArr } from '@/utils/tool.js'
	import {
		getDepartment, //查询部门信息列表
	} from '@/api/user.js'
	import {
		selectCategory, //查询品类列表
	} from '@/api/goods/rules.js'
	import {
		shopUserList, //查询员工列表
	} from '@/api/goods/shop.js'
	import { ElMessage } from 'element-plus'
	export default {
		props: {
			actived: {
				type: String,
			}
		},
		emits: ['sumitDepartment', 'submitCategory'],
		setup(props, context) {
			let actives = props.actived
			console.log(actives, 'actives------');
			const state = reactive({
				activedPartement: 'dept',
				checked1: false,
				checkboxDisabled: false,//部门全选复选框禁用控制
				treeLength: 0,
				isIndeterminate: false,//复选框选择状态
				tree: null,
				isDisabled: false,
				keywordDepartment: '', //按部门的关键词
				keywordUser: '', //按员工的关键词
				categoryList: [], //品类的下拉数据
				dataDepartment: [], //部门数据
				userDate: [], //员工数据
				defaultPartment: [], //默认部门的回显
				defaultUser: [], //默认员工的回显
				defaultProps: { //部门
					value: 'deptId', // ID字段名
					children: 'children',
					label: 'deptName',
				},
				defaultPropsUser: { //员工
					value: 'deptId', // ID字段名
					children: 'children',
					label: 'deptName',
				},
				defaultCategory: { //品类
					value: 'id', // ID字段名
					children: 'children',
					label: 'name',
					disabled: 'disabled'

				},
				departmentId: [],
				treeDepartment: null,
			})
			watch(() => props.actived, val => {
				actives = val
			})
			onMounted(() => {
				initDepartment()
				initUser()
			})
			//搜索时候
			function search() {
				initDepartment()
				if (actives == 1) {
					state.treeDepartment.setCheckedKeys(obj.offerDeptIdList) //处理可选择的方法 
				} else {
					state.treeDepartment.setCheckedKeys(obj.logisticsDeptIdList) //处理可选择的方法  
				}
			}
			function searchUser() {
				initUser()
				if (actives == 1) {
					state.tree.setCheckedKeys(obj.offerUserIdList.map(item => item + 'user')) //处理可选择的方法  
				} else {
					state.tree.setCheckedKeys(obj.logisticsUserIdList.map(item => item + 'user')) //处理可选择的方法  
				}
			}
			//部门的接口
			function initDepartment() {
				getDepartment({ keyword: state.keywordDepartment }).then(res => {
					state.treeLength = [...treeToArr(res.data, 'children', true)].length
					state.dataDepartment = res.data
					loopDisable(state.dataDepartment, obj.goodsDeptIdList)
				})
			}
			//员工的接口
			function initUser() {
				console.log(state.keywordUser, 'state.keywordUser');
				shopUserList({ keyword: state.keywordUser ? state.keywordUser : 'back' }).then(res => {
					loop(res.data)
					state.userDate = res.data
					nextTick(() => {
						loopDisable(state.userDate, obj.goodsUserIdList.map(item => item + 'user'))
					})
				})
			}
			//处理数据
			function loop(data) {
				data.forEach(item => {
					if (item.children && item.children.length) loop(item.children)
					let arr = []
					if (item.userVos && item.userVos.length) {
						item.userVos.forEach(val => {
							arr.push({ deptId: val.userId + 'user', deptName: val.fullName, type: 'user' })
						})
					}
					item.children = arr.concat(item.children)
				})

			}
			//1.右边的框员工选择事件
			function handleUserClick(data, checkd) {
				if (!obj.goodsUserIdList) return
				if (checkd && !data.children) {//选中并且没有子级情况
					obj.goodsUserIdList.push(data.deptId)
					if (actives == 1) {//采购
						if (!obj.offerUserIdList) return
						if (!obj.offerUserIdList.includes(data.deptId?.split('user')[0])) obj.offerUserIdList.push(data.deptId?.split('user')[0])
					} else {//物流
						if (!obj.logisticsUserIdList) return
						if (!obj.logisticsUserIdList.includes(data.deptId?.split('user')[0])) obj.logisticsUserIdList.push(data.deptId?.split('user')[0])
					}
				} else if (!checkd && !data.children) {
					if (actives == 1) {//采购
						obj.offerUserIdList = obj.offerUserIdList.filter(item => item != data.deptId)
					} else {//物流
						obj.logisticsUserIdList = obj.logisticsUserIdList.filter(item => item != data.deptId)
					}
				}
			}
			//1.1右边的部门选择事件
			function handleDepartmentClick(data, checkd) {
				let checkeds = state.treeDepartment.getCheckedNodes()
				checkeds = checkeds.map(item => item.deptId)
				state.checked1 = state.treeLength == checkeds.length;
				state.isIndeterminate = checkeds.length > 0 && checkeds.length < state.treeLength
				if (checkd) {
					if (actives == 1) {//采购
						if (!obj.offerDeptIdList) return
						if (!obj.offerDeptIdList.includes(data.deptId)) obj.offerDeptIdList.push(data.deptId)
					} else {//物流
						if (!obj.logisticsDeptIdList) return
						if (!obj.logisticsDeptIdList.includes(data.deptId)) obj.logisticsDeptIdList.push(data.deptId)
					}
				} else {
					if (actives == 1) {//采购
						obj.offerDeptIdList = obj.offerDeptIdList.filter(item => item != data.deptId)
					} else {//物流
						obj.logisticsDeptIdList = obj.logisticsDeptIdList.filter(item => item != data.deptId)
					}
				}
			}
			//2.全选按钮
			function checkedAll() {
				state.departmentId = []
				if (state.checked1) {
					loop(state.dataDepartment)

					function loop(data) {
						data.forEach(item => {
							state.departmentId.push(item.deptId)
							if (item.children && item.children.length) {
								loop(item.children)
							}
						})
					}
					state.treeDepartment.setCheckedKeys(state.departmentId)
				} else {
					state.departmentId = []
					state.treeDepartment.setCheckedKeys([])
				}
				if (actives == 1) {
					obj.offerDeptIdList = state.departmentId
				} else {
					obj.logisticsDeptIdList = state.departmentId
				}
			}
			//3.品类的接口
			selectCategory({ level: null }).then(res => {
				res.data = res.data.filter(item => item.status === 1)
				state.categoryList = toTree(res.data, 'id')
				//处理子类可选
				loopcatagoryList(state.categoryList)

				function loopcatagoryList(data) {
					data.forEach(item => {
						if (item.children.length > 0) {
							item.disabled = true
						}
						if (item.children && item.children.length) {
							loopcatagoryList(item.children)
						}
					})
				}
			})
			let obj = {}
			//3.1品类选择时候事件
			function handleCategory(data) {
				if (data.disabled == true) return
				obj = data
				////////////////处理回显
				if (actives == 1) {
					//如果选择的是采购报价
					if (data.offerDeptIdList?.length) {
						state.activedPartement = 'dept'
						state.defaultPartment = data.offerDeptIdList //回显
						loopDisable(state.dataDepartment, data.goodsDeptIdList)
						state.treeDepartment.setCheckedKeys(data.offerDeptIdList) //处理可选择的方法
						state.checkboxDisabled = !(state.treeLength === data.goodsDeptIdList?.length)//设置部门的复选框禁用
					} else if (data.offerUserIdList?.length) {
						state.activedPartement = 'user'
						state.defaultUser = data.offerUserIdList //回显人的默认选择
						state.tree.setCheckedKeys(data.offerUserIdList.map(item => item + 'user')) //处理可选择的方法
						if (data.goodsDeptIdList?.length > 0) {  // 部门变员工
							let ids = []
							data.goodsDeptIdList.forEach(item => {
								loopUser(state.userDate, item, ids)
							})
							loopDisable(state.userDate, ids) //处理可选择的方法
						} else {
							loopDisable(state.userDate, data.goodsUserIdList.map(item => item + 'user')) //处理可选择的方法
						}
					} else {
						if (data.goodsDeptIdList?.length) {
							state.activedPartement = 'dept';
							loopDisable(state.dataDepartment, data.goodsDeptIdList)
							state.checkboxDisabled = !(state.treeLength === data.goodsDeptIdList?.length)//设置部门的复选框禁用
						} else {
							state.activedPartement = 'user';
							loopDisable(state.userDate, data.goodsUserIdList.map(item => item + 'user'));
						}
						state.tree.setCheckedKeys([])
						state.treeDepartment.setCheckedKeys([])
					}
				} else { //如果选的是物流报价
					if (data.logisticsDeptIdList?.length) {
						state.activedPartement = 'dept'
						state.defaultPartment = data.logisticsDeptIdList //回显
						loopDisable(state.dataDepartment, data.goodsDeptIdList)
						state.treeDepartment.setCheckedKeys(data.logisticsDeptIdList) //处理可选择的方法
						state.checkboxDisabled = !(state.treeLength === data.goodsDeptIdList?.length)//设置部门的复选框禁用
					} else if (data.logisticsUserIdList?.length) {
						state.activedPartement = 'user'
						state.defaultUser = data.logisticsUserIdList //回显人的默认选择
						state.tree.setCheckedKeys(data.logisticsUserIdList.map(item => item + 'user')) //处理可选择的方法
						if (data.goodsDeptIdList?.length > 0) {  // 部门变员工
							let ids = []
							data.goodsDeptIdList.forEach(item => {
								loopUser(state.userDate, item, ids)
							})
							loopDisable(state.userDate, ids) //处理可选择的方法
						} else {
							loopDisable(state.userDate, data.goodsUserIdList.map(item => item + 'user')) //处理可选择的方法
						}
					} else {
						if (data.goodsDeptIdList?.length) {
							state.activedPartement = 'dept';
							loopDisable(state.dataDepartment, data.goodsDeptIdList)
							state.checkboxDisabled = !(state.treeLength === data.goodsDeptIdList?.length)//设置部门的复选框禁用
						} else {
							state.activedPartement = 'user';
							loopDisable(state.userDate, data.goodsUserIdList.map(item => item + 'user'));
						}
						state.tree.setCheckedKeys([])
						state.treeDepartment.setCheckedKeys([])
					}
				}
				state.isDisabled = !(obj.goodsDeptIdList?.length > 0)  //禁用
			}

			//调用的设置disable方法
			function loopDisable(data, arrList) {
				data.forEach(item => {
					if (arrList?.indexOf(item.deptId) !== -1) {
						item.disabled = false
					} else {
						item.disabled = true
					}
					if (item.children && item.children.length) {
						loopDisable(item.children, arrList)
					}
				})
			}
			//清空默认的disable事件方法
			// function clearList(data) {
			// 	data.forEach(item => {
			// 		item.disabled = false
			// 		if (item.children) {
			// 			clearList(item.children)
			// 		}
			// 	})
			// }
			function loopUser(list, id, ids) {
				return list.some(item => {
					if (item.deptId == id) {
						let arr = item.children?.map(item => item.deptId)
						if (arr) ids.push(...arr)
						return true
					} else {
						if (item.children) return loopUser(item.children, id, ids)
					}
				})
			}
			//tabs切换清空事件
			function handleClick() {
				state.departmentId = []
				state.checked1 = false
				if (state.activedPartement == 'dept') {
					loopDisable(state.dataDepartment, obj.goodsDeptIdList) //处理可选择的方法
					state.tree.setCheckedKeys([])

				} else {
					let ids = []
					obj.goodsDeptIdList?.forEach(item => {
						loopUser(state.userDate, item, ids)
					})
					loopDisable(state.userDate, ids) //处理可选择的方法
					state.treeDepartment.setCheckedKeys([])

				}
			}
			let checkArr = []
			function getChildData() {
				//1.查找子级品类
				if (checkArr.length > 0) return
				loopcatagoryCheck(state.categoryList)
				function loopcatagoryCheck(data) {
					data.forEach(item => {
						if (!item.children.length > 0) {
							checkArr.push(item)
						}
						if (item.children && item.children.length) {
							loopcatagoryCheck(item.children)
						}
					})
				}
			}
			// 父组件获取数据
			function getData(type) {
				getChildData()
				if (checkData(type)) {
					let subArr = checkArr.map(item => {
						return {
							idList: [item.id],
							type: type,
							rightType: setType(item, type),
							rightIdList: getIds(type, item)
						}
					})
					return subArr
				}
				return false

			}
			function getIds(type, item) {
				let dataIdList = []
				if (type == 1) {
					dataIdList = item.offerUserIdList?.length > 0 ? item.offerUserIdList : item.offerDeptIdList
				} else {
					dataIdList = item.logisticsUserIdList?.length > 0 ? item.logisticsUserIdList : item.logisticsDeptIdList
				}
				return dataIdList
			}
			function setType(item, type) {
				if (type == 1) {
					if (!item.offerUserIdList?.length > 0) return 1
					return 2
				} else {
					if (!item.logisticsUserIdList?.length > 0) return 1
					return 2
				}
			}
			function checkData(type) {
				//2.校验没有填的
				let flag = checkArr.some(item => {
					let msg = type == 1 ? `请设置${item.name}的采购报价` : `请设置${item.name}的物流报价`;
					if (type == 1 && !(item.offerUserIdList?.length > 0 || item.offerDeptIdList?.length > 0)) {
						ElMessage.error(msg)
						return true
					}
					if (type == 2 && !(item.logisticsUserIdList?.length > 0 || item.logisticsDeptIdList?.length > 0)) {
						ElMessage.error(msg)
						return true
					}
				})
				return !flag
			}
			//监听数组变化然后回传到父页面
			watch(() => state.categoryList, val => {
				// console.log(val, 'val.......');
			},
				{ deep: true }
			)
			return {
				...toRefs(state),
				handleUserClick, //员工
				handleDepartmentClick, //部门
				checkedAll,
				search,
				handleClick,
				handleCategory,
				actives,
				getData,
				searchUser
			}
		},
	}
</script>

<style lang="scss" scoped>
	.wiih {
		.content {
			.catagroyClass {
				height: 700px;
				overflow: auto;
				background: #fff;
				// border: 1px solid #eee;
				padding-bottom: 24px;
				margin-bottom: 20px;
				:deep(.el-tabs__item) {
					font-size: 16px;
				}
			}

			.rightClass {
				height: 700px;
				background: #fff;
				// border: 1px solid #eee;
				padding: 20px 0px 34px 24px;
				margin-bottom: 50px;

				:deep(.el-tabs__item) {
					font-size: 16px;
				}
				.checkboxClass {
					:deep(.el-checkbox__label) {
						font-weight: 600;
					}
				}
			}

			p {
				padding: 20px 24px;
				font-size: 16px;
				font-weight: 500;
			}

			.treeClass {
				padding: 0 24px 34px 24px;
			}

			.treeRightClass {
				padding: 0px 0px 34px 0px;
			}

			:deep(.el-input__inner) {
				height: 32px;
			}

			.buttonClass {
				width: 70px;
				height: 28px;
				background: #1890ff;
				color: #fff;
				padding: 6px 14px;
				border-radius: 3px;
				cursor: pointer;
			}
		}
	}
</style>
