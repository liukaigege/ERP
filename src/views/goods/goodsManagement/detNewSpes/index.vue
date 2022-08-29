<!--
 * @Descripttion: 'detNewSpes.vue 设置新规格'
 * @version: 2.0
 * @Author: 王新国
 * @Date: 2021-09-06 00:00:00
 * @LastEditors: 朱涛（梅溪）
 * @LastEditTime: 2021-10-23 10:46:23
-->
<template>
  <div style="padding-top: 60px">
    <div class="pageHeader">
      <i class="el-icon-arrow-left" @click="backFn"></i>
      <span>{{ pageTitle }}</span>
    </div>
    <div class="container" v-if="headerSkuData">
      <div class="containerTitle">原品类规格值</div>
      <div class="containerContent">
        <div class="btnsContaier clearfix">
          <div
            class="fl"
            :class="language ? 'active' : ''"
            @click="changeLanguage(true)"
          >
            中文
          </div>
          <div
            class="fl"
            :class="language ? '' : 'active'"
            @click="changeLanguage(false)"
          >
            英文
          </div>
        </div>
        <ul class="skuList" v-if="originData">
          <li
            class="list clearfix"
            v-for="item in originData.spes"
            :key="item.id"
          >
            <p class="fl titleName">
              规格参数：{{ language ? item.nameCn : item.nameEn }}
            </p>
            <p class="fl skuName">参数可选值：</p>
            <div class="fl btnsList">
              <el-button
                style="margin: 0 20px 20px 0"
                v-for="v in item.speValues"
                :key="v.id"
                >{{ language ? v.nameCn : v.nameEn }}</el-button
              >
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="container" v-if="goodsRelation">
      <div class="containerTitle clearfix">组合商品规格信息</div>
      <div class="containerContent">
        <el-table :data="goodsRelation" style="width: 100%" border>
          <el-table-column label="商品信息" header-align="center">
            <template #default="scope">
              <div class="itemList">
                <div class="imgContainer">
                  <el-popover
                    placement="right-start"
                    trigger="hover"
                    width="auto"
                  >
                    <el-image
                      style="width: 200px; height: 200px"
                      :src="scope.row.mainImageUrl"
                      fit="contain"
                    ></el-image>
                    <template #reference>
                      <el-image
                        class="ml-10"
                        style="width: 70px; height: 70px"
                        :src="scope.row.mainImageUrl"
                        fit="contain"
                      ></el-image>
                    </template>
                  </el-popover>
                </div>

                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="scope.row.nameEn || scope.row.nameCn"
                  placement="top"
                >
                  <p class="titleName">
                    {{ scope.row.nameEn || scope.row.nameCn }}
                  </p>
                </el-tooltip>
                <p class="titleName">{{ scope.row.relationId }}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="categoryName"
            label="品类"
            width="200"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column label="商品规格" header-align="center">
            <template #default="scope">
              <p v-for="v in scope.row.goodsSpeVOList" :key="v.frontId">
                <span style="font-weight: 550"
                  >{{ v.nameEn || v.nameCn }}：</span
                >
                <span v-for="val in v.speValues" :key="val.frontId"
                  >{{ val.nameEn || val.nameCn }}&nbsp;&nbsp;&nbsp;</span
                >
              </p>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="container">
      <div class="containerTitle clearfix">
        新品类设置规格值
        <el-button type="text" class="fr" @click="commonSpecifications"
          >管理常用规格</el-button
        >
      </div>
      <div class="containerContent">
        <MultiSku
          v-if="skuData && (goodsRelation || combineType == 1) && skuList"
          :skus="skuData.skus"
          :spes="skuData.spes"
          @showDradwer="showDradwer"
          @showSelectImg="showSelectImg"
          @selectImgEditAll="attrImagesBack"
          :goodsInfo="goodsRelation"
          :skuList="skuList"
					:newspe="changeType"
        />
        <!-- <div class="masker" :style="changeType ? '' : 'display: none;'"></div> -->
      </div>
      <div
        class="newCustomDataContainer"
        v-if="newCustomData && goodsData?.combineType != 2"
      >
        <NewCoustom
          v-model="newCustomData"
          :isCustom="true"
          ref="newCustomRef"
          :isAdd="isAdd"
        />
      </div>
    </div>

    <!-- 右侧申请新规格抽屉 -->
    <el-drawer
      v-model="drawer"
      title="规格设置"
      direction="rtl"
      size="32%"
      @close="skuCallBack(false)"
    >
      <!-- 更改品类的，重新添加规格 -->
      <AddSku
        v-if="drawer && skuData && headerSkuData"
        :query="skuData.spes"
        @ok="skuCallBack"
        @cancel="skuCallBack(false)"
        @selectSpe="selectSpe"
        ref="AddSkuRefs"
        @showSelectImg="showSelectImg"
      />
      <!-- 申请新规格的，只能改动新规格 -->
      <AddSkus
        v-if="drawer && skuDatas && !headerSkuData"
        :query="skuDatas.spes"
        :goodsId="goodsId"
        :goodsData="goodsData"
        @ok="applyCallBack"
        @cancel="cancel"
        :categoryId="categoryId"
      />
    </el-drawer>
    <SpeDialog
      v-if="showSelectSpe"
      :dialogVisible="showSelectSpe"
      :query="selectSpeQuery"
      @selectSpeOk="selectSpeOk"
    />
    <SelectImg
      :dialogVisible="dialogVisible"
      :multiple="multiple"
      v-if="dialogVisible"
      :skuQuery="skuQuery"
      @selectImg="selectImg"
    />

    <div class="pageFooter">
      <el-button @click="backFn">取消</el-button>
      <el-button type="primary" @click="submit">{{
        changeType && goodsData?.enableCustom == 1 ? '保存商品' : '申请报价'
      }}</el-button>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, provide, computed, ref } from 'vue'
