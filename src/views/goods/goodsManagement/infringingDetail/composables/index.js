import { reRed } from '@/utils/tool.js'
import { examine } from './api.js'
import { ElMessage } from 'element-plus'
export function strToArr(str, list = []) {
    let arr = []
    if (str) {
        arr = str.split(',') || []
        if (list.length) arr.forEach(v => { v = reRed(v, list) })
    }
    return arr
}
// '|'分割
export function strToArray(str) {
    let arr = []
    if (str) {
        arr = str.split('|') || []
    }
    return arr
}
// 审核侵权商品
export function infringingFn(data) {
    // if(!data.explains) return ElMessage.warning({ message: '请填写审核说明' })
    examine(data)
        .then(res => {

            ElMessage.success({ message: '操作成功' })
        })
       
}
