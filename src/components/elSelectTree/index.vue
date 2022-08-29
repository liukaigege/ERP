<!--
 * @Descripttion: Vango ERP
 * @version: 1.0
 * @Author: 朱涛（梅溪）
 * @Date: 2021-07-07 21:49:04
 * @LastEditors: 江澎涛
 * @LastEditTime: 2021-07-30 09:40:57
-->
<template>
	<div :style="displayStyle?'display: ' + displayStyle + ';':''">
		<el-select v-model="selectedData" ref="sl" :style="selectStyle" :filterable='filterable' :filter-method="selectData" :placeholder="slPlaceholder" :disabled="slDisabled" :clearable="slClearable" :multiple="multiple" @clear="clearHandle" @remove-tag="removeSelectedNodes" @change="changeSelectedNodes" :size="size">
			<el-option :value="valueTitle" class="option">
				<el-tree id="tree-option" :ref="tree" :data="data" :class="{'disable-item': isDisableItem}" :filter-node-method="filterNode" :highlight-current="true" :expand-on-click-node="isDisableItem" :default-expand-all="defaultExpandAll" @node-click="handleNodeClick" :default-expanded-keys="defaultExpandKey" :default-checked-keys="defaultCheckedKeys" :show-checkbox="multiple" :accordion="accordion" :node-key="treeProps.value" :props="treeProps" @check-change="handleCheckChange" :check-strictly="checkStrictly">
				</el-tree>
			</el-option>
			<el-option v-show="false" v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
		</el-select>
	</div>
</template>

