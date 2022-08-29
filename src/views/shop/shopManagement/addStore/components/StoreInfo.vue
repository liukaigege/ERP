<template>
<el-card class="box-card" shadow="never">
  <template #header>
    <div class="card-header">
      <span>基本信息</span>
    </div>
  </template>
  <el-form :model="formData" ref="formRef" :rules="rules" label-width="120px" :inline="true" >
    <div class="flex-form-item">
      <el-form-item label="店铺名称:" prop="name">
        <el-input v-model="formData.name" class="w310"  maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="店铺ID:">
        <el-input type="number" v-model="formData.platformId" class="w310"  maxlength="10"></el-input>
      </el-form-item>
    </div>
    <div class="flex-form-item">
      <el-form-item label="所属平台:" prop="platform">
        <el-select v-model="formData.platform" class="w310"  placeholder="请选择">
          <el-option v-for="item in platform" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="临时域名:" prop="tempDomain2">
        <el-input placeholder="请输入内容" class="w310"  maxlength="200" v-model="formData.tempDomain2" @input="(e)=>formData.tempDomain2 = e.replace(/[ ]|[\r\n]/g,'')">
        </el-input>
      </el-form-item>
    </div>
    <div class="flex-form-item">
      <el-form-item label="使用部门:" prop="useDept">
        <elSelectTree ref="userRef" filterable clearable :data="deptList" :treeProps="treeProps"  checkStrictly  :width="286" @ok="ok" />
      </el-form-item>
      <el-form-item label="负责人"  prop="leader">
        <el-select v-model="formData.leader"  clearable filterable  class="w310">
          <el-option v-for="item in userList"
            :key="item.value"
            :label="item.fullName"
            :value="item.userId">
          </el-option>
        </el-select>

      </el-form-item>

    </div>
    <div class="flex-form-item">
      <el-form-item label="开店时间:" prop="openTime">
        <el-date-picker v-model="formData.openTime" placeholder="选择日期" class="w310" @change="timeChange">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="发货仓库:" prop="warehouseId">
        <el-select v-model="formData.warehouseId" class="w310">
          <el-option v-for="item in storeSelect" :key="item.id" :label="item.warehouseName" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
    </div>
  </el-form>

</el-card>
</template>

<script>
import { onMounted, reactive, toRefs, watch } from 'vue'
import moment from 'moment'
import { getWareHouse } from '@/api/store.js'
import { shopUserList,checkShopName } from '@/api/goods/shop.js'
import elSelectTree from '@/components/elSelectTree/index.vue'
import { requiredValue, ruleUrl } from '@/views/shop/shopRules/rules.js'
export default {
  props: {
    is_Submit: {
      type: Boolean
    },
    isResetShop: Boolean
  },
  emits: ['submitStatus'],
  components: { elSelectTree },
  setup(props, ctx) {
    const state = reactive({
      formData: {
        name: '', // 店铺名称
        platformId: '', // 店铺id
        platform: '', // 店铺平台
        tempDomain: '', // 临时域名
        tempDomain2: '', // 临时域名
        leader: '', // 使用人id
        useDept: '', //部门id
        warehouseId: '', // 发货仓库
        openTime: '', // 开店时间,
      },
      formRef: '',
      storeSelect: [],
      deptList: [],
      userList:[],
      treeProps: {
        value: 'deptId',
        label: 'deptName',
        children: 'children',
      },
      userRef: ''
    })
    const platform = [
      { value: 'shopify', label: 'shopify' },
      { value: 'shoplazza', label: 'shoplazza' },
      { value: 'vshop', label: 'vshop' },
      { value: 'shopline', label: 'shopline' },
      { value: 'funpinpin', label: 'funpinpin' },
      { value: 'xshoppy', label: 'xshoppy' },
      { value: 'shopyy', label: 'shopyy' },
      { value: 'shopbase', label: 'shopbase' }
    ]
    const rules = {
      name: [requiredValue('请输入店铺名称'),{
        validator:(rule,value,callback)=>{
          checkShopName(
           { name:state.formData.name}
          ).then(res=>{
            callback()
          }).catch(err=>{
            callback('店铺名称已存在')
          })
        },
        trigger:'blur'
      }],
      platform: [requiredValue('请选择平台')],
      tempDomain2: ruleUrl('请输入临时域名', 0, state.formData),
      useDept:[requiredValue('请选择使用部门')],
      leader: [requiredValue('请选择负责人')],
      warehouseId: [requiredValue('请选择发货仓库')],
      openTime: [requiredValue('请输入开店时间')]
    }
    watch(() => props.isResetShop, val => {
      if (val) {
        state.formData = {
          name: '', // 店铺名称
          platformId: '', // 店铺id
          platform: '', // 店铺平台
          tempDomain: '', // 临时域名
          tempDomain2: '', // 临时域名
          leader: '', // 使用人id
          useDept: '', //部门id
          warehouseId: '', // 发货仓库
          openTime: '', // 开店时间,
        }
        state.userRef.clearHandle()

      }
    })
    onMounted(() => {
      getWareHouse({
        page: {
          pageNo: 1,
          pageSize: 100
        }
      }).then(res => {
        state.storeSelect = res.data.dataList
      })
      shopUserList().then(res => {
        state.deptList = res.data
      })
    })

    function loop(data) {
      data.forEach(item => {
        if (item.children && item.children.length) loop(item.children)
        console.log(item.deptId,state.formData.useDept);
        if(item.deptId == state.formData.useDept){
         if(item.userVos){
           console.log(item.userVos);
           state.userList = item.userVos
         }
       }
      })
    }

    // 监听提交校验事件
    watch(() => props.is_Submit, val => {
      if (val) {
        state.formRef.validate().then(res => {
          state.formData.tempDomain = 'https://' + state.formData.tempDomain2
          ctx.emit('submitStatus', 'storeInfo', state.formData)
        }).catch(res => {
          ctx.emit('submitStatus', 'storeInfo', false)
        })
      }
    })

    function timeChange(time) { //时间格式化
      state.formData.openTime = moment(time).format('YYYY-MM-DD 00:00:00')
    }

    function ok(e) {
       state.formData.useDept = e
       state.formData.leader = ''

       state.userList = []
       if(e){
         loop(state.deptList)
       }
    }
    return {
      ...toRefs(state),
      rules,
      platform,
      timeChange,
      ok
    }
  }
}
</script>

<style>

</style>
