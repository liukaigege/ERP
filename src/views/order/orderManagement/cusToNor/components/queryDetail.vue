<!--
* @Descripttion: Vango ERP queryDetail
* @version: 1.0
* @Author: 王新国
* @Date: 2021-11-01 15:16:38
* @LastEditors: 王新国
* @LastEditTime: 2021-11-01 17:07:46
-->
<template>
  <el-dialog
    title="定制信息"
    v-model="dialogVisible"
    width="800px"
    @closed="handleClose"
    :close-on-click-modal="false"
  >
    <div v-if="data">
      <div class="goodsContainer">
        <div class="goodsContent">
          <div class="goodsImages">
            <el-popover placement="right-start" trigger="hover" width="auto">
              <el-image
                style="width: 200px; height: 200px"
                :src="data?.orderInfo?.skuImg || data.skuImg"
                fit="contain"
              ></el-image>
              <template #reference>
                <el-image
                  class="ml-10"
                  style="width: 100px; height: 100px"
                  :src="data?.orderInfo?.skuImg || data.skuImg"
                  fit="contain"
                ></el-image>
              </template>
            </el-popover>
          </div>
          <div class="goodsInfo">
            <p>{{ data.sku }}</p>
            <p>{{data.currency || 'USD'}} {{ data.price }}</p>
          </div>
          <div class="goodsNum">x{{ data.quantity }}</div>
          <div class="otherInfo">
            <p>定制时间：{{ data.purchaseTime || '-' }}</p>
            <p>到货时间：{{ data.deliveryTime || '-' }}</p>
            <p>周期：{{ data.arrivalInterval || '-' }}小时</p>
            <p>供应商:{{ data.supplierName || '-' }}</p>
          </div>
        </div>
      </div>
      <div class="goodsSkuTitle">
        <span>定制内容</span>
        <el-button
          v-if="dialogType == 2"
          type="text"
          style="margin-top: 16px"
          @click="changeEditType"
          >{{ isEditer ? '保存' : '编辑' }}</el-button
        >
      </div>
      <el-table :data="data.customValue" style="width: 100%" border>
        <el-table-column
          prop="field"
          label="规格名称"
          align="center"
        >
          <template #default="scope">
            <el-input
              v-if="isEditer"
              v-model="scope.row.field"
              placeholder="请输入规格名称"
            />
            <p v-else>{{ scope.row.field }}</p>
          </template>
        </el-table-column>
        <el-table-column label="规格值" align="center">
          <template #default="scope">
            <div v-if="isEditer && scope.row.isAdd == 1" class="canChangeValue">
							<div v-if="scope.row.type == 'upload_img'||scope.row.type == 'img_options'">
								<div class="uploadedImageContainer" v-if="scope.row.value">
									<img class="uploadedImage" :src="scope.row.value" alt="">
									<div class="uploadedImageMasker">
										<i class="el-icon-delete uploadedImageMaskerDel" @click="delImage(scope.row.recognitionId)"></i>
									</div>
								</div>
								<div v-else>
									<uploadImage
										:showFileList="false"
										:multiple="false"
										:limit="1"
										:data="imgData(scope.row.value)"
										@add="changeImage"
										@del="changeImage"
										:recognitionId="scope.row.recognitionId"
									/>
								</div>
							</div>
              <el-input
                v-else
                v-model="scope.row.value"
                style="width: 300px"
                placeholder="请输入规格值"
              />

              <el-icon class="colseValues" :style="scope.row.type == 'text_options'?'margin: 10px 0 0 20px;':'margin: 50px 0 0 20px;'" @click="deleteSku(scope.row.recognitionId)"><Close /></el-icon>
            </div>
            <div v-else>
							 <div v-if="scope.row.type == 'upload_img'||scope.row.type == 'img_options'">
                <el-popover
                  placement="right-start"
                  trigger="hover"
                  width="auto"
                >
                  <el-image
                    style="width: 200px; height: 200px"
                    :src="scope.row.value"
                    fit="contain"
                  ></el-image>
                  <template #reference>
                    <el-image
                      class="ml-10"
                      style="width: 100px; height: 100px"
                      :src="scope.row.value"
                      fit="contain"
                    ></el-image>
                  </template>
                </el-popover>
              </div>
              <p v-else>
                {{ scope.row.value }}
              </p>

            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="addListBtn" v-if="dialogType == 2 && isEditer">
        <el-dropdown @command="callback">
          <el-button :icon="Plus" type="primary">增加定制信息</el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="1">图片信息</el-dropdown-item>
              <el-dropdown-item command="2">文本信息</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import { reactive, toRefs } from 'vue'