import AddSku from '@/views/goods/components/sku/components/addSku.vue'
import AddSkus from '@/views/goods/components/goodsDescription/components/addSku.vue'
import MultiSku from '@/views/goods/components/sku/components/multiSku.vue'
import SelectImg from '@/views/goods/components/sku/components/selectImg.vue'
import NewCoustom from '@/views/goods/components/sku/components/newCoustom.vue'
import {
  resData,
  comparisonSkus,
  createSkus
} from '@/views/goods/components/goodsDescription/composables/tools'
import {
  goodsInfo,
  applyNewSku,
  changeNewSku,
  getSpe,
  goodsDetail,
  updateType
} from '@/views/goods/components/goodsDescription/composables/api'
import SpeDialog from '@/views/goods/components/sku/components/speDialog.vue'
import { ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import optionJson from '@/views/goods/components/sku/hooks/optionJson.js'
import {
  comparisonSku,
  createSku,
  sortList,
  getGoodsInfo
} from './composables/index'
import { deepCopy, isObjectValueEqual } from '@/utils/tool.js'
export default {
  components: { AddSku, MultiSku, AddSkus, SpeDialog, SelectImg, NewCoustom },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const goodsId = route.query.id || null
    const categoryId = route.query.categoryId - 0 || null
    const isAdd = route.query.isAdd == '1'
    let skuData = null
    let skuDatas = {
      skus: []
    }
    let originalCustomData = null
    const newCustomRef = ref(null)
    let routeEnableCustom = route.query.enableCustom || null
    const changeType = routeEnableCustom !== null

    if (route.query.paramsStatus && sessionStorage.getItem('paramsData')) {
      let list = route.params.data
        ? JSON.parse(route.params.data)
        : JSON.parse(sessionStorage.getItem('paramsData'))
      // 处理排序，新增isAdd=1，排在前面
      skuData = deepCopy(sortList(list))

      skuData.skus.forEach(v => {
        v.goodsId = goodsId
      })

      skuDatas = deepCopy(sortList(list))
      // 给朱涛回显
      skuData.skus.forEach(sku => {
        if (sku.goodsSkuCombinationRelation) {
          sku.goodsSkuCombinationRelation = sku.goodsSkuCombinationRelation.map(
            item => {
              return {
                ...item,
                speLabel: item.goodsSpeValList.map(spe => spe.nameEn).join('-')
              }
            }
          )
        }
      })
    }
    const routeName = route.name
    provide('routeName', routeName)
    const routeOption = optionJson['detNewSpes']
    provide('routeOption', routeOption)
    if (route.query.combineType == 2 && route.query.combination == 1)
      provide('showCombineGoods', true)
    const state = reactive({
      categoryId,
      skuData,
      skuDatas,
      originData: null,
      headerSkuData: null,
      drawer: false,
      language: true,
      pageTitle: changeType
        ? '确认商品类型'
        : route.query.paramsStatus
        ? '确认新规格'
        : '设置新规格',
      speList: null,
      showSelectSpe: false,
      selectSpeQuery: null,
      goodsInfo: null,
      goodsImages: null,
      commonAttr: null,
      skuQuery: null,
      multiple: false,
      dialogVisible: false,
      addAttrImages: null,
      attrImages: null,
      skuType: 2, //商品SKU类型 1.单规格 2.多规格 3.定制
      combineType: 1, //1:单品 2：组合品
      goodsData: null,
      goodsRelation: null,
      combineRelType: null,
      skuList: null,
      newCustomData: null,
      offerFittingSwitch: 0,
      offerFittingSwitchChange: 0
    })
    //获取商品信息
    goodsDetail({ goodsId }).then(res => {
      if (res.code == 200) {
        state.skuList = res.data.skus || []
        state.goodsData = deepCopy(res.data)
        const {
          goodsCustomFittingList,
          enableCustom,
          enableContainFitting,
          goodsCustomTypeList
        } = state.goodsData
        provide('isDisabled', res.data.enableCustom == 1)
      } else {
        ElMessage.warning({ message: res.message })
      }
    })
    const speList = computed(() => state.speList)
    provide('speList', speList)
    const goodsImages = computed(() => state.goodsImages)
    provide('goodsImages', goodsImages)
    const attrImages = computed(() => state.attrImages)
    provide('attrImages', attrImages)
    const combineRelType = computed(() => state.combineRelType)
    provide('combineRelType', combineRelType)
    if (!route.query.paramsStatus) {
      state.skuData = { skus: [], spes: [] }
      goodsInfo({ goodsId }).then(res => {
        if (res.code == 200) {
          state.headerSkuData = res.data.commonAttr || { skus: [], spes: [] }
          state.originData = deepCopy(res.data.commonAttr)
        } else {
          ElMessage.warning({ message: res.message })
        }
      })

      getSpe({
        categoryId: state.categoryId
      }).then(res => {
        if (res.code == 200) {
          state.speList = res.data
        } else {
          ElMessage.warning({ message: res.message })
        }
      })
    }

    // 获取商品信息
    getGoodsInfo({ goodsId }).then(res => {
      if (res.code == 200) {
        const { goodsCustomFittingList, enableCustom, enableContainFitting } =
          res.data
        const goodsCustomTypeList = res.data.goodsCustomTypeList?.map(
          v => v.type
        )
        if (routeEnableCustom === '1') {
          routeEnableCustom = 0
        } else if (routeEnableCustom === '0') {
          routeEnableCustom = 1
        } else {
          routeEnableCustom = enableCustom
        }
        state.newCustomData = {
          goodsCustomFittingList: goodsCustomFittingList || [],
          enableCustom: routeEnableCustom,
          goodsCustomTypeList: goodsCustomTypeList || [],
          enableContainFitting
        }
        originalCustomData = {
          goodsCustomFittingList: goodsCustomFittingList || [],
          enableCustom: routeEnableCustom,
          goodsCustomTypeList: goodsCustomTypeList || [],
          enableContainFitting
        }
        state.skuType = res.data.skuType
        state.combineType = res.data.combineType
        state.goodsImages = deepCopy(res.data.goodsImages)
        state.attrImages = deepCopy(res.data.attrImages)
        skuData?.skus?.forEach(sku => {
          sku.speValues.forEach(v => {
            if (
              v.activeName == '1' &&
              !state.attrImages.some(el => el.pictureId == v.pictureId)
            ) {
              state.attrImages.push({
                goodsId,
                id: v.id || null,
                pictureId: v.pictureId || null,
                referenced: v.referenced || null,
                resolution: v.resolution || null,
                sort: v.sort || 1,
                thumbnailUrl: v.img || null,
                img: v.img || null,
                url: v.url || null
              })
            }
          })
        })
        state.combineRelType = res.data.combineRelType
        if (route.query.combineType == 2 || res.data.combineType == 2)
          state.goodsRelation = res.data.goodsRelation
            ? res.data.goodsRelation.map(v => {
                v.id = v.relationId
                return v
              })
            : []
      } else {
        ElMessage.warning({ message: res.message })
      }
    })

    function skuCallBack(data) {
      if (data) {
        // 子组件返回值
        const { sku, spes } = deepCopy(data)
        state.skuData.spes = spes
        let x = state.skuData.skus || []
        state.skuData.skus = comparisonSku(createSku(sku), x)
        state.skuData = sortList(state.skuData)
      }
      state.drawer = false
    }
    function showDradwer() {
      state.skuDatas = deepCopy(state.skuData)
      state.drawer = true
    }
    function changeLanguage(data) {
      state.language = data
    }
    function attrImagesBack(val) {
      if (typeof val.url[0].resolution != 'string') {
        // 新增 属性图片 新增的attrImages
        val.url[0].resolution =
          val.url[0].resolution.width + '*' + val.url[0].resolution.height
        state.addAttrImages = val.url
      } else {
        state.addAttrImages = null
      }
    }

    function backFn() {
      sessionStorage.removeItem('paramsData')
      router.go(-1)
    }
    function commonSpecifications() {
      router.push({
        name: 'commonSpecifications'
      })
    }
    function submit() {
      if (changeType) {
        // 直接修改类型
        newCustomRef.value.emitData()
        let trmpArr = []
        if (state.newCustomData.enableCustom == 0) {
          state.newCustomData.goodsCustomFittingList = []
          state.newCustomData.goodsCustomTypeList = []
          state.newCustomData.enableContainFitting = 0
        } else {
          if (state.newCustomData?.goodsCustomTypeList.length == 0)
            return ElMessage.warning({ message: '请选择定制类型' })
          trmpArr = state.newCustomData?.goodsCustomTypeList?.map(v => {
            return (v = { type: v, goodsId })
          })
        }
        const changeTypeObj = {
          goodsCustomFittingList: state.newCustomData.goodsCustomFittingList,
          goodsCustomTypeList: trmpArr,
          enableCustom: state.newCustomData.enableCustom,
          enableContainFitting: state.newCustomData.enableContainFitting,
          pageType: 2,
          id: goodsId,
          offerFittingSwitch: state.newCustomData?.offerFittingSwitch || 0,
          offerFittingSwitchChange:
            state.newCustomData?.offerFittingSwitchChange || 1
        }
        updateType(changeTypeObj).then(res => {
          if (res.code == 200) {
            ElMessage.success({ message: '商品类型修改完成' })
            setTimeout(() => {
              router.push({
                path: '/goods/goodsManagement/setPrice/detail',
                query: {
                  id: goodsId,
                  back: 1
                }
              })
            }, 2000)
          } else {
            ElMessage.warning({ message: res.message })
          }
        })
        return false
      }
      if (!state.skuData.skus.every(v => v.url)) {
        ElMessage.warning({ message: '有规格未上传图片' })
        return false
      }

      if (!state.skuData.skus.every(v => v.expectPrice)) {
        ElMessage.warning({ message: '有规格未填写期望售价' })
        return false
      }
      if (
        state.combineType == 2 &&
        state.skuData.skus.some(v => !v.goodsSkuCombinationRelation) &&
        route.query.combination == 1
      ) {
        ElMessage.warning({ message: '有规格未关联商品' })
        return false
      }
      let spes = []
      state.skuData.spes.forEach(v => {
        v.speValues.forEach(val => {
          if (val.isAdd) {
            val.id = null
          }
        })
        spes.push(v)
      })
      let obj = {
        originalGoodsId: state.skuType == 1 ? goodsId : null, //后台据此是否有值判断是否是单规格
        combinationId: state.combineType == 2 ? goodsId : null, //后台据此是否有值判断是否是组合品
        goodsId,
        categoryId,
        spes,
        combineRelType: state.combineRelType,
        skus: state.skuData.skus,
        attrImages: state.attrImages,
        goodsImages: state.goodsImages
      }
      // 获取所有组合品单品的goodsid
      let allRelationGoods = false
      // 获取所有有关联关系的goodsid
      const relationGoodsIds = []
      obj.skus.forEach(item => {
        item.goodsSkuCombinationRelation?.forEach(val => {
          relationGoodsIds.push(val.goodsId)
        })
        item.speValues.forEach(v => {
          if (
            v.activeName == '1' &&
            !obj.attrImages.some(el => el.pictureId == v.pictureId)
          ) {
            obj.attrImages.push({
              goodsId,
              id: v.id || null,
              pictureId: v.pictureId || null,
              referenced: v.referenced || null,
              resolution: v.resolution || null,
              sort: v.sort || 1,
              thumbnailUrl: v.img || null,
              img: v.img || null,
              url: v.url || null
            })
          }
        })
      })
      state.goodsRelation?.forEach(v => {
        if (relationGoodsIds.every(val => v.id != val)) allRelationGoods = v.id
      })
      if (allRelationGoods)
        return ElMessage.error({
          message: `组合品异常！[提交失败，选择的商品${allRelationGoods}未被组合品关联！]`
        })
      if (state.newCustomData.enableCustom === 1) {
        newCustomRef.value.emitData()

        const { goodsCustomFittingList, enableCustom, enableContainFitting } =
          state.newCustomData
        const goodsCustomTypeList =
          state.newCustomData?.goodsCustomTypeList?.map(v => {
            return (v = { type: v, goodsId })
          })
        // 判断商品数据是否有改变
        if (
          isObjectValueEqual(
            {
              goodsCustomFittingList: goodsCustomFittingList.map(v => {
                delete v._X_ID
                return v
              }),
              enableCustom,
              enableContainFitting,
              goodsCustomTypeList: goodsCustomTypeList.map(v => v.type)
            },
            originalCustomData
          ) &&
          obj.skus.every(v => v.isAdd != 1)
        ) {
          // 数据无变化 请添加主件或配件信息！
          ElMessage.warning({
            message: '请添加主件或配件信息！'
          })
          return false
        }
        obj = {
          ...obj,
          ...{
            goodsCustomFittingList,
            enableCustom,
            enableContainFitting,
            goodsCustomTypeList
          }
        }
      } else {
        obj = {
          ...obj,
          ...{
            goodsCustomFittingList: [],
            enableCustom: 0,
            enableContainFitting: 0,
            goodsCustomTypeList: []
          }
        }
      }
      if (route.query.paramsStatus) {
        // 确认新规格
        applyNewSku(obj).then(res => {
          if (res.code == 200) {
            ElMessage.success({ message: res.message })
            setTimeout(() => {
              // router.back(-2)
              sessionStorage.removeItem('paramsData')
              router.push({
                path: '/goods/goodsManagement/setPrice/detail',
                query: {
                  id: goodsId,
                  back: 1
                }
              })
            }, 500)
          } else {
            ElMessage.warning({ message: res.message })
          }
        })
      } else {
        // 更换品类过来的==》设置新规格
        changeNewSku(obj).then(res => {
          if (res.code == 200) {
            ElMessage.success({ message: res.message })
            setTimeout(() => {
              router.go(-2)
            }, 500)
          } else {
            ElMessage.warning({ message: res.message })
          }
        })
      }
    }

    //申请新规格跳转过来后修改规格子组件返回值
    function applyCallBack(data) {
      const { sku, spes } = resData(deepCopy(data))
      let x = deepCopy(state.skuData.skus).filter(v => v.lgtStatch == 1) || []
      let skus = comparisonSkus(createSkus(sku), x)
      state.skuData = sortList({
        skus: skus.map(el => {
          el.goodsId = goodsId
          return el
        }),
        spes
      })
      cancel()
    }
    function cancel() {
      state.drawer = false
    }
    let AddSkuRefs = ref(null)

    function selectSpeOk(val) {
      const { query, selectList } = val
      const { type, index } = query
      if (type == 'muliti') {
        let r = AddSkuRefs.value.skuRefs[index - 1]
        r.addSpe(selectList)
      } // 多规格设置
    }

    function selectSpe(data) {
      state.selectSpeQuery = data
      state.showSelectSpe = true
    }

    function showSelectImg(val) {
      if (val) {
        state.skuQuery = val
        state.multiple = val.multiple
        state.dialogVisible = true
      }
    } // 打开选择图片弹窗

    function selectImg(val) {
      attrImagesBack(val)
      const { query, url } = val
      if (query.type == 0) {
        state.skuData.skus.forEach(item => {
          if (query.ids?.indexOf(item.frontId) !== -1) {
            item.url = url[0].url
            item.pictureId = url[0].pictureId
          }
        }) // 多规格列表
      } else if (query.type == 1) {
        let r = AddSkuRefs.value.skuRefs[query.index - 1]
        r.getImgList(url) // 新增图片
      } else if (query.type == 2) {
        CoustomDraweRefs.value.getImgList(url)
      } // 定制规格主规格
      else if (query.type == 3) {
        CoustomChildDraweefs.value.getImgList(url)
      } // 定制规格子规格
    } // 选择图片的emit
    return {
      ...toRefs(state),
      skuCallBack,
      showDradwer,
      changeLanguage,
      backFn,
      commonSpecifications,
      submit,
      goodsId,
      applyCallBack,
      cancel,
      selectSpeOk,
      selectSpe,
      AddSkuRefs,
      showSelectImg,
      selectImg,
      attrImagesBack,
      newCustomRef,
      changeType,
      isAdd
    }
  }
}
</script>

