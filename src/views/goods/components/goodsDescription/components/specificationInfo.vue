<!--
 * @Descripttion: 'specificationInfo 规格信息'
 * @version: 2.0
 * @Author: 王新国
 * @Date: 2021-09-06 00:00:00
 * @LastEditors: 王新国
 * @LastEditTime: 2021-09-06 00:00:00
-->
<template>
  <div class="specificationContainer">
    <div class="specificationHeader">
      <span>规格信息</span>
      <el-button
        type="text"
        class="btns"
        @click="openSkuRecord"
        :style="
          !isEdit && layFlag == 0 && combine != 1 && goodsData.skuType == 2
            ? 'right: 150px;'
            : 'right: 10px;'
        "
        >SKU历史记录</el-button
      >
      <el-button
        type="primary"
        class="btnsSku"
        v-if="
          !isEdit &&
          layFlag == 0 &&
          combine != 1 &&
          authPath('applyNewSpes:btn')
        "
        @click="applyNewSku"
        :disabled="sourceRoute"
        >申请新规格</el-button
      >
    </div>
    <div class="specificationContent">
      <div class="radioContainer">
        <span class="titleContainer">货源渠道：</span>
        <el-select
          v-model="spevData.channelId"
          placeholder="请选择"
          :disabled="true"
        >
          <el-option
            v-for="item in channelList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </div>
      <div v-if="isEdit">
        <div
          class="radioContainer"
          v-for="item in spevData.spes"
          :key="item.id"
        >
          <span class="titleContainer" style="margin-top: 20px">{{
            radioValue == 1 ? item.nameCn + '：' : item.nameEn + '：'
          }}</span>
          <button
            style="margin-top: 20px"
            class="spe-btn"
            v-for="ele in item.speValues"
            :key="ele.id"
            :class="{ 'is-active': ele.checked }"
            @click="cleckSkuFn(ele)"
          >
            {{ radioValue == 1 ? ele.nameCn : ele.nameEn }}
          </button>
        </div>
      </div>
      <div class="radioContainer" style="margin-top: 20px">
        <el-radio v-model="radioValue" :label="1">中文</el-radio>
        <el-radio v-model="radioValue" :label="2">英文</el-radio>
      </div>
      <div class="tableContainer">
        <div class="clearfix" style="padding: 0 0 20px">
          <el-button
            type="primary"
            v-if="isEdit && layFlag == 0 && combine != 1"
            style="margin-left: 20px"
            @click="showChangeImg"
            >批量修改</el-button
          >
          <el-button
            type="primary"
            v-if="
              isEdit && layFlag == 0 && combine != 1 && goodsData.skuType != 1
            "
            style="margin-left: 20px"
            @click="setSkuFn"
            >设置规格参数</el-button
          >
          <el-button
            type="primary"
            class="fr"
            v-if="
              !isEdit &&
              layFlag == 0 &&
              combine != 1 &&
              authPath('changeSkuStatus:btn')
            "
            :disabled="sourceRoute"
            @click="skuStatusChange"
            >SKU状态变更</el-button
          >
        </div>
        <SpecTable
          :dataValue="spevData"
          :skuStatus="skuStatus"
          :language="radioValue"
          :isEdit="isEdit"
          :layFlag="layFlag"
          @tableBack="tableBack"
          ref="specTableRef"
          :skuType="skuType"
          v-model="shouldChangeList"
          :goodsData="goodsData"
        />
      </div>
    </div>
    <!-- 批量修改=>图片 -->
    <!-- 批量修改=>图片 1.1.1修复版本 -->
    <SelectImg
      :dialogVisible="dialogVisible"
      v-if="dialogVisible"
      :multiple="false"
      @selectImg="selectImgsBack"
      :skuQuery="selectImageData"
    />
    <!-- SKU历史记录 -->
    <SkuRecord
      @changeBack="openSkuRecord"
      v-if="SkuRecordVisible && spevData"
      :data="spevData.skuHistory"
    />
    <!-- 右侧申请新规格抽屉 -->
    <el-drawer
      v-model="drawer"
      title="规格设置"
      direction="rtl"
      :before-close="closeDrawer"
    >
      <AddSku
        v-if="drawer && spevData && !setSkuShow"
        :query="querySpes"
        :goodsId="goodsIds"
        :goodsData="goodsData"
        @ok="skuCallBack"
        @cancel="cancel"
        :categoryId="goodsData.categoryId"
      />
      <SetSku
        v-if="drawer && spevData && setSkuShow"
        :query="goodsData.spes"
				:goodsData="goodsData"
        :goodsId="goodsIds"
        @ok="setSkuBack"
        @cancel="setSkuCancel"
        :categoryId="goodsData.categoryId"
      />
    </el-drawer>
  </div>
