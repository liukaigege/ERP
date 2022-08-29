<template>
  <div>
    <div class="skuItemBox">
      <div class="skuList">
        <div class="skuItem">
          <div class="itemBtn">
            <div class="btnList">
              <div class="sku">
                <el-select v-model="commonSpeId"  @change="changeSpe"  v-if="showCoutomCloumns('customType')" :disabled='isDisabled'>
                  <el-option label="不使用常用规格" :value="null"></el-option>
                  <el-option
                    :label="item.nameCn"
                    :value="item.id"
                    v-for="(item, index) in speList"
                    :key="index"
                  ></el-option>
                </el-select>
              </div>
              <div class="btn" @click="add" v-if="routeOption.add && !isDisabled">
                <i class="el-icon-plus"></i> 增加参数
              </div>
              <div
                class="btn"
                v-if="selectSpeValue.length > 0 && commonSpeId && !isDisabled"
                @click="selectSpe"
              >
                常用属性
              </div>
            </div>
          </div>

          <div class="itemTable">
            <div class="tableHead">
              <div class="headTop">
                <el-row>
                  <el-col :span="12" class="col"> 参数可选值 </el-col>
                  <el-col :span="7" class="col"> 加价 </el-col>
                  <el-col :span="5" class="col"> 图片参数 </el-col>
                </el-row>
              </div>
              <div class="headBottom">
                <el-row>
                  <el-col :span="12" class="colB">
                     <div class="en">英文</div>
                  <div class="cn" v-if="showCoutomCloumns('nameCn')">中文</div>
                     <div class="cn" v-if="showCoutomCloumns('status')">状态</div>
                  </el-col>
                  <el-col :span="7" class="colB"> </el-col>
                  <el-col :span="5" class="colB">
                    <el-switch
                      v-model="isShowImg"

                      :active-value="1"
                      :inactive-value="0"
                      :disabled="isDisabled"
                    ></el-switch>
                  </el-col>
                </el-row>
              </div>
            </div>

            <div class="tableTr">
              <div class="trItemLeft">
                <draggable
                  v-model="coustom"
                  group="coustom"
                  @start="(val) => leftDragStart(val)"
                  @end="(val) => leftDragEnd(val, 'imgList')"
                  item-key="id"
                  :disabled="dragDisabled"
                  handle=".drag"
                >
                  <template #item="{ element }">
                    <el-row>
                      <el-col :span="15" class="trCol">
                        <div class="itemEn bdCol">
                          <i v-if="!showCoutomDisabled('dragItem')" class="vango-icon vango-erp-move drag"></i>
                          <div class="input">
                            <el-input
                              v-model="element.nameEn"
                              placeholder=""

                              :maxlength="100"
                              :disabled="showCoutomDisabled('nameEn') || isDisabled"
                            ></el-input>
                          </div>
                        </div>
                        <div class="itemCn bdCol">
                          <div class="input">
                            <el-input
                             v-if="showCoutomCloumns('nameCn')"
                              v-model="element.nameCn"
                              :disabled="element.commonSpeValId ? true : false  || showCoutomDisabled('nameCn') || isDisabled"

                              placeholder=""
                              :maxlength="100"
                            ></el-input>
                             <el-switch
                              :active-value="1"
                              :inactive-value="0"
                            v-if="showCoutomCloumns('status')"
                            :disabled="isDisabled"
                            v-model="element.status"></el-switch>
                          </div>
                        </div>
                      </el-col>
                      <el-col :span="9" class="trCol bdCol">
                        <div class="input">
                          <el-input-number
                            v-model="element.plusPrice"
                            style="width: 120px"
                            controls-position="right"
                            :min="0"
                            :max="999999.99"
                            :disabled=" showCoutomDisabled('plusPrice') || isDisabled"
                          ></el-input-number>
                        </div>
                      </el-col>
                    </el-row>
                  </template>
                </draggable>
              </div>
              <div class="trItemRight">
                <draggable
                  v-model="imgList"
                  group="imgList"
                  @start=""
                  @end="dragEnd"
                  item-key="id"
                  class="dragImg"
                  :disabled="dragDisabled"
                >
                  <template #item="{ element, index }">
                    <div class="itemRightImg bdCol" v-if="element.url">
                      <div class="imgItem">
                        <img :src="element.url" alt="" />
                        <div class="mask" v-if="!showCoutomDisabled('url') && !isDisabled"></div>
                        <div class="icons" v-if="!showCoutomDisabled('url') && !isDisabled">
                          <i class="el-icon-delete" @click="delImg(index)"></i>
                        </div>
                      </div>
                    </div>
                  </template>
                </draggable>

                <div class="itemRightImg bdCol" v-if="showUploadImg">
                  <!-- <UploadImg
									ref="uploadImg"
									:data="[]"
									:showFileList="false"
									:isNoFilieList="true"
									@getFileList="val => getImgList(val)"
								/> -->
                  <div class="selectImg" @click="showSelectImg" v-if="!showCoutomDisabled('url') && !isDisabled">
                    <i class="el-icon-plus"></i>
                  </div>
                </div>
              </div>

              <div class="trItemClose">
                <div class="closeItem" v-for="(item, index) in coustom" :key="index">
                  <i
                    class="el-icon-close delSku"
                    @click="delSku(index)"
                    v-if="routeOption.add && !isDisabled"
                  ></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- skuitem -->

    <div
      :style="{
        position: 'fixed',
        right: 0,
        bottom: 0,
        width: '32%',
        borderTop: '1px solid #e9e9e9',
        padding: '10px 16px',
        background: '#fff',
        textAlign: 'right',
        zIndex: 999,
      }"
    >
      <el-button  :style="{ marginRight: '8px' }" @click="cancel">
        取消
      </el-button>
      <el-button  type="primary" @click="submit"> 确定 </el-button>
    </div>
  </div>
