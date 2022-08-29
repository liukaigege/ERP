/*
 * @Descripttion: Vango ERP
 * @version: 1.0
 * @Author: 朱涛（梅溪）
 * @Date: 2021-07-06 12:54:54
 * @LastEditors: 朱涛
 * @LastEditTime: 2021-08-26 09:31:16
 */
import { ElMessage, ElMessageBox } from 'element-plus'
import  moment from 'moment'
import { v } from 'vxe-table'
export class TableTools {
    constructor(props) {
        if (props) this.refs = props
    }
    selectTableAll(data, flag) {
        for (let i = 0; i < data.length; i++) {
            this.refs.toggleRowSelection(data[i], flag)
            if (data[i].children != undefined) {
                this.selectTableAll(data[i].children, flag)
            }
        }
    }

    delItem(data, value, itemName) {
        for (let i = 0; i < data.length; i++) {
            let item = data[i][itemName]
            // 获取用来校验的值 ,itemName 是键值名
            if (item === value) {
                data.splice(i, 1)
                return false
            }
            if (data[i].children !== undefined && data[i].length > 0) {
                data[i].children = this.delItem(data[i].children, itemName, value)
            }
        }
        return data
    } // 递归删除table某一项
}
export class createFileName {
    constructor(props) {
        const { moduleName, type } = props
        this.moduleName = moduleName // 模块名
        this.type = type
    }
    createImportFileName = () => {
        return `${this.type}/${this.moduleName}/${this.createDate()}/${this.createTime()}_${this.moduleName}_${this.createMathNums(0, 10000)}`
    } // 生成导入文件的文件名

    createMathNums = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1) + min)
    } //生成随机数
    createTime = () => {
        var date = new Date()
        let hour = String(date.getHours()).length == 2 ? String(date.getHours()) : ('0' + String(date.getHours()))
        let minu = String(date.getMinutes()).length == 2 ? String(date.getMinutes()) : ('0' + String(date.getMinutes()))
        let sec = String(date.getSeconds()).length == 2 ? String(date.getSeconds()) : ('0' + String(date.getSeconds()))
        return hour + minu + sec
    } // 获取时分秒
    createDate = () => {
        var date = new Date()
        let yy = String(date.getFullYear())
        let mm = String(date.getMonth()).length == 2 ? String(date.getMonth() + 1) : ( date.getMonth() + 1 === 10 ? String(date.getMonth() + 1) : '0' + String(date.getMonth() + 1))
        let dd = String(date.getDate()).length == 2 ? String(date.getDate()) : ('0' + String(date.getDate()))
        return yy + mm + dd
    } // 获取日期
}
export function type(para) {
    return Object.prototype.toString.call(para)
}

export function resetForm(form, filterForm) {
    for (var i in form) {
        if (type(form[i]) == '[object Array]' || type(form[i]) == 'Array') {
            form[i] = new Array()
        } else {
            form[i] = null
        }
        if (filterForm) form[i] = filterArr(i, form[i])
    }

    function filterArr(index, item) {
        let keyArr = Object.keys(filterForm)
        if (keyArr.includes(index)) {
            return filterForm[index]
        } else {
            return item
        }
    } // 如果有需要保留的值即可以同样的键值名 加需要保留的值 以对象方式传进来替换
    return form
} // 清空对象

export function showPermission(orderTabType, testOrderType, per) {
    let bole = true
    if (per) { } //权限校验模块
    if (orderTabType && testOrderType) {
        if (orderTabType !== testOrderType) bole = false
    }

    return bole
} // 根据权限和orderTabType 来决定是否显示

// 数组排序 Author: 王新国 (支持字符串排序，以编码顺序排序)
export function sortFn(arr, sortKey = 'orderNum') {
    if (arr.length == 0) return arr
    if (arr.filter(v => v[sortKey])) {
        arr.sort(function (a, b) {
            return a[sortKey] - b[sortKey]
        })
    } else {
        arr = arr.sort()
    }
    return arr
}

