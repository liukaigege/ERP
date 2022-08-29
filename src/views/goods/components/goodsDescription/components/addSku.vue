<!--
 * @Descripttion: 'addSku 新增规格'
 * @version: 2.0
 * @Author: 王新国
 * @Date: 2021-09-06 00:00:00
 * @LastEditors: 王新国
 * @LastEditTime: 2021-09-06 00:00:00
-->
<template>
  <div class="container">
    <ul :style="addSkuBtnStatus ? '' : 'margin-bottom: 70px;'">
      <li
        v-for="(item, index) in dialogData"
        :key="item.id"
        class="listContainer"
      >
        <el-collapse v-model="item.opened" :accordion="false">
          <el-collapse-item :name="1" :title="item.nameEn">
            <template #title>
              <div style="text-align: right; width: 90%" v-if="addSkuBtnStatus">
                <i
                  class="el-icon-delete"
                  v-if="
                    goodsData.enableCustom != 1 ||
                    (goodsData.enableCustom == 1 && goodsData.skuType == 1)
                  "
                  @click="deleteFn(item.frontId)"
                ></i>
              </div>
            </template>
            <div class="box-warpper tableContainer">
              <el-form :model="item">
                <el-form-item label="规格名称：">
                  <div class="clearfix" style="width: 100%">
                    <el-radio-group
                      v-model="item.lang"
                      class="fl"
                      border
                      @change="radioChange(item.frontId)"
                      :style="'width: 30%'"
                    >
                      <el-radio-button label="英文"></el-radio-button>
                      <el-radio-button label="中文"></el-radio-button>
                    </el-radio-group>
                    <el-select
                      class="fl"
                      v-if="categoryList"
                      v-model="item.commonSpeId"
                      style="width: 40%"
                      placeholder="不使用常用规格"
                      :disabled="
                        !addSkuBtnStatus ||
                        (goodsData.enableCustom == 1 && goodsData.skuType != 1)
                      "
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
                      class="fr"
                      style="margin-right: 20px"
                      size="small"
                      @click="transtlateBtn(item.frontId)"
                      >翻译并填充{{
                        item.lang == '英文' ? '中文' : '英文'
                      }}</el-button
                    >
                  </div>
                  <el-input
                    v-model="item.titleName"
                    :disabled="
                      !addSkuBtnStatus ||
                      (goodsData.enableCustom == 1 && goodsData.skuType != 1)
                    "
                  ></el-input>
                </el-form-item>
                <el-form-item :label-width="85">
                  <div class="clearfix">
                    <el-button
                      type="primary"
                      plain
                      icon="el-icon-plus"
                      @click="addAttrFn(index)"
                      >增加参数</el-button
                    >
                    <el-button
                      type="primary"
                      plain
                      v-if="item.commonSpeId"
                      @click="showSelectSpeFn(index, item.commonSpeId)"
                      >选择属性</el-button
                    >
                  </div>
                </el-form-item>
              </el-form>
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
                        :disabled="scope.row.isAdd != 1"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column prop="nameCn" label="中文" align="center">
                    <template #default="scope">
                      <el-input
                        v-model.trim="scope.row.nameCn"
                        :disabled="scope.row.isAdd != 1"
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
                      :disabled="
                        !addSkuBtnStatus || goodsData.enableCustom == 1
                      "
                    />
                  </template>
                  <template #default="scope">
                    <div class="clearfix" v-if="scope.row.img">
                      <div class="imgConatiner fl" id="imgBox">
                        <img :src="scope.row.img" alt="" />
                        <div
                          class="masker"
                          @click="
                            delImage(index, scope.row.frontId, scope.row.isAdd)
                          "
                        >
                          <i class="el-icon-delete"></i>
                        </div>
                      </div>
                      <i
                        class="el-icon-close fl"
                        @click="
                          delAttr(index, scope.row.frontId, scope.row.isAdd)
                        "
                      ></i>
                    </div>
                    <div class="clearfix" v-else>
                      <div
                        class="imgConatiner fl"
                        @click="
                          addImage(index, scope.row.frontId, scope.row.isAdd)
                        "
                      >
                        <div class="addImg">
                          <i class="el-icon-plus"></i>
                        </div>
                      </div>
                      <i
                        class="el-icon-close fl"
                        @click="
                          delAttr(index, scope.row.frontId, scope.row.isAdd)
                        "
                      ></i>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-collapse-item>
        </el-collapse>
      </li>
    </ul>
    <div
      class="addSkuBtn"
      v-if="
        goodsData.skuType == 1
      "
      @click="addSku"
    >
      <i class="el-icon-plus"></i> 添加规格参数
    </div>
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
import { reactive, toRefs, computed, provide } from 'vue'
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
import skuItemHook from '@/views/goods/components/sku/hooks/skuItem.js'
export default {
  components: { SelectImg, SpeDialog },
  props: {
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
    },
    goodsData: Object
  },
  setup(props, context) {
    console.log(1223)
    const route = useRoute()
    const goodsId = route.query.id || props.goodsId || null
    const addSkuBtnStatus =
      props.goodsData.skuType == 1 || props.goodsData.enableCustom == 1
        ? true
        : false
    const state = reactive({
      addSkuBtnStatus,
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
    const { createId } = skuItemHook()
    getInfo({ goodsId: props.goodsId }).then(res => {
      if (res.code == 200) {
        state.attrImages = res.data.attrImages
        state.goodsImages = res.data.goodsImages
      } else {
        ElMessage.warning({ message: res.message })
      }
    })

    getSpe({ categoryId: props.categoryId }).then(res => {
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
    function addAttrFn(index) {
      let attrObj = addAttr()
      state.dialogData[index].speValues.push(attrObj)
    }
    function delAttr(index, frontId, isAdd) {
      if (isAdd) {
        state.dialogData[index].speValues = state.dialogData[
          index
        ].speValues.filter(v => v.frontId != frontId)
      }
    }
    function addImage(index, frontId, isAdd) {
      if (isAdd) {
        state.dialogVisible = true
        state.imgChangeData = {
          index,
          frontId
        }
      }
    }
    function selectImgsBack(val) {
      const { index, frontId } = state.imgChangeData
      state.dialogData[index].speValues.forEach(v => {
        if (v.frontId == frontId) {
          v.goodsId = val.url[0].goodsId
          v.activeName = val.activeName
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
      let sureStaus = false
      let emptyStutus = false
      let imgEmptyIndex = null //空值
      let repeat = null //当前列表重复
      let notOffer = null //未报价重复
      let skuEmpty = false // 规格空值
      if (state.dialogData.some(v => !v.speValues || v.speValues.length === 0))
        return ElMessage.warning({
          message: '有规格未填写规格值'
        })
      state.dialogData.forEach((v, index) => {
        if (!v.nameEn && !v.nameCn) {
          if (v.titleName) {
            v.nameEn = v.titleName
            v.nameCn = v.titleName
          } else {
            skuEmpty = true
          }
        } else if (!v.nameEn && v.nameCn) {
          v.nameEn = v.nameCn
        } else if (v.nameEn && !v.nameCn) {
          v.nameCn = v.nameEn
        }
        v.speValues?.forEach((k, i) => {
          // 新增属性值，中英文名称校验是否填写
          if (k.isAdd == 1) {
            sureStaus = true
            if (!k.nameEn && !k.nameCn) {
              emptyStutus = true
            } else if (!k.nameEn && k.nameCn) {
              k.nameEn = k.nameCn
            } else if (k.nameEn && !k.nameCn) {
              k.nameCn = k.nameEn
            }
            // 判断是否重复(接口返回列表)// 判断是否和未报价重复 state.goodsData
            state.goodsData.spes?.forEach(val => {
              if (
                val.speValues.filter(
                  ele => ele.nameEn == k.nameEn || ele.nameCn == k.nameCn
                ).length
              ) {
                notOffer = { index, i }
              }
            })
          }
          if (v.isPhoto && !k.img) imgEmptyIndex = { index, i }
          //属性过滤是否重复(当前列表)
          if (
            v.speValues.filter(
              ele => ele.nameEn == k.nameEn || ele.nameCn == k.nameCn
            ).length > 1
          ) {
            repeat = { index, i }
          }
        })
      })
      if (skuEmpty) {
        ElMessage.warning({ message: '请添加规格名称' })
      } else {
        if (sureStaus) {
          if (emptyStutus) {
            ElMessage.warning({ message: '请添加规格参数可选值' })
          } else {
            if (imgEmptyIndex) {
              ElMessage.warning({
                message:
                  '第' +
                  (imgEmptyIndex.index + 1) +
                  '个规格的第' +
                  (imgEmptyIndex.i + 1) +
                  '个参数图片未选择'
              })
            } else {
              if (repeat) {
                ElMessage.warning({
                  message:
                    '第' +
                    (repeat.index + 1) +
                    '个规格的第' +
                    (repeat.i + 1) +
                    '个参数重复'
                })
              } else {
                if (notOffer) {
                  ElMessage.warning({
                    message:
                      '第' +
                      (notOffer.index + 1) +
                      '个规格的第' +
                      (notOffer.i + 1) +
                      '个参数与未报价参数值重复'
                  })
                } else {
                  context.emit('ok', state.dialogData)
                }
              }
            }
          }
        } else {
          ElMessage.warning({ message: '请添加规格参数' })
        }
      }
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
    function delImage(index, frontId, isAdd) {
      if (isAdd) {
        state.dialogData[index].speValues.forEach(v => {
          if (v.frontId == frontId) {
            v.img = ''
            v.url = ''
          }
        })
      }
    }
    function addSku() {
      let obj = {
        id: null,
        frontId: createId(),
        nameEn: null,
        nameCn: null,
        isPhoto: 0, //是否开启图片参数
        showType: 1, //展示样式
        commonSpeId: null,
        speValues: [],
        lang: '英文',
        opened: 1
      }
      state.dialogData.push(obj)
    } // 新增规格
    function deleteFn(frontId) {
      state.dialogData = state.dialogData.filter(v => v.frontId != frontId)
    }
    function radioChange(frontId) {
      state.dialogData.forEach(v => {
        if (frontId == v.frontId) {
          if (v.lang == '英文') {
            if (!v.nameCn || v.nameCn == 'null') v.nameCn = v.titleName
            v.titleName = v.nameEn
          } else {
            if (!v.nameEn || v.nameEn == 'null') v.nameEn = v.titleName
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
          if (state.addSkuBtnStatus)
            baiduTranslate(val, from, to).then(res => {
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
          batchBaiduTranslate(transtlateList, from, to, false).then(res => {
            v.speValues.forEach((val, index) => {
              if (v.lang == '英文') {
                if (val.isAdd == 1) val.nameCn = res[index].str
              } else {
                if (val.isAdd == 1) val.nameEn = res[index].str
              }
            })
          })
        }
      })
    }
    return {
      ...toRefs(state),
      addAttrFn,
      delAttr,
      addImage,
      selectImgsBack,
      cancel,
      sureFn,
      radioChange,
      showSelectSpeFn,
      selectSpeOkBack,
      delImage,
      addSku,
      deleteFn,
      transtlateBtn
    }
  }
}
</script>
<style lang="scss" scoped>
.addSkuBtn {
  cursor: pointer;
  margin-bottom: 70px;
  width: 30%;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -ms-flex-pack: distribute;
  justify-content: space-around;
  border: 1px solid #1890ff;
  color: #1890ff;
  padding: 5.5px 10px;
  margin-right: 12px;
}
:deep(.el-collapse-item__header) {
  background-color: #fafafa;
  height: 45px;
  text-indent: 20px;
}
.box-warpper {
  padding-top: 15px;
  position: relative;
  .el-icon-delete {
    position: absolute;
    right: 0;
    top: -100px;
  }
}
:deep(.is-active .el-radio-button__inner) {
  background-color: #fff;
  color: #000;
  border-radius: 0;
}
.container {
  ul {
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
