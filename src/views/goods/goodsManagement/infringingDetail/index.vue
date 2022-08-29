<!--
 * @Descripttion: 'infringingDetail 侵权商品详情'
 * @version: 1.0
 * @Author: 王新国
 * @Date: 2021-07-07 00:00:00
 * @LastEditors: 王新国
 * @LastEditTime: 2021-07-14 00:00:00
-->
<template>
  <div>
    <div>
      <div style="height: 76px" v-if="routeId"></div>
      <div class="infringingDetail" v-if="detailData">
        <div class="infringingDetailHeader" v-if="routeId">
          <span>详情</span>
          <i class="el-icon-arrow-left" @click="backFn"></i>
        </div>
        <div class="infringingDetailContent clearfix">
          <div class="leftContent fl">
            <div class="listContainer clearfix">
              <div class="fl listTitle">敏感词汇：</div>
              <ul class="fl listContent clearfix">
                <li class="wordsList fl" v-for="item in wordsList" :key="item">
                  {{ item }}
                </li>
              </ul>
            </div>
            <div class="listContainer clearfix">
              <div class="fl listTitle">图片样例：</div>
              <ul class="fl listContent clearfix" style="padding-bottom: 5px">
                <li
                  class="imgList fl"
                  v-for="(item, index) in imageUrl"
                  :key="index"
                >
                  <img :src="item.thumbnailUrl" alt="" />
                  <i
                    class="el-icon-zoom-in"
                    @click="tiggleImgBanner(1, index)"
                  ></i>
                </li>
              </ul>
            </div>
          </div>
          <div class="rightContent fl">
            <div class="listContainer clearfix">
              <div class="fl listTitle">产品标题：</div>
              <div class="fl langContent clearfix">
                <el-radio-group
                  v-model="language"
                  
                  @change="languageChange"
                >
                  <el-radio-button label="英文"></el-radio-button>
                  <el-radio-button label="中文"></el-radio-button>
                </el-radio-group>
              </div>
              <div
                class="fl listContent clearfix modalInpit"
                style="margin-left: 120px; position: relative; top: -1px"
                v-html="text"
              ></div>
            </div>
            <div class="listContainer clearfix">
              <div class="fl listTitle">产品标签：</div>
              <ul class="fl listContent clearfix">
                <li
                  class="wordsList fl"
                  v-for="item in detailData.labelNameList"
                  :key="item"
                  v-html="item"
                  :class="{
                    redColor: detailData.wordsList.indexOf(item) == -1
                  }"
                ></li>
              </ul>
            </div>
            <div class="listContainer clearfix" v-if="detailData.collectionUrl">
              <div class="fl listTitle">采集链接：</div>
              <div
                class="fl listContent clearfix modalInpit linkInput"
                @click="clickLink(detailData.collectionUrl)"
              >
                {{ detailData.collectionUrl }}
              </div>
            </div>
            <div v-else>
              <div
                class="listContainer clearfix"
                v-for="item in referenceUrlList"
                :key="item"
              >
                <div class="fl listTitle">参考链接：</div>
                <div
                  class="fl listContent clearfix modalInpit linkInput"
                  @click="clickLink(item)"
                >
                  {{ item }}
                </div>
              </div>
            </div>
            <div class="listContainer clearfix">
              <div class="fl listTitle">图文信息：</div>
              <div class="fl listContent clearfix modalInpit">
                <el-tabs v-model="activeName">
                  <el-tab-pane label="图文描述" name="first">
                    <div class="clearfix" style="margin: 20px 0 0">
                      <div class="fl">简短描述：</div>
                      <div
                        class="fl discriptionTitle"
                        :class="{
                          redWord:
                            detailData.wordsList.indexOf(detailData.brief) != -1
                        }"
                      >
                        {{ detailData.brief }}
                      </div>
                    </div>
                    <div class="discription">
                      <div v-html="description"></div>
                    </div>
                  </el-tab-pane>
                  <el-tab-pane label="产品图片" name="second">
                    <ul
                      class="img-box"
                      style="padding-bottom: 5px; margin-bottom: 20px"
                    >
                      <li
                        class="imgList fl"
                        v-for="(item, index) in detailData.goodsPhotos"
                        :key="item.thumbnailUrl"
                      >
                        <img :src="item.thumbnailUrl" alt="" />
                        <i
                          class="el-icon-zoom-in"
                          @click="tiggleImgBanner(2, index)"
                        ></i>
                      </li>
                    </ul>
                  </el-tab-pane>
                  <el-tab-pane label="属性图片" name="third">
                    <ul
                      class="fl listContent clearfix"
                      style="
                        padding-bottom: 5px;
                        margin-bottom: 20px;
                        width: 100%;
                      "
                    >
                      <li
                        class="imgList fl"
                        v-for="(item, index) in detailData.attrPhotos"
                        :key="item.thumbnailUrl"
                      >
                        <img :src="item.thumbnailUrl" alt="" />
                        <i
                          class="el-icon-zoom-in"
                          @click="tiggleImgBanner(3, index)"
                        ></i>
                      </li>
                    </ul>
                  </el-tab-pane>
                </el-tabs>
              </div>
            </div>
          </div>
        </div>
        <div class="infringingDetailFooter" v-if="routeId">
          <span>审核说明：</span>
          <el-input
            v-model="explains"
            :maxlength="100"
            placeholder="请输入内容"
            
            :readonly="listStatus != 1"
            style="max-width: 530px; margin-right: 7px"
          ></el-input>
          <el-button  class="ml" @click="backFn">取 消</el-button>
          <el-button
            type="primary"
            
            class="ml"
            v-if="listStatus == 1"
            @click="infringingFn({ id, status: 2, explains })"
            >未侵权</el-button
          >
          <el-button
            type="primary"
            
            class="ml"
            v-if="listStatus == 1"
            @click="infringingFn({ id, status: 3, explains })"
            >侵权不可用</el-button
          >
          <el-button
            type="primary"
            
            class="ml"
            v-if="listStatus == 1"
            @click="infringingFn({ id, status: 4, explains })"
            >侵权可用</el-button
          >
        </div>
        <div
          class="infringingDetailFooter infringingDetailFooters"
          v-if="!routeId"
        >
          <el-button  @click="callBack(false)">取消</el-button>
          <el-button type="primary"  @click="callBack(true)"
            >申请审核</el-button
          >
        </div>

        <ImgBanner
          :list="imgBanner"
          v-if="showImgBanner"
          @close="tiggleImgBanner(4, 0)"
          :previwIndex="previwIndex"
        />
      </div>
    </div>
    <div id="editor" style="display: none"></div>
  </div>
