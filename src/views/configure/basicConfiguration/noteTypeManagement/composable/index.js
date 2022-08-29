
/*
 * @Descripttion: 
 * @version: 
 * @Author: 江澎涛
 * @Date: 2021-08-16 15:47:05
 * @LastEditors: 江澎涛
 * @LastEditTime: 2021-08-19 17:01:46
 */
import { ElMessage, ElMessageBox } from "element-plus"
import { typeList, typeDel,typeStatus,typeEdit,typeAdd} from '@/api/order/orderProcessing'
import moment from 'moment'

// 删除备注
export function delItem(row,state){
    ElMessageBox.confirm('确定删除该备注?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        typeDel({
            id: row.id,
            name: row.name
        }).then(res => {
            ElMessage.success('删除备注成功！')
            if (state.tableData == 1 && state.tableCurrent != 1) state.tableCurrent--
            getList(state)
        })
    })
}
// 获取列表
export function getList(state){
    const data = {
        enabled: state.value == "全部" ? '' : state.value == "已开启" ? 1 : 0,
        useScope:state.useScope,
        page: {
            pageNo: state.tableCurrent,
            pageSize: state.tableSize
        }
    }
    typeList(data).then(res => {
        state.tableData = res.data.dataList
        state.tableData.forEach(item => {
            item.enabled = item.enabled ? true : false
            item.pick = item.pick ? true : false
        })
        state.tableTotal = res.data.page.totalCount
    })
}
// 批量开启/关闭
export function batchStatus (value,state) {
    if (state.selectId.length == 0) { return ElMessage.error('请选择备注') }
    ElMessageBox.confirm(`是否批量${value?'开启':'关闭'}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(() => {
        typeStatus({
            ids: state.selectId,
            enabled: value
        }).then(res => {
            if (state.value != '全部' && state.selectId.length == state.tableData.length && state.tableCurrent > 1) state.tableCurrent--
            getList(state)
        })
    })
}

export function statusChange(row,state){
    ElMessageBox.confirm('是否改变状态?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(() => {
        typeStatus({
            ids: [row.id],
            enabled: row.enabled ? 0 : 1,
           
        }).then(res => {
            if (state.value != '全部' && state.tableData.length == 1 && state.tableCurrent > 1) {
                state.tableCurrent--
            }
            getList(state)
        })
    })
}

export function filterTime (e){
    return moment(e).format('YYYY-MM-DD HH:mm')
}

export function addEdit(state,emit){
    state.ref.validate().then(() => {
        //表单验证通过
        const data = {
            id: state.formData.id,
            name: state.formData.name,
            color: state.formData.color,
            word: state.formData.word,
            pick: state.formData.pick ? 1 : 0,
            enabled: state.formData.enabled ? 1 : 0,
            useScope:state.formData.useScope.join(',')
        }
        if (state.formData.id) {
            typeEdit(data).then(res => {
                emit('getTableData')
                state.newShow = false
            })
        } else {
            typeAdd(data).then(res => {
                emit('getTableData')
                state.newShow = false
            })
        }

    })
}