<!--
 * @Descripttion: 'cusSpecInfo.vue 规格信息=>定制'
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
    </div>
    <div class="p20">
      <p class="skuIdContainer" v-if="routeName!='PurchaseQuote'&&routeName!='logisticsQuote'">
        <span>SKU唯一ID：{{ custSku.skuId }} </span>
        <span style="margin-left: 30px">SKU编码：{{ custSku.sku }} </span>
        <span style="margin-left: 30px">商品配对：</span>
        <el-button type="text" @click="closePairing(true)">查看</el-button>
      </p>
      <div class="ctrls"  v-if="routeName!='PurchaseQuote'&&routeName!='logisticsQuote'">
        <span>货源渠道：现货渠道</span>
        <span class="ml20">重量：</span>
        <el-input
          placeholder="请输入内容"
          
          class="input-with-select"
          :disabled="true"
          v-model="custSku.weight"
        >
          <template #append>
            <el-button >g</el-button>
          </template>
        </el-input>
        <span class="ml20">长：</span>
        <el-input
          placeholder="请输入内容"
          
          class="input-with-select"
          :disabled="true"
          v-model="custSku.length"
        >
          <template #append>
            <el-button >cm</el-button>
          </template>
        </el-input>
        <span class="ml20">宽：</span>
        <el-input
          placeholder="请输入内容"
          
          class="input-with-select"
          :disabled="true"
          v-model="custSku.width"
        >
          <template #append>
            <el-button >cm</el-button>
          </template>
        </el-input>
        <span class="ml20">高：</span>
        <el-input
          placeholder="请输入内容"
          
          class="input-with-select"
          :disabled="true"
          v-model="custSku.height"
        >
          <template #append>
            <el-button >cm</el-button>
          </template>
        </el-input>
      </div>
      <div class="tableCotainer">
        <div class="headTop">
          <el-row>
            <el-col :span="2" class="col hCol"> 规格类型 </el-col>
            <el-col :span="4" class="col hCol"> 常用规格 </el-col>
            <el-col :span="4" class="col hCol"> 定制规格名称（英文） </el-col>
            <el-col :span="4" class="col hCol"> 定制规格名称（中文） </el-col>
            <el-col :span="2" class="col hCol"> 定制规格类型 </el-col>
            <el-col :span="2" class="col hCol"> 规格值 </el-col>
            <el-col :span="2" class="col hCol"> 展示样式 </el-col>
            <el-col :span="2" class="col hCol"> 是否必选 </el-col>
            <el-col :span="2" class="col hCol"> 加价 </el-col>
          </el-row>
        </div>
        <div class="tableContent">
          <draggable v-model="modelValue" group="skuValue" item-key="custom">
            <template #item="{ element }">
              <el-row>
                <el-col :span="2" class="trCol col">
                  <!-- 规格类型 -->
                  <i class="el-icon-sort"></i>
                  <span>
                    {{ element.normsType == 1 ? ' 子规格 ' : ' 主规格 ' }}
                  </span>
                  <!-- <i class="el-icon-link" v-if="element.normsType"></i> -->
                  <svg
                    class="linkIcon"
                    width="24"
                    height="24"
                    focusable="false"
                    v-if="element.normsType"
                    @click="changeShowRelevanceSku(element.frontId)"
                  >
                    <path
                      d="M6.2 12.3a1 1 0 011.4 1.4l-2.1 2a2 2 0 102.7 2.8l4.8-4.8a1 1 0 000-1.4 1 1 0 111.4-1.3 2.9 2.9 0 010 4L9.6 20a3.9 3.9 0 01-5.5-5.5l2-2zm11.6-.6a1 1 0 01-1.4-1.4l2-2a2 2 0 10-2.6-2.8L11 10.3a1 1 0 000 1.4A1 1 0 119.6 13a2.9 2.9 0 010-4L14.4 4a3.9 3.9 0 015.5 5.5l-2 2z"
                      fill-rule="nonzero"
                    ></path>
                  </svg>
                </el-col>
                <el-col :span="4" class="trCol col">
                  <!-- 常用规格 -->
                  <el-select
                    v-model="element.commonSpeId"
                    placeholder="不使用常用规格"
                    
                    :style="longStyle"
                    v-if="statusList"
                    :disabled="true"
                  >
                    <el-option
                      v-for="item in statusList"
                      :key="item.id"
                      :label="item.nameCn"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                </el-col>
                <el-col :span="4" class="trCol col">
                  <!-- 定制规格名称（英文） -->
                  <el-input
                    v-model="element.nameEn"
                    placeholder="请输入内容"
                    
                    :style="longStyle"
                    :disabled="true"
                    :maxlength="100"
                  ></el-input>
                </el-col>
                <el-col :span="4" class="trCol col">
                  <!-- 定制规格名称（中文） -->
                  <el-input
                    v-model="element.nameCn"
                    placeholder="请输入内容"
                    
                    :style="longStyle"
                    :disabled="true"
                    :maxlength="100"
                  ></el-input>
                </el-col>
                <el-col :span="2" class="trCol col">
                  <!-- 定制规格类型 -->
                  <el-select
                    v-model="element.customType"
                    placeholder="请选择"
                    
                    :style="shortStyle"
                    :disabled="true"
                  >
                    <el-option
                      v-for="item in customTypeList"
                      :key="item.id"
                      :label="item.label"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                </el-col>
                <el-col :span="2" class="trCol col">
                  <!-- 规格值 -->
                  <span v-if="element.customType != 1">
                    {{element.customType==2?'用户填写':'用户上传'}}
                  </span>
                  <el-button v-else type="text" :disabled="!element.speValues||!element.speValues.length" @click="showDrawer(element.frontId)"
                    >查看</el-button
                  >
                </el-col>
                <el-col :span="2" class="trCol col">
                  <!-- 展示样式 -->
                  <span v-if="element.customType != 1">
                    {{element.customType==2?element.length:'用户上传'}}
                  </span>
                  <el-select
                    v-else
                    v-model="element.showType"
                    placeholder="请选择"
                    
                    :style="shortStyle"
                    :disabled="true"
                  >
                    <el-option
                      v-for="item in showSTyle"
                      :key="item.id"
                      :label="item.label"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                </el-col>
                <el-col :span="2" class="trCol col">
                  <!-- 是否必选 -->
                  <el-checkbox
                    v-model="element.required"
                    :disabled="true"
                    :true-label="1"
                    :false-label="0"
                    label="必选"
                  ></el-checkbox>
                </el-col>
                <el-col :span="2" class="trCol col">
                  <!-- 加价 -->
                  <el-input
                    v-model="element.plusPrice"
                    placeholder="0"
                    
                    :style="shortStyle"
                    :disabled="true"
                  ></el-input>
                </el-col>
              </el-row>
            </template>
          </draggable>
        </div>
      </div>
    </div>
    <Pairing v-if="pairingShow" @close="closePairing" :data="pairingData" />
    <RelevanceSku
      v-if="relevanceSkuShow"
      :data="modelValue"
      :frontId="frontId"
      @close="changeShowRelevanceSku"
    />
    <!-- 右侧规格值查看抽屉 -->
    <el-drawer
      v-model="drawer"
      title="规格选项"
      direction="rtl"
      :before-close="closeDrawer"
    >
      <div>
        <CoustomDrawe v-if="drawer" :drawerData="drawerData" :allData="modelValue" @cancel="closeDrawer"/>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import { reactive, toRefs } from 'vue'
