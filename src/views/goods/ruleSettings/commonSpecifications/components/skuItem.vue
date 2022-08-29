<template>
<div class="dialogBox">
  <el-dialog :title="id ? '编辑规格' : '添加规格'" v-model="show" @close="close" :close-on-click-modal="false">
    <el-form :model="formData" ref="formRef" label-width="80px" :inline="false" >
      <el-form-item label="规格名称" :rules="{ required: true }"  style="margin-bottom:0">
        <el-radio-group v-model="labelPosition" >
          <el-radio-button label="en">英文</el-radio-button>
          <el-radio-button label="cn">中文</el-radio-button>
        </el-radio-group>
        <el-form-item  v-if="labelPosition == 'cn'" prop="nameCn" :rules="rules.speName">
          <el-input maxlength="32" v-model="formData.nameCn"  class="skuInput"></el-input>
        </el-form-item>

        <el-form-item  v-if="labelPosition == 'en'" prop="nameEn" :rules="rules.speName">
          <el-input maxlength="32" v-model="formData.nameEn"  class="skuInput"></el-input>
        </el-form-item>
      </el-form-item>
      <el-form-item label="品类：" prop="categoryIdList" :rules="{ required: true, message: '请选择品类' }">
        <elSelectTree :data="treeData" defaultExpandAll :treeProps="treeProps"  :width="435" :multiple="true" :checkStrictly="true" @ok="checkTree" :defaultCheckedKeys="
              formData.categoryIdList ? formData.categoryIdList : []
            " />
      </el-form-item>
      <el-form-item label="规格属性"  :rules="{ required: true }">
        <el-row class="thead">
          <div class="parameter">
            参数可选值
            <div>
              <span>英文</span>
              <span>中文</span>
            </div>
          </div>
          <div class="head-sku">SKU编码</div>
          <div class="imgDesc">
            图片参数
          </div>
        </el-row>
        <div class="skuBox" v-if="formData.valueList.length" >
          <div class="skuLeft">
            <draggable class="list-group" tag="transition-group" :component-data="{
                  tag: 'div',
                  type: 'transition-group',
                  name: !drag ? 'flip-list' : null
                }" v-model="formData.valueList" v-bind="dragOptions" @start="drag = true" @end="endLeft" item-key="delFlag">
              <template #item="{ element, index }">
                <el-row class="list-group-item">
                  <el-col :span="8" class="flex-center">
                    <i class="el-icon-sort"></i>
                    <el-form-item label=""  :rules="rules.value" :prop="'valueList.'+index + '.valEn'">
                      <el-input v-model="element.valEn" maxlength="60" placeholder="参数1"  class="w170" clearable></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8" class="flex-center">
                    <el-form-item label=""  :rules="rules.value" :prop="'valueList.'+index + '.valCn'">
                      <el-input v-model="element.valCn" maxlength="32" placeholder="参数2"  class="w170" clearable></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8" class="flex-center right-b">
                    <el-form-item label=""  :rules="rules.skuCode" :prop="'valueList.'+index + '.skuCode'">
                      <el-input placeholder="SKU编码" maxlength="5" v-model="element.skuCode"  class="w206" :disabled="element.skuCodeStatus ==1" clearable></el-input>
                    </el-form-item>
                  </el-col>
                  <div class="deleteRow">
                    <i class="el-icon-close" @click="deleteRow(element, index)"></i>
                  </div>
                </el-row>

              </template>
            </draggable>
          </div>
          <div class="skuRight" ref="skuRight">
            <draggable class="list-group" tag="transition-group" :component-data="{tag: 'div',type: 'transition-group', name: !drag ? 'flip-list' : null}" v-model="formData.imgList" v-bind="dragOptions" @start="drag = true" @end="drag = false" item-key="mainImg">
              <template #item="{ element ,index}">
                <div class="list-group-item">
                  <div class="imgBox maskBox" v-if="element.mainImg">
                    <div class="context">
                      <img :src="element.mainImg" class="w50" />
                      <div class="mask ">
                        <i class="el-icon-delete-solid"  @click="deleteImg(index)"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </draggable>
            <div v-if="formData.valueList?.length > 0 && formData.valueList?.length>formData.imgList?.length">
              <div class="imgBox">
                <div class="context">
                  <UploadImg ref="uploadImg" message="图片过大" :maxSize="10" :data="[]" :isCompress="true" :showFileList="false" :isNoFilieList="true" @getCompressList="val => getCompressList(val)" @getFileList="val => getImgList(val)" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style="flex:1">
          <div v-if="formData.valueList.length==0" style="color:#000000a6;margin-top: 40px;text-align: center">点击【添加规格参数】按钮，设置常用规格参数</div>
        <div @click="addSku" class="addSku">
          <i class="el-icon-plus"></i> 添加规格参数
        </div>
        </div>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button  @click="close">取消</el-button>
      <el-button  type="primary" @click="submit">确定</el-button>
    </template>
  </el-dialog>
