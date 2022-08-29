<template>
  <el-card class="none-border-card" shadow="never">
    <template #header>
      <div class="baseinfo-card-header">
        <div class="baseinfo-card-title">参考/采集产品</div>
      </div>
    </template>
    <div class="baseinfo-card-body">
      <el-form>
        <el-form-item label="采集商品链接:" v-if="collectionUrl">
          <a :href="collectionUrl" target="_blank" class="textOverflow">{{collectionUrl}}</a>
        </el-form-item>
        <el-form-item label="商品中文名称:">
          <el-tooltip placement="top" trigger="hover" effect="dark" :content="goodsName">
            <template #default>
              <span class="textOverflow">{{goodsName}}</span>
            </template>
          </el-tooltip>
        </el-form-item>
        <!-- 采集商品不显示参考链接 -->
        <template v-if="mode > 1">
          <el-form-item label="参考产品链接:" v-for="(url, index) in referenceUrls" :key="index">
            <a :href="url" target="_blank" class="textOverflow">{{url}}</a>
          </el-form-item>
        </template>
        <div class="flex-div">
          <el-form-item label="期望售价:">
            <span>{{expectPrice}} USD</span>
          </el-form-item>
          <el-form-item label="成本价:">
            <span>{{costPrice}} CNY</span>
          </el-form-item>
          <el-form-item v-if="showApplyUser" label="申请人:">
            <span>{{applyUser}}</span>
          </el-form-item>
        </div>
        <div class="flex-div">
           <change-category v-if="showApplyUser && goods.goodsId" :id="goods.categoryId" :goodsId="goods.goodsId"></change-category>
        <div class="mt-20" v-if="authPath('/goods/goodsManagement/quotation/confirmNewSpe')">
          产品类型：{{ enableCustom == 1? "定制商品" : "普通商品" }}
          <el-popconfirm title="确认更改产品类型？" @confirm="changeType('ConfirmNewSpe')" >
             <template #reference>
              <el-button type="primary">更改类型</el-button>
            </template>
          </el-popconfirm>
        </div>
        </div>
      </el-form>
    </div>
  </el-card>
</template>

<script>
import { toRefs } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ChangeCategory from './ChangeCategory.vue'
import { ElMessage } from 'element-plus'
export default {
  components: { ChangeCategory },
  props: {
    goods: {
      type: Object,
      default: {}
    },
    showApplyUser: {
      type: Boolean,
      default: false
    },
    isPurchaseQuote:Boolean,
    goodsStatus:{},
    quoteForm:Object
  },
  setup(props) {
    const router = useRouter()
    const route = useRoute()
    function changeType(name){
      // 组合品和申请新规格报价中的商品不可更改商品类型！
      // isPurchaseQuote &&  quoteForm.combineType == 1 && goodsStatus!=6
      if(props.goodsStatus==6 || props.quoteForm.combineType != 1) return  ElMessage.error('组合品和申请新规格报价中的商品不可更改商品类型！')
      router.push({name,query:route.query})
    }
    console.log(props.goods);
    return {
      ...toRefs(props.goods),
      changeType
    }
  }
}
</script>

<style lang="scss" scoped>
.baseinfo-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #000;
}
.baseinfo-card-body {
  padding-right: 600px;
}
.flex-div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  :deep(.el-form-item__content) {
    display: flex;
    align-items: center;
  }
  :deep(.el-form-item) {
    margin-bottom: 0;
  }
}
.w-140 {
  width: 140px;
}
.mt-20{
  margin-top: 20px;
}
</style>
