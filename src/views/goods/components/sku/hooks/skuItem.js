import { getCurrentInstance,inject} from 'vue'
import {ElMessage}  from 'element-plus'
import { baiduTranslate } from '@/utils/translate'
import { speList } from '../../../../../api/goods/addGoods'
import { ElMessageBox } from 'element-plus'
export default function(data = {}) {
    const { proxy } = getCurrentInstance()
  	const routeName = inject('routeName')
    function createId() {
        let timestamp = new Date().getTime()
				let num = parseInt((Math.random()*9+1) * 10000)
				// console.log(num)
            //console.log(timestamp+String(num))
        return timestamp + num
    } // 生成随机id


    function confirm(text, callback,cancelCall) {
			ElMessageBox.confirm(text, '提示', {
                closeOnClickModal : false,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
            .then(res => {
                callback()
            })
          .catch(err => {
            cancelCall()
            })
    } //封装的提示弹窗

    function showIndeter(selectedArry, list) {
        if (
            data[selectedArry]?.length > 0 &&
            data[selectedArry]?.length < data[list]?.length
        ) return true

        return false
    } // 控制全选的checkbox样式


    function leftDragStart(val) {} // 左侧拖拽开始

    function leftDragEnd(val, rightList, isParts) {
        /**
         * val 拖拽返回的参数
         * rightList 需要根据当前拖拽体 匹配的数据的 在data中的字段名,
         * isParts 是否是开启配件的, 定制规格中有开启配件,需要额外处理
         */
        const { oldIndex, newIndex } = val
        let rightOld = isParts ? data[rightList][isParts][oldIndex] : data[rightList][oldIndex]
        let rightNew = isParts ? data[rightList][isParts][newIndex] : data[rightList][newIndex]
        if (rightOld && rightNew) {
            if (isParts) { // 配件是否开启, 定制规格有配件开启
                data[rightList][isParts].splice(oldIndex, 1)
                data[rightList][isParts].splice(newIndex, 0, rightOld)
            } else {
                data[rightList].splice(oldIndex, 1)
                data[rightList].splice(newIndex, 0, rightOld)
            }

        }
    } // 左侧拖拽结束,右侧图片匹配对应位置


    function getSkuVal(leftList, rightList) {

        let left = data[leftList]
        let right = data[rightList] // 图片列表
				console.log(left,right)
        left?.forEach((item, index) => {
            if (right[index]) {
                item.url = right[index].url
                item.pictureId = right[index].pictureId
								item.pictureType = right[index].pictureType || 0
								// item.photoId = right[index].photoId || null
            }else{
							item.url = null
							item.pictureId = null
						}


            // if(item.nameCn &&  !item.nameEn){
            //     item.nameEn = item.nameCn
            // }
						//
            // if(item.nameEn && !item.nameCn){
            //     item.nameCn= item.nameEn
            // }


        })
        const { name, photoId, showType, isPhoto,commonSpeId,id } = data.form
        const element = {
            frontId: createId(),
            nameEn: name.en ,
            nameCn: name.cn ,
            isPhoto,
            showType,
            commonSpeId,
            id,
            speValues: left || []
        }

        return element
    } // 统计组合当前规格的数据


    function setDetail(v) {
        const { frontId, nameEn, nameCn, isPhoto, showType, speValues, commonSpeId,id } = v
        speValues?.forEach(item => {
            if (item.url ) {
                let imgItem = {
									  pictureId:item.pictureId,
										id: frontId,
										// photoId:item.photoId || null,
                    url: item.url,
                }
                data.imgList.push(imgItem)
            }
        })
			console.log(speValues,'==>')
        data.form = {
            language: 'en',
            name: {
                cn: nameCn,
                en: nameEn,
            },
            isPhoto,
            showType,
            photoId: null,
            commonSpeId,
            id
        }
        data.skuValue = speValues
        if(commonSpeId){
            data.speList.map(item => {
              if (item.id == commonSpeId) data.selectSpeValue = item.valueList
          })
        }
    } // 设置多规格回显


    function checkAgainData(arr, o = {}, Findex) {
        let r = {
            bole: true,
            message: null
        }
        let hash = {}
        for (let i = 0; i < arr.length; i++) {
            if (hash[arr[i][o.key]]) {
                r.bole = false
                if (Findex) {
                    r.message = `第${Findex || 1}个规格的第${i + 1}个参数的'${o.desc}'数据重复,请修改!`
                } else {
                    r.message = `第${i + 1}个参数的'${o.desc}'数据重复,请修改!`
                }
                return r
            }
            if(arr[i][o.key]) hash[arr[i][o.key]] = true
        }
        return r
    } // 判断数组中是否有重复参数

    function checkDataIsNull(arr, Findex = 1) {
			console.log(routeName)
        const { isPhoto, name } = data.form
        let r = {
            bole: true,
            message: null
        }
				if(routeName === 'goodsPublishDeatil' && !name.en){
					r.bole = false
					r.message = `请填写第${Findex}个规格的名称!`
					return r
				}

        if (!name.cn && !name.en) {
            r.bole = false
            r.message = `请填写第${Findex}个规格的名称!`
            return r
        } // 规格名称必填

        if (arr.length == 0) {
            r.bole = false
            r.message = `请填写第${Findex}个规格的参数!`
            return r
        }

        if (arr) {
            let index = 0
            let bole = arr.every((v, i) => {
							if(routeName === 'goodsPublishDeatil' && !v.nameEn){
								index = i
								return false
							}
							if (!v.nameEn && !v.nameCn) {
                    index = i
                    return false
                }
                return true
            })
            if (!bole) {
                r.bole = bole
                r.message = `请填写第${Findex}个规格的第${index + 1}个参数的名称`
            }

        }
        if (isPhoto) {
            if (data.imgList?.length !== arr?.length) {
                r.bole = false
                r.message = `第${Findex}个规格的图片数量需要和参数数量一致!`
            }
            return r
        } // 图片数量需要和参数数量一致


        return r


    } // 检验规格是否有未填项


  function checkCoustomDataIsNull(coustom, imgList, isShowImg) {
        let r = {
            bole: true,
            message: null
        }
        if (coustom?.length == 0) {
            r.bole = false
            r.message = `请添加规格参数!`

        }

        if (coustom) {
            let index = 0
            let bole = coustom.every((v, i) => {
							if (!v.nameEn && routeName === 'goodsPublishDeatil') {
								index = i
								return false
							}
                if (!v.nameEn && !v.nameCn) {
                    index = i
                    return false
                }
                return true
            })
            if (!bole) {
                r.bole = bole
                r.message = `请填写第${index + 1}个参数的名称!`
            }

        }

    if (isShowImg == 1) {
            if (imgList?.length !== coustom?.length) {
                r.bole = false
                r.message = `图片数量需要和参数数量一致!`
            }

        } // 图片数量需要和参数数量一致

        return r


    } // 校验定制规格的参数是否有未填项


    function submitCoustom(query) {
        const { imgList, coustom, isShowImg } = query
        return new Promise((resolve, reject) => {
            let r
          r = checkCoustomDataIsNull(coustom, imgList, isShowImg)
            if (r.bole) {
                r = checkAgainData(coustom, { key: 'nameCn', desc: '中文名称' })
            }
            if (r.bole) {
                r = checkAgainData(coustom, { key: 'nameEn', desc: '英文名称' })
            }
            const { bole, message } = r
            if (bole) {
                resolve()
            } else {
                proxy.$message.error(message)
                reject()
            }
        })
    } // 配置定制信息提交校验


    function createCoustomSpes(coustom, imgList) {
        coustom.forEach((item, index) => {
            if (imgList[index]) {
                item.url = imgList[index].url
            }
        })
        return coustom
    } // 生成定制规格Spes



    function createSku(x) {
        let list = []
        x.map(item => {
            console.log(item.speValues)
            list.push(item.speValues)
        })

        function calcDescartes(array) {
            if (array.length < 2) {
                return array[0]?.map(item => {
                    return [item]
                }) || []
            }
            return array?.reduce((total, currentValue) => {
                let res = [];
                total?.forEach(t => {
                    currentValue.forEach(cv => {
                        if (t instanceof Array) // 或者使用 Array.isArray(t)
                            res.push([...t, cv]);
                        else
                            res.push([t, cv]);
                    })
                })
                return res;
            })
        }


        return calcDescartes(list)


    } // 通过笛卡尔积生成sku


    function supplementData(arr, key1, key2, child) {
        function sup(arr) {
            arr?.forEach(item => {
                // if (item[key1] && !item[key2]) item[key2] = item[key1]
                // if (item[key2] && !item[key1]) item[key1] = item[key2]
								//中英文互补
                if (item[child]?.length > 0) {
                    item[child] = sup(item[child])
                }
            })
            return arr
        }
        return sup(arr)

    } // 补充规格数据 中英文

    function cancel() {
        proxy.$emit('cancel')
    } // 关闭弹窗

    function changeSpe(val) {
        data.speList.map(item => {
            // console.log(item)
            if (item.id == val) data.selectSpeValue = item.valueList
        })
    } // 切换常用规格


	function translateSkuItem(query,cb){
			/**
			 * query :{
			 *   isShowEn, 是否展示英文文
			 *   isShowCn  是否展示中文
			 *   isDisabled // 是否统一不可编辑
			 *   nameDisabled // 名称是否可编辑
			 * }
			 * */
			const {to,from,isShowEn,isShowCn,nameDisabled} = query
			if(nameDisabled) return ElMessage.error('当前sku不可编辑')
			if((to==='zh' && !isShowCn) || nameDisabled)  return ElMessage.error('当前不可翻译为中文')
			if((to==='en' && !isShowEn) || nameDisabled)  return ElMessage.error('当前不可翻译为英文')
			let arr = data.skuValue.filter(v=>!v.commonSpeValId) // 过滤常用规格

		let bole = arr.some(v=>{
			let q = from ==='zh' ? v.nameCn : v.nameEn
			if(!q) return true
		})

		if(bole || arr?.length ===0) {
			cb()
			ElMessage.error('当前有空的规格,请补充')
			return
		}

			let promiseList = arr?.map(v=>{
					let q = from ==='zh' ? v.nameCn : v.nameEn
					return baiduTranslate(q,from,to,false)
			})
		if(promiseList?.length ===0) return
			Promise.all(promiseList).then(res=>{
				let types = to === 'zh' ? 'nameCn' :'nameEn'
				if(res?.length === promiseList.length){
					ElMessage.success('翻译成功')
						res.forEach((item,index)=>{
							arr[index][types] = item.str
						})
					data.skuValue.forEach(v=>{
						let findItem = arr.find(i=> i.frontId === v.frontId)
						if(findItem) v = findItem
					})
				}else{
					ElMessage.error('规格值翻译出错!')
				}
					cb()
			})

	} // 添加规格的翻译




    return {
        createId,
        confirm,
        showIndeter,
        leftDragStart,
        leftDragEnd,
        getSkuVal,
        setDetail,
        checkAgainData,
        checkDataIsNull,
        createSku,
        supplementData,
        checkCoustomDataIsNull,
        submitCoustom,
        createCoustomSpes,
        cancel,
        changeSpe,
				translateSkuItem
    }
}
