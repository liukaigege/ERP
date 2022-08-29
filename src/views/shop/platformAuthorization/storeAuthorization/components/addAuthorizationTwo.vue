<template>
    <div class="headAuthorOne">
        <el-dialog
            title="添加授权"
            v-model="dialogAuthorTwo"
            width="640px"
            custom-class="myDialog"
            :close-on-click-modal="false"
            :destroy-on-close="true"
            @close="closeDialog">
            <el-steps :active="active" align-center>
                <el-step title="步骤1" description="点击授权即可完成授权" />
            </el-steps>
            <div style="margin-top:46px">
                <el-form :label-width="167" :rules="rules"  ref="formRef" :model="form">
                    <el-form-item label="店铺名称:" prop="name">
                        <el-select style="width:320px" v-model="form.name" placeholder="请选择店铺" @change="changeSelect">
                            <el-option v-for="item in shopName" :key="item.id" :label="item.name" :value="item.name" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="二级域名:" prop="shop">
                        <el-input disabled style="width:320px" v-model="form.shop" />
                    </el-form-item>
                    <el-form-item label="Shopline API:" prop="token" v-if="routerType==='shopline'">
                        <el-input  style="width:320px" v-model="form.token" />
                    </el-form-item>
                    <!-- funpinpin -->
                    <el-form-item label="api_key:" prop="appKey" v-if="routerType==='funpinpin'||routerType==='shopbase'">
                        <el-input  style="width:320px" v-model="form.appKey" />
                    </el-form-item>
                    <el-form-item label="Password:" prop="token" v-if="routerType==='funpinpin'||routerType==='shopbase'">
                        <el-input  style="width:320px" v-model="form.token" />
                    </el-form-item>
                    <!-- xshoppy -->
                    <el-form-item label="API密钥:" prop="appKey" v-if="routerType==='xshoppy'">
                        <el-input  style="width:320px" v-model="form.appKey" />
                    </el-form-item>
                    <el-form-item label="密码:" prop="token" v-if="routerType==='xshoppy'">
                        <el-input  style="width:320px" v-model="form.token" />
                    </el-form-item>
                    <el-form-item label="共享密钥:" prop="sharedSecret" v-if="routerType==='xshoppy'">
                        <el-input  style="width:320px" v-model="form.sharedSecret" />
                    </el-form-item>
                    <el-form-item label="CORE_TOKEN:" prop="token" v-if="routerType==='shopyy'">
                        <el-input  style="width:320px" v-model="form.token" />
                    </el-form-item>
                </el-form>

            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button  @click="closeDialog">取 消</el-button>
                    <el-button  type="primary" @click="sumbitAtutor">授权</el-button>
                </span>
            </template>
        </el-dialog>

    </div>
</template>

<script>
import { reactive, toRefs, getCurrentInstance, onMounted } from 'vue'
import {
    shopList, //店铺列表
    empower, //授权
} from '@/api/goods/shop.js'
import { ElMessage } from 'element-plus'
export default {
    components: {

    },
    props: {
        routerType: {
            type: String
        },
    },
    setup(props) {
        const { proxy } = getCurrentInstance()
        const routerType = props.routerType
        console.log(routerType, 'routerType-----');
        const state = reactive({
            active: 1,
            formRef: null,
            dialogAuthorTwo: true,
            showAddTwo: false, //打开弹框二
            form: {
                name: '',
                shop: '',
                token:'',
                appKey:'',
                sharedSecret:''
            },
            shopName: [], //保存店铺名称
            //表单的验证


        })
         let msg = {
            shopline:'Shopline API为空',
            funpinpin:'password不能为空',
            shopbase:'password不能为空',
            xshoppy:'密码不能为空',
            shopyy:'CORE_TOKEN不能为空'
        }
        const rules ={
                name: [
                    { required: true, message: '请输入店铺名称', trigger: 'change' },
                ],
                shop: [
                    { required: true, message: '二级域名为空', trigger: 'change' },
                ],
                appKey: [
                    { required: true, message:routerType==='funpinpin'||routerType==='shopbase'? 'api_key不能为空':'API密钥不能为空', trigger: 'blur' },
                ],
                token: [
                    { required: true, message: msg[routerType], trigger: 'blur' },
                ],
               sharedSecret: [
                    { required: true, message: '共享密钥不能为空', trigger: 'blur' },
                ],
            }

        //1.关闭事件
        function closeDialog() {
            proxy.$parent.showAddTwo = false
        }
        //2.点击授权事件
        function sumbitAtutor() {
            state.formRef.validate().then(() => {
                let params={
                    tempDomain:state.form.shop,
                    platform:routerType,
                    shopId:state.form.shopId,

                }
                if(routerType==='shopline'||routerType==='funpinpin'||routerType==='xshoppy' ||routerType==='shopyy'||routerType==='shopbase') params.token=state.form.token.replace(/[ ]|[\r\n]/g,"");
                if(routerType==='funpinpin'||routerType==='xshoppy'||routerType==='shopbase') params.appKey=state.form.appKey.replace(/[ ]|[\r\n]/g,"");
                if(routerType==='xshoppy') params.sharedSecret=state.form.sharedSecret.replace(/[ ]|[\r\n]/g,"");
               empower(params).then(res=>{
                   if(res.data){
                       ElMessage.success('授权成功')
                   closeDialog()
                   }else{
                       ElMessage.error('授权失败')
                   }
               })
            }).catch(err => {
                console.log('校验失败');
            })
        }
        //3.获取店铺列表接口
        function init() {
            shopList({ platform: routerType,type:0 }).then(res => {
                state.shopName = res.data
            })
        }
        onMounted(() => {
            init()
        })
        //4.选择框事件
        function changeSelect(val) {
            let domain = ''
            console.log(val, 'val');
            if (val) {
                state.shopName.forEach(item => {
                    if (val == item.name) {
                        domain = item.tempDomain
                        state.form.shopId = item.id
                    }
                })

                state.form.shop = domain
            }
        }

        return {
            ...toRefs(state),
            closeDialog, //关闭
            sumbitAtutor, //授权
            routerType,
            changeSelect,
            rules
        }
    }
}
</script>

<style lang="scss" scoped>
.headAuthorOne {
    .formContent {
        text-align: center;
    }
}
</style>
