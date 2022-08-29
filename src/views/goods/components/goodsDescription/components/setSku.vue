<!--
* @Descripttion: Vango ERP setSku
* @version: 1.0
* @Author: 王新国
* @Date: 2021-11-01 15:16:38
* @LastEditors: 王新国
* @LastEditTime: 2021-11-01 17:07:46
-->
<template>
  <div class="container">
    <ul>
      <li
        v-for="(item, index) in dialogData"
        :key="item.id"
        class="listContainer"
      >
        <el-collapse v-model="item.opened" :accordion="false">
          <el-collapse-item :name="1" :title="item.titleName">
            <div class="box-warpper tableContainer">
              <el-form :model="item">
                <el-form-item label="规格名称：">
                  <div class="clearfix" style="width: 100%">
                    <el-radio-group
                      v-model="item.lang"
                      style="width: 30%"
                      class="fl"
                      border
                      @change="langChange(item.frontId)"
                    >
                      <el-radio-button label="英文"></el-radio-button>
                      <el-radio-button label="中文"></el-radio-button>
                    </el-radio-group>
                    <el-select
                      :style="'width: 40%'"
                      class="fl"
                      v-if="categoryList"
                      v-model="item.commonSpeId"
                      placeholder="不使用常用规格"
                      :disabled="true"
                    >
                      <el-option
                        v-for="(v, i) in categoryList"
                        :key="i"
                        :label="v.nameEn"
                        :value="v.id"
                      >
                      </el-option>
                    </el-select>
                    <el-button
                      type="text"
                      style="margin-left: 20px"
                      class="fl"
                      @click="transtlateBtn(item.frontId)"
                      >翻译并填充{{
                        item.lang == '英文' ? '中文' : '英文'
                      }}</el-button
                    >
                  </div>
                  <el-input
                    v-model.trim="item.titleName"
                    :disabled="item.commonSpeId > 0"
                  ></el-input>
                </el-form-item>
              </el-form>
              <div v-if="item.isPhoto">
                <span style="padding: 0 12px 0 0">展示样式： </span>
                <el-select v-model="item.showType" placeholder="不使用常用规格">
                  <el-option
                    v-for="(v, i) in [
                      {
                        id: 1,
                        label: '下拉'
                      },
                      {
                        id: 2,
                        label: '展开'
                      }
                    ]"
                    :key="i"
                    :label="v.label"
                    :value="v.id"
                  >
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="tableContainer">
              <el-table
                :data="item.speValues"
                style="width: 100%; margin-top: 15px"
              >
                <el-table-column prop="date" label="参数可选值" align="center">
                  <el-table-column prop="nameEn" label="英文" align="center">
                    <template #default="scope">
                      <el-input
                        v-model.trim="scope.row.nameEn"
                        :disabled="item.commonSpeId > 0"
                        maxlength="100"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column prop="nameCn" label="中文" align="center">
                    <template #default="scope">
                      <el-input
                        v-model.trim="scope.row.nameCn"
                        :disabled="item.commonSpeId > 0"
                        maxlength="100"
                      />
                    </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column prop="skuCode" label="SKU编码" align="center">
                  <template #default="scope">
                    <el-input
                      v-model.trim="scope.row.skuCode"
                      :disabled="true"
                    />
                  </template>
                </el-table-column>
                <el-table-column
                  prop="img"
                  label="图片参数"
                  align="center"
                  width="120px"
                >
                  <template #header>
                    <p>图片参数</p>
                    <el-switch
                      v-model="item.isPhoto"
                      :active-value="1"
                      :inactive-value="0"
                    />
                  </template>
                  <template #default="scope">
                    <div class="clearfix" v-if="scope.row.img">
                      <div class="imgConatiner" id="imgBox">
                        <img :src="scope.row.img" alt="" />
                        <div
                          class="masker"
                          @click="delImage(index, scope.row.frontId)"
                        >
                          <i class="el-icon-delete"></i>
                        </div>
                      </div>
                    </div>
                    <div class="clearfix" v-else>
                      <div
                        class="imgConatiner"
                        @click="addImage(index, scope.row.frontId)"
                      >
                        <div class="addImg">
                          <i class="el-icon-plus"></i>
                        </div>
                      </div>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-collapse-item>
        </el-collapse>
      </li>
    </ul>
    <div class="footer">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="sureFn">确定</el-button>
    </div>
    <SelectImg
      :dialogVisible="dialogVisible"
      v-if="dialogVisible"
      :multiple="false"
      @selectImg="selectImgsBack"
      :skuQuery="selectImageData"
    />
    <SpeDialog
      v-if="showSelectSpe"
      :dialogVisible="showSelectSpe"
      :query="selectSpeQuery"
      @selectSpeOk="selectSpeOkBack"
    />
  </div>
