<template>
    <div class="headAddInfringmentSetting">
        <!-- 头部 -->
        <div class="box">
            <erpNav :title="params.routeType=='edit'?'编辑侵权设置':'新建侵权设置'" routeOpt="/goods/ruleSettings/InfringementSetting" />
        </div>
        <!-- 内容 -->
        <div class="content">
            <el-form :model="formData" :rules="rules" label-width="100px" ref="formName">
                <el-form-item prop="name" label="名称:">
                    <el-input style="width:800px" :maxlength="20" v-model="formData.name" placeholder="请输入名称" />
                </el-form-item>
                <el-form-item class="dropdownMenu" label="敏感词汇:">
                    <el-select
                    style="width:800px"
                        v-model="value"
                        popper-class="words"
                        multiple
                        filterable
                        allow-create
                        default-first-option
                        @remove-tag="move"
                        :multiple-limit="50"
                        @change="headchage"
                        placeholder="多个词汇,Enter键隔开">
                    </el-select>
                </el-form-item>
                <el-form-item  label="图片样例:">
                    <div class="productImg">
                     <ProductImg   v-model="goodsImags" ref="formRef" :message="message" :notAcceptedType="['jpg','jpeg','png']"/>
                    </div>
                </el-form-item>
                <el-form-item label="状态:">
                  <el-switch v-model="formData.status" active-color="#1890FF" inactive-color="#C0C0C0"></el-switch>
               </el-form-item>
            </el-form>
        </div>
        <!-- 底部 -->
        <div class="flex-pagination page-fixed">
        <div></div>
        <div>
            <el-button  @click="back">取消</el-button>
            <el-button type="primary"  @click="submit">确定</el-button>
        </div>
    </div>
    </div>
</template>

<script>
import erpNav from '@/components/erpNav/index.vue'
import ProductImg from '@/views/goods/components/goodsImg/components/productImg.vue'
import { ElMessage, ElMessageBox } from "element-plus"
import { reactive, toRef, toRefs, watch, onMounted,ref, provide } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
		seleteTortDetails, //查询侵权信息详情(编辑页面的数据)
        addTort//新增侵权信息
	} from '@/api/goods/rules.js'
export default {
    name: "addInfringmentSetting",
    components:{
        erpNav,
        ProductImg
    },
    setup() {
        provide('isDisabled', false)
        //表单验证
        const rules= {
          name:[
                { required: true, message: '请输入名称', trigger: 'blur' },
                { max: 20, message: '长度20个字符', trigger: 'blur' },
                { pattern: /^[\u4E00-\u9FA5A-Za-z]+$/, message: '样例名称格式错误', trigger: 'blur' } 

                ]
        }
        const router=useRouter()
        const route=useRoute()
        const params = route.params
        console.log(params);
        const state = reactive({
          formName:null,
            goodsImags:[],//商品图片
            //////////
            value: [],//存储标签的值
            input: false,
            message:'1. 每张图片建议 800*800以上 像素，支持jpg / jpeg / png ，最大不超过10M，最多可添加30张图片',
            /////////
            formData: {
                name: '',
                status:true
            },
        })
        //回退到首页
        const  formRef = ref(null)
        function back() {
           router.push({name:'InfringementSetting'})
        }
        //初始进入编辑页面的回显
        function init () {
            if(params.routeType=="edit"){
              seleteTortDetails({id:params.rowId}).then(res=>{
                  console.log(res,'res----');
                  state.formData.name=res.data.name
                  state.formData.status=res.data.status?true:false
                  state.value=res.data.vocabularyList?res.data.vocabularyList:[]
                  res.data.photoList.forEach(item=>{
                      let obj={
                          url:item.url,
                          resolution:item.resolution,
                          thumbnailUrl:item.thumbnailUrl,
                          id:item.id,
                          check:false
                      }
                      state.goodsImags.push(obj)
                  })
              })
            }
        }
        onMounted(()=>{
            init()
        })
        // 标签选择框事件处理
        ///////////////////////
        function headchage(value) {
           var regu = '^[ ]+$'
      var re = new RegExp(regu)
      let arr = []
      value.forEach((item, index) => {
        if (item.length > 20) {
         ElMessage.warning('关键词最多输入20个字符')
          item = item.substring(0, 20)
        }
        let x = item.replace(
          /[0-9\|\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\||\，||\。|\[|\；|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]/g,
          ''
        )
        console.log('changeInput=======', state.input)
        state.input = true
        if (!re.test(x) && x !== '') {
          arr.push(x)
        }
      })
      state.value = [...new Set(arr)]
      console.log(state.value);
        }
        function getArrDiff(arr1, arr2) {
            return arr1.concat(arr2).filter(function (v, i, arr) {
            return arr.indexOf(v) === arr.lastIndexOf(v)
            })
        }
        watch(() => state.value, (to, from) => {
            if (state.input && from.length > to.length) {
               getArrDiff(from, to).forEach(it => {
                    to.splice(from.indexOf(it), 0, it)
                })
                console.log('state.value======', state.value)
            }
        })
        function move(value) {
            state.input = false
            console.log('changeInput=======', state.input)
            console.log('remove-tag======', value)
        }
        //////////////////////
       //商品图片
    //    function getVal(){
    //        formRef.value.emitData()
    //        const {goodsImags}= state
    //        return {
    //            goodsImags
    //        }
    //    }
       function submit(){
           if(!state.goodsImags.length&&!state.value.length){
               ElMessage.error('请输入敏感词汇或图片样例')
           }else{
            state.formName.validate().then(()=>{
             formRef.value.emitData() 
              let photo=[]
           state.goodsImags.forEach(item=>{
               item.type=1
               if(!item['id']) item['id'] = null
               photo.push(item)
           })
          let list={
           id:params.routeType=="edit"?params.rowId:'',
           name:state.formData.name,
           vocabularyList:state.value,
           status:state.formData.status?1:0,
           photoList:photo
                }
        addTort(list).then(res=>{
           ElMessage.success(res.data)
           back()
       })
            }).catch(err=>{
               console.log('校验失败');
            })
           }
       }
        return {
            ...toRefs(state),
            back, //回退到首页
            params, //上个页面传过来的值
            move,
            submit,//提交事件
            headchage,
            formRef,
            // getVal,//图片选择事件
            rules//校验规则
        }
    }
}
</script>
<style lang="scss">
.words {
    display: none !important;
}
</style>
<style lang="scss" scoped>
.headAddInfringmentSetting {
    .content {
        padding: 24px 30px;
        background: #fff;
        margin-top: 24px;

        :deep(.el-input__inner) {
            height: 32px;
        }
        //////////////////////
        .dropdownMenu {
        :deep(.el-popper.is-pure) {
            display: none !important;
        }
        :deep(.el-form-item__label){
           
        }
        :deep(.el-input__suffix) {
            display: none !important;
        }
        }
        ///////////////////////
       //状态
    ::v-deep(.productImg){
       .imgItemIbt{
        height: 45px;
       } 
    }
    }
   
}
</style>
