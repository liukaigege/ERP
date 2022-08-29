<template>
    <div class="headAuthorOne">
        <el-dialog
            title="添加授权"
            v-model="dialogAuthorOne"
            width="640px"
            custom-class="myDialog"
            :close-on-click-modal="false"
            :destroy-on-close="true"
            @close="closeDialog">
            <el-steps :active="active" align-center>
                <el-step title="步骤1" description="点击确定后跳转独立站登录获得授权码进行授权绑定"></el-step>
                <el-step title="步骤2" description="将授权码粘贴至输入框 中进行授权绑定"></el-step>
            </el-steps>
            <div style="margin-top:46px">
                <el-form :label-width="167" :rules="rules"  ref="formRef" :model="form">
                    <el-form-item label="店铺名称:" prop="name" v-show="showForm">
                        <el-select style="width:320px" v-model="form.name" placeholder="请选择店铺" @change="changeSelect">
                            <el-option v-for="item in shopName" :key="item.id" :label="item.name" :value="item.name" />

                        </el-select>
                    </el-form-item>
                    <el-form-item label="二级域名:" prop="shop" v-show="showForm">
                        <el-input disabled style="width:320px" v-model="form.shop" />
                    </el-form-item>
                    <el-form-item label="授权码:" v-show="showFormS">
                        <el-input style="width:320px" v-model="form.shopTag" />
                    </el-form-item>
                    <el-form-item label="appKey:" v-show="showFormS&&routerType=='shopify'">
                        <el-input style="width:320px" v-model="form.appKey" />
                    </el-form-item>
                </el-form>

            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button  @click="closeDialog">取 消</el-button>
                    <el-button  type="primary" @click="submitForm" v-show="showForm">确 定</el-button>
                    <el-button  type="primary" @click="sumbitAtutor" v-show="showFormS">授权</el-button>
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
        const routerType = props.routerType
        const { proxy } = getCurrentInstance()
        const state = reactive({
            formRef: null,
            active: 1,
            showForm: true,
            showFormS: false,
            dialogAuthorOne: true,
            showAddTwo: false, //打开弹框二
            form: {
                name: '',
                shop: '',
                shopTag: '',
                shopId: '', //店铺id
                appKey: ''
            },
            shopName: [], //保存店铺名称
            //表单的验证
            rules: {
                name: [
                    { required: true, message: '请选择店铺名称', trigger: 'change' },
                ],
                shop: [
                    { required: true, message: '二级域名为空', trigger: 'change' },
                ]

            },
        })
        //1.关闭事件
        function closeDialog() {
            proxy.$parent.showAddOne = false
        }
        //2.弹框确定事件
        function submitForm() {
            state.formRef.validate().then(() => {
                state.active = 2
                state.showForm = false
                state.showFormS = true
                window.open(state.form.shop)
            }).catch(err => {
                console.log('校验失败');
            })
        }
        //3.点击授权事件
        function sumbitAtutor() {
            let params = {
                tempDomain: state.form.shop,
                token: state.form.shopTag,
                platform: routerType,
                shopId: state.form.shopId
            }
            if (routerType == 'shopify') params.appKey = state.form.appKey.replace(/[ ]|[\r\n]/g,"");
            empower(params).then(res => {
                if (res.data) {
                    ElMessage.success('授权成功')
                    closeDialog()
                } else {
                    ElMessage.error('授权失败')
                }
            })
        }
        //4.select框选择事件
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
                // if(routerType=='shoplazza'){
                //     state.form.shop=domain
                // }else {
                //    state.form.shop=domain 
                // }

            }
        }
        //4.1.获取店铺列表接口
        function init() {
            shopList({ platform: routerType, type: 0 }).then(res => {
                console.log(res, 'res====');
                state.shopName = res.data
            })
        }
        onMounted(() => {
            init()
        })
        //4.2 授权提交

        return {
            ...toRefs(state),
            closeDialog, //关闭
            submitForm, //确定
            sumbitAtutor, //授权
            changeSelect,
            routerType
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
