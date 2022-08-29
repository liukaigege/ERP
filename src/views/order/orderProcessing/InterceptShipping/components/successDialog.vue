<!--
 * @Descripttion: 
 * @version: 
 * @Author: 江澎涛
 * @Date: 2021-08-21 09:45:37
 * @LastEditors: 江澎涛
 * @LastEditTime: 2021-08-21 10:39:25
-->
<template>
<el-dialog v-model="success" width="800px" @close="close" :close-on-click-modal="false" title="拦截包裹信息确认">
    <p>添加拦截包裹成功<span style="color:#1890FF">&nbsp; {{successData.successNum}}&nbsp; </span>条，添加失败<span style="color:#FF4D4F"> &nbsp;{{successData.filaureNum}}&nbsp; </span>条</p>
    <div class="divFlex" v-if="successData.filaure.length">
        <div class="title">拦截失败单号及原因：</div>
        <div class="interBox">
            <p v-for="(value,index) in successData.filaure" :key="index"><span class="title">{{value[0]}}</span><span style="color:rgb(255, 77, 79)">{{value[1]}}</span></p>
        </div>
    </div>
</el-dialog>
</template>

<script>
import { toRefs } from 'vue'
import { successData } from '../composable/index.js'

export default {
    emits: ['search'],
    setup(props, { emit }) {
        function close() {
            successData.success = false
            emit("search")
        }
        return {
            ...toRefs(successData),
            close
        }
    }
}
</script>

<style lang="scss" scoped>
p {
    text-align: center;
}

.title {
    color: rgba($color: #000000, $alpha: .65);
}

.divFlex {
    margin-top: 15px;
    display: flex;
    justify-content: center;

    p {
        text-align: left;
    }
}
</style>
