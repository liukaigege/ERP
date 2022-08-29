<template>
<div class="commodityInfoBox">
  <div class="card">
    <div class="header">
      <span v-if="data.collectionUrl">采集</span>
      <span v-else>参考</span>产品
    </div>
    <div class="context">
      <el-row v-if="data.collectionUrl">
        <el-col :span="1.8" class="col">
          <span>商品采集链接：</span>
        </el-col>
        <el-col :span="22">
          <el-input v-model="data.collectionUrl"  readonly />
        </el-col>
      </el-row>
      <el-row v-else>
        <el-col :span="1.8" class="col">
          <span>商品参考链接：</span>
        </el-col>
        <el-col :span="22">
          <el-input v-model="data.referenceUrls"  readonly />
        </el-col>
      </el-row>
    </div>
  </div>
  <div class="card">
    <div class="header">基本信息</div>
    <div class="context">
      <el-row>
        <el-col :span="1.5" class="col">
          <span>商品标题：</span>
        </el-col>
        <el-col :span="22">
          <el-radio-group v-model="radioBtn" >
            <el-radio-button label="En">英文</el-radio-button>
            <el-radio-button label="Cn">中文</el-radio-button>
          </el-radio-group>
          <el-input v-model="data['name'+radioBtn]"  clearable readonly disabled></el-input>
        </el-col>
      </el-row>
      <div class="flex-box">
        <div class="flex-col">商品品类：{{data.categoryName}}
        </div>
        <div class="flex-col">商品标签：<span v-for="(item,index) in data.labels" :key="item.id">{{index?'、':''}}{{item.name}} </span>
        </div>
      </div>
      <div class="flex-box">
        <div class="box-300">商品来源：{{mode[data.mode]}}{{data.source?'-' + data.source:''}}</div>
        <div class="box-300">维护人：{{data.maintainUser}}</div>
        <div class="box-400">维护人部门：{{data.maintainDep}}</div>
        <div class="box-300">开发时间：{{data.createTime}}</div>
      </div>
      <div class="flex-box">
         <div class="box-300">采购报价人：{{data.purchasePriceUser}}</div>
        <div class="box-300">货源渠道：{{data.channelName}}</div>
        <div class="box-300">特殊属性：{{data.attr}}</div>
      </div>
    </div>
  </div>
  <div class="card">
    <div class="header">规格信息</div>
    <div class="context">
      <div class="ckeck">
        <div class="typeBox" v-for="item in data.skuSpeList" :key="item.nameCn">
          <span>{{item.nameCn}}：</span>
          <span :class="{type:true,check:!item.speValues.some(val=>val.checked)}" @click="check(item,'all')">不限</span>
          <span v-for="val in item.speValues" :key="val" :class="{type:true,check:val.checked}" @click="check(val)" :title="val.nameCn">{{val.nameCn}}</span>
        </div>
      </div>
      <div class="tableBox">
        <vxe-table :data="copyData" border align="center"  max-height="540" :row-config="{height:80}">
          <vxe-column field="skuCode" title="SKU编码" width="200px">
            <template #default="{row}">
                <p>{{row.skuId}}</p>
               <el-tooltip placement="top" :offset="10">
                  <template #content>
                    <a style="color: #fff" v-copy="row.skuCode" >复制</a>
                   </template>
                  <p class="text-row" :title="row.skuCode">{{row.skuCode}}</p>
               </el-tooltip>
            </template>
          </vxe-column>
          <vxe-column field="size" title="图片" width="150px">
            <template #default="{row}">
                <el-image :src="row.skuImageUrl" :style="{width:'60px',height:'60px'}" fit="fill"></el-image>
            </template>
          </vxe-column>
          <vxe-column field="skuValueStr" title="规格" width="150px" >
          </vxe-column>
          <vxe-column field="suggestPrice" title="建议售价(USD)" width="150">
          </vxe-column>
          <vxe-column field="purchasePrice" title="默认采购价(CNY)" width="150">
          </vxe-column>
          <vxe-column field="yesterdaySales" title="昨日销量" width="150px">
          </vxe-column>
          <vxe-column field="yesterdayCustomers" title="昨日客户数" width="110px">
          </vxe-column>
          <vxe-column field="sevenAverageSales" title="近7日均销" width="110px">
          </vxe-column>
          <vxe-column field="sevenCustomers" title="七日客户数" width="110px">
          </vxe-column>
          <vxe-column field="prospectSevenTotalSales" title="预计七日总销" width="110px">
          </vxe-column>
          <vxe-column field="monthTotalSales" title="当月总销" >
          </vxe-column>
        </vxe-table>
      </div>
    </div>
  </div>
  <div class="card">
    <div class="header">图文信息</div>
    <div class="context">
      <el-radio-group v-model="radioVal"  class="radio-btn">
        <el-radio-button label="desc">图文描述</el-radio-button>
        <el-radio-button label="goodsImg">商品图片</el-radio-button>
        <el-radio-button label="categoryVideo">品类视频</el-radio-button>
        <el-radio-button label="attrImg">属性图片</el-radio-button>
        <el-radio-button label="physicalImg">实物图片</el-radio-button>
      </el-radio-group>
      <div v-if="radioVal=='desc'" class="editorBox">
        <!-- 富文本 -->
        <div><span>简短描述：</span>
          <el-input v-model="data.brief"  disabled clearable style="width:350px"></el-input>
        </div>
        <div>
          <span>图文描述：</span>
          <div>
            <el-radio-group v-model="textDescVal"  @change="language">
              <el-radio-button label="英文"></el-radio-button>
              <el-radio-button label="中文"></el-radio-button>
            </el-radio-group>
            <editor readonly :content="textDescVal=='英文'?descriptionEn:descriptionCn" ref="myEditor" />
          </div>

        </div>
      </div>

      <attributeImg :modelValue="data.goodsImages" v-if="radioVal == 'goodsImg'" />
      <attributeImg :modelValue="data.attrImages" v-if="radioVal == 'attrImg'" />
      <productVideo v-model="videoInfo" v-if="radioVal == 'categoryVideo'" />
      <attributeImg :modelValue="data.realImages" v-if="radioVal == 'physicalImg'" :onlineImgShow="false"/>
    </div>
  </div>
