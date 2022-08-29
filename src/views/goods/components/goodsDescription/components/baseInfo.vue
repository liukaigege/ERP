<!--
 * @Descripttion: 'baseInfo.vue 基本信息'
 * @version: 2.0
 * @Author: 王新国
 * @Date: 2021-09-06 00:00:00
 * @LastEditors: 王新国
 * @LastEditTime: 2021-09-06 00:00:00
-->
<template>
  <div class="baseInfoContainer">
    <div class="baseInfoHeader">基本信息</div>
    <div class="baseInfoContent">
      <el-form
        :model="baseInfoData"
        :rules="rules"
        class="demo-baseInfoData"
        :inline="true"
        label-width="130px"
      >
        <el-form-item label="产品标题：" prop="titleName">
          <el-radio-group v-model="language" @change="languageChange">
            <el-radio-button label="英文"></el-radio-button>
            <el-radio-button label="中文"></el-radio-button>
          </el-radio-group>
          <div class="languageContent">
            <el-input
              v-model="baseInfoData.titleName"
              :disabled="!isEdit"
              :style="styleCss"
            ></el-input>
            <el-button
              type="text"
              class="transtlateBtn"
              @click="transtlateBtn"
              v-if="isEdit"
            >
              翻译并填充{{ language == '英文' ? '中文' : '英文' }}
            </el-button>
          </div>
        </el-form-item>
        <el-form-item label="产品品类：">
          <el-cascader
            v-model="categoryId"
            :options="categoryData"
            @change="handleChange"
            :disabled="!categoryStatus"
            :style="'width: 250px'"
            :props="{ value: 'id', label: 'name', children: 'child' }"
          ></el-cascader>
          <el-button
            v-if="
              categoryStatus &&
              !isEdit &&
              layFlag == 0 &&
              combine != 1 &&
              authPath('changeCategory:btn')
            "
            type="primary"
            style="margin-left: 127px"
            @click="changeCategoryfn"
            >保存</el-button
          >
          <el-button
            v-if="
              categoryStatus &&
              !isEdit &&
              layFlag == 0 &&
              combine != 1 &&
              authPath('changeCategory:btn')
            "
            @click="changeEditor"
            >取消</el-button
          >
          <el-button
            v-if="
              !categoryStatus &&
              !isEdit &&
              layFlag == 0 &&
              combine != 1 &&
              authPath('changeCategory:btn')
            "
            :disabled="sourceRoute"
            type="primary"
            style="margin-left: 167px"
            @click="changeEditor"
            >更改品类</el-button
          >
        </el-form-item>
        <el-form-item
          label="产品类型："
          v-if="
            !isEdit &&
            layFlag == 0 &&
            combine != 1 &&
            goodsData.combineType != 2
          "
        >
          <span style="margin-right: 60px">{{
            goodsData.enableCustom == 1 ? '定制商品' : '普通商品'
          }}</span>
          <el-button type="primary" @click="changeGoodsType"
            >更改类型</el-button
          >
        </el-form-item>
        <el-form-item label="产品标签：">
          <el-select
            v-model="baseInfoData.labels"
            placeholder="请选择产品标签"
            :multiple="true"
            :disabled="!isEdit"
            :style="styleCss"
          >
            <el-option
              v-for="item in labelList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
              <span>
                {{ item.name }}
              </span>
            </el-option>
          </el-select>
        </el-form-item>
        <br />
        <div class="baseInfo-box">
          <el-form-item label="期望售价(USD)：">
            <div>
              {{ baseInfoData.expectPrice || '0.00' }}
            </div>
          </el-form-item>
          <el-form-item
            label="建议售价(USD)："
            v-if="routeName != 'PurchaseQuote'"
          >
            <div>{{ qiwangPrice || '0.00' }}</div>
          </el-form-item>
        </div>
        <div class="baseInfo-box">
          <el-form-item label="商品来源：">
            <div>{{ baseInfoData.collectWay }}</div>
          </el-form-item>
          <el-form-item label="查看权限：">
            <div>
              {{
                baseInfoData.authType == 0
                  ? '仅维护人可见'
                  : baseInfoData.authType == 1
                  ? '仅部门人员可见'
                  : baseInfoData.authType == 2
                  ? '所有人可见'
                  : '部门及以下可见'
              }}
            </div>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