<style lang="scss" scoped>
.itemList {
  padding-left: 90px;
  height: 70px;
  box-sizing: border-box;
  position: relative;
  .imgContainer {
    width: 70px;
    height: 70px;
    position: absolute;
    left: 0;
    top: 0;
  }
  .titleName {
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    cursor: default;
  }
}
:deep(.el-drawer__body) {
  overflow-y: auto;
}
.pageHeader {
  position: fixed;
  width: calc(100% - var(--sideBarWidth));
  height: 60px;
  right: 0;
  top: 111px;
  border-bottom: 1px solid #e9e9e9;
  background-color: #fff;
  z-index: 99;
  .el-icon-arrow-left {
    position: absolute;
    left: 20px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 20px;
    cursor: pointer;
  }
  span {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    font-size: 20px;
  }
}
.container {
  width: calc(100% - var(--sideBarWidth) - 40);
  background-color: #fff;
  margin-bottom: 20px;
  padding-bottom: 20px;
  .containerTitle {
    border-bottom: 1px solid #e9e9e9;
    line-height: 36px;
    margin-bottom: 20px;
    box-sizing: border-box;
    padding: 10px 20px;
  }
  .containerContent {
    width: 100%;
    box-sizing: border-box;
    padding: 0 20px;
    position: relative;
    .masker {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
    }
  }
}
.pageFooter {
  width: calc(100% - var(--sideBarWidth));
  background-color: #fff;
  position: fixed;
  z-index: 99;
  bottom: 0;
  right: 0;
  padding: 10px 42px;
  box-sizing: border-box;
  text-align: right;
}
.btnsContaier {
  .fl {
    width: 70px;
    line-height: 32px;
    border: 1px solid #e8e8e8;
    text-align: center;
    cursor: pointer;
  }
  .active {
    border: 1px solid #1890ff;
    color: #1890ff;
  }
}
.skuList {
  margin-top: 20px;
  p {
    line-height: 32px;
  }
  .titleName {
    width: 15%;
  }
  .skuName {
    margin-right: 20px;
  }
  .btnsList {
    width: 75%;
  }
}
.newCustomDataContainer {
  box-sizing: border-box;
  padding: 20px;
}
</style>
