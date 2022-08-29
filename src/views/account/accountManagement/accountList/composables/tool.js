//时间选择器只能选择180天内的时间
export function disabledDate(time, timeSlot = 180, newDate = false) {
    let nowTimeStamp = newDate ? newDate.getTime() : new Date().getTime()
    let MaxTimeStamp = timeSlot * 24 * 3600 * 1000
    let differenceTimeStamp = nowTimeStamp - MaxTimeStamp
    if(newDate){
        return time.getTime() > Date.now() || time.getTime() < differenceTimeStamp || time.getTime() > nowTimeStamp + MaxTimeStamp
    }else{
        return time.getTime() > Date.now() || time.getTime() < differenceTimeStamp
    }
}