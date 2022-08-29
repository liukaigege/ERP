<!--
 * @Descripttion: 菜单树状结构上面挂载vue
 * @version: 1.0
 * @Author: 王新国
 * @Date: 2021-07-27 00:00:00
 * @LastEditors: 王新国
 * @LastEditTime: 2021-07-27 00:00:00
-->
<template>
  <div class="fruitsContainer">
    <el-checkbox
      v-model="fruitsData.checkAllChildren"
      @change="treeListBtnsCheckAll"
      >全选</el-checkbox
    >
    <div style="margin: 15px 0"></div>
    <el-checkbox-group
      v-model="fruitsData.choosedChildren"
      @change="treeListBtnsCheck"
    >
      <el-checkbox
        v-for="item in fruitsData.list"
        :label="item.menuId"
        :key="item.menuId"
        >{{ item.menuName }}</el-checkbox
      >
    </el-checkbox-group>
  </div>
</template>
<script>
import { reactive, toRefs, ref, toRaw, getCurrentInstance } from 'vue'
export default {
  props: {
    data: {
      type: Object,
      default: {}
    },
    btnsIdList: {
      //所有按钮选择情况
      type: Array,
      default: []
    }
  },
  setup(props, context) {
    const state = reactive({
      fruitsData: '',
    //   btnsIdCheckedList: []
    })
    state.fruitsData = props.data
    // state.btnsIdCheckedList = props.btnsIdList
    state.fruitsData.choosedChildren = []
    props.btnsIdList.forEach(v => {
        state.fruitsData.list.forEach(item => {
            if(v == item.menuId){
                state.fruitsData.choosedChildren.push(v-0)
            }
        })
        if (state.fruitsData.choosedChildren.length == state.fruitsData.list.length) {
            state.fruitsData.checkAllChildren = true
        } else {
            state.fruitsData.checkAllChildren = false
        }
    })
    //全选事件
    const treeListBtnsCheckAll = val => {
      state.fruitsData.choosedChildren = []
      let choosedList = []
      if (val) {
        state.fruitsData.list.forEach(v => {
          state.fruitsData.choosedChildren.push(v.menuId)
          choosedList.push(v.menuId)
        })
      }
      context.emit('btnsIdCheckedList', choosedList,state.fruitsData)
    }
    //单独选择
    const treeListBtnsCheck = val => {
      if (val.length == state.fruitsData.list.length) {
        state.fruitsData.checkAllChildren = true
      } else {
        state.fruitsData.checkAllChildren = false
      }
      context.emit('btnsIdCheckedList', val,state.fruitsData)
    }
    return {
      ...toRefs(state),
      treeListBtnsCheckAll, //全选事件
      treeListBtnsCheck //单独选择
    }
  }
}
</script>
<style lang="scss" scoped>
</style>