</div>
</template>

<script>
import { computed, reactive, toRefs, onMounted, watchEffect, watch, nextTick } from 'vue'
import draggable from 'vuedraggable'
import UploadImg from '@/components/uploadImg/index.vue'
import { speAddOrUpdate, rulecClassify, speDetail } from '@/api/goods/rules.js'
import elSelectTree from '@/components/elSelectTree/index.vue'
import { checkNumOrWords } from '@/utils/ruleOptions.js'
import { ElMessage } from 'element-plus'
import { deepCopy } from '@/utils/tool.js'
export default {
  props: {
    id: {
      default: null
    }
  },
  emits: ['close', 'search'],
  components: { draggable, UploadImg, elSelectTree },
  setup(props, ctx) {
    const state = reactive({
      show: false,
      labelPosition: 'en',
      formData: {
        id: '',
        nameCn: '',
        nameEn: '',
        valueList: [],
        delList: [],
        imgList: [],
        categoryIdList: []
      },
      formRef: '',
      drag: false,
      treeData: [],
      treeProps: {
        value: 'id', // ID字段名
        label: 'name', // 显示名称
        children: 'childs', // 子级字段名
        disabled: null
      },
      OldCalssify: [],
      skuRight: '',
    })

    const rules = {
      // 表单校验规则
      value: [{ validator: rulesEnOrCn, trigger: ['blur', 'change'] }],
      speName: [{ validator: ruleSpeName, trigger: 'blur' }],
      skuCode: [
        { validator: checkNumOrWords, trigger: ['blur', 'change'] },
        { validator: skuRules, trigger: ['blur', 'change'] }
      ]
    }

    function rulesEnOrCn(rule, value, callback) {
      const url = rule.field.split('.') // 获取数据所在地址
      const eventObj = state.formData[url[0]][url[1]] // 获取数据
      return (eventObj.valEn.trim() || eventObj.valCn.trim()) ? callback() : callback('中文和英文参数至少填一项')
    }

    function skuRules(rule, value, callback) {
      const url = rule.field.split('.') // 获取数据所在地址
      const eventObj = state.formData[url[0]][url[1]] // 获取数据
      return eventObj.skuCode.trim() ? callback() : callback('请输入SKU')
    }

    watch(() => state.formData, val => {
      let num1 = state.formData.valueList.length
      let num2 = state.formData.imgList.length
      nextTick(() => {
        let box = document.querySelector('.skuRight')
        if(num1-num2<=1||!num1){
          box.style = 'border-bottom:unset;'
        }else{
          box.style = 'border-bottom:1px solid #e8e8e8;'
        }
      })

    }, { deep: true, immediate: true })
    

    onMounted(() => {
      state.show = true
      rulecClassify().then(res => {
        state.treeData = res.data
      })
      if (props.id) {
        speDetail({ id: props.id }).then(res => {
          state.formData.id = res.data.id // 获取id
          state.formData.nameCn = res.data.nameCn // 获取中文名称
          state.formData.nameEn = res.data.nameEn // 获取英文名称
          state.formData.valueList = res.data.valueList
          res.data.valueList ?.forEach(item => {
            if (!item.mainImg) return false
            state.formData.imgList.push({
              thumbnailUrl: item.thumbnailUrl, // 压缩图地址
              resolution: item.resolution, // 分辨率
              mainImg: item.mainImg // 图片地址
            })
          })

          res.data.categoryList.forEach(item => {
            state.formData.categoryIdList.push(item.categoryId)
            state.OldCalssify.push(item.categoryId)
          })
        })
      }
    })

    function ruleSpeName(rule, vlaue, callback) {
      if (state.formData.nameCn || state.formData.nameEn) return callback()
      else return callback('中文和英文规格名称至少填一项')
    }

    function close() {
      state.show = false
      setTimeout(() => ctx.emit('close'), 500)
    }

    function dragOptions() {
      return {
        animation: 200,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost'
      }
    }

    function addSku() {
      let obj = {
        valCn: '',
        valEn: '',
        skuCode: '',
        delFlag: 0,
        mainImg: '',
        thumbnailUrl: '',
        resolution: ''
      }
      state.formData.valueList.push(obj)
    }

    function endLeft(e) {
      state.drag = false
      if (!state.formData.imgList[e.oldIndex] || !state.formData.imgList[e.newIndex]) return false
      let oldObj = state.formData.imgList[e.oldIndex]
      let newObj = state.formData.imgList[e.newIndex]
      state.formData.imgList[e.oldIndex] = newObj
      state.formData.imgList[e.newIndex] = oldObj
    }

    function getImgList(val) { // 新增图片
    
      let url = val[0].fileUrl
      console.log(url);
      let obj = state.formData.imgList.find(item => {
        url = url.replace('-o', '')
        url = url.replace('https', 'http')
        return url == item.thumbnailUrl
      }) // 查询是否已被创建
      if (obj) { //已创建
        obj.mainImg = val[0].fileUrl
        obj.resolution = val[0].imgSize.width + 'x' + val[0].imgSize.height
      } else { //未创建
        if (state.formData.imgList.length == state.formData.valueList.length) return false
        state.formData.imgList.push({
          mainImg: val[0].fileUrl,
          thumbnailUrl: '',
          resolution: val[0].imgSize.width + 'x' + val[0].imgSize.height
        })
      }

    }

    function getCompressList(val) { // 获取图片压缩地址

      let url = val[val.length - 1]
      console.log(url);
      let type = ['jpg', 'jpeg', 'png', 'gif']
      let newUrl = null

      type.forEach(item => {
        if (url.indexOf(item) != -1) {
          newUrl = url.replace('.' + item, '-o.' + item)
          newUrl = newUrl.replace('http', 'https')
        }
      })

      for (let i = 0; i < state.formData.imgList.length; i++) {
        if (state.formData.imgList[i].mainImg == newUrl) { // 找到匹配
          return state.formData.imgList[i].thumbnailUrl = url
        }
      }
      if (state.formData.imgList.length == state.formData.valueList.length) return false
      state.formData.imgList.push({ // 未找到创建
        mainImg: '',
        thumbnailUrl: url,
        resolution: ''
      })
    }

    function checkTree(e) {
      state.formData.categoryIdList = e ? e : []
    }

    function submit() {
      state.formRef.validate().then(() => {
        if (state.formData.valueList.length == 0)
          return ElMessage.error('请添加规格属性')
        // 填充内容
        if (state.formData.nameCn.trim() == '') state.formData.nameCn = state.formData.nameEn
        if (state.formData.nameEn.trim() == '') state.formData.nameEn = state.formData.nameCn

        state.formData.valueList.forEach(item => {
          if (item.valCn.trim() == '') item.valCn = item.valEn
          if (item.valEn.trim() == '') item.valEn = item.valCn
        })

        for (let index = 0; index < state.formData.valueList.length; index++) {
          for (let i = index + 1; i < state.formData.valueList.length; i++) {
            // 判断是否出现相同的参数值和sku
            let a = state.formData.valueList[index].valCn == state.formData.valueList[i].valCn
            let b = state.formData.valueList[index].valEn == state.formData.valueList[i].valEn
            let c = state.formData.valueList[index].skuCode == state.formData.valueList[i].skuCode
            if (a || b) return ElMessage.error('参数可选值重复')
            if (c) return ElMessage.error('SKU编码重复')
          }
        }

        let data = {}
        data.id = state.formData.id
        data.nameCn = state.formData.nameCn
        data.nameEn = state.formData.nameEn
        data.categoryIdList = state.formData.categoryIdList

        state.formData.valueList.map(item => { // 清空所有delFlag = 0 的图片属性
          item.mainImg = ''
          item.thumbnailUrl = ''
          item.resolution = ''
        })

        // 将图片属性插入相对应行
        state.formData.imgList.forEach((item, index) => {
          state.formData.valueList[index].mainImg = item.mainImg
          state.formData.valueList[index].thumbnailUrl = item.thumbnailUrl
          state.formData.valueList[index].resolution = item.resolution
        })

        // 将列表数据和被删除的数据合在一起（本地不做删除操作，一并发送给后台）
        data.valueList = state.formData.valueList.concat(state.formData.delList)

        speAddOrUpdate(data)
          .then(res => {
            ElMessage.success('编辑成功')
            ctx.emit('search')
            close()
          })
          .catch(res => {
            // 品类被使用且被删除，则回复
            if (res.code == 260117) state.formData.categoryIdList = [...state.OldCalssify]
          
          })
      })
    }

    function deleteRow(e, i) {
      if (e.skuCodeStatus == 1) {
        return ElMessage.error('不能删除已使用的规格参数')
      }

      if (e.id) { // 已存在的id 不能直接删除
        e.delFlag = 1
        state.formData.imgList.splice(i, 1)
        state.formData.delList.push(state.formData.valueList.splice(i, 1)[0])
      } else {
        state.formData.valueList.splice(i, 1)
        state.formData.imgList.splice(i, 1)
      }
    }

    function deleteImg(index) { // 删除图片
      state.formData.imgList.splice(index, 1)
    }

    return {
      ...toRefs(state),
      close,
      dragOptions,
      endLeft,
      addSku,
      getImgList,
      checkTree,
      rules,
      submit,
      deleteRow,
      deleteImg,

      getCompressList
    }
  }
}
</script>

