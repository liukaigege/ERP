import { reactive, toRefs,ref } from 'vue'
import { ElMessage } from 'element-plus'
import {
    deleteStaion, //删除岗位信息
    checkStation //岗位删除校验
} from '@/api/user.js'
export const state1 = reactive({
    selectionAll:[],
    check: '1', //删除的标志
    cancelId: '', //表格的ID值
    cancelType: '', //用来区分是批量删除还是单选删除
    cancelList: false,
    dialogRemarks: false, //控制删除弹框显示
    message: '此操作将删除当前所选中岗位，是否继续？',
    multipleSelection: [],
})
  //表格的删除
export function del(val) {
    state1.cancelType = '2'
    state1.cancelId = val

    let params = {
        postIds: [state1.cancelId]
    }
    checkStation(params)
        .then(res => {
            console.log(res,'545555');
            if (res.code == 200) {
                state1.dialogRemarks = true
                state1.cancelList = false
                state1.message = '此操作将删除当前所选中岗位，是否继续？'
                state1.check = '1' 
            }
        })
        .catch(err => {
            console.log(err,'88888');
            
            state1.dialogRemarks = true
            state1.cancelList = true
            state1.message =
                '当前所选中的岗位下还有未处理的数据，请处理后再进行删除操作'
            state1.check = '2'
            // ElMessage.error(err.message)
            console.log(state1.message,'msg');
        })
}
//表格的多选框
export function handleSelectionChange (e){
    state1.selectionAll=e
    console.log(e,'selection')
    state1.multipleSelection = []
    e.forEach(v => {
      state1.multipleSelection.push(v.postId)
    })
  }
export  function deleteList(val) {
    //批量删除
    state1.cancelType = '1'
    let params = {
        postIds: state1.multipleSelection
    }
    checkStation(params)
        .then(res => {
            if (res.code == 200) {
                state1.dialogRemarks = true
                state1.cancelList = false
                state1.message = '此操作将删除当前所选中岗位，是否继续？'
                state1.check = '1'
            }
        })
        .catch(err => {
            state1.dialogRemarks = true
            state1.cancelList = true
            state1.message =
                '当前所选中的岗位下还有未处理的数据，请处理后再进行删除操作'
            state1.check = '2'
        })
}