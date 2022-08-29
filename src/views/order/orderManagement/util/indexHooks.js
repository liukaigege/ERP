import  moment from 'moment'
let formatStart = 'YYYY-MM-DD 00:00:00',formatEnd = 'YYYY-MM-DD 23:59:59',formatNow = 'YYYY-MM-DD HH:mm:ss'
const orderIndexParmas = {
		1: [moment().format(formatStart),moment().format(formatNow)],//当前日期
		2: [moment().endOf('day').subtract(1, 'days').format(formatStart),moment().endOf('day').subtract(1, 'days').format(formatEnd)],//昨天日期
		3: function(){
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
		4:[moment().subtract(6,'days').format(formatStart),moment().format(formatNow)],// 0 -6 日
		5:[moment().subtract(11,'days').format(formatStart),moment().subtract(7,'days').format(formatEnd)],//6-11日,
		6:[moment().subtract(20,'days').format(formatStart),moment().subtract(12,'days').format(formatEnd)], // 11-20日
		7:function(){
			let start = moment().subtract(2,'month').format('YYYY-MM-01 00:00:00')
			let end = moment().format(formatNow)
			return [start,end];
		}
}



export   {
	orderIndexParmas
}
