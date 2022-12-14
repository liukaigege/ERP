<template>
	<div class="tableView">
		<table>
			<thead>
				<tr>
					<th style="width: 50px;" v-if="checkboxType">
						<el-checkbox :indeterminate="isIndeterminate" v-model="ischeckAll" @change="handleCheckAllChange" />
					</th>
					<th v-for="(item, index) in columns" :key="index" :style="'width:' + item.width">
						<slot :name="item.slotTh" v-if="item.slotTh"></slot>
						<div v-else>{{ item.title }}</div>
					</th>
				</tr>
			</thead>
			<tbody>
				<template v-for="(scoped, keys) in tableData" :key="keys">
					<tr class="tbHead">
						<td class="checkboxTd" v-if="checkboxType == 1">
							<el-checkbox :disabled="isDisabled(scoped)" v-model="scoped.isChecked" @change="val => handleCheckedChange(val, scope)" />
						</td>
						<td :colspan="getHeaderCol(columns.length, scoped)">
							<slot name="extraHeader" :row="scoped"></slot>
						</td>
					</tr>
					<tr class="list" :class="{ showlist: ifShowList }" v-for="(scope, key) in scoped[fieldName]" :key="key">
						<td v-if="checkboxType" :colspan="checkboxType == 1 ? 2 : 1" :style="checkboxType == 1 ?`width:${columns[0]?.width}` : '80px'">
							<el-checkbox v-model="scope.isChecked" @change="val => handleCheckedChange(val, scope)" v-if="checkboxType == 2"></el-checkbox>
							<template v-if="checkboxType == 1">
								<slot :name="columns[0]?.key" v-if="ifShowList" :row="scope" :parentRow="scoped"></slot>
							</template>
						</td>
						<template v-for="(item, index) in columns" :key="index">
							<td v-if="showTd(item.key, scoped, scope, keys, index,key)" :rowspan="getRowSpan(item.key, scoped, scope, keys, index,scoped[fieldName],key)">
								<slot :name="item.key" v-if="ifShowList" :row="scope" :parentRow="scoped" :index="keys" :ind="key"></slot>
							</td>
						</template>
					</tr>
					<tr class="detail" :class="{ showDetail: ifShowDetail && ifShowList }" v-if="ifShowDetail && ifShowList">
						<td :colspan="columns.length + 1">
							<slot name="detail" :row="scoped"></slot>
						</td>
					</tr>
				</template>
			</tbody>
			<tbody v-if="tableData.length == 0">
				<tr class="noData">
					<td :colspan="columns.length + 1">????????????</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script>
	import { computed, onBeforeUnmount, reactive, toRefs, watch, nextTick, onMounted } from 'vue'
	import { startIndex, endIndex, setData } from './js/virtualScroll'
	import { useStore } from 'vuex'

	export default {
		props: {
			checkboxType: {
				// checkbox???????????????,0:????????????1:????????????????????????2:????????????
				type: Number,
				default: 0
			},
			columns: {
				// ?????????
				type: Array,
				default: []
			},
			ifShowDetail: {
				// ??????????????????????????????
				type: Boolean,
				false: true
			},
			ifShowList: {
				// ?????????????????????
				type: Boolean,
				default: true
			},
			border: {
				// ??????????????????
				type: Boolean,
				default: false
			},
			tableData: {
				// ???????????????
				type: Array,
				default: []
			},
			checkedKey: {
				// ????????????????????????????????????????????????goodsId, packageId, id
				type: String,
				default: ''
			},
			fieldName: {
				// ?????????????????????????????????????????????????????????????????????????????????????????????????????????
				type: String,
				default: ''
			},
			loading: {
				type: Boolean,
				default: false,
			},
			isSpanColumns: {
				type: Boolean,
				default: false
			},
			spanColumns: {
				// ???????????????
				type: Array,
				default: []
			},
			parentNode: {
				// ???????????????
				type: String,
				default: null
			},
			isMearg: {
				type: Boolean,
				default: false
			},
			mearge: {
				// ???????????????
				type: Object,
				default: null
			},
			meargeKey: {
				type: String,
				default: 'infoCode'
			},
			isDisable: {
				type: Boolean,
				default: false
			},
			isRowSpanLogis: {
				type: Boolean,
				default: false
			} // ?????????????????????????????????
		},
		emits: ['selectRowKeys'],
		setup(props, context) {
			let store = useStore()
			let selectRowKeysComputed = computed(() => store.getters.selectRowKeys)
			let state = reactive({
				myBorder: props.border ? '1px solid #EBEEF5' : 'none',
				isIndeterminate: false,
				ischeckAll: false, // ????????????
				checkOptions: [], // ??????????????????key
				checkedArr: [] // ????????????key
			})
            onMounted(() => {
                window.addEventListener('scroll', scroll)
            })
			function scroll(e) {
				setData(props.tableData[0][props.fieldName]?.length)
			}

			let filterData = computed(() => {
                if(!props.tableData[0][props.fieldName]) return []
				return props.tableData[0][props.fieldName].slice(startIndex.value, endIndex.value)
			})
			// ??????/??????
			let handleCheckAllChange = val => {
				let { checkboxType, tableData, fieldName } = props
				if (checkboxType == 1) {
					tableData.forEach(item => {
						item.isChecked = val
					})
				} else if (checkboxType == 2) {
					tableData.forEach(item => {
						item[fieldName].forEach(it => {
							it.isChecked = val
						})
					})
				}
        state.ischeckAll = val
				state.checkedArr = val ? state.checkOptions : []
				state.isIndeterminate = false
			}
			// ??????
			let handleCheckedChange = (value, data) => {
				let { checkboxType, checkedKey, tableData, fieldName } = props
				let checkedArr = []
				if (checkboxType == 1) {
					tableData.forEach(item => {
						if (item.isChecked) checkedArr.push(item[checkedKey])
					})
				} else if (checkboxType == 2) {
					tableData.forEach(item => {
						item[fieldName].forEach(it => {
							if (it.isChecked) checkedArr.push(it[checkedKey])
						})
					})
				}
				state.checkedArr = checkedArr
				state.ischeckAll = state.checkedArr.length === state.checkOptions.length
				state.isIndeterminate = state.checkedArr.length > 0 && state.checkedArr.length < state.checkOptions.length
			}

			// ?????????????????????????????????????????????checkedKey,?????????
			watch(() => state.checkedArr, newVal => {
				context.emit('selectRowKeys', newVal)
				store.dispatch('com/setSelectRowKeysActions', newVal)
			}
			)
			// ??????????????????
			const showTd = (name, parent, children, faIndex, coumIndex, chIndex) => {
				if (props.checkboxType == 1 && coumIndex == 0) return false // ???checkboxType == 1 ???????????????checked?????????
				let bole = true
				if (!props.parentNode) return bole  // ??????????????????????????? 
				let faArray = parent[props.parentNode] // ?????????????????????????????????
				let index = faArray.findIndex(a => {
					return a == children
				}) // ????????????td???????????????
				if (props.isSpanColumns) {
					let isIncloud = props.spanColumns.includes(name) ? true : false   // ??????????????????????????????????????????name
					if (faArray.length > 1 && index > 0 && isIncloud) {
						bole = false
					} // ??????????????????1,???????????????????????????0 ????????????????????????,????????????
				} // ????????????????????????

				if (props.isMearg && name == 'options') {
					// ?????????????????? ????????????td????????????
					let meargeKey = props.meargeKey
					if (props.mearge[parent[meargeKey]]) {
						let obj = props.mearge[parent[meargeKey]]
						if (faIndex !== obj.startIndex) {
							bole = false
						} else if (
							faIndex == obj.startIndex &&
							faArray.length > 1 &&
							index == 0
						) {
							bole = true
						}
					}
				} // ????????????


				if (props.isRowSpanLogis && name == 'logistics') {
					if (chIndex == 0) return true
					return false
				} // ??????????????????????????????

				return bole
			}



			//????????????????????????????
			const getRowSpan = (name, parent, children, faIndex, index, orderList, chIndex) => {
				let span = 1 // ????????????1
				if (props.isSpanColumns) { // ????????????
					let faArray = parent[props.parentNode] // ????????????
					let index = faArray.findIndex(a => {
						return a == children
					})
					let isIncloud = props.spanColumns.includes(name) ? true : false
					if (faArray.length > 1 && index == 0 && isIncloud) {
						span = faArray.length
					}
				}

				if (props.isMearg && name == 'options') {
					let meargeKey = props.meargeKey // ???????????????????????????
					if (props.mearge[parent[meargeKey]]) {
						//mearge ??????????????????????????????????????????,???????????????
						let obj = props.mearge[parent[meargeKey]]
						span = obj.rowSpan + obj.packgeNum
					}
				}

				if (props.isRowSpanLogis && name == 'logistics' && chIndex == 0) {
					span = 0
					span += orderList.length

				} // ??????????????????????????????

				return span
			} // ???????????????????????????

			const getHeaderCol = (length, parent) => {
				if (props.isMearg) {
					return length - 1
				} else {
					return length + 1
				}
			}

			// ?????????
			let initFun = () => {
				state.ischeckAll = false
				state.checkOptions = []
				state.isIndeterminate = false
				let num = 0
				let checkedArr = []
				if (props.checkboxType == 1) {
					props.tableData.forEach(item => {
						let ble = selectRowKeysComputed.value.includes(item[props.checkedKey])
						if (ble) {
							item.isChecked = true
							checkedArr.push(item[props.checkedKey])
							state.isIndeterminate = true
							num++
						} else {
							item.isChecked = false
						}
						state.checkOptions.push(item[props.checkedKey])
					})
				} else if (props.checkboxType == 2) {
					props.tableData.forEach(item => { // ???????????????checkBox??????
						item[props.fieldName].forEach(it => {
							let ble = selectRowKeysComputed.value.includes(it[props.checkedKey])
							if (ble) {
								it.isChecked = true
								checkedArr.push(it[props.checkedKey])
								state.isIndeterminate = true
								num++
							} else {
								it.isChecked = false
							}
							state.checkOptions.push(it[props.checkedKey])
						})
					})
				}
				state.checkedArr = checkedArr
				if (state.checkOptions.length > 0 && num == state.checkOptions.length) {
					state.ischeckAll = true
					state.isIndeterminate = false
				}
				nextTick(() => {
					handleCheckAllChange(false)
				})
			}

			const isDisabled = val => {
				if (!props.isDisable) return false
				const { orderType, orderTabType } = store.getters
				if (orderType == 0) {

				} // ?????????
				return false
			} // ????????????

			onBeforeUnmount(() => {              
				window.removeEventListener('scroll', scroll)
				store.dispatch('com/removeSelectRowKeysActions')
			})
			return {
				...toRefs(state),
				selectRowKeysComputed,
				initFun,
				handleCheckAllChange,
				handleCheckedChange,
				showTd,
				getRowSpan,
				getHeaderCol,
				isDisabled,
				filterData
			}
		}
	}
