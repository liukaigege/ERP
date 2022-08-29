<template>
  <div class="goodsImg">
    <div class="tabs">
      <div
        :class="activeTab == item.value ? 'tabItem tabActive' : 'tabItem'"
        v-for="(item, index) in tabList"
        :key="index"
        @click="
          () => {
            activeTab = item.value;
          }
        "
      >
        {{ item.label }}
      </div>
    </div>
    <ProductImg
      v-show="activeTab == 0"
      v-model="goodsImages"
      :ref="(el) => (refList[0] = el)"
    />
    <ProductVideo
      v-show="activeTab == 1"
      v-model="video"
      :ref="(el) => (refList[1] = el)"
    />
    <AttibuteImg
      v-show="activeTab == 2"
      v-model="attrImages"
      :ref="(el) => (refList[2] = el)"
    />
  </div>
</template>

<script>
import { toRefs, reactive,onMounted,watch } from "vue";
import {ElMessage} from 'element-plus'
import ProductImg from "@/views/goods/components/goodsImg/components/productImg.vue";
import ProductVideo from "@/views/goods/components/goodsImg/components/productVideo.vue";
import AttibuteImg from "@/views/goods/components/goodsImg/components/attributeImg.vue";
export default {
  props:{
    query:{
        type:Object,
        default:null
    }
  },
  components: { ProductImg, ProductVideo, AttibuteImg },
  setup(props) {
    const data = reactive({
      activeTab: 0,
      tabList: [
        {
          label: "商品图片",
          value: 0,
        },
        {
          label: "商品视频",
          value: 1,
        },
        {
          label: "属性图片",
          value: 2,
        },
      ],
      goodsImages: [], // 商品图片
      attrImages: [], //属性图片
      video: {
        videoCover: null, //封面
        videoCoverCompress: null, //封面压缩
        videoUrl: null, // 视频路径
      },
      refList: [],
    });

    function getVal() {
      data.refList.forEach((item) => {
        item.emitData();
      });
      const { goodsImages, attrImages, video } = data;
      const { videoCover, videoCoverCompress, videoUrl } = video;
      return {
        goodsImages,
        attrImages,
        videoCover,
        videoCoverCompress,
        videoUrl,
      };
    }

    function validate() {
      return new Promise((reslove, reject) => {
        const val = getVal()
        const {goodsImages,videoCover,videoUrl} = val
        if(goodsImages.length < 3) {
          reject({type:'goodsImg',status:0,message:'商品图片至少添加3张'})
          return
        }
        if(!videoUrl && videoCover){

          reject({type:'goodsImg',status:1,message:'请上传视频'})
          return
        }
         reslove({
          imgInfo: getVal(),
          type: "goodsImg",
        });

      });
    } // 检验产品图片模块内容完整性

    function cancelReturnVal(){
        return new Promise((reslove,reject)=>{
           reslove({
          info: getVal(),
          type: "goodsImg",
        });
        })

    } // 退出时给最新的数据




    watch(() =>props.query,(a)=>{
      showInfo()
    })

    function showInfo(){
          if(!props.query) return
          const {attrImages,goodsImages,videoCover,videoCoverCompress,videoUrl} = props.query
          data.goodsImages = goodsImages
          data.attrImages = attrImages
          data.video={
            videoCover,videoCoverCompress,videoUrl
          }
  } // 回显



  onMounted(() => {

  })

    return {
      ...toRefs(data),
      getVal,
      validate,
      cancelReturnVal,

    };
  },
};
</script>

<style lang="scss" scoped>
.goodsImg {
  background: white;
  padding: 20px;
}
.tabs {
  display: flex;
  margin-bottom: 20px;
  .text {
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #fd4c60;
    margin-left: 20px;
    display: flex;
    align-items: center;
  }
  .tabItem {
    padding: 5px 22px;
    border-radius: 2px;
    border: 1px solid #d9d9d9;
    cursor: pointer;
    font-size: 14px;
    color:#606266
  }
  .tabActive {
    border: 1px solid #1890ff;
    color: #1890ff;
  }
}
</style>
