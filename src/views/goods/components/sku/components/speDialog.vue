<!--
 * @Descripttion: 弹框模板
 * @version:
 * @Author: 朱涛
 * @Date: 2021-07-15 17:01:59
 * @LastEditors: 朱涛
 * @LastEditTime: 2021-08-05 10:00:34
-->

<template>
	<div>
		<el-dialog
			:title="`(${query.spe.nameCn || query.spe.nameEn})常用属性`"
			v-model="dialogVisible"
			:width="width"
			@close="close"
			:close-on-click-modal="false"
			:close-on-press-escape="false"
		>
			<div class="container">
				<div style="display: flex;align-items: center">
					<el-radio-group v-model="nameType" >
						<el-radio-button :label="1">中文</el-radio-button>
						<el-radio-button :label="2">英文</el-radio-button>
					</el-radio-group>

					<el-checkbox
						style='margin-left: 10px'
						v-model="isCheckedAll"
						@change="checkedAll"
						:indeterminate="showIndeter()"
						>全选</el-checkbox
					>
				</div>
				<div class="speList">
					<div
						:class="
							activeIds.indexOf(item.id) !== -1 ? 'speItem active' : 'speItem'
						"
						v-for="(item, index) in query.values"
						:key="index"
						@click="select(item.id)"
					>
						<div class="img">
							<img :src="item.mainImg || defaultImg" alt="" srcset="" />
						</div>
						<p class="title" :title="item.valEn || item.valCn">
							{{ showName(item) }}
						</p>
					</div>
				</div>
			</div>
			<template #footer>
				<span class="dialog-footer">
					<el-button  @click="cancel">取 消</el-button>
					<el-button
						type="primary"
						
						@click="dialogHandOk"
						:disabled="activeIds.length == 0"
						>确 定</el-button
					>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script>
import { reactive, toRefs, getCurrentInstance, watch, onMounted } from 'vue'
import defaultImg from '@/assets/image/mr_bg@2x.png'
export default {
	props: {
		query: {
			type: Object,
			default: null
		},
		/**
		 * type:muliti,coustom,coustomChild
		 * index,
		 * values,规格参数
		 * spe,常用规格
		 * slectSpeArr,已有常用规格idspeValues 项
		 */

		dialogTitle: {
			type: String,
			default: '提示'
		},
		dialogVisible: {
			type: Boolean,
			default: false
		},
		width: {
			type: String,
			default: '40%'
		}
	},
	setup(props, context) {
		const { proxy } = getCurrentInstance()
		const data = reactive({
			// activeIds:props.query.slectSpeArr || [],  //去除默认勾选
			activeIds: [],
			isCheckedAll: false,
			nameType: 2
		})

		watch(
			() => data.activeIds,
			a => {
				console.log(a)
				if (a.length == props.query.values.length) data.isCheckedAll = true
				if (a.length == 0) data.isCheckedAll = false
			},
			{ deep: true }
		)

		const dialogHandOk = () => {
			let selectList = []
			data.activeIds.map(item => {
				let index = props.query.values.findIndex(v => v.id == item)
				if (index !== -1) selectList.push(props.query.values[index])
			})
			context.emit('selectSpeOk', { query: props.query, selectList })
			cancel()
		}

		const close = () => {
			proxy.$parent.showSelectSpe = false
		}
		const cancel = () => {
			proxy.$parent.showSelectSpe = false
		}

		function showName(item) {
			const { valCn, valEn } = item
			let name
			data.nameType === 1 ? (name = valCn) : (name = valEn)
			// name?.length > 4? name =  name.slice(0,4)+'...' : ''
			return name
		}

		function select(id) {
			let index = data.activeIds.findIndex(v => v == id)
			if (index !== -1) {
				data.activeIds.splice(index, 1)
			} else {
				data.activeIds.push(id)
			}
		}

		function checkedAll(val) {
			if (val) {
				props.query.values.map(item => {
					if (data.activeIds.indexOf(item.id) == -1) {
						data.activeIds.push(item.id)
					}
				})
			} else {
				data.activeIds = []
			}
		}

		function showIndeter() {
			if (
				data.activeIds?.length > 0 &&
				data.activeIds?.length < props.query.values?.length
			)
				return true
			return false
		}

		onMounted(() => {
			let a = data.activeIds
			if (a.length == props.query.values.length) data.isCheckedAll = true
			if (a.length == 0) data.isCheckedAll = false
		})

		return {
			...toRefs(data),
			dialogHandOk,
			cancel,
			close,
			showName,
			select,
			checkedAll,
			showIndeter,
			defaultImg
		}
	}
}
</script>

<style lang="scss" scoped>
.speList {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	margin-top: 18px;
}

.speItem {
	width: 90px;
	height: 100px;
	border-radius: 2px;
	border: 1px solid #ececec;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 18px;
	margin-bottom: 18px;
	flex-direction: column;
	.img {
		width: 50px;
		height: 50px;
		margin: 6px auto;
		display: flex;
		align-items: center;
		justify-content: center;
		img {
			max-width: 50px;
			max-height: 50px;
			width: auto;
			height: auto;
		}
	}
	.title {
		cursor: pointer;
		font-size: 10px;
		margin: 0 5px;
		word-break: break-all;
		text-overflow: ellipsis;
		text-align: center;
		overflow: hidden;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}
}
.active {
	border: 1px solid #1890ff;
}
</style>
