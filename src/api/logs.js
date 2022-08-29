import request from '@/api/request.js'
import qs from 'qs'
const logApi = {
    checkLogs: '/logs/v1/sysLog/list',
}

// 根据userId查询用户操作日志  Author: 王新国
export function checkUserLogs(data) {
    return request({
        url: logApi.checkLogs,
        method: 'post',
        data: data
    })
}