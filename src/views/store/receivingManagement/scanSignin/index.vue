<template>
<div class="scanBox">
  <el-row :gutter="20" class="row-1">
    <el-col :span="6" :offset="0" class="flex-center bgc-f2f2f2">
      <span>单号</span>
    </el-col>
    <el-col :span="18" :offset="0" class="flex-center">
      <el-input v-model.trim="trackNum" placeholder=""  clearable @keyup.enter="enterHandler" style="width:400px" @blur="inputBlur"></el-input>
    </el-col>
  </el-row>
  <el-row :gutter="20" class="row-2">
    <el-col :span="6" :offset="0" class="flex-center bgc-f2f2f2"><span>仓库</span></el-col>
    <el-col :span="6" :offset="0" class="flex-center"><span>万众智谷仓库</span></el-col>
    <el-col :span="6" :offset="0" class="flex-center bgc-f2f2f2"><span>经办人</span></el-col>
    <el-col :span="6" :offset="0" class="flex-center"><span>{{userName}}</span></el-col>
  </el-row>

</div>
</template>

<script>
import { nextTick, onActivated, onMounted, reactive, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { getSignOrderList } from '@/api/store.js'
import { storage} from '@/utils/storage.js'

export default {
  setup() {
    const state = reactive({
      trackNum: '',
      go: true,
      userName:''
    })
    
    const router = useRouter()
    onActivated(() => {
      inputBlur()
    })

    function enterHandler() {
      if (state.trackNum && state.go) {
        state.go = false
        getSignOrderList({
          trackNum: state.trackNum + ''
        }).then(res => {
          if(res.data?.length){
            router.push({ name: 'scanSubpage',query: {trackNum:state.trackNum + ''}})
          }else{
             router.push({name:'errorPage',query:{trackNum:state.trackNum}})
          }
          state.go = true
        }).catch(err => {
          state.go = true
        })
      }
    }
    onMounted(() => {
      document.querySelector('input') ?.focus()
      state.userName = storage.get('ERP_USERINFO').fullName
    })

    function inputBlur() {
      nextTick(() => {
        document.querySelector('input') ?.focus()
      })
    }
    return {
      ...toRefs(state),
      enterHandler,
      inputBlur,
      storage
    }
  }
}
</script>

<style lang="scss" scoped>
.scanBox {
  padding: 16px 24px;
  background-color: #fff;
  height: 770px;

  .el-col {
    height: 55px;
    border: 1px solid #EBEEF5;
  }

  .el-col+.el-col {
    border-left: unset;
  }

  .row-2 {
    .el-col {
      border-top: unset;
    }
  }
}

.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.bgc-f2f2f2 {
  background-color: #F5F7FA;
}
</style>
