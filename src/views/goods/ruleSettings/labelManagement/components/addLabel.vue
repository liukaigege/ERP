<template>
    <div class="headAuthorOne">
        <el-dialog
            :title="row.id?'编辑标签':'新增标签'"
            v-model="dialogLabel"
            width="480px"
            custom-class="myDialog"
            :close-on-click-modal="false"
            :destroy-on-close="true"
            @close="closeDialog">
            <div >
                <el-form ref="formRef" :rules="rules"  :model="form">
                    <el-form-item label="标签内容：" prop="name">
                        <el-input style="width:320px" v-model="form.name" placeholder="请输入标签内容" />
                    </el-form-item>
                    <el-form-item label="状态：" prop="status" style="margin-left:38px" >
                       <el-switch v-model="form.status"/>
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
import { reactive, toRefs,onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import {
    updateLabel, //添加/修改标签
} from '@/api/goods/rules.js'
export default {
    props: {
      row:{
          type:Object,
          default:{}
      }
    },
    emits:['closeDialog','updateDialog'],
    setup(props,context) {
        //校验规则
        const rules={
            name: [
                    { required: true, message: '请输入标签内容', trigger: 'blur' },
                    { max: 5, message: '长度5个字符', trigger: 'blur' },
                    // {validator:(rule,value,callback)=>{
                    //     if(!value.trim()) return callback('请输入标签内容')
                    //     return callback()
                    // }}
                ],
        }
        const row=props.row
        console.log(row,'row');
        const state = reactive({
            dialogLabel: true,
            formRef:null,
            form: {
                name: '',
                status: true,
            },
        })
        //1.关闭事件
        function closeDialog() {
            state.dialogLabel=false
            context.emit('closeDialog')
            // proxy.$parent.showAddLabel = false

        }
        //2.点击确定事件
        function submitForm() {
            state.formRef.validate().then(()=>{
                if(!state.form.name.trim()){
                 return ElMessage.error('标签内容不能为空')
                }
              const params={
                  id:row.id?row.id:'',
                  name:state.form.name.trim(),
                  status:state.form.status?'1':'0'
              }
              
              updateLabel(params).then(res=>{
                  ElMessage.success(row.id?'修改成功':'提交成功')
                   context.emit('updateDialog')
                console.log('1212');
              })
               
            }).catch(err=>{
                console.log('校验失败');
            })
        }
        //3.初始进去页面回显
        function init() {
            if(row.id){
             state.form.name=row.name
             state.form.status=row.status?true:false
            }else{
              state.form.name='' 
            }
        }
        onMounted(()=>{
            init()
        })
        return {
            ...toRefs(state),
            row,
            rules,
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