<style lang="scss" scoped>
:deep(.el-dialog__body) {
  max-height: 650px;
  overflow-y: auto;
  padding-right: 2px;

}

.skuInput {
  position: relative;
  width: 460px;
  margin-bottom: 18px;
}

.deleteRow {
  width: 22px;
  position: absolute;
  right: -115px;
  text-align: center;
  height: 66px;
  line-height: 66px;
  border-left: 1px solid #e8e8e8;
}

::v-deep(.el-upload--picture-card) {
  width: 50px;
  height: 50px;
}

::v-deep(.el-radio-button) {
  --el-radio-button-checked-background-color: #fff;
  --el-radio-button-checked-font-color: #409eff;
}

.w477 {
  width: 477px;
}

.w250 {
  width: 250px;
}

.w149 {
  width: 149px;
}

.w238 {
  width: 238px;
}

.w170 {
  width: 170px;
}

.w206 {
  width: 206px;
}

.w50 {
  width: 50px;
  height: 50px;
}

.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 66px;
  border-left: 1px solid #e8e8e8;
  border-bottom: 1px solid #e8e8e8;
}

.right-b {
  border-right: 1px solid #e8e8e8;
}

.thead {
  width: 835px;
  display: flex;
  background-color: #fafafa;
  border: 1px solid #e8e8e8;
  height: 48px;
  color: #000;
  text-align: center;

  .parameter {
    position: relative;
    height: 48px;
    width: 480px;

    div {
      position: absolute;
      width: 100%;
      display: flex;
      justify-content: space-around;
      left: 0;
      font-size: 12px;
      color: rgba($color: #000000, $alpha: 0.85);
      bottom: 0px;
    }
  }

  .imgDesc {
    width: 110px;
    // width: 100%;
    // display: flex;
    // flex-direction: column;
    // justify-content: center;
    // align-items: center;
  }
}

.skuBox {

  display: flex;
  position: relative;

}

.skuLeft .list-group-item {
  width: 720px;
}

.dialogBox {
  width: 1000px;
}

.skuRight {
  width: 115px;
  ;
  border-right: 1px solid #e8e8e8;
  border-bottom: 1px solid #e8e8e8;

  .context {
    width: 115px;
    height: 66px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  img {
    width: 50px;
    height: 50px;
  }
}

.addSku {
  color: #409eff;
  border: 1px solid #409eff;
  width: 130px;
  height: 32px;
  line-height: 32px;
  text-align: center;
  margin-top: 16px;
}

.el-icon-sort {
  font-size: 20px;
  margin-right: 10px;
}

.list-group-item .el-form-item {
  margin-bottom: 0 !important;
}

.imgBox {

  height: 66px;
  border-bottom: 1px solid #e8e8e8;

  .context {
    position: relative;
    width: 92px;
    height: 66px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  :deep(.el-upload--picture-card) {
    width: 50px !important;
    height: 50px !important;
  }
}

.mask {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.el-icon-delete-solid{
    display: none;
    font-size: 16px;
  }
.list-group-item .maskBox:hover {
  .el-icon-delete-solid{
    display: block;
  }
  
}

.head-sku {
  width: 240px;
}
</style>
