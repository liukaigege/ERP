<template>
  <div class="coustom">
    <div class="coustomTable">
      <vxe-table
        :data="tableData"
        ref="xtable"
        align="center"
        :edit-rules="rules"
				row-key
				row-id="frontId"
				:scroll-y="{ gt: -1 }"
        :edit-config="{
          trigger: 'click',
          mode: 'row',
          showStatus: true,
        }"
      >
        <vxe-column width="30" v-if="!showCoutomDisabled('dragItem')">
          <template #default>
            <span class="drag-btn">
              <i class="vango-icon vango-erp-move"></i>
            </span>
          </template>
        </vxe-column>
        <vxe-column field="normsType" title="规格类型" width="90">
          <template #default="{ row }">
            <div class="type">
              {{ row.normsType == 0 ? "主规格" : "子规格" }}
                <span v-if="row.normsType == 1">
                <i @click="showRelation(row.frontId)" :class="relation.indexOf(row.frontId) !== -1 ? 'vango-icon vango-erp-lianjie' : 'vango-icon vango-erp-duankai'"></i>
                </span>
            </div>
            <!-- <i class=" vango-icon vango-erp-duankai"></i> -->
          </template>
        </vxe-column>

        <vxe-column
          field="nameEn"
          title="定制规格名称（英文）"
          width="180"
          :edit-render="{}"
        >
          <template #edit="{ row }">
            <vxe-input :maxlength="100" v-model="row.nameEn" :disabled="showCoutomDisabled('nameEn') || isDisabled"> </vxe-input>
          </template>
        </vxe-column>
        <!--  定制规格名称（英文）-->

        <vxe-column
          field="nameCn"
          title="定制规格名称（中文）"
          width="180"
          :edit-render="{}"
          v-if="showCloumns('nameCn')"
        >
          <template #edit="{ row }">
            <vxe-input :maxlength="100" v-model="row.nameCn" :disabled="showCoutomDisabled('nameCn') || isDisabled" > </vxe-input>
          </template>
        </vxe-column>

        <!--  定制规格名称（中文）-->

        <vxe-column
          field="customType"
          title="定制规格类型"
          width="180"
          :edit-render="{}"
        >
          <template #edit="{ row }">
            <vxe-select
              v-model="row.customType"
              placeholder="请选择"
              :transfer="true"
              :disabled="showCoutomDisabled('customType')"
              @change="
                (val) => {
                  val.value == 1 ? (row.plusPrice = null) : '';
                }
              "
            >
              <vxe-option
                v-for="(item, index) in statusList"
                :key="index"
                :value="item.value"
                :label="item.label"
              ></vxe-option>
            </vxe-select>
          </template>
          <template #default="{ row }">
            {{ filterStatus(row.customType) }}
          </template>
        </vxe-column>

        <!-- 定制规格类型 -->

        <vxe-column field="speValues" title="规格值" :edit-render="{}">
          <!-- <template #header>
						<span style="color: red">*</span>规格值
					</template> -->
          <template #edit="{ row }">
            <el-button
              type="text"
              v-if="row.customType == 1"
              @click="showDradwer(row)"
              >

             <span v-if="routeOption.add"> 配置({{ row.speValues?.length || 0 }}) </span>
              <span v-else> 查看 </span>

              </el-button
            >
            <p v-if="row.customType == 3">用户上传</p>
            <p v-if="row.customType == 2">用户填写</p>
          </template>
          <template #default="{ row }">
            <el-button
              type="text"
              v-if="row.customType == 1"
              @click="showDradwer(row)"
              >
              <span v-if="routeOption.add"> 配置({{ row.speValues?.length || 0 }})</span>
              <span v-else> 查看 </span>
              </el-button
            >
            <p v-if="row.customType == 3">用户上传</p>
            <p v-if="row.customType == 2">用户填写</p>
          </template>
        </vxe-column>
        <!-- 规格值 -->

        <vxe-column field="showType" title="展示样式" width="180" :edit-render="{}">
          <template #edit="{ row }">
            <vxe-select
              v-model="row.showType"
              placeholder="请选择"
              :transfer="true"
              v-if="row.customType == 1"
              :disabled="showCoutomDisabled('showType') || isDisabled"
            >
              <vxe-option :value="1" label="下拉"></vxe-option>
              <vxe-option :value="2" label="展开"></vxe-option>
            </vxe-select>
            <vxe-input
              v-model="row.length"
              v-if="row.customType == 2"
              type="integer"
              :disabled="showCoutomDisabled('length') || isDisabled"
              :min="1"
              :max="999"
              @change="
                () => {
                  row.showType = 1;
                }
              "
            ></vxe-input>
            <p v-if="row.customType == 3">用户上传</p>
          </template>
          <template #default="{ row }">
            {{ filterShowType(row) }}
          </template>
        </vxe-column>
        <!-- 展示样式 -->

           <vxe-column field="weight" title="重量（g）"  v-if="showCloumns('weight')">
              <template #default="{ row }">
                {{row.weight }}
              </template>
            </vxe-column>

             <vxe-column field="weight" title="体积（cm³）"  v-if="showCloumns('weight')">
              <template #default="{ row }">
                {{ row.lwh }}
              </template>
            </vxe-column>

        <vxe-column field="required" title="是否必选">
          <template #default="{ row }">
            <el-checkbox :disabled="showCoutomDisabled('required')  || isDisabled" v-model=" row.required" :true-label="1" false-label="0">必选</el-checkbox>
          </template>
        </vxe-column>
        <!-- 是否必选 -->

        <vxe-column field="plusPrice" title="加价" :edit-render="{}">
          <template #edit="{ row }">
            <vxe-input
              type="float"
              v-model="row.plusPrice"
              :disabled="row.customType == 1 || showCoutomDisabled('plusPrice') || isDisabled"
              :min="0"
              :max="999999.99"
              :step="1"

            >
            </vxe-input>
          </template>
        </vxe-column>

        <vxe-column field="option" title="操作" v-if="routeOption.add && !isDisabled">
          <template #default="{ row, seq }">
            <div class="formBtn">
              <el-button type="text" @click="copyCoustom(row,seq -1)">复制</el-button>
              <el-button type="text" style="color: red" @click="del(seq -1)">删除</el-button>
            </div>
          </template>
        </vxe-column>
      </vxe-table>
    </div>
    <div class="coustomBtn"  v-if="routeOption.add && !isDisabled">
      <div class="btn" @click="addCoustom(0)">
        <i class="el-icon-plus"></i>
        添加主定制规格
        <!-- <i class="el-icon-circle-plus"></i> -->
      </div>
      <div class="btn" @click="addCoustom(1)">
        <i class="el-icon-plus"></i>
        添加子定制规格
        <!-- <i class="el-icon-circle-plus"></i> -->
      </div>
    </div>
  </div>
