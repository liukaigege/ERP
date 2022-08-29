<!--
 * @Descripttion: 
 * @version: 
 * @Author: 江澎涛
 * @Date: 2021-07-16 09:01:03
 * @LastEditors: 江澎涛
 * @LastEditTime: 2021-08-19 15:06:52
-->
<template>
<div class="userContainer">
    <el-row :gutter="20">
        <el-col :span="5" style="width: 328px">
            <div class="grid-content bg-purple">
                <div class="left-box">
                    <user-left :userData="userData" @getUser="getUser" />
                </div>
            </div>
        </el-col>
        <el-col :span="19">
            <div class="grid-content bg-purple">
                <div class="right-box">
                    <user-right :userData="userData" @getUser="getUser" />
                </div>
            </div>
        </el-col>
    </el-row>
</div>
</template>

<script>
import userRight from './components/userRight.vue'
import userLeft from './components/userLeft.vue'
import { reactive, toRefs } from 'vue'
import { onMounted } from 'vue';
import { queryUserMessage } from '@/api/user.js'
import { useStore } from 'vuex'
export default {
    name: 'UserInfo',
    components: { userRight, userLeft },
    setup() {
        const store = useStore()
        const state = reactive({
            userData: {}
        })
        onMounted(() => {
            getUser()
        })
        const getUser = (e) => {
            queryUserMessage().then(res => {
                state.userData = res.data
                if (e) store.dispatch('user/updateAvatar', state.userData.avatar)
            })
        }
        return {
            ...toRefs(state),
            getUser
        }
    }
}
</script>

<style lang="scss" scoped>
.right-box {
    background-color: #fff;
}
</style>