</template>

<script>
import { toRefs, reactive, computed, onMounted, inject, watch } from "vue";
import UploadImg from "@/components/uploadImg/index.vue";
import draggable from "vuedraggable";
import skuItemHook from "../hooks/skuItem.js";
import optionFun from "../hooks/optionFun.js";
export default {
  components: { UploadImg, draggable },
  props: {
    query: {
      type: Object,
      default: null,
    },
  },
  setup(props, { emit }) {
    const data = reactive({
      dragDisabled: false,
      commonSpeId: null,
      coustom: [], // sku参数列表
      imgList: [],
      isShowImg: 0, // 是否显示img
      speList: inject("speList"),
      selectSpeValue: [],
    });
    const isDisabled = inject('isDisabled')
    const {
      createId,
      confirm,
      leftDragEnd,
      leftDragStart,
      submitCoustom,
      cancel,
      changeSpe,
    } = skuItemHook(data);


    const routeOption = inject("routeOption");
        const { showCoutomCloumns, showCoutomDisabled } = optionFun(routeOption);
    const nameCnDisabled = computed(() => {
      const { commonSpeId } = data;
      if (commonSpeId) return true;

      return false;
    }); // 中文输入框是否disabled

    const showUploadImg = computed(() => {
      const { imgList, coustom } = getPartsList();
      if (imgList.length == coustom.length) {
        return false;
      }
      return true;
    });

    function getPartsList() {
      const imgList = data.imgList;
      const coustom = data.coustom;
      const isShowImg = data.isShowImg;
      return {
        imgList,
        coustom,
        isShowImg,
      };
    } // 获取配件是否开启的状态下的数据

    function dragEnd(params) {} // 拖拽结束

    function add() {
      let obj = {
        frontId: createId(),
        nameEn: null,
        nameCn: null,
        plusPrice: null,
        url: null,
        commonSpeValId: null,
      };
      data.coustom.push(obj);
    } // 新增参数

    function getImgList(val) {
      console.log(val);
      if (data.imgList.length < data.coustom.length) {
        for (var i = 0; i < val.length; i++) {
          let item = val[i];
          let imgItem = {
            pictureId: item.pictureId,
            url: item.url,
						pictureType:0
          };
          if (data.imgList.length < data.coustom.length) {
            data.imgList.push(imgItem);
          } else {
            return false;
          }
        }
      }
    } // 获取上传的图片列表

    function delImg(index) {
      confirm("确定删除当前图片?", () => {
        data.imgList.splice(index, 1);
      });
    } // 删除当前图片

    function delSku(index) {
      confirm("确定删除当前规格参数?", () => {
        if (data.imgList[index]) data.imgList.splice(index, 1);
        data.coustom.splice(index, 1);
      });
    } // 删除sku参数

    function submit() {
      const { coustom, imgList, isShowImg, commonSpeId } = data;
      submitCoustom({ imgList, coustom, isShowImg })
        .then((res) => {
          coustom.forEach((item, index) => {
            // if(item.nameEn && !item.nameCn) item.nameCn = item.nameEn
            // if(!item.nameEn && item.nameCn) item.nameEn = item.nameCn
            item.url = imgList[index] ? imgList[index].url : null;
            item.pictureId = imgList[index] ? imgList[index].pictureId : null;
						item.pictureType = imgList[index] ? imgList[index].pictureType : 0
          });
          const emitQuery = {
            speValues: coustom,
            isPhoto: isShowImg,
            commonSpeId,
          };
          emit("ok", { emitQuery, query: props.query });
        })
        .catch((err) => {
          console.log(err);
        });
    }

    function showSelectImg() {
      emit("showSelectImg", { type: 3, multiple: true });
    } // 打开图片选择框

    function init(row) {
      if (row) {
        const { isPhoto, commonSpeId, speValues } = row;
        data.isShowImg = isPhoto;
        data.commonSpeId = commonSpeId;
        getCoustom(speValues);
      }

      function getCoustom(speValues) {
        let url = [];
        speValues.forEach((item) => {
          if (item.url ) {
            let imgItem = {
              frontId: createId(),
              url: item.url,
							pictureType:0,
							pictureId:item.pictureId || null
            };
            url.push(imgItem);
          }
        });
        data.imgList = url;
        data.coustom = speValues;
      }
    }

    function selectSpe() {
      const coustom = data.coustom;
      let spe = data.speList.find((v) => v.id == data.commonSpeId);
      let slectSpeArr = [];
      coustom.map((item) => {
        if (item.commonSpeValId) slectSpeArr.push(item.commonSpeValId);
      });
      let query = {
        type: "coustomChild",
        values: data.selectSpeValue,
        spe,
        slectSpeArr,
      };
      emit("selectSpe", query);
    } // 选择常用规格

    function addSpe(speList) {
      speList.map((item) => {
        let index = data.coustom.findIndex((v) => v.commonSpeValId == item.id);
        if (index !== -1) return;

        let obj = {
          frontId: createId(),
          nameCn: item.valCn,
          nameEn: item.valEn,
          plusPrice: null,
          url: null,
          commonSpeValId: item.id,
        };

        data.coustom.push(obj);

        // if (data.isShowImg == 0) return;
        let imgItem = {
          frontId: createId(),
          url: item.mainImg,
					pictureId:createId(),
					pictureType:1
        };
        data.imgList.push(imgItem);
      });
    }

    watch(
      () => props.query,
      (a) => {
        if (props.query) {
          const { row } = props.query;
          init(JSON.parse(JSON.stringify(row)));
          if (data.commonSpeId) {
            data.speList.map((item) => {
              if (item.id == data.commonSpeId) data.selectSpeValue = item.valueList;
            });
          }
        }
      }
    );

    onMounted(() => {
      if (props.query) {
        const { row } = props.query;
        init(JSON.parse(JSON.stringify(row)));
        if (data.commonSpeId) {
          data.speList.map((item) => {
            if (item.id == data.commonSpeId) data.selectSpeValue = item.valueList;
          });
        }
      }
    });

    return {
      ...toRefs(data),
      dragEnd,
      add,
      getImgList,
      delImg,
      showUploadImg,
      delSku,
      nameCnDisabled,
      leftDragEnd,
      leftDragStart,
      submit,
      showSelectImg,
      cancel,
      changeSpe,
      selectSpe,
      addSpe,
      routeOption,
      showCoutomCloumns,
      showCoutomDisabled,
      isDisabled
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
  justify-content: flex-start;
  padding: 12px 26px;
  background: #fafafa;
  width: 103%;
  margin-left: -1.5%;
  i {
    font-size: 16px;
    color: rgba(0, 0, 0, 0.45);
  }
  .itemHeadRight {
    width: 60%;
    margin-left: 30px;
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
    width: 100%;
    display: flex;
    align-items: center;
    .sku {
      width: 40%;
      margin-right: 10px;
    }
    .btn {
      cursor: pointer;
      border: 1px solid #1890ff;
      color: #1890ff;
      padding: 5px 10px;
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
        width: 60%;
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
      border-right: none !important;
    }
  }
}

.dragImg {
  width: 100%;
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

.matchChild {
  margin: 20px 0 50px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .matchLeft {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    p {
      color: #1890ff;
      margin-bottom: 5px;
    }
    width: 20%;
  }
  .matchRight {
    display: flex;
    flex-wrap: wrap;
    width: 80%;
  }
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