</template>

<script>
import { toRefs, reactive, ref, onMounted, getCurrentInstance,watch,inject, computed } from "vue";
import coustomHook from "../hooks/coustom.js";
import skuItemHook from "../hooks/skuItem.js";
import { deepCopy } from '@/utils/tool.js'
import optionFun from "../hooks/optionFun.js";
export default {
  components: {},
  props: {
    modelValue: Array,
  },
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance();
    const isDisabled = inject('isDisabled')
    const data = reactive({
      tableData: [],
      sortable: null,
      statusList: [
        {
          label: "规格选项",
          value: 1,
        },
        {
          label: "文本输入",
          value: 2,
        },
        {
          label: "图片上传",
          value: 3,
        },
      ],
    });
    const { createId, confirm } = skuItemHook(data);
    const routeOption = inject('routeOption')
    const {showCoutomDisabled} = optionFun(routeOption)
    const xtable = ref(null);
    const { rowDrop, rules, filterStatus, filterShowType } = coustomHook(data);

    const relation= computed(()=>{
      let relationChildList =[]
      props.modelValue.map(item=>{
        if(item.normsType == 0){
           item.speValues.map(a=>{
             if(a.childIds.length>0){
               relationChildList = relationChildList.concat([...a.childIds])
             }
           })
        }
      })
      return  [...new Set(relationChildList)]
    })


    function addCoustom(val) {
      let obj = {
        id: null,
        frontId: createId(), // 前端处理id
        isParts: 0,
        isPhoto: 0,
        commonSpeId: null, // 常用规格id
        normsType: val, // 0主规格 1 子规格
        nameCn: null, // 中文名
        nameEn: null, //英文名
        customType: 1, // 1 规格类型, 2 文字输入, 3 图片上传
        showType: 1, // 1 下拉 2 展开
        plusPrice: null, // 加价
        required: 1, //1必选 0 非
        numbers: 0, // 规格选型数量
        length: 10, // 长度限制
        speValues: [],
      };
      if (val == 0) {
        data.tableData.push(obj);
        xtable.value.reloadData(data.tableData);
      } else {
        let bole = data.tableData.some((v) => {
          return v.normsType == 0;
        });

        if (!bole) {
          proxy.$message.error("请先添加主规格!");
          return;
        } else {
          data.tableData.push(obj);
          xtable.value.reloadData(data.tableData);
        }
      }
    } // 添加规格

    function showDradwer(row) {
      let x = row.normsType == 0 ? 2 : 3;
      let index = data.tableData.findIndex(item => item.frontId == row.frontId)
      let childList = data.tableData.filter((item) => {
        return item.normsType == 1;
      });
      emit("showDradwer", x, { row, index, childList });
    }

    function del(index){
      emit('delCoustom',index)
      xtable.value.reloadData(data.tableData);
    } // 删除规格'''

    function showCloumns(name){
      const arr = routeOption.coustom.columns
      return arr.indexOf(name) !== -1
    }

    function showRelation(frontId){
      let relation = []
      props.modelValue.map(item=>{
        let obj = new Object()
        if(item.normsType == 0 && item.customType !==2 && item.customType!==3){
             obj = {
                 fa:{
                   name:item.nameEn || item.nameCn,
                   frontId:item.frontId,
                   active:false,
                 },
                 child:[]
               }
           let z = 0
           item.speValues.map(a=>{
              let x = {
                name:a.nameEn || a.nameCn,
                frontId:a.frontId,
                selectedChildId:frontId, // 点击子规格的id（后补参数）
                active: a.childIds.indexOf(frontId) !== - 1,
                // childIds:[] // 准备的空数组
              }
              if(x.active) z += 1
              obj.child.push(x)
           })
           if(z == obj.child.length && obj.child.length>0) obj.fa.active = true
            relation.push(obj)
        }

      })
      emit('showRelationDialog',relation)
    }


    function copyCoustom(row,index){
        let x = deepCopy(row)
        x.speValues.forEach(item=>{
          item.frontId = createId()
          item.id = null
        })
        x.frontId = createId()
        x.id = null // 复制清空id
        data.tableData.splice(index,0,x)
          // xtable.value.insert(x)
          // console.log(data.tableData)
          xtable.value.reloadData(data.tableData);
    }




    watch(() =>props.modelValue ,(a)=>{
      if(a){
          data.tableData = a;
          console.log(a,'coustom')
      }
    })

    onMounted(() => {
      data.tableData = props.modelValue || [];
      rowDrop(xtable, ".drag-btn", true);
    });

    return {
      ...toRefs(data),
      xtable,
      rules,
      filterStatus,
      filterShowType,
      addCoustom,
      showDradwer,
      del,
      routeOption,
      showCloumns,
      relation,
      showRelation,
      copyCoustom,
      showCoutomDisabled,
      isDisabled
    };
  },
};
</script>

<style lang="scss" scoped>
.type {
  display: flex;
  align-items: center;
  justify-content: center;
  i {
    font-size: 20px;
  }
}
.coustomBtn {
  display: flex;
  align-items: center;
  margin-top: 20px;
  .btn {
    padding: 7px 15px;
    border: 1px solid #1890ff;
    color: #1890ff;
    margin-right: 10px;
    cursor: pointer;
    i {
      margin: 0 5px;
    }
  }
}
.drag-btn {
  i {
    font-size: 20px;
  }
}
</style>
