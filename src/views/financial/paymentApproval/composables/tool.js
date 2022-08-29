import { deepCopy } from '@/utils/tool'
// 判断时间是否超时
export function timeLimt(data = '2021-11-25 17:09:00', time) {
	const inTimestamp = new Date(data).getTime() //传入时间戳
	const nowTimestamp = new Date().getTime() //当前时间戳
	if (inTimestamp + (1 * 24 * 60 * 60 * 1000) >= nowTimestamp) {
		return true
	} else {
		return false
	}
}

export function recombination(list) {
	const newData = []
	list.forEach(v => {
		v.mergeStatus = false
		v.active = false
		newData.push(deepCopy(v))
		if (v.checkStatus === '0' && v.reason) {
			let tempV = deepCopy(v)
			tempV.mergeStatus = true
			newData.push(deepCopy(tempV))
		}
	})
	return newData
}

// 跳转过来带的状态及搜索内容
function getDay(type = 0) {
	var timenow = new Date();
	timenow.setDate(timenow.getDate() - type); //设置天数 -type 天，昨天的日期
	var y = timenow.getFullYear();//年
	var m = timenow.getMonth() + 1;//月
	m = m < 10 ? '0' + m : m;
	var d = timenow.getDate();//日
	d = d < 10 ? ('0' + d) : d;
	var _thisTime = y + '-' + m + '-' + d;//字符串拼接成自己想要的时间格式，现在是yyyy/mm/dd格式
	return _thisTime;
}
export function paramsQuery(paramsId, data) {

	switch (paramsId) {
		case 1:
			// '已审核-今日审核'
			data.timeType = 4
			data.start_end = [getDay(), getDay()]
			break;
		case 2:
			// '已审核-今日审核-已付款'
			data.timeType = 4
			data.start_end = [getDay(), getDay()]
			data.result = 1
			break;
		case 3:
			// '已审核-今日审核-已打回'
			data.timeType = 4
			data.start_end = [getDay(), getDay()]
			data.result = 0
			break;
		case 4:
			// '已审核-昨日审核'
			data.timeType = 4
			data.start_end = [getDay(1), getDay(1)]
			break;
		case 5:
			// '已审核-昨日审核-已付款'
			data.timeType = 4
			data.start_end = [getDay(1), getDay(1)]
			data.result = 1
			break;
		case 6:
			// '已审核-昨日审核-已打回'
			data.timeType = 4
			data.start_end = [getDay(1), getDay(1)]
			data.result = 0
			break;
		case 7:
			// '已审核-近3日审核'
			data.timeType = 4
			data.start_end = [getDay(3), getDay(1)]
			break;
		case 8:
			// '已审核-近3日审核-已付款'
			data.timeType = 4
			data.start_end = [getDay(3), getDay(1)]
			data.result = 1
			break;
		case 9:
			// '已审核-近3日审核-已打回'
			data.timeType = 4
			data.start_end = [getDay(3), getDay(1)]
			data.result = 0
			break;
		case 10:
			// '待审核-历史新增'
			data.start_end = ['2000-01-01', getDay(1)]
			break;
		case 11:
			// '待审核-今日新增'
			data.start_end = [getDay(), getDay()]
			break;
		default:
		// 默认搜索条件
	}
	return data
}

export function settlementRender(row){
	if(!row.settlementType) return ''
	let str = ''
	const tyleList = [{
		value:1,
		label:'预付'
	},{
		value:2,
		label:'账期'
	},{
		value:3,
		label:'货到付款'
	},{
		value:4,
		label:'款到发货'
	}]
	// settlementType 结算方式（1：预付、2：账期、3：货到付款、4：款到发货）
	str += tyleList.filter(v=>v.value == row.settlementType)[0]?.label
	// settlementValue 结算值（金额/到账日期）
	// settlementUnit 结算单位（1：%，2：元）
	if(row.settlementType ==1){
		if(row.settlementUnit ==1 ){
			str += `（${row.settlementValue}）%`
		}else{
			str += `（${row.settlementValue}）元`
		}
	}else if(row.settlementType ==2){
		str += `（${row.settlementValue}）天`
	}
	return str
}