<script>
	import {reactive,toRefs,ref,watch,nextTick} from 'vue'
	export default {
		props: {
			data: {
				type: Array,
				default: [
					{
						id: 1990,
						lable: 'test'
					}
				]
			},
			treeProps: {
				type: Object,
				default: {
					value: 'id', // ID字段名
					label: 'title', // 显示名称
					children: 'children', // 子级字段名
          disabled: 'disabled'
				}
			},
			defaultExpandAll: {
				type: Boolean,
				default: false
			}, // 树形结构是否默认全部打开
			defaultExpandKey: {
				type: Array,
				default: []
			}, // 树形结构是否默认打开的项
			defaultCheckedKeys: {
				type: Array,
				default: []
			}, // 树形结构是否默认选中的项
			multiple: {
				type: Boolean,
				default: false
			}, // 树形结构是否打开选择框
			nodeKey: {
				type: String,
				default: 'id' // nodekey
			},
			checkStrictly: {
				type: Boolean,
				default: false
			}, // 在显示复选框的情况下，是否严格的遵循父子不互相关联的做法，默认为 false
			accordion: {
				type: Boolean,
				default: false // 手风琴模式,对于同一级的节点，每次只能展开一个
			},
			slDisabled: {
				type: Boolean,
				default: false // 是否disabled
			},
			slClearable: {
				type: Boolean,
				default: true //是否开启清除按钮
			},
			slPlaceholder: {
				type: String,
				default: '请选择内容' // placeholder 内容
			},
			width: {
				type: Number,
				default() {
					return 250
				}
			},
			height: {
				type: Number,
				default() {
					return 300
				}
			},
			size: {
				type: String,
				default: '' // 尺寸
			},
			filterable: {  // 筛选节点
				type: Boolean,
				default: false
			},
			isDisableItem: {  // 禁止点击disable节点
				type: Boolean,
				default: false
			},
			displayStyle:{ // 是否是行内样式
				type: String,
				default: ''
			}
		},
		setup(props, context) {
			const state = reactive({
				valueId: props.treeProps.value, // 初始值
				valueTitle: '',
				selectedData: props.multiple ? [] : '',
				//selectedData: [],
				options: [],
				style: 'width:' + props.width + 'px;' + 'height:' + props.height + 'px;',
				selectStyle: 'width:' + (props.width + 24) + 'px;',
				defaultCheckedList: props.defaultCheckedKeys
			})
			let treeRefs = ''
			const tree = el => {
				treeRefs = el
			}

			const sl = ref(null)
			const handleNodeClick = node => {
				if (props.isDisableItem && node.disabled) return
				if (props.multiple) return
				const { label, value } = props.treeProps
				state.valueTitle = node[label]
				state.valueId = node[value]
				state.selectedData = node[label]
				console.log(state.valueTitle, state.valueId)
				sl.value.blur()
				context.emit('ok', state.valueId,state.valueTitle)
			}

			const handleCheckChange = (data, checked, indeterminate) => {
				if (!props.multiple) return
				const checkedKeys = treeRefs.getCheckedKeys()
				state.options = checkedKeys.map(item => {
					let node = treeRefs.getNode(item)
					let tmpMap = {}
					tmpMap.value = node.key
					tmpMap.label = node.label
					return tmpMap
				})
				state.selectedData = state.options.map(item => {
					return item.value
				})
				context.emit('ok', checkedKeys)
			} // 多选框输出值
			const clearHandle = () => {
				state.selectedData = props.multiple ? [] : null
				state.valueTitle = ''
				state.valueId = ''
				treeRefs.setCheckedKeys([])
				treeRefs.filter()
				context.emit('ok', null)
				// clearSelected()
			}

			const removeSelectedNodes = val => {
				treeRefs.setChecked(val, false)
			}
			const changeSelectedNodes = e => {
				if (state.selectedData) {
					state.selectedData.forEach((item, index) => {
						if (item === '') {
							state.selectedData.splice(index, 1)
						}
					})
				}

			}

			const init = (propsCheckeds) => {
				const { multiple, defaultCheckedKeys } = props
				let arr = propsCheckeds ? propsCheckeds : defaultCheckedKeys
				if (multiple) {
					if (arr.length > 0) {
						treeRefs.setCheckedKeys(arr) // 勾选节点
						state.options = arr.map(item => {
							let node = treeRefs.getNode(item)
							let tmpMap = {}
							tmpMap.value = node.key
							tmpMap.label = node.label
							return tmpMap
						})
						state.selectedData = state.options.map(item => {
							return item.value
						})
					} else {
						// 清空所有勾选
						var checkedKeys = treeRefs.getCheckedKeys() // 所有被选中的节点的 key 所组成的数组数据
						for (let i = 0; i < checkedKeys.length; i++) {
							treeRefs.setChecked(checkedKeys[i], false)
						}
					}
				} else {
					if (arr.length > 0) {
						// 选中传进来的节点
						var item = arr[0]
						treeRefs.setCurrentKey(item)
						var node = treeRefs.getNode(item)
						state.selectedData = node.label
					} else {
						// 清空选中
						state.selectedData = ''
						treeRefs.setCurrentKey(null)
					}
				}
			} // 初始化函数

			// 筛选数据
			function selectData(v) {
				treeRefs.filter(v)
			}
			function filterNode(value, data) {
				if (!value) return true
				return data[props.treeProps.label].indexOf(value) !== -1
			}

			watch(props, (a, b) => {
				if (a) {
                   setTimeout(() =>{
                       init(a.defaultCheckedKeys)
                   },400)
				}
			},{immediate: true})
			return {
				...toRefs(state),
				tree,
				handleNodeClick,
				clearHandle,
				handleCheckChange,
				removeSelectedNodes,
				changeSelectedNodes,
				sl,
				selectData,
				filterNode,
				init
			}
		}
	}
</script>
>
<style scoped>
:deep(.el-tree-node__label){
	display: inline-block;
  width: 300px;
  line-height: 33px;
        max-height: 33px;
  overflow: hidden; /**隐藏超出的内容**/
        white-space: nowrap;
        -o-text-overflow: ellipsis;
        text-overflow: ellipsis;
}
	.disable-item >>> [aria-disabled='true'] > .el-tree-node__content {
		cursor: not-allowed;
		background: #fff !important;
	}

	.el-scrollbar .el-scrollbar__view .el-select-dropdown__item {
		height: auto;
		padding: 0;
	}
	.el-select-dropdown__item.selected {
		font-weight: normal;
	}
	ul li >>> .el-tree .el-tree-node__content {
		height: auto;
		padding: 0 20px;
	}
	.el-tree-node__label {
		font-weight: normal;
	}

	.el-tree >>> .is-current .el-tree-node__children .el-tree-node__label {
		color: #606266;
		font-weight: normal;
	}
</style>