import { ElMessage } from 'element-plus'
import SkuRecord from './skuRecord.vue'
import draggable from 'vuedraggable'
import Pairing from './pairing.vue'
import RelevanceSku from './relevanceSku.vue'
import { showSTyle, customTypeList } from '../composables/data.js'
import { getSpe } from '../composables/api.js'
import { useRoute } from 'vue-router'
import CoustomDrawe from './coustomDrawe.vue'
export default {
  components: {
    SkuRecord,
    draggable,
    Pairing,
    RelevanceSku,
    CoustomDrawe,
  },
  props: {
    modelValue: {
      type: Array,
      default: null
    },
    pairingData: {
      type: Object,
      default: null
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    custSkus: {
      type: Object,
      default: null
    },
    categoryId:{
      type:Number,
      default:null
    }
  },
  setup(props) {
    const route = useRoute()
    const routeName = route.name
    const longStyle = 'max-width:180px;'
    const shortStyle = 'max-width:105px;'
    const state = reactive({
      SkuRecordVisible: false,
      statusList: null,
      drawer: false,
      pairingShow: false,
      pairingData: null,
      relevanceSkuShow: false,
      custSku: props.custSkus,
      frontId: '',
      drawerData:null
    })
    getSpe({categoryId: props.categoryId})
      .then(res => {
        if (res.code == 200) {
          state.statusList = res.data
        } else {
          ElMessage.warning({ message: res.message })
        }
      })
    
    function closeDrawer() {
      state.drawer = false
    }
    function showDrawer(id) {
      state.drawerData = props.modelValue.filter(v=>id == v.frontId)[0]
      state.drawer = true
    }
    function closePairing(data) {
      state.pairingShow = data
    }
    function changeShowRelevanceSku(data) {
      if (data) {
        state.frontId = data
        state.relevanceSkuShow = true
      } else {
        state.relevanceSkuShow = false
      }
    }

    return {
      ...toRefs(state),
      longStyle,
      shortStyle,
      showSTyle,
      customTypeList,
      closeDrawer,
      showDrawer,
      closePairing,
      changeShowRelevanceSku,
      routeName,
    }
  }
}
</script>
<style lang="scss" scoped>
.linkIcon {
  transform: scale(0.65);
  position: relative;
  top: 7px;
}
.linkIcon:hover {
  opacity: 0.75px;
  cursor: pointer;
}
.blueColor {
  color: #1890ff;
}
.specificationContainer {
  box-sizing: border-box;
  .specificationHeader {
    border-bottom: 1px solid #e8eaec;
    box-sizing: border-box;
    padding: 0 40px;
    margin: 0 -30px;
    line-height: 50px;
    position: relative;
    .btns {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
.p20 {
  box-sizing: border-box;
  padding: 20px;
}
.skuIdContainer {
  line-height: 36px;
}
.input-with-select {
  width: 180px;
}
.ml20 {
  margin-left: 20px;
}
.tableCotainer {
  margin-top: 25px;
  .headTop {
    background-color: #fafafa;
    border-top: 1px solid #e9e9e9;
  }
  .col {
    border-bottom: 1px solid #e9e9e9;
    height: 54px;
    line-height: 54px;
    text-align: center;
  }
  .hCol {
    font-weight: 550;
  }
  .tableContent {
    max-height: 400px;
    overflow-y: auto;
  }
}

:deep(.el-drawer__body) {
  overflow-y: auto;
  padding-top: 0;
}
</style>