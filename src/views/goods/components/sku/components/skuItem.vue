<template>
  <div class="skuItemBox" :style="!upDown? 'padding-bottom:0' :''"  v-loading="translateLoading">
    <div class="skuList">
      <div class="skuItem">
        <div class="itemHead">
          <div class="itemHeadLeft">
            <i class="vango-icon vango-erp-move"  v-if="!showMulitDisabled('dragItem') && !isDisabled"></i>
          </div>
          <div class="itemHeadRight">
            <i class="el-icon-delete delete" @click="del"  v-if="routeOption.multi.del && !isDisabled"></i>
            <i :class="upDown ? 'el-icon-arrow-down' :'el-icon-arrow-up'" @click="()=>upDown = !upDown"></i>
          </div>
        </div>

        <div class="itemForm" v-show ="upDown">
          <div class="itemFormLeft">规格名称:</div>
          <div class="itemFormRight">
            <div class="type">
               <div
                :class="form.language == 'en' ? 'formType active' : 'formType'"
                @click="changeLanguage('en')" v-if="routeOption.multi.setSkuItem.en"
              >
                英文
              </div>
              <div
                :class="form.language == 'cn' ? 'formType active' : 'formType'"
                @click="changeLanguage('cn')" v-if="routeOption.multi.setSkuItem.cn"
              >
                中文
              </div>

              <div class="formSelect" v-if="routeOption.multi.setSkuItem.commonSpe">
                <el-select
                  v-model="form.commonSpeId"
                  placeholder=""
                  
                  @change="changeSpe"
                   :disabled="showMulitDisabled('commonSpeId') || isDisabled"
                >
                  <el-option label="不使用常用规格" :value="null"> </el-option>
                  <el-option
                    :label="item.nameCn"
                    :value="item.id"
                    v-for="(item, index) in speList"
                    :key="index"
                  ></el-option>
                </el-select>
              </div>

							<div style='margin-left: 15px' v-if=' routeOption.multi.setSkuItem.cn && routeOption.multi.setSkuItem.en'>
								<el-button size='small' @click='transtlateBtn' type='text' :disabled="showMulitDisabled('name') || isDisabled">
									{{form.language == 'cn' ? '翻译并填充英文' :'翻译并填充中文' }}
								</el-button>
							</div>

            </div>

            <div class="input">
              <el-input
                v-model="form.name[form.language]"
                placeholder=""
                
                 :maxlength="100"
                 :disabled="showMulitDisabled('name') || isDisabled"
              ></el-input>
            </div>
          </div>
        </div>

        <div class="itemBtn" v-show ="upDown">
          <div class="btnList">
            <div class="btn" @click="add"  v-if="routeOption.multi.setSkuItem.add  && !isDisabled"><i class="el-icon-plus"></i> 增加参数</div>
            <div class="btn" v-if="selectSpeValue.length > 0 && form.commonSpeId && routeOption.multi.add"  @click="selectSpe">
              选择属性
            </div>

            <div class="select" v-if="form.isPhoto == 0">
              展示样式：
              <div style="width: 100px">
                <el-select v-model="form.showType" placeholder=""   :disabled="showMulitDisabled('showType') || isDisabled">
                  <el-option label="下拉" :value="1"></el-option>
                  <el-option label="展开" :value="2"></el-option>
                </el-select>
              </div>
            </div>
          </div>
        </div>

        <div class="itemTable" v-show ="upDown">
          <div class="tableHead">
            <div class="headTop">
              <el-row>
                <el-col :span="routeOption.multi.setSkuItem.skuCode? 12 :19" class="col"> 参数可选值 </el-col>
                <el-col :span="7" class="col" v-if="routeOption.multi.setSkuItem.skuCode"> SKU编码 </el-col>
                <el-col :span="5" class="col"> 图片参数 </el-col>
              </el-row>
            </div>
            <div class="headBottom">
              <el-row>
                <el-col :span="routeOption.multi.setSkuItem.cn ?  12 :19" class="colB">
                  <div class="en"  v-if="routeOption.multi.setSkuItem.en"  :style=" !routeOption.multi.setSkuItem.cn ? 'width:100%' :'' ">英文</div>
                  <div class="cn" v-if="routeOption.multi.setSkuItem.cn" >中文</div>
                </el-col>
                <el-col :span="7" class="colB"  v-if="routeOption.multi.setSkuItem.cn"> </el-col>
                <el-col :span="5" class="colB">
                  <el-switch
                    v-model="form.isPhoto"
                    :active-value="1"
                    :inactive-value="0"
                    
                    :disabled="showMulitDisabled('isPhoto') || isDisabled"
                  ></el-switch>
                </el-col>
              </el-row>
            </div>
          </div>

          <div class="tableTr">
            <div class="trItemLeft">
              <draggable
                v-model="skuValue"
                @start="(val) => leftDragStart(val)"
                @end="(val) => leftDragEnd(val, 'imgList')"
                item-key="frontId"
                handle=".drag"
              >
                <template #item="{ element }">
                  <el-row>
                    <el-col :span="routeOption.multi.setSkuItem.skuCode ? 15 : 24" class="trCol">
                      <div class="itemEn bdCol" :style=" !routeOption.multi.setSkuItem.cn ? 'width:100%' :'' ">
                        <i class="vango-icon vango-erp-move drag" v-if="!showMulitDisabled('dragItem') && !isDisabled"></i>
                        <div class="input"  v-if="routeOption.multi.setSkuItem.en">
                          <el-input
                            v-model="element.nameEn"
                            placeholder=""
                            
                            :maxlength="100"
                            :disabled="showMulitDisabled('itemName') || isDisabled"
                          ></el-input>
                        </div>
                      </div>
                      <div class="itemCn bdCol " v-if="routeOption.multi.setSkuItem.cn">
                        <div class="input"  v-if="routeOption.multi.setSkuItem.cn">
                          <el-input
                            v-model="element.nameCn"
                            
                            placeholder=""
                            :maxlength="100"
                            :disabled="showMulitDisabled('itemName') || isDisabled || (element.commonSpeValId ? true :false)"
                          ></el-input>
                        </div>
                      </div>
                    </el-col>
                    <el-col :span="9" class="trCol bdCol" v-if="routeOption.multi.setSkuItem.skuCode">
                      <div class="input" v-if="element.commonSpeValId && routeOption.multi.setSkuItem.skuCode">
                        <el-input
                          v-model="element.skuCode"
                          placeholder="SKU编码"
                          
                          disabled
                        ></el-input>
                      </div>
                    </el-col>
                  </el-row>
                </template>
              </draggable>
            </div>
            <div class="trItemRight">
              <draggable
                v-model="imgList"
                @end="dragEnd"
                class="dragImg"
                :disabled="showMulitDisabled('dragItem')"
              >
                <template #item="{ element, index }">
                  <div class="itemRightImg bdCol" v-if="element.url">
                    <div class="imgItem">
                      {{skuValue[index].isAdd }}
                      <img :src="element.url" alt="" />
                      <div class="mask" v-if="!showMulitDisabled('url') && !isDisabled"></div>
                      <div class="icons" v-if="!showMulitDisabled('url') && !isDisabled">
                        <i class="el-icon-delete" @click="delImg(index)"></i>
                      </div>
                    </div>
                  </div>
                </template>
              </draggable>

              <div class="itemRightImg bdCol" v-if="showUploadImg && !showMulitDisabled('url') && !isDisabled">
                <!-- <UploadImg
									ref="uploadImg"
									:data="[]"
									:showFileList="false"
									:isNoFilieList="true"
									@getFileList="val => getImgList(val)"
								/> -->
                <div class="selectImg" @click=" showSelectImg">
                  <i class="el-icon-plus"></i>
                </div>
              </div>
            </div>

            <div class="trItemClose">
              <div class="closeItem" v-for="(item, index) in skuValue" :key="index">
                <i class="el-icon-close delSku" @click="delSku(index)"  v-if="routeOption.multi.del && !isDisabled"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  toRefs,
  reactive,
  computed,
  onMounted,
  getCurrentInstance,
  watch,
  inject,
} from "vue";
import {ElMessage} from 'element-plus'
import UploadImg from "@/components/uploadImg/index.vue";
import draggable from "vuedraggable";
import skuItemHook from "../hooks/skuItem.js";
import optionFun from "../hooks/optionFun.js";
import { baiduTranslate } from '@/utils/translate'
export default {
  components: { UploadImg, draggable },
  props: {
    modelValue: Object,
    index: {
      type: Number,
      default: 0,
    },
  },
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance();
    const data = reactive({
			translateLoading:false,//翻译loading
      drag: false,
      form: {
        language: "en", // cn 中文 en 英文
        name: {
          cn: "",
          en: "",
        }, // 名称
        commonSpeId:null, // 规格类型
        showType: 1, // 展示样式
        isPhoto: 0, // 是否显示图片
        id:null
      }, // sku 参数值
      skuValue: [], // sku参数列表
      imgList: [], // 图片列表
      element: {}, // modelValue
      speList: inject("speList"),
      selectSpeValue: [],
      upDown:true
    });

    const routeOption = inject('routeOption')

    const isDisabled = inject('isDisabled')

     const {showMulitDisabled } = optionFun(routeOption);
    const {
      createId,
      confirm,
      leftDragEnd,
      leftDragStart,
      getSkuVal,
      setDetail,
      checkAgainData,
      checkDataIsNull,
      changeSpe,
			translateSkuItem
    } = skuItemHook(data);

    const showUploadImg = computed(() => {
      if (data.imgList.length == data.skuValue.length) {
        return false;
      }
      return true;
    });

    function dragEnd(params) {
			console.log(data.imgList)
      data.drag = false;
    }

    function add() {
      let obj = {
        frontId: createId(),
        nameCn: null,
        nameEn: null,
        skuCode: null,
        img: null,
        commonSpeValId: null, // 常用规格id
      };
      data.skuValue.push(obj);
    } // 新增参数

    function addSpe(speList) {
      speList.map((item) => {
        let index = data.skuValue.findIndex((v) => v.commonSpeValId == item.id);
        if (index !== -1) return;
        let obj = {
          frontId: createId(),
          nameCn: item.valCn,
          nameEn: item.valEn,
          skuCode: item.skuCode,
          commonSpeValId: item.id,
          img: null,
          id:null,
          idAdd:1,
        };
        data.skuValue.push(obj);
        // if (data.form.isPhoto == 0) return;

        if(item.mainImg){
           let imgItem = {
          frontId: createId(),
          url: item.mainImg,
					pictureId: createId(),
					pictureType:1, // 是否是常用规格
        };
         data.imgList.push(imgItem);
        }

      });
    } // 设置spe的规格

    function getImgList(val) {
			console.log(val, '==>val')
      for (var i = 0; i < val.length; i++) {
        let item = val[i];
        let imgItem = {
          pictureId: item.pictureId,
          url: item.url,
					id:item.id
        };
        if (data.imgList.length < data.skuValue.length) {
          data.imgList.push(imgItem);
        } else {
          return false;
        }
      }
    } // 获取上传的图片列表

		function transtlateBtn(){
			const {name,language} = data.form
			data.translateLoading = true
			let val = name[language]  // 当前标题
			let from  = language =='cn' ? 'zh' :'en'
			let to = language =='cn' ? 'en' :'zh'
			if (val && /^(?!(\s+$))/.test(val)){
				baiduTranslate(val,from,to,false).then(res=>{
					if(res.str){
						// ElMessage.success('翻译成功!')
						data.form.name[language ==='cn' ? 'en' : 'cn'] = res.str
					}
				})
			}else{
				data.translateLoading = false
				return ElMessage.error('规格名称不能为空')
			}
			translateSkuItem({
				from,
				to,
				isShowEn:routeOption.multi.setSkuItem.en,
				isShowCn:routeOption.multi.setSkuItem.cn,
				nameDisabled:showMulitDisabled('itemName'),
			},_=>{
				data.translateLoading = false
			})



			// skuValue

		} // 翻译

    function delImg(index) {
      confirm("确定删除当前图片?", () => {
        data.imgList.splice(index, 1);
      });
    } // 删除当前图片

    function delSku(index) {
       if (data.imgList[index]) data.imgList.splice(index, 1);
        data.skuValue.splice(index, 1);
      // confirm("确定删除当前规格参数?", () => {
      //   if (data.imgList[index]) data.imgList.splice(index, 1);
      //   data.skuValue.splice(index, 1);
      // });
    } // 删除sku参数

    function changeLanguage(val) {
      data.form.language = val;
    } // 切换语言

    function emitData() {
      let val = getSkuVal("skuValue", "imgList");
      emit("update:modelValue", val);
    } // 通信

    function checkSku() {
      let arr = data.skuValue;
      return new Promise((resolve, reject) => {
        let r;
        r = checkDataIsNull(arr, props.index);
        if (r.bole) {
          r = checkAgainData(arr, { key: "nameCn", desc: "中文名称" }, props.index);
        }
        if (r.bole) {
          r = checkAgainData(arr, { key: "nameEn", desc: "英文名称" }, props.index);
        }
        const { bole, message } = r;
        if (bole) {
          resolve(true);
        } else {
          data.upDown = true
          reject(message);
        }
      });
    } // 校验单个多规格

    function showSelectImg() {
      emit("showSelectImg", { type: 1, multiple: true, index: props.index });
    } // 打开图片选择框

    function del() {
      confirm("确定删除此规格参数?", () => {
        emit("delSpe", { index: props.index });
      });
    }

    function selectSpe() {
      let spe = data.speList.find((v) => v.id == data.form.commonSpeId);
      let slectSpeArr = [];
      data.skuValue.map((item) => {
        if (item.commonSpeValId) slectSpeArr.push(item.commonSpeValId);
      });
      emit("selectSpe", {
        type: "muliti",
        index: props.index,
        values: data.selectSpeValue,
        spe,
        slectSpeArr,
      });
    }


    watch(()=>props.modelValue,(a)=>{
			console.log(a,'==>props.modelValue')
       setDetail(props.modelValue);
    })

    onMounted(() => {
      data.element = props.modelValue;
      setDetail(props.modelValue);

    });

    return {
      ...toRefs(data),
      dragEnd,
      add,
      getImgList,
      delImg,
      showUploadImg,
      delSku,
      changeLanguage,
      leftDragEnd,
      leftDragStart,
      emitData,
      checkSku,
      showSelectImg,
      del,
      changeSpe,
      selectSpe,
      addSpe,
      routeOption,
      showMulitDisabled,
      isDisabled,
			transtlateBtn
    };
  },
};
</script>

