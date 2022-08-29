
import { nextTick, ref } from 'vue'
import Sortable from 'sortablejs'
export default function (data) {
	const numbers = ({ row }) => {
		const { customType, length } = row
		if (customType == 2 && !length) {
			return new Error('请填写文本最大数')
		}
	}
	const showTypeRule = ({ row }) => {
		const { customType, length, showType } = row
		if (customType == 1 && !showType) return new Error('请选择展示样式')
	}

	const valitorNameCn = ({ row }) => {
		const { nameCn, nameEn } = row
		if (!nameCn && !nameEn) {
			return new Error('请填写规格名称(中文)')
		}
	}

	const valitorNameEn = ({ row }) => {
		const { nameCn, nameEn } = row
		if (!nameCn && !nameEn) {
			return new Error('请填写规格名称(英文)')
		}
	}




	const speValues = ({ row }) => {
		if (row.customType == 1 && row.speValues.length == 0 && row.required == 1) return new Error('请配置规格信息')
	}
	const plusPrice = ({ row }) => {
		const { customType, plusPrice } = row
		if (plusPrice) {
			return new Error('当定制规格为')
		}
	}

	const rules = ref(
		{

			nameEn: [
				// { required: true, message: '请填写规格名称(英文)', },
				{ validator: valitorNameEn },
				{ min: 1, max: 100, message: '规格名称字数不得大于100' }
			],
			nameCn: [
				// { required: true, message: '请填写规格名称(中文)'},
				{ validator: valitorNameCn },
				{ min: 1, max: 100, message: '规格名称字数不得大于100' }
			],
			customType: [
				{ required: true, message: '请选择定制规格类型' },
			],
			showType: [
				{ validator: showTypeRule },
				{ validator: numbers }
			],
			speValues: [
				{ required: true, message: '请配置规格信息', },
				{ validator: speValues },
			],
			plusPrice: [
				// {validator : plusPrice}
			]
		}
	)

	function rowDrop(ref, className, refresh) {
		nextTick(() => {
			data.sortable = Sortable.create(
				ref.value.$el.querySelector(
					'.body--wrapper>.vxe-table--body tbody'
				),
				{
					handle: className,
					onEnd: ({newIndex ,oldIndex ,item}) => {
						let rowId = item.getAttribute('rowid');
						let distance = newIndex - oldIndex
						let index =  data.tableData.findIndex(row => row.frontId == rowId)
						const currRow = data.tableData.splice(
							index,
							1
						)[0]
						data.tableData.splice(index + distance, 0, currRow)
						ref.value.reloadData(data.tableData);
					}
				}
			)
		})
	} // vxeTable 生成拖拽


	function filterStatus(val) {
		let x = data.statusList.find(v => v.value == val)
		return x.label
	} // 过滤定制规格类型

	function filterShowType(row) {
		const { customType, showType } = row
		let text
		if (customType == 2) {
			text = row.length
		}
		if (customType == 3) {
			text = '用户上传'
		}
		if (customType == 1) {
			if (showType == 1) text = '下拉'
			if (showType == 2) text = '展开'
		}
		return text
	}




	return {
		rowDrop,
		rules,
		filterStatus,
		filterShowType,

	}
}