// 将list转为树状结构 Author: 王新国
//   function toTree(data, key, sortKey) {
//     key = key || 'deptId'
//     sortKey = sortKey || key
//     data = sortFn(data,sortKey);
export function toTree(data, key, parentId = 0) {
    key = key || 'deptId'
    sortFn(data)
    let result = []
    if (!Array.isArray(data)) {
        return result
    }
    if (data.length == 1) {
        return (result = data)
    }
    data.forEach(item => {
        // console.log(item,item.parentId)
        if (item.parentId === parentId) {
            // 递归寻找

            item.children = toTree(data, key, item[key])
            result.push(item)
        }
    })

    return result
}

/* 将树状结构转为list数组 Author: 王新国
 * 使用方法 [...treeToArr(treeArr,'children',true)]
 * 参数1：treeArr 需要转换的 树状结构数据 数据类型为Array       ==>必传项
 * 参数2：children 子集键名 数据类型为String                   ==>可传可不传，默认为children为子集键名
 * 参数3：完成转换后是否删除children子集 数据类型为Boolean      ==>可传可不传，默认为false，默认不删除子集
 */
export function* treeToArr(treeArr, children, deleteChildren) {
    children = children || 'children'
    deleteChildren = deleteChildren || false
    for (let item of treeArr) {
        let newItem = deepClone(item)
        delete newItem[children]
        yield newItem
        if (item[children] && item[children].length)
            yield* treeToArr(item[children])
    }
}

//将数组转树状结构，最后一层为list键名，特定场合使用 Author: 王新国
export function childrenToList(treeArr, key) {
    key = key || 'deptId'
    let result = []
    if (!Array.isArray(treeArr)) {
        return result
    }
    let map = {}
    treeArr.forEach(item => {
        if (item.menuType != 'F' && item.menuType != 'D') {
            delete item.children
            map[item[key]] = item
            let parent = map[item.parentId]
            if (parent) {
                ;
                (parent.children || (parent.children = [])).push(item)
            } else {
                result.push(item)
            }
        } else if (item.menuType == 'D') {
            delete item.children
            delete item.textList
            map[item[key]] = item
            let parent = map[item.parentId]
            if (parent) {
                ;
                (parent.textList || (parent.textList = [])).push(item)
            } else {
                result.push(item)
            }
        } else {
            delete item.children
            delete item.list
            map[item[key]] = item
            let parent = map[item.parentId]
            if (parent) {
                ;
                (parent.list || (parent.list = [])).push(item)
            } else {
                result.push(item)
            }
        }
    })
    return result
}

// 深拷贝 支持多层级数据深拷贝 Author: 王新国  注意：数组不可用此方法（主要使用deepCopy方法，deepClone方法用于多层对象的深拷贝）
export function deepClone(x) {
    const returnData = {}
    const loopList = [{
        parent: returnData,
        key: undefined,
        data: x
    }]
    while (loopList.length) {
        const node = loopList.pop()
        const parent = node.parent
        const key = node.key
        const data = node.data
        let res = parent
        if (typeof key !== 'undefined') {
            res = parent[key] = {}
        }
        for (let k in data) {
            if (data.hasOwnProperty(k)) {
                if (typeof data[k] === 'object') {
                    loopList.push({
                        parent: res,
                        key: k,
                        data: data[k]
                    })
                } else {
                    res[k] = data[k]
                }
            }
        }
    }
    return returnData
}

// 深拷贝 支持多层级数据深拷贝 Author: 王新国 通用，数组和对象都可以用
export function deepCopy(obj) {
    var result = Array.isArray(obj) ? [] : {}
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (typeof obj[key] === 'object' && obj[key] !== null) {
                result[key] = deepCopy(obj[key]) // 递归复制
            } else {
                result[key] = obj[key]
            }
        }
    }
    return result
}

// 禁止页面后退 Author: 韦剑
export function notAllowRouter() {
    history.pushState(null, null, document.URL);
    window.addEventListener('popstate', function () {
        history.pushState(null, null, document.URL);
    })
}

/*正则校验  Author: 王新国
 * 第一个参数 dataStr ==> 需要校验的字符串   类型：字符串
 * 第二个参数 type ==> 校验的分类   类型：字符串    可选值：'email'=>邮箱  'userName'=>用户名  'mobileNumber'=>手机号码 'roleName'=>角色名
 */