<style lang="scss" scoped>
.skuItemBox {
  border: 1px solid #e8e8e8;
  padding: 0 1.5% 20px 1.5%;
}

.itemHead {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 26px;
  background: #fafafa;
  width: 103%;
  margin-left: -1.5%;
  i {
    font-size: 16px;
    color: rgba(0, 0, 0, 0.45);
  }
  .itemHeadRight {
    .delete {
      margin-right: 10px;
    }
  }
}

.itemForm {
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .itemFormLeft {
    width: 15%;
  }
  .itemFormRight {
    width: 85%;
  }
}

.type {
  display: flex;
  align-items: center;
  cursor: pointer;
  .formType {
    padding: 5.5px 20px;
    border: 1px solid #e8e8e8;
  }
  .formSelect {
    margin-left: 10px;
    width: 180px;
  }
  .active {
    border: 1px solid #1890ff;
    color: #1890ff;
  }
}

.itemBtn {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 20px;
  .btnList {
    width: 85%;
    display: flex;
    align-items: center;
    .btn {
      cursor: pointer;
      border: 1px solid #1890ff;
      color: #1890ff;
      padding: 5.5px 10px;
      margin-right: 12px;
    }
    .select {
      display: flex;
      align-items: center;
    }
  }
}

.itemTable {
  .tableHead {
    margin-top: 20px;
    background: #fafafa;
    border: 1px solid #e8e8e8;
    border-bottom: none;
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    text-align: center;
    .col {
      padding: 6px 0px 3px 0px;
    }

    .headBottom {
      .colB {
        justify-content: center;
        align-items: center;
        display: flex;
        font-size: 12px;
        padding: 2px 0;
        color: rgba(0, 0, 0, 0.85);
        .en {
          width: 60%;
        }
        .cn {
          width: 40%;
        }
      }
    }
  }

  .tableTr {
    display: flex;
    .trItemLeft {
      width: 80%;
    }
    .trItemRight {
      width: 15%;
      border-bottom: 1px solid #e8e8e8;
    }
  }
  .bdCol {
    border-bottom: 1px solid #e8e8e8;
    border-right: 1px solid #e8e8e8;
  }
  .trItemLeft {
    border-top: 1px solid #e8e8e8;
    border-left: 1px solid #e8e8e8;
    .input {
      width: 80%;
    }

    .trCol {
      justify-content: center;
      align-items: center;
      display: flex;
      font-size: 12px;
      color: rgba(0, 0, 0, 0.85);
      text-align: center;
      height: 70px;

      .itemEn {
        height: 70px;
        width:60%;
        display: flex;
        align-items: center;
        justify-content: space-around;
      }
      .itemCn {
        height: 70px;
        width: 40%;
        display: flex;
        align-items: center;
        justify-content: space-around;
      }
    }
  }
  .trItemRight {
    display: flex;
    flex-direction: column;
    align-items: center;
    border-top: 1px solid #e8e8e8;
    .itemRightImg {
      height: 70px;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}

.trItemClose {
  display: flex;
  flex-direction: column;
  width: 5%;
  border-right: 1px solid #e8e8e8;
  border-bottom: 1px solid #e8e8e8;
  .closeItem {
    height: 70px;
    line-height: 70px;
    text-align: center;
    border-top: 1px solid #e8e8e8;
    border-left: 1px solid #e8e8e8;
  }
  .delSku {
  }
}

.dragImg {
  width: 100%;
}

.imgItem {
  position: relative;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    width: auto;
    height: auto;
    max-width: 60px;
    max-height: 60px;
  }
  .mask {
    position: absolute;
    width: 100%;
    height: 100%;
    max-width: 110px;
    max-height: 110px;
    top: 0;
  }
  .icons {
    display: none;
    position: absolute;
    top: 35%;
    left: 50%;
    transform: translateX(-50%);
  }
}
.imgItem:hover {
  .mask {
    background-color: rgba(0, 0, 0, 0.5);
    transition: all 0.3s;
  }
  .icons {
    display: block;
    transition: all 0.3s;
    i {
      color: white;
      font-size: 18px;
    }
  }
}
.delSku {
  margin-left: 5px;
}
.selectImg {
  background: rgba(0, 0, 0, 0.04);
  width: 60px;
  height: 60px;
  border: 1px solid #e8e8e8;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px auto;
}
:deep(.el-upload--picture-card) {
  width: 60px;
  height: 60px;
}
:deep(.imgList .imgItem) {
  width: 60px;
  height: 60px;
  img {
    width: auto;
    height: auto;
    max-width: 60px;
    max-height: 60px;
  }
}
</style>