</div>
</template>

<script>
import { reactive, toRefs, onMounted, provide, ref, computed, watch, nextTick } from 'vue'
import editor from '@/components/editor/index.vue'
import attributeImg from '@/views/goods/components/goodsImg/components/attributeImg.vue'
import productVideo from '@/views/goods/components/goodsImg/components/productVideo.vue'
import { useRoute, useRouter } from 'vue-router'
import { manageInfo } from '@/api/commodity.js'
import initEditorInfo from '@/components/editor/js/handle.js'
export default {
  components: { editor, attributeImg, productVideo },
  setup() {
    const route = useRoute()
    const state = reactive({
      radioBtn: 'En',
      copyData: [],
      radioVal: 'desc',
      textDescVal: "英文",
      data: {},
      descriptionCn: null,
      descriptionEn: null,
      videoInfo: {
        videoUrl: null,
        videoCover: null,
        videoCoverCompress: null,
      },
      myEditor: '',
      isDisabled: true
    })

    provide('isDisabled', state.isDisabled)
    provide('skuRef', null)
    const mode = ['平台采集 ', '独立站采集', '手动', '导入']
    watch(() => state.radioVal, val => {
      nextTick(() => {
        if (val == 'desc') {
          language()
        }
      })
    })
    onMounted(() => {
      manageInfo({
        goodsId: route.query.goodsId,
        skuIdList: typeof route.query.skuIdList == 'string' ? route.query.skuIdList.split(',') : route.query.skuIdList,
        warehouseId: route.query.warehouseId,
      }).then(res => {
        res.data.referenceUrls = res.data.referenceUrls?.length ? res.data.referenceUrls.join(',') : ''
        state.data = res.data
        state.copyData = res.data.skuList
        state.videoInfo = {
          videoUrl: res.data.videoUrl,
          videoCover: res.data.videoCover,
          videoCoverCompress: res.data.videoCoverCompress,
        }

        Promise.all([initEditorInfo(res.data.descriptionEn), initEditorInfo(res.data.descriptionCn)]).then(res => {
          state.descriptionEn = res[0]
          state.descriptionCn = res[1]
          state.myEditor.myContent = state.descriptionEn
        })

        state.data.skuList.forEach(item => { //转换 规格信息 json
          item.skuValueStr = ''
          if (item.skuValue && JSON.parse(item.skuValue) && JSON.parse(item.skuValue).length) {
            item.skuValue = JSON.parse(item.skuValue)
            item.skuValueStr = item.skuValue.reduce((a, b) => {
              return typeof a == 'object' ? a.speVal + '-' + b.speVal : a + '-' + b.speVal
            })
            if (typeof item.skuValueStr == 'object') {
              item.skuValueStr = item.skuValueStr.speVal
            }
          }
        })
      })

    })

    function check(val, status) {
      // 第一个参数为数据，第二个参数为不限
      if (status) {
        val.speValues.map(e => e.checked = false)
      } else {
        val.checked = !val.checked
      }
      state.copyData = []
      state.data.skuList.forEach(item => {
        let flag = true
        item.skuValue.forEach(e => {
          console.log(checkItem.value[e.speEn]);
          if (checkItem.value[e.speEn].length) {
            if (!checkItem.value[e.speEn].includes(e.speVal)) {
              flag = false
            }
          }
        })
        if (flag) {
          state.copyData.push(item)
        }
      })
    }

    let checkItem = computed(() => {
      let obj = {}
      state.data.skuSpeList.forEach(item => {
        obj[item.nameEn] = item.speValues.filter(val => val.checked).map(val => val.nameCn)
      })
      return obj
    })

    function language() {
      if (state.textDescVal == '英文') {
        state.myEditor.myContent = state.descriptionEn
      } else {
        state.myEditor.myContent = state.descriptionCn
      }
      console.log(state.descriptionCn, state.descriptionEn);
    }

    return {
      ...toRefs(state),
      check,
      mode,
      language,
    }
  }
}
</script>