</script>

<style lang="scss" scoped>
.tableView {
	overflow: hidden;
	table {
		word-break: break-all;
		width: 100%;
		border-collapse: collapse;
		border: 1px solid #ebeef5;

		td {
			border: 1px solid #ebeef5;
			border-left: none;
			border-right: none;
			padding: 0;
			overflow: hidden;
			text-align: center;
		}

		thead {
			tr {
				th {
					height: 54px;
					line-height: 20px !important;
					text-align: center;
					line-height: 54px;
					font-size: 14px;
					background-color: #f5f7fa;
				}
			}
		}

		tbody {
			width: 100%;

			.checkboxTd {
				text-align: center;
				background-color: #f5f7fa;
			}

			.list {
				height: 0;
				display: none;
				td {
					border-left: v-bind(myBorder);
					border-right: v-bind(myBorder);
				}
			}
			// .list:hover{
			//   background-color: #f5f7fa;
			// }

			.showlist {
				display: table-row;
				height: 86px;
			}

			.detail {
				width: 100%;
				height: 0;
				overflow: hidden;

				tr {
					width: 100%;
				}

				td {
					width: 100%;
					padding: 10px 10px 0 10px;
				}
			}

			.showDetail {
				height: 126px;
			}

			.noData {
				height: 54px;
				color: #909399;
			}
		}
	}
}
</style>
