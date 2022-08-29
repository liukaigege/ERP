<template>
  <div class="collection">
    <div class="form">
      <el-form :model="form" :inline="true" >
        <el-form-item label="独立站平台：" v-if="type == 'second'">
          <el-select v-model="form.station" placeholder="">
            <el-option label="店匠" value="shoplazza"></el-option>
            <el-option label="shopify" value="shopify"></el-option>
						<el-option label="funpinpin" value="funpinpin"></el-option>
						<el-option label="xshoppy" value="xshoppy"></el-option>
					</el-select>
        </el-form-item>
        <el-form-item label="商品类型：">
          <el-select v-model="form.goodsType" placeholder="">
            <el-option label="普通商品" :value="0"></el-option>
            <el-option label="定制商品" :value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>

    <div class="collect">
      <div class="tab">
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
          {{ item.lable }}
        </div>
        <div class="text">
          <span v-if="type == 'first'"
					>当前支持平台：ETSY、1688、亚马逊（美国）、速卖通、wayfair、shein</span
					>
          <span v-if="type == 'second'">当前支持平台：店匠、shopify、funpinpin、xshoppy</span>
        </div>
      </div>

      <div class="collectContent">
        <el-form :model="form" >
          <el-form-item label="" v-if="activeTab == 1">
            <el-input
              v-model="form.collectLink"
              placeholder="请填写商品列表链接"
            ></el-input>
          </el-form-item>
          <el-form-item label="" v-if="activeTab == 1">
            <div
              style="display: flex; align-items: center; justify-content: space-between;width: 100%;"
            >
              <div>
                链接采集商品
                <el-input-number
                  style="width: 100px"
                  v-model="form.start"
                  :min="1"
                  :max="999"
                  controls-position="right"
                ></el-input-number>
                -
                <el-input-number
                  style="width: 100px"
                  v-model="form.end"
                  :min="1"
                  :max="999"
                  controls-position="right"
                ></el-input-number>
                <span class="span"
                  >(请填写列表要采集商品开始和结束位置，一次最多采集不超过200个商品，结束不填默认采集200个)</span
                >
              </div>
              <div class="btnList" v-if="activeTab == 1">
                <el-button
                  type="primary"

                  :disabled="btnDisabled"
                  @click="collection"
                  :loading="activesLoading"
                  >开始采集</el-button
                >
                <el-button type="default"  @click="clear">清空</el-button>
              </div>
            </div>
          </el-form-item>

          <el-form-item label="" v-if="activeTab == 0">
            <el-input
              type="textarea"
              v-model="form.collectLinkArray"
              placeholder="请填写在线商品链接,多个网址请使用Enter(回车)换行,最多可添加50个"
              rows="8"
            ></el-input>
          </el-form-item>
        </el-form>
        <div class="btnList" v-if="activeTab == 0">
          <el-button
            type="primary"

            :disabled="btnDisabled"
            @click="collection"
            :loading="activesLoading"
            >开始采集</el-button
          >
          <el-button type="default"  @click="clear">清空</el-button>
        </div>
      </div>
    </div>
    <div class="line"></div>
    <CollectionDilaog
      :dialog-visible="dialogVisible"
      v-if="dialogVisible"
      :dialog="collectionData"

    />
    <CollectionLoading
       :dialog-visible="showLoadingDialog"
        v-if="showLoadingDialog"
        :dialog="uuid"
        @cancel="cancelCollection"
        destroy-on-close
    />
  </div>
</template>