</template>
<script>
import { reactive, toRefs, watch, provide, ref, computed, toRaw } from 'vue'
import SpecTable from './specTable.vue'
import { channelList } from '../composables/api.js'
import { ElMessage } from 'element-plus'
import SkuRecord from './skuRecord.vue'
import {
  checkedButton,
  resData,
  comparisonSkus,
  statusTips
} from '../composables/tools'
import SelectImg from '@/views/goods/components/sku/components/selectImg.vue'
import AddSku from './addSku.vue'
import SetSku from './setSku.vue'
import optionJson from '@/views/goods/components/sku/hooks/optionJson.js'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { deepCopy } from '@/utils/tool.js'
import { authPath } from '@/utils/hooks'
export default {
  components: { SpecTable, SkuRecord, AddSku, SelectImg, SetSku },
  props: {
    data: {
      type: Object,
      default: {
        channelId: null,
        spes: []
      }
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    layFlag: {
      type: Number,
      default: 0
    },
    skuType: {
      type: Number,
      default: 2
    },
    goodsData: {
      type: Object,
      default: null
    },
    sourceRoute: Boolean
  },
  setup(props, context) {
    const route = useRoute()
    const router = useRouter()
    const store = useStore()
    const goodsId = route.query.id || props.goodsId || null
    const combine = route.query.combine || null
    const spevData = checkedButton(props.data)
    let querySpes = [] //可传递给子组件的数据
    let offerStatus = [] //已报价的speId集合
    props.goodsData.offerSku?.forEach(ele => {
      ele.speValues?.forEach(v => {
        offerStatus.push(v.id)
      })
    })
    props.goodsData.spes?.forEach(item => {
      let obj = deepCopy(item)
      obj.speValues = []
      item.speValues?.forEach(v => {
        if (offerStatus.filter(ele => ele == v.id).length) {
          obj.speValues.push(v)
        }
      })
      querySpes.push(obj)
    })
    const routeOption = optionJson['setPriceDetail']
    provide('routeOption', routeOption)
    const state = reactive({
      setSkuShow: false,
      dialogVisible: false, //选择图片
      selectImageData: null,
      radioValue: 2,
      checkedValue: false,
      channelList: [], //货源渠道
      spevData,
      SkuRecordVisible: false,
      drawer: false,
      skuStatus: false,
      shouldChangeList: [],
      showChangeImgData: null,
      addImgData: null,
      goodsIds: goodsId,
      skuPhoto: null
    })
    const goodsImages = computed(() => props.goodsData.goodsImages)
    provide('goodsImages', goodsImages)
    const attrImages = computed(() => props.goodsData.attrImages)
    provide('attrImages', attrImages)
    state.spevData.offerSku?.forEach(key => {
      state.shouldChangeList.push(key.id)
    })

    channelList({
      page: {
        pageNo: 1,
        pageSize: 1000
      }
    }).then(res => {
      if (res.code == 200) {
        state.channelList = res.data.dataList
      } else {
        ElMessage.warning({ message: res.message })
      }
    })

    watch(state.spevData, () => {
      context.emit('changeBack', state.spevData)
      context.emit('callBack', state.skuPhoto)
    })
    let specTableRef = ref(null)
    function openSkuRecord() {
      state.SkuRecordVisible = !state.SkuRecordVisible
    }

    function cleckSkuFn(ele) {
      ele.checked = !ele.checked // 切换状态
      let checkedIds = []
      state.spevData.spes?.forEach(v => {
        v.speValues?.forEach(val => {
          if (val.checked) checkedIds.push(val.id)
        })
      })
      let ids = [] // table 需要勾选的id
      state.spevData.offerSku?.forEach(item => {
        let arr = item.speValues.map(spe => spe.id)
        // 规格属性有选择即选择
        // if (checkedIds.some(id => arr.includes(id))) ids.push(item.id)
        // 规格属性全部选择才会选择
        if (arr.every(id => checkedIds.includes(id))) ids.push(item.id)
      })
      specTableRef.value.setCheckboxRowFn(ids, state.shouldChangeList)
      state.shouldChangeList = ids
    }
    function applyNewSku() {
      if (
        (props.goodsData.skuType === 3 ||
				props.goodsData.enableCustom == 1) &&
        props.goodsData.spes
      ) {
        // 定制品申请新规格
        // router.push({
        //   path: '/goods/goodsManagement/detNewSpes/index',
        //   query: {
        //     id: props.goodsData.id,
        //     categoryId: props.goodsData.categoryId
        //   }
        // })
        skuCallBack(props.goodsData.spes)
      } else {
        // 申请新规格
        if (props.goodsData.operateStatus) {
          statusTips(props.goodsData.operateStatus)
          return false
        }
        state.setSkuShow = false
        state.drawer = true
      }
    }
    function createSku(arr) {
      let newA = []
      arr.map(item => {
        let obj = {
          frontId: createSKUId(item),
          sku: null, //商品sku编码
          url: null, //图片链接
          originalPrice: null, //原价（USD）
          expectPrice: null, // 期望售价
          costPrice: null, //成本价
          skuSwitch: 1, //是否可用
          puhSwitch: 1, //采购报价开关
          lgtSwitch: 1, // 物流报价开关
          codeVal: null, //错码尺码
          weight: null, //重量
          lwh: null, //长宽高 *隔开
          length: null, //长
          width: null, // 宽
          height: null, // 高
          speValues: item
        }
        newA.push(obj)
      })
      return newA
      function createSKUId(x) {
        let id = 0
        x.map(item => {
          id += item.frontId
        })
        return id
      }
    } // 生成多规格sku
    function skuCallBack(data) {
      const { sku, spes } = resData(deepCopy(data))
      let x =
        deepCopy(state.spevData.skus || [])?.filter(v => v.lgtStatch == 1) || []
      let skus = comparisonSkus(createSku(sku), x)
      // goodsData
      let dataList = [],
        tempList = []
      //将未报价的SKU归类
      props.goodsData.notOfferSku?.forEach(v => {
        let tempId = ''
        v.speValues?.forEach(item => {
          tempId += item.id
        })
        tempList.push(tempId)
      })
      skus?.forEach(v => {
        let tempId = ''
        v.speValues?.forEach(item => {
          tempId += item.id
        })
        if (tempList.filter(ele => ele == tempId).length == 0) dataList.push(v)
      })
      cancel()
      const paramsData = JSON.stringify({
        skus: dataList,
        spes
      })
      sessionStorage.setItem('paramsData', paramsData)
      router.push({
        name: 'detNewSpes',
        query: {
          id: goodsId,
          categoryId: props.goodsData.categoryId,
          combineType: props.goodsData.combineType,
          combination: route.query.combination || 0,
          paramsStatus: 1
        },
        params: {
          data: paramsData
        }
      })
    }
    function cancel() {
      state.drawer = false
    }
    function closeDrawer(done) {
      done()
    }
    function skuStatusChange() {
      if (!state.skuStatus) state.skuStatus = true
    }

    function showChangeImg() {
      if (state.shouldChangeList.length) {
        state.dialogVisible = true
      } else {
        ElMessage.warning({ message: '请选择商品' })
      }
    }
    function tableBack(data) {
      state.shouldChangeList = data
    }

    function selectImgsBack(data) {
      if (typeof data.url[0].resolution != 'string')
        data.url[0].resolution =
          data.url[0].resolution.width + '*' + data.url[0].resolution.height
      state.spevData.offerSku?.forEach(v => {
        if (state.shouldChangeList.filter(val => val == v.id).length) {
          v.url = data.url[0].url
          v.thumbnailUrl = data.url[0].thumbnailUrl
          v.isChangeImage = 1
          v.pictureId = data.url[0].pictureId
        }
      })
      if (data.url[0].goodsId) {
        context.emit('attrImages', null)
      } else {
        context.emit('attrImages', data.url)
      }
      state.skuPhoto = data.url[0]
    }

    // 设置规格参数
    function setSkuFn() {
      state.drawer = true
      state.setSkuShow = true
    }
    function setSkuCancel() {
      state.setSkuShow = false
      state.drawer = false
    }
    function setSkuBack(val) {
      const arr = val.map(v => {
        delete v.lang
        delete v.opened
        delete v.titleName
        return v
      })
      state.spevData.spes = arr
      context.emit('changeBack', state.spevData)
      context.emit('callBack', state.skuPhoto)
      setSkuCancel()
    }
    return {
      ...toRefs(state),
      openSkuRecord,
      cleckSkuFn,
      applyNewSku,
      closeDrawer,
      skuCallBack,
      skuStatusChange,
      cancel,
      showChangeImg,
      tableBack,
      combine,
      specTableRef,
      querySpes,
      selectImgsBack,
      setSkuFn,
      setSkuCancel,
      setSkuBack
    }
  }
}
</script>
<style lang="scss" scoped>
:deep(.el-drawer__body) {
  overflow-y: auto;
}
.spe-btn {
  background: #fff;
  color: #606266;
  padding: 6px 15px;
  border: 1px rgb(220, 223, 230) solid;
  border-radius: 3px;
}
.spe-btn + .spe-btn {
  margin-left: 5px;
}
.spe-btn.is-active {
  background: #409eff;
  color: #fff;
  border-color: #409eff;
}
.specificationContainer {
  box-sizing: border-box;
  .specificationHeader {
    margin: 0 -30px;
    border-bottom: 1px solid #e8eaec;
    box-sizing: border-box;
    padding: 0 40px;
    line-height: 50px;
    position: relative;
    .btns {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
    }
    .btnsSku {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  .specificationContent {
    box-sizing: border-box;
    padding: 20px 10px 0;
  }
  .redColor {
    color: var(--el-color-danger);
    margin: 0 2px 0 10px;
  }
  .input-with-select {
    width: 180px;
  }
  .input-with-selectContainer {
    position: relative;
    top: 4px;
  }
  .lineHeight32 {
    line-height: 36px;
  }
}
.tableContainer {
  margin-top: 20px;
  border-top: 1px dashed #e9e9e9;
  padding: 20px 0;
}
</style>