</template>
<script>
import { reactive, toRefs, ref, computed, provide } from 'vue'
import SelectImg from '@/views/goods/components/sku/components/selectImg.vue'
import SpeDialog from './speAdd.vue'
import { ElMessage } from 'element-plus'
import { addAttr } from '../composables/tools'
import { deepCopy } from '@/utils/tool.js'
import { baiduTranslate, batchBaiduTranslate } from '@/utils/translate'
import {
  getInfo,
  getSpe,
  categorydetail,
  goodsDetail
} from '../composables/api.js'
import { useRoute } from 'vue-router'
export default {
  components: { SelectImg, SpeDialog },
  props: {
    goodsData: {
      type: Object,
      default: null
    },
    query: {
      type: Object,
      default: null
    },
    goodsId: {
      type: String,
      default: null
    },
    categoryId: {
      type: Number,
      default: null
    }
  },
  setup(props, context) {
    const route = useRoute()
    const goodsId = route.query.id || props.goodsId || null
    const state = reactive({
      dialogVisible: false, //选择图片
      selectImageData: null,
      imgChangeData: null,
      categoryList: null,
      selectSpeQuery: null,
      showSelectSpe: false,
      addIndex: null,
      goodsImages: null,
      attrImages: null,
      dialogData: props.query.map(v => {
        v.opened = 1
        v.lang = '英文'
        v.titleName = v.nameEn
        return v
      }),
      goodsData: null, //商品数据
      notOfferSku: null
    })

    getInfo({ goodsId: props.goodsId }).then(res => {
      if (res.code == 200) {
        state.attrImages = res.data.attrImages
        state.goodsImages = res.data.goodsImages
      } else {
        ElMessage.warning({ message: res.message })
      }
    })

    getSpe({
      categoryId: props.categoryId
    }).then(res => {
      if (res.code == 200) {
        state.categoryList = res.data
      } else {
        ElMessage.warning({ message: res.message })
      }
    })
    //获取商品信息
    goodsDetail({ goodsId }).then(res => {
      if (res.code == 200) {
        state.goodsData = deepCopy(res.data)
      } else {
        ElMessage.warning({ message: res.message })
      }
    })

    const goodsImages = computed(() => state.goodsImages)
    provide('goodsImages', goodsImages)
    const attrImages = computed(() => state.attrImages)
    provide('attrImages', attrImages)
    const activeName = ref(1)
    function addAttrFn(index) {
      let attrObj = addAttr()
      state.dialogData[index].speValues.push(attrObj)
    }
    function addImage(index, frontId) {
      state.dialogVisible = true
      state.imgChangeData = {
        index,
        frontId
      }
    }
    function selectImgsBack(val) {
      const { index, frontId } = state.imgChangeData
      state.dialogData[index].speValues.forEach(v => {
        if (v.frontId == frontId) {
          v.goodsId = val.url[0].goodsId
          // v.id = val.url[0].id
          v.pictureId = val.url[0].pictureId
          v.referenced = val.url[0].referenced
          v.resolution = val.url[0].resolution
          v.sort = val.url[0].sort
          v.type = val.url[0].type
          v.img = val.url[0].thumbnailUrl
          v.url = val.url[0].url
        }
      })
    }
    function cancel() {
      context.emit('cancel', false)
    }
    function sureFn() {
      let images = true,
        skuStatus = true,
        skuDesc = true
      state.dialogData.forEach(v => {
        if (
          v.speValues.some(val => !val.img || val.img == 'null') &&
          v.isPhoto == 1
        ) {
          if (images) {
            ElMessage.warning({ message: '请选择图片' })
            images = false
          }
        }
        if (v.nameEn || v.nameCn) {
          if (!v.nameEn) {
            v.nameEn = v.nameCn
          } else if (!v.nameCn) {
            v.nameCn = v.nameEn
          }
        } else {
          ElMessage.warning({ message: '请填写规格名称' })
          skuStatus = false
        }
        v.speValues.forEach(val => {
          if (val.nameEn || val.nameCn) {
            if (!val.nameEn) {
              val.nameEn = val.nameCn
            } else if (!val.nameCn) {
              val.nameCn = val.nameEn
            }
          } else {
            ElMessage.warning({ message: '请填写规格值' })
            skuDesc = false
          }
        })
      })
      if (images && skuStatus && skuDesc) context.emit('ok', state.dialogData)
    }

    function showSelectSpeFn(index, id) {
      categorydetail({
        id
      }).then(res => {
        if (res.code == 200) {
          state.addIndex = index
          state.selectSpeQuery = res.data.valueList
          state.showSelectSpe = true
        } else {
          ElMessage.warning({ message: res.message })
        }
      })
    }
    function selectSpeOkBack(val) {
      val.selectList.forEach(v => {
        if (
          state.dialogData[state.addIndex].speValues.filter(
            ele => ele.skuCode == v.skuCode
          ).length == 0
        ) {
          let attrObj = addAttr()
          attrObj.id = null
          attrObj.img = v.thumbnailUrl
          attrObj.url = v.mainImg
          attrObj.skuCode = v.skuCode
          attrObj.sort = v.sort
          attrObj.speId = v.speId
          attrObj.nameCn = v.valCn
          attrObj.nameEn = v.valEn
          state.dialogData[state.addIndex].speValues.push(attrObj)
        }
      })
    }
    function delImage(index, frontId) {
      state.dialogData[index].speValues.forEach(v => {
        if (v.frontId == frontId) {
          v.img = ''
          v.url = ''
        }
      })
    }

    function langChange(frontId) {
      state.dialogData.forEach(v => {
        if (v.frontId == frontId) {
          if (v.lang == '英文') {
            v.titleName = v.nameEn
          } else {
            v.titleName = v.nameCn
          }
        }
      })
    }

    // 中英文翻译
    function transtlateBtn(frontId) {
      state.dialogData.forEach(v => {
        if (v.frontId == frontId) {
          const val = v.titleName
          const from = v.lang == '英文' ? 'en' : 'zh'
          const to = v.lang == '英文' ? 'zh' : 'en'
          if (!v.commonSpeId || props.goodsData.enableCustom == 1)
            baiduTranslate(val, from, to, false).then(res => {
              if (res.str) {
                if (v.lang == '英文') {
                  v.nameCn = res.str
                } else {
                  v.nameEn = res.str
                }
              }
            })
          const transtlateList = v.speValues.map(val =>
            v.lang == '英文' ? val.nameEn : val.nameCn
          )
          batchBaiduTranslate(transtlateList, from, to).then(res => {
            v.speValues.forEach((val, index) => {
              if (v.lang == '英文') {
                if (!val.commonSpeId > 0) val.nameCn = res[index].str
              } else {
                if (!val.commonSpeId > 0) val.nameEn = res[index].str
              }
            })
          })
        }
      })
    }
    return {
      ...toRefs(state),
      activeName,
      addAttrFn,
      addImage,
      selectImgsBack,
      cancel,
      sureFn,
      showSelectSpeFn,
      selectSpeOkBack,
      delImage,
      transtlateBtn,
      langChange
    }
  }
}
</script>
<style lang="scss" scoped>
:deep(.el-collapse-item__header) {
  background-color: #fafafa;
  height: 45px;
  text-indent: 20px;
}
.box-warpper {
  padding-top: 15px;
}
:deep(.is-active .el-radio-button__inner) {
  background-color: #fff;
  color: #000;
  border-radius: 0;
}
.container {
  ul {
    margin-bottom: 70px;
    .listContainer {
      border: 1px solid #e8e8e8;
      margin-bottom: 20px;
    }
  }
}
.tableContainer {
  box-sizing: border-box;
  padding: 0 10px;
}
.reTop5 {
  position: relative;
  top: -10px;
}
.reTop8 {
  position: relative;
  top: 3px;
}
.selectELE {
  margin-left: 10px;
  width: 100px;
}