</template>
<script>
import { reactive, toRefs, computed, ref, onMounted, nextTick } from 'vue'
import ImgBanner from '@/components/imgBanner/index.vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { reRed } from '@/utils/tool.js'
import { getInfringingDetail, getTortMsg } from './composables/api.js'
import { ElMessage } from 'element-plus'
import { strToArr, strToArray } from './composables/index.js'
import { examine } from './composables/api.js'
import initEditorInfo from '@/components/editor/js/handle.js'
export default {
  components: { ImgBanner },
  props: {
    id: {
      type: Number,
      default: null
    },
    status: {
      type: Number,
      default: 1
    }
  },
  setup(props, context) {
    let store = useStore()
    const sideBarWidth = computed(() => store.state.menu.sideBarWidth)
    const route = useRoute()
    const router = useRouter()
    const id = route.query.id - 0 || props.id - 0 || null
    const listStatus = route.query.listStatus - 0 || props.status - 0 || 1
    const state = reactive({
      explains: '',
      language: '英文',
      showImgBanner: false,
      imgBanner: [],
      text: '',
      detailData: null,
      referenceUrlList: [],
      activeName: 'first',
      previwIndex: 0,
      description: '',
      routeId: route.query.from,
      wordsList: [],
      imageUrl: [], //图片样例
      words: [] //敏感词
    })
    onMounted(() => {})
    if (route.query.from) {
      // 自己侵权列表过来的
      getInfringingDetail({ id })
        .then(res => {
          // 敏感词
          res.data.wordsList = strToArr(res.data.words)
          state.wordsList = res.data.wordsList
          state.imageUrl = res.data.photos
          //标签
          res.data.labelNameList = strToArr(
            res.data.labelName,
            res.data.wordsList
          )
          //商品标题
          res.data.nameEn = reRed(res.data.nameEn, res.data.wordsList)
          res.data.nameCn = reRed(res.data.nameCn, res.data.wordsList)
          state.text = res.data.nameEn
          //参考链接
          state.referenceUrlList = strToArr(res.data.referenceUrl)
          state.detailData = res.data
          //图文描述
          // state.description = res.data.descriptionEn
          description(res.data.descriptionEn)
          //备注
          state.explains = res.data.explains
        })
       
    } else {
      // 朱涛接口
      getTortMsg({ goodsId: id + '' })
        .then(res => {
          // 敏感词
          res.data.wordsList = strToArr(res.data.words)
          // state.wordsList = res.data.wordsList
          let wordsList = []
          let imageUrl = []
          res.data.searchTortVO.goodsTortVOS.forEach(element => {
            const photosList = {}
            if (element.imageUrl) {
              element.imageUrl.forEach(item => {
                photosList.url = item
                photosList.thumbnailUrl = item
              })
              imageUrl = [...imageUrl, photosList]
            }
            if (element.words) wordsList = [...wordsList, ...element.words]
          })

          state.imageUrl = imageUrl
          state.wordsList = wordsList
          //标签
          res.data.labelNameList = strToArr(
            res.data.labelName,
            res.data.wordsList
          )
          //商品标题
          res.data.nameEn = reRed(res.data.nameEn, res.data.wordsList)
          res.data.nameCn = reRed(res.data.nameCn, res.data.wordsList)
          state.text = res.data.nameEn
          //参考链接
          state.referenceUrlList = strToArray(res.data.referenceUrl)
          state.detailData = res.data
          //图文描述
          description(res.data.descriptionEn)
          //备注
          state.explains = res.data.explains
        })
       
    }
    function languageChange() {
      if (state.language == '英文') {
        state.text = state.detailData.nameEn
        description(state.detailData.descriptionEn)
      } else {
        state.text = state.detailData.nameCn
        description(state.detailData.descriptionCn)
      }
    }
    function description(description) {
      if (description) {
        nextTick(() => {
          initEditorInfo(description).then(res => {
            state.description = reRed(res, state.wordsList)
          })
        })
      } else {
        state.description = ''
      }
    }
    const activeIndex = ref('1')

    const handleSelect = (key, keyPath) => {
      console.log(key, keyPath)
    }

    function tiggleImgBanner(val, index) {
      state.imgBanner = []
      state.previwIndex = index
      if (val == 1) {
        //左侧图片列表
        state.imageUrl.forEach(v => state.imgBanner.push(v.url))
      } else if (val == 2) {
        //产品图片
        state.detailData.goodsPhotos.forEach(v => state.imgBanner.push(v.url))
      } else if (val == 3) {
        //属性图片
        state.detailData.attrPhotos.forEach(v => state.imgBanner.push(v.url))
      } else {
        //关闭
      }
      state.showImgBanner = !state.showImgBanner
    }

    function backFn() {
      router.push({
        path: '/goods/goodsManagement/infringingManagement/index',
        query: { listStatus }
      })
    }
    const infringingFn = data => {
      // if(!data.explains) return ElMessage.warning({ message: '请填写审核说明' })
      examine(data)
        .then(res => {
          if (res.code == 200) {
            backFn()
            ElMessage.success({ message: '操作成功' })
          } else {
            ElMessage.error({ message: res.message })
          }
        })
     
    }

    function clickLink(url) {
      window.open(url, '_blank')
    }
    function callBack(data) {
      context.emit('callBack', data)
    }
    return {
      ...toRefs(state),
      id,
      sideBarWidth,
      activeIndex,
      listStatus,
      handleSelect,
      tiggleImgBanner,
      clickLink,
      backFn,
      languageChange,
      infringingFn,
      callBack
    }
  }
}
</script>
<style lang="scss" scoped>
.img-box {
  display: grid;
  grid-template-columns: repeat(4, 25%);
}
.infringingDetailHeader {
  position: fixed;
  height: 76px;
  text-align: center;
  background-color: #fff;
  top: 111px;
  left: v-bind(sideBarWidth);
  width: calc(100% - v-bind(sideBarWidth));
  border-top: 1px solid #e8ecef;
  z-index: 66;
  span {
    font-size: 20px;
    color: #000000d9;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    letter-spacing: 1px;
  }
  .el-icon-arrow-left {
    position: absolute;
    left: 20px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 20px;
    cursor: pointer;
  }
}
.infringingDetailFooters {
  text-align: center;
}
.infringingDetailFooter {
  position: fixed;
  height: 52px;
  line-height: 52px;
  left: v-bind(sideBarWidth);
  width: calc(100% - v-bind(sideBarWidth));
  background-color: #fff;
  bottom: 0;
  border-top: 1px solid #e8ecef;
  text-align: right;
  box-sizing: border-box;
  padding-right: 32px;
  color: #262626;
  z-index: 2;
  .ml {
    margin-left: 8px;
  }
}
.infringingDetailContent {
  background-color: #fff;
  box-sizing: border-box;
  padding: 20px 0;
  .leftContent,
  .rightContent {
    width: 50%;
    box-sizing: border-box;
    padding: 0 20px;
  }
  .leftContent {
    border-right: 1px dashed #e9e9e9;
  }
}
.discriptionTitle {
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  min-height: 34px;
  width: calc(100% - 70px);
  box-sizing: border-box;
  padding: 0 10px;
}
.listContainer {
  line-height: 32px;
  margin-bottom: 20px;
  .listTitle {
    color: #262626;
    font-size: 14px;
    text-align: right;
    width: 120px;
  }
  .listContent {
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    min-height: 34px;
    width: 640px;
    .wordsList {
      box-sizing: border-box;
      line-height: 22px;
      margin: 5px 0 0 5px;
      border: 1px solid #ffa39e;
      background-color: #fff1f0;
      color: #ff4d4f;
      font-size: 12px;
      border-radius: 4px;
      padding: 0 5px;
    }
    .redColor {
      border: 1px solid #91d5ff;
      background-color: #e6f7ff;
      color: #1890ff;
    }
    .imgList {
      width: 148px;
      height: 148px;
      margin: 5px 0 0 5px;
      position: relative;
      border: 1px #eee solid;
      img {
        max-height: 100%;
        max-width: 100%;
        position: absolute;
        left: 50%;
        top: 50%;
        display: inline-block;
        transform: translate(-50%, -50%);
      }
      .el-icon-zoom-in {
        position: absolute;
        right: 0;
        bottom: 0;
        background-color: #fff;
        padding: 2px;
        color: #8c8c8c;
        cursor: pointer;
      }
    }
  }
}
.discription {
  border: 1px solid #d9d9d9;
  border-radius: 2px;
  min-height: 200px;
  margin: 20px 0;
  padding: 10px 20px;
  box-sizing: border-box;
  word-break: break-all;
  :deep(img) {
    max-width: 100%;
  }
}
.discription * {
  max-width: 100%;
}
.modalInpit {
  box-sizing: border-box;
  padding: 0 10px;
}
.linkInput {
  color: #1890ff;
  word-break: break-all;
}
.linkInput:hover {
  cursor: pointer;
  opacity: 0.85;
}
.langContent {
  z-index: 2;
  position: relative;
}
.redWord {
  color: #ff4d4f;
}
.el-form--inline .el-form-item {
  margin-bottom: 16px;
}
</style>