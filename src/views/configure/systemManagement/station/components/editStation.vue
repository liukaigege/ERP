
<template>
  <el-dialog
    :title="routerType == 1 ? '编辑岗位' : '新增岗位'"
    width="580px"
    v-model="centerDialogVisible"
    :close-on-click-modal="false"
    :before-close="close"
  >
    <el-form
      :model="form"
      :ref="formRef"
      :inline="true"
      
      label-width="80px"
      :rules="rules"
    >
      <!-- 菜单标题 -->
      <el-form-item label="名称:" prop="postName">
        <el-input
          v-model="form.postName"
          style="width: 445px"
          placeholder="请输入名称"
        />
      </el-form-item>

      <el-form-item label="状态:" prop="status">
        <el-radio v-model="form.status" label="0">启用</el-radio>
        <el-radio v-model="form.status" label="1" :disabled="disabledButton">停用</el-radio>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button  @click="close">取 消</el-button>
        <el-button  type="primary" @click="submitForm" 
          >确 定</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>
<script>
import { ElMessage } from 'element-plus'
import { reactive, toRefs, ref, toRaw } from 'vue'
import elSelectTree from '@/components/elSelectTree/index.vue'
import {
  updateStation, //修改岗位信息
  addStation //新增岗位信息
} from '@/api/user.js'
import { onMounted } from 'vue'
export default {
  components: { elSelectTree },
  props: {
    routerType: {
      type: Number,
      default: 1
    },
    row: {
      type: Object,
      default: {}
    },
    editStatus:{
      type:String,
      default:String
    }
  },
  emits: ['close'],
  setup(props, { attrs, emit }) {
    console.log(props)
    const row = props.row
    const editStatus=props.editStatus
    const routerType = props.routerType
    console.log(row, 'row')
    // console.log(routerType, toRaw(datas))
    const state = reactive({
      disabledButton:false,
      //表单验证
      rules: {
        postName: [
          { required: true, message: '请输入岗位名称', trigger: 'blur' },
          { max: 16, message: '长度16个字符', trigger: 'blur' }
        ]
      },
      menus: [],
      centerDialogVisible: true, //控制弹框的显示和隐藏

      form: {
        postName: '',
        status: '1',
        remark: ''
      },
      flag:true
    })
    //页面一进入初始回显
    const init = () => {
      if (routerType == '1') {
        state.form.postName = row.postName
        // if(editStatus=='2'){
        //   state.disabledButton=true
        // }
        if (row.status) {
          state.form.status = '0'
        } else {
          state.form.status='1'
        }
         if(editStatus=='2'){
          state.disabledButton=true
        }else{
          state.disabledButton=false
        }
      }
    }
    //onMounted方法
    onMounted(() => {
      init()
    })
    //关闭弹框事件
    const close = () => {
      emit('close', true)
    }

    //提交时候
    let formR = ''
    const formRef = el => {
      formR = el
    }
    const submitForm = () => {
      
      formR
        .validate()
        .then(() => {
          let { postName, status } = state.form,
            params = { postName, status }
          if (routerType == '2' && state.flag) {
            //新增时候.
            state.flag = false
            addStation(params).then(res => {
              if (res.code == 200) {
                emit('close', false)
                ElMessage.success('新增成功')
              } 
              state.flag = true
            }).catch(err=>{
           
              state.flag = true
            })
            
          } else if(routerType=='1') {
             //修改时候
            params.remark = ''
            params.postId = row.postId
            updateStation(params).then(res => {
              if (res.code == 200) {
                emit('close', false)
                ElMessage.success('修改成功')
              } 
            }).catch(err=>{
           
            })
          }
        })
        // .catch(() => {
        //   console.log('校验失败')
        // })
    }
    return {
      ...toRefs(state),
      routerType,
      row,
      close,
      submitForm,
      formRef,
      editStatus
    }
  }
}
</script>
<style scoped lang="scss">
// .submit {
//   display: flex;
//  justify-content: flex-end;
// }
</style>