.imgConatiner {
  width: 70px;
  height: 70px;
  position: relative;
  box-sizing: border-box;
  margin: 0 auto;
  img {
    max-width: 100%;
    max-height: 100%;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .masker {
    width: 100%;
    height: 100%;
    line-height: 70px;
    text-align: center;
    position: absolute;
    left: 0;
    top: 0;
    background-color: rgba(0, 0, 0, 0.5);
    color: #fff;
    cursor: pointer;
    display: none;
  }
}
#imgBox:hover {
  .masker {
    display: block;
  }
}
.el-icon-close {
  line-height: 70px;
  margin-left: 5px;
}
.el-icon-close:hover {
  color: rgba(24, 144, 255, 1);
  cursor: pointer;
}
.footer {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 70%;
  text-align: right;
  padding: 9px 20px;
  box-sizing: border-box;
  background-color: #fff;
  z-index: 10;
  border-top: 1px solid rgb(233, 233, 233);
}
.addImg {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  border: 2px dashed rgba(232, 232, 232, 1);
  background-color: rgba(0, 0, 0, 0.04);
  position: relative;
  cursor: pointer;
  i {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}
.addImg:hover {
  border: 2px dashed rgba(200, 200, 200, 1);
  background-color: rgba(0, 0, 0, 0.07);
}
</style>