import { reactive, toRefs, getCurrentInstance, watch } from 'vue'
import {
  labelList,
  changeCategory,
  categoryValidate
} from '../composables/api.js'
import { ElMessageBox, ElMessage } from 'element-plus'
import { styleCss, baseInfoRule } from '../composables/data.js'
import { getCategory } from '@/api/goods/quotedPrice.js'
import { useRoute, useRouter } from 'vue-router'
import { getExchangeRataListPage } from '@/api/financial.js'
import { treeToArr } from '@/utils/tool.js'
import { authPath } from '@/utils/hooks'
import { statusTips } from '../composables/tools.js'
import { baiduTranslate } from '@/utils/translate'
export default {
  props: {
    data: {
      type: Object,
      default: {}
    },
    id: {
      type: String,
      default: ''
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    layFlag: {
      type: Number,
      default: 0
    },
    goodsData: {
      type: Object,
      default: null
    },
    sourceRoute: Boolean
  },
  setup(props, context) {
    // console.log('基础信息', props.data)
    const { proxy } = getCurrentInstance()
    const route = useRoute()
    const router = useRouter()
    const routeName = route.name
    const goodsId = route.query.id || props.id || null
    const combine = route.query.combine || null
    const { categoryId } = props.data //已选择品类
    let qiwangPrice = 0
    if (props.goodsData.offerSku) {
      for (var i = 0; i < props.goodsData.offerSku.length; i++) {
        if (
          props.goodsData.offerSku[i].price &&
          props.goodsData.offerSku[i].freightUsa
        ) {
          qiwangPrice = (
            props.goodsData.offerSku[i].price *
            1 *
            props.goodsData.suggestPriceFactor *
            props.goodsData.rate
          ).toFixed(2)
          break
        }
      }
    }
    if (props.goodsData.custSku) {
      qiwangPrice = (
        props.goodsData.custSku.price *
        props.goodsData.suggestPriceFactor *
        props.goodsData.rate
      ).toFixed(2)
    }
    const state = reactive({
      baseInfoData: props.data,
      rules: baseInfoRule,
      language: '英文',
      labelList: [], //标签列表
      categoryData: [], //商品品类列表
      categoryId,
      categoryStatus: false //false正常状态 true编辑品类状态
    })
    state.baseInfoData.titleName = state.baseInfoData.nameEn
    //获取标签列表
    labelList().then(res => {
      state.labelList = res.data.dataList.filter(v => v.status)
    })

    //获取商品品类列表
    getCategory().then(res => {
      state.categoryData = res.data
    })

    watch(state.baseInfoData, () => {
      if (state.language == '英文') {
        state.baseInfoData.nameEn = state.baseInfoData.titleName
      } else {
        state.baseInfoData.nameCn = state.baseInfoData.titleName
      }
      context.emit('changeBack', state.baseInfoData)
    })
    //切换标题语言
    function languageChange() {
      if (state.language == '英文') {
        state.baseInfoData.titleName = state.baseInfoData.nameEn
      } else {
        state.baseInfoData.titleName = state.baseInfoData.nameCn
      }
    }
    getExchangeRataListPage({
      baseCurrency: 'USD',
      originalCurrency: 'CN',
      page: { pageNo: 1, pageSize: 100 }
    }).then(({ data }) => {})
    // 计算建议售价
    function calcPrice(row) {
      let { purchasePrice, freightUsa } = row
      if (purchasePrice && freightUsa) {
        return (
          ((Number(purchasePrice) + Number(freightUsa)) * props.rate) /
          0.48
        ).toFixed(2)
      }
      return ''
    }
    //确定更改品类
    function changeCategoryfn() {
      let categoryId = state.categoryId
      if (Array.isArray(state.categoryId))
        categoryId = categoryId[categoryId.length - 1]
      categoryValidate({ goodsId, categoryId }).then(res => {
        if (res.data.result) {
          state.baseInfoData.categoryId = categoryId
          ElMessage.success({ message: res.message })
          state.categoryStatus = false
        } else {
          ElMessageBox.confirm(
            `继续更改需重新编辑商品规格值并申请报价，${
              props.goodsData.combineType == 2
                ? '已绑定的采购商品关联关系也将被解除，'
                : ''
            }你还要继续吗？`,
            '新更品类与原品类的常用规格不匹配',
            {
              confirmButtonText: '继续',
              cancelButtonText: '取消',
              type: 'warning'
            }
          )
            .then(() => {
              router.push({
                path: '/goods/goodsManagement/detNewSpes/index',
                query: {
                  id: goodsId,
                  categoryId,
                  isAdd: 1
                }
              })
            })
            .catch(() => {})
        }
      })
    }

    //品类选择结果
    const handleChange = value => {
      if (value && value.length)
        state.baseInfoData.categoryId = value[value.length - 1]
    }
    //切换品类编辑状态
    function changeEditor() {
      if (props.goodsData.operateStatus) {
        statusTips(props.goodsData.operateStatus)
        return false
      }
      state.categoryStatus = !state.categoryStatus
    }

    // 中英文翻译
    function transtlateBtn() {
      const val = state.baseInfoData.titleName // 当前标题
      const from = state.language == '英文' ? 'en' : 'zh'
      const to = state.language == '英文' ? 'zh' : 'en'
      baiduTranslate(val, from, to).then(res => {
        if (res.str) {
          // ElMessage.success('翻译成功!')
          if (state.language == '英文') {
            state.baseInfoData.nameCn = res.str
          } else {
            state.baseInfoData.nameEn = res.str
          }
        }
      })
    }
    function changeGoodsType() {
      if (props.goodsData.skuType == 1)
        return ElMessage.warning({ message: '单规格商品不支持更换产品类型' })
      if (props.goodsData.operateStatus)
        return statusTips(props.goodsData.operateStatus)
      ElMessageBox.confirm(`确认更改产品类型？`, '', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const { skus, spes } = props.goodsData
          const paramsData = JSON.stringify({ skus, spes })
          sessionStorage.setItem('paramsData', paramsData)
          router.push({
            path: '/goods/goodsManagement/detNewSpes/index',
            query: {
              id: props.goodsData.id,
              categoryId: props.goodsData.categoryId,
              combineType: props.goodsData.combineType,
              combination: route.query.combination || 0,
              paramsStatus: 1,
              enableCustom: props.goodsData.enableCustom
            },
            params: {
              data: paramsData
            }
          })
        })
        .catch(() => {})
    }

    return {
      ...toRefs(state),
      styleCss,
      languageChange,
      handleChange,
      changeEditor,
      changeCategoryfn,
      combine,
      qiwangPrice,
      routeName,
      transtlateBtn,
      changeGoodsType
    }
  }
}
</script>
<style lang="scss" scoped>
.baseInfoContainer {
  box-sizing: border-box;
  .baseInfoHeader {
    border-bottom: 1px solid #e8eaec;
    box-sizing: border-box;
    padding: 0 40px;
    margin: 0 -30px;
    line-height: 50px;
  }
  .baseInfoContent {
    box-sizing: border-box;
    padding: 20px 10px 0;
  }
  .baseInfo-box {
    width: 990px;
    display: flex;
    justify-content: space-between;
  }
  .languageModal {
    .languageContent {
      position: relative;
      top: -7px;
      margin-bottom: 20px;
      .transtlateBtn {
        position: absolute;
        right: 10px;
        top: -25px;
      }
    }
    :deep(.el-form-item__error) {
      top: 70%;
    }
  }
  .input-with-select {
    width: 180px;
  }
}
</style>