export function patternFn(dataStr, type) {
    let patternData = {
        email: /^\w+@\w+(\.\w+)+$/, //邮箱
        userName: /^[\s\u4e00-\u9fa5_a-zA-Z0-9_-]{2,16}$/, //用户名(中国人用)
        mobileNumber: /^((1[3,4,7,6,9,5,8,9][0-9]))\d{8}$/, //手机号码(国内手机号)
        roleName: /^[\s\u4e00-\u9fa5_a-zA-Z0-9_-]{2,16}$/, //角色名
        shinpping: /^[A-Za-z0-9]+$/, //运单号(数字+字母)
        postCode: /[\sa-zA-Z0-9]{1,40}/, //邮编（文本，数字、大写英文字母，最大40个字）
        taxNumber: /[\sa-zA-Z0-9]{1,30}/, //税号数字+大小写字母，最大30个字
        name: /[\sa-zA-Z]{1,60}/, //英文姓名(最大60个字)（外国人用）
        phone: /[0-9 -+()#]{1,60}$/, //国外电话：包含数字、+ - ( ) # 空格，最大60个字
        weght: /^[0-9]+(.[0-9]{0,5})?$/, //重量正则，5位有效小数
        webUrl: /^((http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?)/,//网址正则
    }
    if (patternData[type].test(dataStr)) {
        return true
    } else {
        return false
    }
}

/*播放音频文件封装 Author: 王新国
 *第一个参数 audioUrl 音频文件路径 字符串
 *第二个参数 timeStamp 播放时长 毫秒数 默认3000毫秒
 */
export function audioPlay(audioUrl, timeStamp) {
    var body = document.getElementsByTagName("body")[0];
    var audio = document.createElement("audio");
    audio.setAttribute("id", "awardAudio");
    audio.setAttribute("autoplay", "autoplay");
    audio.setAttribute("src", audioUrl);
    body.appendChild(audio);
    setTimeout(function () {
        body.removeChild(audio);
    }, timeStamp);
}

//将字符串中的字标记为红色 Author: 王新国
export function reRed(str,arr){
	arr.forEach(v => {
		str = str.replace(v,'<span style="color:#F56C6C">' + v + '</span>')
	});
	return str
}


//打印proxy数据，方便调试(上线可去除) Author: 王新国
export function print(obj, str) {
    return console.log(str || '', JSON.parse(JSON.stringify(obj)))
}

// 防抖 Author: 韦剑
export function _debounce(fn, time = 500) {
    let timer = null
    return function (...args) {
        let that = this
        if (timer) clearTimeout(timer)
        timer = setTimeout(() => {
            fn.call(that, ...args)
        }, time);
    }
}


export function debounce(callBack) {
    let timer = null
    return function () {
        if (timer) clearTimeout(timer)
				let callNow = !timer
				timer = setTimeout(() => {
					timer = null
				}, 1000)
			if (callNow) callBack()
    };
}
// 防抖函数 Author: 朱涛


export function duplicate(array) {
    let obj = {}
    return array.filter((item, index) => {
        // 防止key重复
        let newItem = item + JSON.stringify(item)
        return obj.hasOwnProperty(newItem) ? false : obj[newItem] = true
    })

} // js 二维数组去重


export function confirm(text, callback,cancelCall) {
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

export function changeNull(val) {
    for (var i in val) {
        if (val[i] === '') val[i] = null
    }
    return val

}


export function copy(val){
    const textarea = document.createElement('textarea')
    textarea.readOnly = 'readonly'
    textarea.style.position = 'absolute'
    textarea.style.left = '-9999px'
    textarea.value = val
    document.body.appendChild(textarea)
    textarea.select()
    const result = document.execCommand('Copy')
    if (result) {
        ElMessage.success('复制成功') // 可根据项目UI仔细设计
    }
    document.body.removeChild(textarea)
}

 export function isObjectValueEqual(o1, o2) {
    //两个对象是否一样
    var props1 = Object.getOwnPropertyNames(o1)
    var props2 = Object.getOwnPropertyNames(o2)
    if (props1.length != props2.length) {
      return false
    }
    for (var i = 0, max = props1.length; i < max; i++) {
      var propName = props1[i]
      if (JSON.stringify(o1[propName]) !== JSON.stringify(o2[propName])) {
        console.log('内容比较有误==>',o1[propName],o2[propName])
        return false
      }
    }
    return true
  }

  export function findPathbyId(tree, id, path) {
      if (typeof path == 'undefined') {
          path = []
      }
      for (let i = 0; i < tree.length; i++) {
          let tempPath = [...path]
          tempPath.push(tree[i].id)
          if (tree[i].id === id) {
              return tempPath
          }
          if (tree[i].child) {
              let reuslt = findPathbyId(tree[i].child, id, tempPath)
              if (reuslt) {
                  return reuslt
              }
          }
      }
  }
  //  生成随机索引唯一标识 Author: 韦剑
export function getuuid() {
  var s = []
  var hexDigits = '0123456789abcdef'
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
  }
  s[14] = '4' // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = '-'
  var uuid = s.join('')
  return uuid
}

// 场景：使用Object.assign时目标对象会被赋值某些自己没有而源对象有的属性
// usefulKeys 需要保留的源对象的属性值
export function assignTool(target, source, usefulKeys = [], insertObj = {}) {
  Object.keys(target).forEach(key => target[key] = source[key])
  usefulKeys.forEach(k => target[k] = source[k])
  Object.keys(insertObj).forEach(y => target[y] = insertObj[y])
  return target
}

// 很多SKU后端给json字符串，此函数解析返回拼接好可直接展示
export function skuShow(jsonStr){
    const jsonData = JSON.parse(jsonStr)
    if(jsonData){
        let str = ''
        jsonData.forEach(v=>{
            str += `${v.spe || v.speEn}:${v.speVal || v.speValEn} `
        })
        return str
    }
}
export function createId() {
	let timestamp = new Date().getTime()
	let num = parseInt((Math.random()*9+1) * 10000)
	// console.log(num)
	//console.log(timestamp+String(num))
	return timestamp + num
} // 生成随机id

export function printFail(cb){
	ElMessageBox.alert(
		'<p>请务必确认打印过程中是否出现以下情况？确定打印失败包裹会继续停留在当前状态以便再次打印！</p><p style="text-indent: 13px">1.pdf预览页面未弹出</p><p style="text-indent: 13px">2.pdf预览弹出但内容异常</p><p style="text-indent: 13px">3.在pdf预览页面点击打印后打印机未能正常打印或打印过程中出现异常</p><p style="font-weight: bold">若正常弹出pdf预览且打印机已正常打印请点击取消返回弹框点击打印完成，否者会出现面单多打的情况！</p>',
		'打印失败告警确认',
		{
			customStyle:'width:auto',
			type:'warning',
			dangerouslyUseHTMLString: true,
			showCancelButton	: true,
			confirmButtonText: '确定',
			cancelButtonText: '取消',
		}
	).then(()=>{
		cb()
	})

} // 打印面单二次确认弹框

// 格式化定制属性
export function renderCustomInfo(list = [], type = 1) {
	if (type == 1) {
		let str = ''
		list.forEach(v => str += `${v.field}:${v.value}`)
		return str
	} else {
		let arr = []
		list.forEach(v => {
			arr.push(v)
			if (v.subOptions) arr = [...arr, ...v.subOptions]
		})
		return arr
	}
}

// 是否是属于图片链接
export function isImgString(str = "") {
	const imgTypeList = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.jfif']
	return imgTypeList.some(item=> str.indexOf(item) > -1 && (str.indexOf('https://') > -1 || str.indexOf('http://') > -1))
}


let formatStart = 'YYYY-MM-DD 00:00:00',formatEnd = 'YYYY-MM-DD',formatNow = 'YYYY-MM-DD HH:mm:ss'
const orderIndexParmas = {
		1: [moment().format(formatStart),moment().format(formatEnd)],//当前日期
		2: [moment().endOf('day').subtract(1, 'days').format(formatStart),moment().endOf('day').subtract(1, 'days').format(formatEnd)],//昨天日期
    3: [moment().endOf('day').subtract(3, 'days').format(formatStart),moment().endOf('day').subtract(1, 'days').format(formatEnd)],//三日日期
    4: [moment().endOf('day').subtract(7, 'days').format(formatStart),moment().endOf('day').subtract(1, 'days').format(formatEnd)],//近七天
    7: function(){
			let start  = moment().day(-1).format(formatStart)
			let end  = moment().format(formatNow)
			const days = moment().format('E')
			console.log(days)
			if(['0','6'].includes(days)){
				start = moment().day(6).format(formatStart)
				console.log(start)
			}
			return [start,end]
		}, // 本周日期
}
export {orderIndexParmas}
