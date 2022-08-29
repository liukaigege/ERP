<!--
 * @Descripttion: 'coustomDrawe 定制品展示主规格'
 * @version: 2.0
 * @Author: 王新国
 * @Date: 2021-09-06 00:00:00
 * @LastEditors: 王新国
 * @LastEditTime: 2021-09-06 00:00:00
-->
<template>
  <div class="container">
    <div class="header clearfix">
      <span style="color: red">* </span>
      <span style="margin-right: 10px">配件：</span>
      <el-switch
        v-model="drawerData.isParts"
        :active-value="1"
        :inactive-value="0"
        :disabled="true"
      />
    </div>
    <ul class="listContainer">
      <li class="list">
        <el-table :data="drawerData.speValues" style="width: 100%" @row-click="sortSonList">
          <el-table-column prop="date" label="参数可选值" align="center">
            <el-table-column prop="nameEn" label="英文" align="center">
              <template #default="scope">
                <el-input
                  v-model="scope.row.nameEn"
                  
                  :readonly="true"
                />
              </template>
            </el-table-column>
            <el-table-column prop="nameCn" label="中文" align="center">
              <template #default="scope">
                <el-input
                  v-model="scope.row.nameCn"
                  
                  :readonly="true"
                />
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column prop="plusPrice" label="加价" align="center">
            <template #default="scope">
              <el-input
                v-model="scope.row.plusPrice"
                
                :readonly="true"
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="url"
            label="图片参数"
            align="center"
            width="100px"
          >
            <template #header>
              <p>图片参数</p>
              <el-switch
                v-model="drawerData.isPhoto"
                :active-value="1"
                :inactive-value="0"
                :disabled="true"
              />
            </template>
            <template #default="scope">
              <div class="imgConatiner">
                <img :src="scope.row.url" alt="" />
              </div>
            </template>
          </el-table-column>
        </el-table>
      </li>
    </ul>
    <div class="sonTable" v-if="sonData">
      <div class="tableContainer">
        <el-table
          v-if="drawerData.normsType != 1"
          :data="sonData"
          border
          style="width: 100%"
          :show-header="false"
        >
          <el-table-column prop="nameEn" width="92" align="center">
            <template #default="scope">
              <div class="re">
                <p style="font-weight: 550">{{ scope.row.nameEn }}</p>
                <el-checkbox
                  :disabled="true"
                  v-model="scope.row.allChoose"
                  :indeterminate="scope.row.list?.filter(val => val.active).length&&scope.row.list?.filter(val => val.active).length<scope.row.list?.length"
                  label="全选"
                ></el-checkbox>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="list">
            <template #default="scope">
              <div class="re" style="line-height: 36px">
                <el-checkbox
                  :disabled="true"
                  v-for="v in scope.row.list"
                  :key="v.frontId"
                  v-model="v.active"
                  :label="v.nameEn"
                  style="
                    width: 105px;
                    height: 36px;
                    white-space: nowrap;
                    overflow: hidden;
                    -o-text-overflow: ellipsis;
                    text-overflow: ellipsis;
                  "
                ></el-checkbox>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="footer">
        <el-button  class="cancelBtn" @click="cancelFn"
          >取消</el-button
        >
      </div>
    </div>
  </div>
</template>
<script>
import { reactive, toRefs } from 'vue'
export default {
  props: {
    drawerData: {
      type: Object,
      default: null
    },
    allData: {
      type: Array,
      default: null
    }
  },
  setup(props, context) {
    const list = props.allData.filter(v => v.normsType == 1)
    const state = reactive({
      sonData:null
    })
    function cancelFn() {
      context.emit('cancel', false)
    }

    function sortSonList(val){
      //选择了行
      const { nameCn, nameEn, childIds } = val
      if(childIds.length){
        // childIds不为空数组
        let sonList = []
        childIds.forEach(v => {
          sonList = [...sonList,...list.filter(item => item.frontId == v)]
        })
        list.forEach(v=>{
          if(childIds.filter(value => v.frontId === value).length){
            v.active = true
          }else{
            v.active = false
          }
        })
        state.sonData = [{
          nameEn:nameEn?nameEn:nameCn,
          list,
          allChoose:childIds.length === list.length
        }]
      }else{
        state.sonData = null
      }
    }

    return {
      ...toRefs(state),
      cancelFn,
      sortSonList
    }
  }
}
</script>
<style lang="scss" scoped>
.listContainer {
  margin: 20px 0 320px;
  position: relative;
}
.imgConatiner {
  width: 70px;
  height: 70px;
  position: relative;
  img {
    max-width: 100%;
    max-height: 100%;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}
.sonTable {
  width: 30%;
  background-color: #fff;
  position: fixed;
  bottom: 0;
  right: 0;
  max-height: 300px;
  z-index: 10;
  box-sizing: border-box;
  padding: 0 20px;
  .tableContainer {
    margin-bottom: 20px;
    max-height: 230px;
    overflow: auto;
    position: relative;
    .masker{
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: 100%;
      z-index: 2;
    }
  }
  .footer {
    text-align: right;
    padding: 9px 20px;
    box-sizing: border-box;
  }
}
</style>