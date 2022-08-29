<template>
<div class="left">
    <div class="userImg">
        <uploadImg class="uploadImg" @getFileUrl="emitUrl" :showFileList="false" :ref="ref" :moduleName="'avatar'" />
        <img :src="userData.avatar" alt="" />
    </div>
    <div class="userInfo">
        <p class="account">
            <span class="spanLeft">登陆账号：</span>
            <span class="spanRight">{{ userData.userName }}</span>
        </p>
        <p class="name">
            <span class="spanLeft">用户昵称：</span>
            <span class="spanRight">{{ userData.fullName }}</span>
        </p>
    </div>
    <div class="userContact">
        <p class="phone">
            <span class="spanLeft">手机号码：</span>
            <span class="spanRight">{{ userData.phoneNumber }}</span>
        </p>
        <p class="email">
            <span class="spanLeft">用户邮箱：</span>
            <span class="spanRight">{{ userData.email }}</span>
        </p>
    </div>
    <div class="userEdit">
        <p class="department">
            <span class="spanLeft">所属部门：</span>
            <span class="spanRight">{{ userData.deptName }} <span class="ii"> | </span> {{userData.postName}}</span>
        </p>
        <p class="safety">
            <span class="spanLeft"> 安全设置：</span>
            <span class="spanRight">
                <a class="edit" @click="isEditPwd = true">修改密码</a>
                <span class="ii"> | </span>
                <a class="edit" @click="isEditEmail = true">修改邮箱</a>
            </span>
        </p>
    </div>

    <!-- 修改密码 -->
    <edit-pwd v-if="isEditPwd" :userData="userData" />
    <!-- 修改邮箱 -->
    <edit-email v-if="isEditEmail" :userData="userData" @getUser="emitUser" />
</div>
</template>

<script>
import { nextTick, onMounted, reactive, toRefs, watch } from 'vue'
import uploadImg from '@/components/uploadImg/index.vue'
import editPwd from './editPwd.vue'
import EditEmail from './editEmail.vue'
import { submitAvatar } from '../composable/index.js'
export default {
    name: 'UserLeft',
    props: {
        userData: {
            type: Object,
            required: true
        }
    },
    components: { uploadImg, editPwd, EditEmail },
    emits: ['getUser'],
    setup(props, { emit }) {
        const state = reactive({
            isEditPwd: false,
            isEditEmail: false,
            userData: {},
            ref: ''
        })

        watch(() => props.userData, val => {
            state.userData = val
        })

        // 元素获取
        const ref = e => {
            state.ref = e
        }

        // 修改用户头像
        const emitUrl = val => {
            submitAvatar(val, state, emit)
        }

        const emitUser = () => {
            emit('getUser')
        }
        return {
            ...toRefs(state),
            emitUrl,
            ref,
            emitUser
        }
    }
}
</script>

<style lang="scss" scoped>
.left {
    padding: 24px 30px 14px 30px;
    font-size: 14px;
    background-color: #fff;

    .userImg {
        text-align: center;
        padding-bottom: 20px;
        position: relative;

        img {
            width: 106px;
            height: 106px;
            border-radius: 50%;
            overflow: hidden;
        }
    }

    .userInfo,
    .userContact,
    .userEdit {
        padding: 15px 0;
        height: 90px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

    }

    .userContact {
        border-top: 1px dashed #f0f0f0;
        border-bottom: 1px dashed #f0f0f0;
    }

    .userEdit .edit {
        color: rgb(53, 158, 255);
    }
}

.account,
.name,
.phone,
.email,
.department,
.safety {
    display: flex;
    justify-content: space-between;

    .span1 {
        width: 80px;
    }

    .ii {
        margin: 0 5px;
        color: #e9e9e9;
    }

    .span2 {
        word-break: break-all;
        display: flex;
        justify-content: flex-end;
    }
}

.userImg {
    position: relative;

    :deep(.uploadImg) {
        opacity: 0;
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);

    }
}
</style>
