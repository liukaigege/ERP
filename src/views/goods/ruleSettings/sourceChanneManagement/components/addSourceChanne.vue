<template>
    <div class="headAuthorOne">
        <el-dialog
            :title="row.id?'编辑货源渠道':'新增货源渠道'"
            v-model="dialogSource"
            width="480px"
            custom-class="myDialog"
            :close-on-click-modal="false"
            :destroy-on-close="true"
            @close="closeDialog">
            <div >
                <el-form :rules="rules"  :model="form" ref="formRef">
                    <el-form-item label="渠道名称：" prop="name">
                        <el-input style="width:320px" v-model="form.name" placeholder="请输入渠道名称" />
                    </el-form-item>
                    <el-form-item label="渠道编码：" prop="code" >
                        <el-input style="width:320px" v-model="form.code" placeholder="请输入渠道编码" />
                    </el-form-item>

                </el-form>

            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button  @click="closeDialog">取 消</el-button>
                    <el-button  type="primary" @click="submitForm">确 定</el-button>
                </span>
            </template>
        </el-dialog>

    </div>
</template>

<script>
import { reactive, toRefs, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import {
    updateSourceChanne, //新增/修改货源渠道信息
} from '@/api/goods/rules.js'
export default {
    props: {
      row:{
         type: Object,
         default: {} 
      }
    },
    emits:['closeDialog','updateDialog'],
    setup(props,context) {
        const row=props.row
        const state = reactive({
            dialogSource: true,
            formRef:null,
            form: {
                name: '',
                code: '',
            },
            //表单的验证
            rules: {
                name: [
                    { required: true, message: '请填写渠道名称', trigger: 'blur' },
                    { max: 32, message: '长度32个字符', trigger: 'blur' }
                ],
                code: [
                    { required: true, message: '请填写渠道编码', trigger: 'blur' },
                    { max: 5, message: '长度5个字符', trigger: 'blur' },
                    { pattern:/^[0-9A-Za-z]+$/,message: '渠道编码格式不正确',trigger: 'blur'}
                ],

            },
        })
        //1.关闭事件
        function closeDialog() {
            state.dialogSource=false
            context.emit('closeDialog')
        }
        //2.弹框确定事件
        function submitForm() {
            state.formRef.validate().then(()=>{
             const params={
                 id:row.id?row.id:'',
                 name:state.form.name,
                 code:state.form.code
             }
            updateSourceChanne(params).then(res=>{
                ElMessage.success(row.id?'修改成功':'提交成功')
                context.emit('updateDialog')
            })
            }).catch(err=>{
                console.log('校验失败');
            })
        }
       //一进去的时候回显
       function init(){
          if(row.id){
              state.form.name=row.name
              state.form.code=row.code
          }
       }
       onMounted(()=>{
           init()
       })
        return {
            ...toRefs(state),
            row,
            closeDialog, //关闭
            submitForm, //确定
        }
    }
}
</script>

<style lang="scss" scoped>
.headAuthorOne {
  :deep(.el-dialog__title){
      font-weight: 500;
  }
}
</style>
