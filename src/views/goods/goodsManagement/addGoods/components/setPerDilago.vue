
<template>
  <div>

    <el-dialog title="设置权限" v-model="dialogVisible" :width="width" @close="close"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    >
        <div >

        <div class="activeF"  v-if="!copyShow" >
            <el-form :model="form" ref="formRef"  :rules="rules">
              <el-form-item label="查看范围：" prop="active">
                <el-select v-model="form.active" placeholder="">
                  <el-option v-for="(item,index) in authTypeOptionsBK" :key="index" :label="item.label" :value="item.value"></el-option>
                  <!-- <el-option label="全部可见" :value="0"></el-option>
                  <el-option label="仅部门成员可见" :value="1"></el-option>
                  <el-option label="仅自己可见" :value="2"></el-option> -->
                </el-select>
              </el-form-item>
            </el-form>
					<p style='margin: -10px 0 0 90px' class="tollitpText">报价成员及部门负责人可不受权限限制</p>

				</div>

        <div  v-if="copyShow">
          <p>权限申请成功</p>
          <p>可复制商品编码在【商品开发-待申请】中搜索查看该激活商品</p>
        </div>

        </div>



      <template #footer >
        <span class="dialog-footer">

          <el-button  @click="cancel"
            >取 消</el-button
          >

          <el-button  type="primary"  	v-debounce="setPer"    v-if="!copyShow"
            >确定</el-button
          >


          <el-button  type="primary"   v-if="copyShow"
            >复制商品编码</el-button
          >


        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, toRefs, getCurrentInstance,ref,onMounted, computed } from 'vue'
import {useRouter} from 'vue-router'
import {activateCheck,setPermission} from '@/api/goods/addGoods.js'
import {authTypeOptionsBK } from '@/assets/js/staticData.js'

  export default {
    props:{
      query:{
        type:Object,
        default:null
      },
      dialogVisible:{
        type:Boolean,
        default:false
      },
      width:{
        type:String,
        default:'30%'
      },
    },
    setup(props,context){
      const {proxy} = getCurrentInstance()
      const router =  useRouter()
      const formRef = ref(null)
      const data = reactive({
          form:{
            active:0
          },
          showContent:true,
          showType:null,
          copyShow:false
      })
      const rules = {
         active: [
                    { required: true, message: '请选择权限范围', trigger: 'change' }
         ],
      }



      const dialogHandOk = () => {

      }

      const close = () =>{
        cancel()
     }
      const cancel = () =>{
         context.emit('cancel')
      }



      function setPer(){
        formRef.value.validate().then(res=>{
          const {status} =props.query
            if(status && status == 'all'){
                   let authTypeName
                   let x = authTypeOptionsBK.find(v=>v.value == data.form.active)
                   authTypeName = x.label
                 const emitParam = {goodsIds:props.query.goodsId,authTypeName,authType:data.form.active}
                 context.emit('setPerSuccess',emitParam)
            }else{
                  set()
            }

        })

      }

      function set(){
          const param = {
           goodsIds:props.query.goodsId,
           authType:data.form.active,
           similarGoods:props.query.status == 'success' ? 0 : 1
         }
          setPermission(param).then(res=>{
              // console.log(res.data)
              if(res.code == 200){
                  data.copyShow = true
                //  context.emit('setPerSuccess',emitParam)
              }
          })
      }




      onMounted(()=>{
        console.log(props.query)

      })


      return {
        ...toRefs(data),
        dialogHandOk,
        cancel,
        close,
        rules,
        formRef,
        setPer,
        authTypeOptionsBK
      }
    }
  }
</script>


<style lang="scss" scoped>

.tollitpText{
  font-size: 12px;
  color: #9e9e9e;
}
</style>