import { Plus, Close } from '@element-plus/icons-vue'
import { deepCopy } from '@/utils/tool'
import { getCustomValues, updateCustomValues } from '../composables/api'
import uploadImage from '@/components/uploadImg/index.vue'
import { ElMessage } from 'element-plus'
export default {
  props: {
    orderInfo: Object,
    dialogType: Number // 1定制品转普货 2普货转定制品
  },
  components: { Close, uploadImage },
  emits: ['queryBack','saveBack'],
  setup(props, { emit }) {

    const state = reactive({
      dialogVisible: true,
      isEditer: false,
      data: null
    })
    queryValues()
    function queryValues() {
      getCustomValues({ skuId: props.orderInfo.id }).then(res => {
        if (res.data.customValue)
          res.data.customValue = JSON.parse(res.data.customValue)
        else res.data.customValue = []
        state.data = res.data
      })
    }
    function handleClose() {
      emit('queryBack', false)
    }
    function changeEditType() {
			if(state.isEditer){
				if(state.data.customValue.length === 0) return ElMessage.error({ message: '请添加定制内容' })
				if(state.data.customValue.some(v=>!v.field)) return ElMessage.error({ message: '请添加定制内容属性' })
				if(state.data.customValue.some(v=>!v.value)) return ElMessage.error({ message: '请添加定制内容属性值' })
			}
      state.isEditer = !state.isEditer
			//updateCustomValues
			if(!state.isEditer) {
				updateCustomValues({
					customValue:JSON.stringify(state.data.customValue),
					id:state.data.id
				})
				.then(res=>{
					if(res.code == 200)
						emit('saveBack', state.data)
					else
						ElMessage.warning({ message: res.message })
				})
			}

    }
    function callback(val) {
      state.data.customValue.push({
        field: '',
        type: val == 2 ? 'text' : 'upload_img',
        value: '',
        isAdd: 1,
        recognitionId: new Date().valueOf() + ''
      })
    }

    // images been changed
    function changeImage(data, id) {
      state.data.customValue.forEach(v => {
        if (v.recognitionId && v.recognitionId == id)
          if (data.length) {
            // add image
						v.value = data[0].url
          } else {
            // delete image
						v.value = ''
          }
      })
    }

		// delete the sku function
		function deleteSku(id){
			// const i = state.data.customValue.filter((item, index) => {
			// 	if (item.recognitionId == id) return index
			// })
			// state.data.customValue.splice(i, 1)
			const list = deepCopy(state.data.customValue)
			state.data.customValue = list.filter(v=>v.recognitionId != id)
		}

		const imgData = val => {
			if (val) {
				return [
					{
						name: val,
						url: val
					}
				]
			} else {
				return []
			}
		}

		function delImage(id){
			state.data.customValue.forEach(v=>{
				if(v.recognitionId == id) v.value = ''
			})
		}
    return {
      ...toRefs(state),
      Plus,
			imgData,
      callback,
			delImage,
			deleteSku,
      changeImage,
      handleClose,
      changeEditType
    }
  }
}
</script>
<style lang='scss' scoped>
.uploadedImageContainer{
	width: 100px;
	height: 100px;
	position: relative;
	.uploadedImage{
		position: absolute;
		max-width: 100%;
		max-height: 100%;
		top: 50%;
		left: 50%;
		transform: translate(-50%,-50%);
	}
	.uploadedImageMasker{
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0;
		top: 0;
		display: none;
		background-color: rgba($color: #000000, $alpha: 0.3);
		color: #fff;
		font-size: 20px;
		.uploadedImageMaskerDel{
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%,-50%);
		}
	}
}
.uploadedImageContainer:hover{
	.uploadedImageMasker{
		display: block;
	}
}
.goodsContainer {
  width: 100%;
  border: 1px solid #EBEEF5;
  box-sizing: border-box;
  padding: 10px;
  .goodsContent {
    display: flex;
    justify-content: space-between;
    .goodsImages {
      width: 100px;
      height: 100px;
      :deep(.ml-10) {
        margin: 0 !important;
      }
    }
    .goodsNum {
      width: 60px;
      height: 100px;
      line-height: 100px;
      text-align: center;
    }
    .goodsInfo {
      width: 270px;
    }
    .otherInfo {
      width: 270px;
      p {
        line-height: 25px;
      }
    }
  }
}
.goodsSkuTitle {
  line-height: 60px;
  font-size: 16px;
  margin-top: 15px;
  display: flex;
  justify-content: space-between;
}
.addListBtn {
  margin-top: 20px;
}
.canChangeValue{
	display: flex;
}
</style>