<script>
import { reactive, toRefs, computed, getCurrentInstance } from "vue";
import CollectionDilaog from "@/views/goods/goodsManagement/addGoods/components/collectionDilaog.vue";
import { plCollection, psCollection } from "@/api/goods/addGoods.js";
import CollectionLoading from "@/views/goods/goodsManagement/addGoods/components/collectionLoading.vue";
export default {
  props: {
    type: {
      type: String,
      default: null,
    },
    query: {
      type: Object,
      default: null,
    },
  },
  components: {
    CollectionDilaog,CollectionLoading
  },
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance();
    const data = reactive({
      form: {
        goodsType: 0,
        collectLinkArray: null, // 单挑采集
        collectLink: null, // 列表采集
        start: undefined,
        end: undefined,
        station: "shoplazza",
      },
      tabList: [
        {
          lable: "单条采集",
          value: 0,
        },
        {
          lable: "列表采集",
          value: 1,
        },
        // {
        // 	lable:"自定义采集",
        // 	value:2
        // }
      ],
      activeTab: 0,
      collectionData: null,
      dialogVisible: false,
      activesLoading: false,
      uuid:null,
      showLoadingDialog:false
    });


		function createId() {
			let timestamp = new Date().getTime()
			let num = parseInt((Math.random()*9+1) * 10000)
			//console.log(timestamp+String(num))
			return timestamp + num
		} // 生成随机id

    const btnDisabled = computed(() => {
      const { collectLinkArray, collectLink } = data.form;
      if (data.activeTab == 0 && !collectLinkArray) return true;
      if (data.activeTab == 1 && !collectLink) return true;
      return false;
    });

    function clear() {
      if (data.activeTab == 0) {
        data.form.collectLinkArray = null;
      } else {
        data.form.collectLink = null;
      }
    } // 清空

    function collection() {
      data.collectionData = null
      if (data.activeTab == 1) {
        if (data.form.start > data.form.end) {
          proxy.$message.error(`采集商品开始数应小于结束数`);
          return;
        }
      }
         isShowLoading(true)
      if (data.activeTab == 0) {
        collectionSignle();
      } else {
        collectionMore();
      }
    } // 采集

    function collectionSignle() {
        data.uuid = String(createId())
      const { collectLinkArray, goodsType, station } = data.form;
      var temp =[collectLinkArray]
			if(collectLinkArray.indexOf("http://") > -1){
				temp =	collectLinkArray
					.split("http://", 51)
					.filter((item) => item)
					.map((item) => "http://" + item.replace("\n", ""))

			}else if(collectLinkArray.indexOf("https://") >-1){
				temp =	collectLinkArray
					.split("https://", 51)
					.filter((item) => item)
					.map((item) => "https://" + item.replace("\n", ""))
			}

      temp = unique(temp);
			console.log(temp)

      const param = {
        goodsType,
        collectLinkArray: temp,
        station: props.type == "second" ? station : null,
        uuid:data.uuid
      };
      psCollection(param).then((res) => {
        if (res.code == 200) {
          // data.dialogVisible = true;
          // data.collectionData = res.data;

					//  isShowLoading(false)
          // refersh();
        }
      }).catch(err=>{
        // isShowLoading(false)
      });

      function unique(arr) {
        return Array.from(new Set(arr));
      }
    } // 单条采集

    function collectionMore() {
      data.uuid = String(createId())

			const { goodsType, collectLink, start, end, station } = data.form;
      const param = {
        goodsType,
        collectLink,
        start,
        end,
        station: props.type == "second" ? station : null,
				uuid: data.uuid
      };
      data.activesLoading = true;
      plCollection(param)
        .then((res) => {
          if (res.code == 200) {
            if (res.data.successCount) {
              proxy.$message.success(
                `采集完成，共采集有效商品${res.data.successCount}个`
              );
            } else {
              // proxy.$message.error(`该链接为无效链接，无法采集`);
            }

						// isShowLoading(false)
          }
          data.activesLoading = false;
        })
        .catch((err) => {
          //  isShowLoading(false)
          data.activesLoading = false;
        });
    } // 列表采集

    function refersh() {
      emit("refersh");
    }

    function cancelCollection(val){
       data.collectionData = val
      data.dialogVisible = true
      data.form.collectLinkArray = null;
      data.form.collectLink = null;
       refersh();
    }


    function isShowLoading(val){
      console.log(val)
      data.showLoadingDialog = val
    } //  打开进度条


    return {
      ...toRefs(data),
      btnDisabled,
      clear,
      collection,
      isShowLoading,
      cancelCollection
    };
  },
};
</script>

<style lang="scss" scoped>
.tab {
  display: flex;
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
  }
  .tabActive {
    border: 1px solid #1890ff;
    color: #1890ff;
  }
}
.btnList {

	display: flex;
  justify-content: flex-end;
}
.span {
  font-size: 12px;
  margin-left: 10px;
}
.line {
  width: 100%;
  height: 0;
  border-top: 1px dashed #ccc;
  margin: 20px 0;
}
</style>
