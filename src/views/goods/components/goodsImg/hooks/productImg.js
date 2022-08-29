import { getCurrentInstance, inject, watch } from 'vue'
export default function (data) {
	const { proxy } = getCurrentInstance()
	const skuRef = inject('skuRef')
	function preview(element, urlKey) {
		// console.log(data.previwList,element)
		if (data.previwList?.length > 0) {
			const Index = data.previwList.findIndex(v => {
				return v === element[urlKey]
			})

			Index ? (data.previwIndex = Index) : (data.previwIndex = 0)
			// console.log(data.previwIndex)
			data.showPreview = true
		}
	} // 预览

	function createId() {
		let timestamp = new Date().getTime()
		let num = parseInt((Math.random() * 9 + 1) * 10000)
		//console.log(timestamp+String(num))
		// console.log(num,timestamp,timestamp + num)
		return timestamp + num
	} // 生成随机id

	function testPictureId(pictureId, list = []) {
		return list.some(v => v.pictureId === pictureId)
	} // 校验id是否重复

	// function deleteItem(index) {
	//       data.imgList.splice(index, 1)
	//       getPreviwList(data.imgList, 'url')
	//   } // 删除

	function deleteValidate(testUrl) {
		return new Promise((reslove, reject) => {
			if (!skuRef) {
				reslove()
				return
			} // 当单纯调用组件图片时就不会存在sku的校验,就直接通过且删除
			const { radio, form, checked } = skuRef.value
			const { spes, coustom, skus } = form
			if (!checked) {
				reslove()
				return
			} // 当sku未勾选则直接通过且删除
			if (radio == 2) {
				// console.log(getImgList(skus,'speValues'))
				let x, y
				x = getImgList(spes, 'speValues')
				y = getImgList(skus)
				console.log(x, y, '==>xy')
				x && y ? reslove() : reject()
			} // 多规格
			if (radio == 3) {
				getImgList(coustom, 'speValues') ? reslove() : reject()
			}
			if (radio == 1) {
				reslove()
			}
			console.log(spes, skus)
		})

		function getImgList(arr, key) {
			let bole = true
			for (let i = 0; i < arr.length; i++) {
				let item = arr[i]
				;(function () {
					if (testUrl.indexOf(item.pictureId) !== -1) {
						return (bole = false)
					}
					if (key && item[key]?.length > 0) {
						bole = getImgList(item[key], key)
						console.log('递归==>', bole)
						// bole = getImgList(item[key], key);
					}
				})(i)
				if (!bole) return false
			}
			console.log(3, bole)
			return bole
		}
	} // 删除校验

	function deleteItem(index) {
		console.log(data.imgList[index])
		const { pictureId, url } = data.imgList[index]
		deleteValidate([pictureId])
			.then(res => {
				console.log('success')
				data.imgList.splice(index, 1)
				getPreviwList(data.imgList, 'url')
			})
			.catch(err => {
				console.log(err, '图片被使用')
				confirm(
					'当前图片正在被规格属性使用,删除后影响使用,确认要删除吗?',
					() => {
						data.imgList.splice(index, 1)
						delAttrImgWithSku([pictureId])
						getPreviwList(data.imgList, 'url')
					}
				)
			})
	} // 删除单张图片

	function delAttrImgWithSku(picIds = []) {
		const { radio, form, checked } = skuRef.value
		const { spes, coustom, skus } = form
		if (radio == 2) {
			// console.log(getImgList(skus,'speValues'))
			delImgList(skus, 'speValues')
			delImgList(spes, 'speValues')
			setSpesIsPhoto(spes)
		} // 多规格
		if (radio == 3) {
			delImgList(coustom, 'speValues')
			setSpesIsPhoto(coustom)
		}
		function setSpesIsPhoto(arr) {
			arr.forEach(item => {
				if (item.isPhoto === 1) {
					if (item.speValues?.some(v => !v.pictureId)) item.isPhoto = 0
				}
			})
		}
		function delImgList(arr, key) {
			for (let i = 0; i < arr?.length; i++) {
				let item = arr[i]
				if (picIds.indexOf(item.pictureId) !== -1) {
					item.img = null
					item.url = null
					item.pictureId = null
				}
				if (item[key]?.length > 0) {
					delImgList(item[key], key)
				}
			}
		}
	} //删除sku里用到的属性图片

	// function deleteAll () {
	//     if (data.selectedList.length > 0) {
	//         confirm('是否删除已勾选的图片?', () => {
	//             for (let i = data.imgList.length - 1; i >= 0; i--) {
	//                 let item = data.imgList[i]
	//                 if (item.checked) data.imgList.splice(i, 1)
	//             }
	//         })
	//     } else {
	//         proxy.$message.error('请勾选图片!')
	//     }
	// } // 批量删除
	function deleteAll() {
		if (data.selectedList.length > 0) {
			confirm('是否删除已勾选的图片?', () => {
				let arr = []
				let indexList = []
				for (let i = data.imgList.length - 1; i >= 0; i--) {
					let item = data.imgList[i]
					if (item.checked) {
						indexList.push(i)
						arr.push(item.pictureId)
						//  data.imgList.splice(i, 1)
					}
				}
				deleteValidate(arr)
					.then(res => {
						indexList?.map(item => {
							data.imgList.splice(item, 1)
						})
					})
					.catch(err => {
						// console.log("图片被使用");
						confirm(
							'选中的图片存在正在规格属性使用的图片,删除后影响使用,确认要删除吗?',
							() => {
								indexList?.map(item => {
									data.imgList.splice(item, 1)
								})
								delAttrImgWithSku(arr)
								getPreviwList(data.imgList, 'url')
							}
						)
					})
			})
		} else {
			proxy.$message.error('请勾选图片!')
		}
	} // 批量删除

	watch(
		() => data.imgList,
		newVal => {
			let selectedList = []
			newVal.forEach(item => {
				if (item.checked) selectedList.push(item)
			})
			data.selectedList = selectedList
			if (data.selectedList.length == data.imgList.length)
				data.isCheckedAll = true
			if (data.selectedList.length == 0) data.isCheckedAll = false
		},
		{
			deep: true
		}
	)

	function checkedAll(val) {
		data.imgList.forEach(item => (item.checked = val))
	} // 全选

	function showIndeter(selectedArry, list) {
		if (
			data[selectedArry]?.length > 0 &&
			data[selectedArry]?.length < data[list]?.length
		)
			return true
		return false
	}

	function getPreviwList(arr, urlKey) {

		data.previwList = []
		arr.forEach((item,index) => {

			if (data.previwList.indexOf(item[urlKey]) == -1) {
				data.previwList.push(item[urlKey])
			}
		})

		// console.log(data.previwList)
	} // 收集预览图片的列表

	function dragEnd() {
		data.drag = false
		getPreviwList(data.imgList, 'url')
	}

	function confirm(text, callback) {
		proxy
			.$confirm(text, '提示', {
				closeOnClickModal: false,
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
			.then(res => {
				callback()
			})
	} //封装的提示弹窗

	function thumbnailUrl(arr1, arr2) {
		arr1.forEach(item => {
			let x = arr2.find(v => {
				return checkName(item.url, v)
			})
			if (x && !item.thumbnailUrl) item.thumbnailUrl = x
		})
		function checkName(nameA, nameB) {
			if (getImgName(nameA) == getImgName(nameB)) return true
			return false
		}
	} // 填充压缩图

	function getImgName(path) {
		let filename
		let num = []
		if (path.indexOf('/') > 0) {
			//如果包含有"/"号 从最后一个"/"号+1的位置开始截取字符串
			filename = path.substring(path.lastIndexOf('/') + 1, path.length)
			for (let i = 0; i < filename.length; i++) {
				if (filename[i] === '_') num.push(i)
			}
			filename = filename.slice(0, num[2])
		} else {
			filename = path
		}
		return filename
	}

	function emitData() {
		proxy.$emit('update:modelValue', data.imgList)
	} // 通信

	function isNull(str) {
		if (str == '') return true
		var regu = '^[ ]+$'
		var re = new RegExp(regu)
		return re.test(str)
	} // 判断是否为空或者空格

	return {
		confirm,
		dragEnd,
		getPreviwList,
		showIndeter,
		checkedAll,
		deleteAll,
		deleteItem,
		preview,
		thumbnailUrl,
		emitData,
		isNull,
		createId,
		testPictureId
	}
}