<style lang="scss" scoped>
.commodityInfoBox {
  background-color: #fff;
  padding: 24px;
  font-size: 14px;
  .card {
    border: 1px solid rgb(215, 215, 215);
    margin-bottom: 16px;
    .header {
      height: 40px;
      line-height: 40px;
      padding-left: 16px;
      border-bottom: 1px solid rgb(215, 215, 215);
      background-color: rgb(242, 242, 242);
    }

    .context {
      padding: 20px;

      .col {
        span {
          line-height: 30px;
        }
      }
    }
  }
}

::v-deep(.el-radio-button) {
  --el-radio-button-checked-background-color: #fff;
  --el-radio-button-checked-font-color: #409eff;
}

.flex-box {
  display: flex;
  margin-top: 30px;

  .flex-col {
    width: 600px;

    .el-input {
      width: 350px;
    }
  }

  .box-300 {
    width: 300px;
  }
  .box-400 {
    width: 400px;
  }
}

.typeBox {
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  .type {
    display: inline-block;
    max-width: 80px;
    min-width: 60px;
    padding: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    border: 1px solid #d9d9d9;
    text-align: center;
    margin-right: 10px;
    cursor: pointer;
  }

  .check {
    background-color: #1890ff;
    color: #fff;
    border: 1px solid #1890ff;
  }
}

.typeBox + .typeBox {
  margin-top: 8px;
}

.tableBox {
  margin-top: 24px;
}

.radio-btn {
  margin-bottom: 24px;
}

.editorBox > div {
  display: flex;
  margin-top: 16px;
}
.text-row {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #909399;
}
</style>
