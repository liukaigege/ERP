<!--
 * @Descripttion: 导出订单
 * @version: 1.0
 * @Author: 王新国
 * @Date: 2021-07-15 00:00:00
 * @LastEditors: 王新国
 * @LastEditTime: 2021-07-15 00:00:00
-->
<template>
  <div class="exportOrderView" v-if="exportOrderShow">
    <el-dialog
      title="导出订单"
      v-model="exportOrderShow"
      width="800px"
      :close-on-click-modal="closeModal"
      :before-close="closeExportOrderView"
    >
      <div class="progressContainer">
        <el-progress
          :percentage="progressData.number"
          :status="progressData.number == 100 ? 'success' : ''"
          v-if="timerData.timerStatus"
        ></el-progress>
      </div>
      <div class="exportOrderViewHeader">
        <span
          class="exportOrderViewTypeList"
          :class="headerType == 1 ? 'active' : ''"
          @click="changeExportRtypeFn(1)"
          >当前数据导出</span
        >
        <span
          class="exportOrderViewTypeList"
          :class="headerType == 2 ? 'active' : ''"
          @click="changeExportRtypeFn(2)"
          >按天导出</span
        >
        <span
          class="exportOrderViewTypeList"
          :class="headerType == 3 ? 'active' : ''"
          @click="changeExportRtypeFn(3)"
          >自定义导出</span
        >
      </div>
      <div class="exportOrderViewBody">
        <div class="exportOrderViewCtrls">
          <div
            class="exportOrderTypeContainer marginBottom"
            v-if="headerType == 1"
          >
            <el-radio v-model="exportOrderType" label="1"
              >当前查询数据</el-radio
            >
            <el-radio v-model="exportOrderType" label="2"
              >当前勾选数据</el-radio
            >
          </div>
          <div
            class="exportOrderTypeContainer marginBottom"
            v-if="headerType == 3"
          >
            <el-radio v-model="exportOrderTypes" label="1"
              >按订单号导出</el-radio
            >
            <el-radio v-model="exportOrderTypes" label="2"
              >按运单号导出</el-radio
            >
          </div>
          <div
            class="customContainer exportOrderTypeContainer marginBottom"
            v-if="headerType == 3"
          >
            <el-input v-model="customValue" placeholder="请输入内容"></el-input>
          </div>
          <div class="exportFormat marginBottom" v-if="headerType == 2">
            <span class="exportTitle">选择日期：</span>
            <el-date-picker
              v-model="dateVulue"
              type="date"
              value-format="YYYY-MM-DD"
              placeholder="选择日期"
            >
            </el-date-picker>
          </div>
          <div class="exportFormat marginBottom">
            <span class="exportTitle">导出格式：</span>
            <el-radio v-model="exportFormatType" label="1">按订单</el-radio>
            <el-radio v-model="exportFormatType" label="2">按包裹</el-radio>
            <el-radio v-model="exportFormatType" label="4">按商品</el-radio>
          </div>
          <div class="exportFormat marginBottom">
            <span class="exportTitle">选择模板：</span>
            <el-select
              v-model="exportModal.exportModalType"
              placeholder="请选择"
              clearable
              filterable
            >
              <el-option
                v-for="item in exportModal.exportModalTypeArr"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
            <el-button type="primary" class="exportBtn" @click="ecportModal"
              >导出</el-button
            >
          </div>
        </div>
        <div class="tableContainer">
          <draggable
            class="list-group tableDataContainer"
            tag="transition-group"
            :component-data="{
              tag: 'ul',
              type: 'transition-group',
              name: 'tr'
            }"
            v-model="tableData"
            v-bind="dragOptions"
            @start="drag = true"
            @end="drag = false"
            :item-key="itemKey"
            group="leftList"
          >
            <template #item="{ element }">
              <li class="tableDataList clearfix" :key="element.nameCn">
                <div class="tableDataListLeft">
                  <p>{{ element.nameCn }}</p>
                  <el-checkbox
                    v-model="element.checkAll"
                    @change="
                      handleCheckAllChange(element.nameEn, element.checkAll)
                    "
                  >
                    全选
                  </el-checkbox>
                </div>
                <div class="fr tableDataListRight">
                  <draggable
                    class="list-group"
                    tag="transition-group"
                    :component-data="{
                      tag: 'div',
                      type: 'transition-group',
                      name: element.nameEn
                    }"
                    v-model="element.list"
                    v-bind="dragOptions"
                    @start="drag = true"
                    @end="drag = false"
                    :item-key="itemKey"
                    :group="
                      element.nameEn == 'remarkInfo'
                        ? 'remarkInfo'
                        : 'unremarkInfo'
                    "
                  >
                    <template #item="{ element: item }">
                      <el-checkbox
                        :key="item.nameCn"
                        v-model="item.checked"
                        :class="item.nameEn == 'mainImg' ? 'redColor' : ''"
                        @change="
                          handleCheckedRightChange(
                            element.nameEn,
                            item.nameEn,
                            item.checked
                          )
                        "
                      >
                        <p
                          :title="item.nameCn ? item.nameCn : item.nameEn"
                          class="listStr"
                        >
                          {{ item.nameCn ? item.nameCn : item.nameEn }}
                        </p>
                      </el-checkbox>
                    </template>
                  </draggable>
                </div>
              </li>
            </template>
          </draggable>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  reactive,
  toRefs,
  ref,
  toRaw,
  getCurrentInstance,
  computed,
  watch
} from 'vue'
import {
  exportItemsList,
  checkExportTemplate,
  exportOrderFn,
  checkProgress
} from '@/api/order/exportOrder.js'
import { deepCopy } from '@/utils/tool.js'
import { ElMessage } from 'element-plus'
import draggable from 'vuedraggable'
export default {
  props: {
    showExportOrder: {
      type: Boolean,
      default: false
    },
    jsonStr: {
      //父组件搜索条件的json字符串
      type: String,
      default: ''
    },
    packageIdList: {
      //父组件勾选的包裹id字符串,多个逗号隔开
      type: String,
      default: ''
    }
  },
  components: { draggable },
  setup(props, context) {
    const jsonStr = JSON.parse(props.jsonStr)
    if (jsonStr)
      if (jsonStr.orderStatus instanceof Array) {
        jsonStr.orderStatus = jsonStr.orderStatus?.join(',')
      } else if (jsonStr.orderStatus || jsonStr.orderStatus === 0) {
        jsonStr.orderStatus = String(jsonStr.orderStatus)
      }
    const { proxy } = getCurrentInstance()
    var date = new Date()
    var year = date.getFullYear()
    var month =
      date.getMonth() + 1 > 9
        ? date.getMonth() + 1
        : '0' + (date.getMonth() + 1)
    var day = date.getDate() > 9 ? date.getDate() : '0' + date.getDate()
    var dateVulue = year + '-' + month + '-' + day
    const state = reactive({
      closeModal: false,
      drag: false, //是否是推拽
      headerType: 1, //1=>当前数据导出 2=>按天导出 3=>自定义导出
      dateVulue, //按天导出的日期
      customValue: '', //自定义导出输入框内容
      exportOrderShow: false, // 显示弹框组件
      exportOrderType: '1', //导出类型（当前数据导出）
      exportOrderTypes: '1', //导出类型（自定义导出）
      exportFormatType: '1', //导出格式
      exportModal: {
        //选择模板
        exportModalType: '', //选择模板
        exportModalTypeArr: [] //导出模板数组列表
      },
      tableData: [], //表格数据
      uuid: '',
      timerData: {
        timerStatus: false
      },
      timer: null,
      progressData: {
        //进度条数据
        number: 0
      }
    })

    state.exportOrderShow = props.showExportOrder
    //获取导出订单选项列表
    const exportItemsListFn = () => {
      exportItemsList({ type: 1,remarkType:0 }).then(res => {
        if (res.code == 200) {
          state.tableData = deepCopy(res.data.order)
          state.tableData?.forEach(item =>
            item.list?.forEach(v => (v.checked = false))
          )
        } else {
          ElMessage.warning({ message: res.message })
        }
      })
    }
    exportItemsListFn()

    //查询导出模板列表(不带分页)
    const checkExportTemplateFn = () => {
      checkExportTemplate({ type: 1 }).then(res => {
        if (res.code == 200) {
          state.exportModal.exportModalTypeArr = [...res.data]
        } else {
          ElMessage.warning({ message: res.message })
        }
      })
    }
    checkExportTemplateFn()

    // 控制顶部导出方式
    const changeExportRtypeFn = type => {
      state.headerType = type
    }

    // 控制弹框的显示隐藏---关闭弹框
    const closeExportOrderView = () => {
      state.exportOrderShow = false
      context.emit('closeExportOrderView', state.exportOrderShow)
    }
    // 选择了全选
    const handleCheckAllChange = (id, val) => {
      state.tableData
        .filter(item => item.nameEn == id)[0]
        ?.list?.forEach(v => (v.checked = val))
    }

    // 右边多选框选择
    const handleCheckedRightChange = (parentNameEn, nameEn, val) => {
      let childrenList = state.tableData.filter(
        item => item.nameEn == parentNameEn
      )[0].list
      if (
        childrenList.length ==
        childrenList.filter(v => v.checked == true).length
      ) {
        state.tableData.filter(
          item => item.nameEn == parentNameEn
        )[0].checkAll = true
      } else {
        state.tableData.filter(
          item => item.nameEn == parentNameEn
        )[0].checkAll = false
      }
    }

    // ***********************
    const itemKey = e => {
      return e
    }

    const dragOptions = computed(() => {
      return {
        animation: 200,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost'
      }
    })

    // vue3 监听方法 监听弹框模板内容变化
    watch(state.exportModal, (count, prevCount) => {
			console.log(state.exportModal)
      if (
        state.exportModal.exportModalTypeArr.filter(
          v => v.id == state.exportModal.exportModalType
        ).length
      ) {
        let list = state.exportModal.exportModalTypeArr
          .filter(v => v.id == state.exportModal.exportModalType)[0]
          .field.split('|')
        let obj = {}
        let sortList = []
        list.forEach(v => {
          sortList.push((obj[v.split(':')[0]] = v.split(':')[0]))
          obj[v.split(':')[0]] = v.split(':')[1].split(',')
        })
        state.tableData?.forEach(v => (v.checkAll = false))
        for (var i = sortList.length - 1; i >= 0; i--) {
          state.tableData = [
            ...state.tableData.filter(v => v.nameEn == sortList[i]),
            ...state.tableData.filter(v => v.nameEn != sortList[i])
          ]
        }
        state.tableData?.forEach((item, index) => {
          item.list?.forEach(v => (v.checked = false))
          let tempList = []
          if (obj[item.nameEn])
            obj[item.nameEn]?.forEach(v => {
              item.list?.forEach(key => {
                if (key.nameEn == v) {
                  key.checked = true
                  tempList.push(key)
                }
              })
            })
          item.list = [
            ...tempList,
            ...item.list.filter(val => val.checked == false)
          ]
          if (tempList.length == item.list.length) item.checkAll = true
        })
      }else{
				state.tableData?.forEach(item => {
					item.checkAll = false
          item.list?.forEach(v => (v.checked = false))
        })
			}
    })

    // ***********************

    //导出数据模板
    const ecportModal = () => {
      state.uuid = new Date().getTime() + ''
      let fieldArray = []
      let remarkArray = []
      state.tableData?.forEach(v => {
        if (v.nameEn == 'remarkInfo') {
          // 备注信息
          v.list?.forEach(item => {
            if (item.checked) {
              remarkArray.push(item.nameEn)
            }
          })
        } else {
          // 非备注信息
          v.list?.forEach(item => {
            if (item.checked) {
              fieldArray.push(item.nameEn)
            }
          })
        }
      })
      let obj = {
        type: state.headerType - 0, //1当前数据导出 2按天导出 3自定义导出
        subType:
          state.headerType == 1
            ? state.exportOrderType - 0
            : state.exportOrderTypes - 0, //当type为1时,1当前查询数据2当前勾选数据 当type为2时,该参数无意义 当type为3时,1订单号2运单号
        value:
          state.headerType == 2
            ? state.dateVulue
            : state.headerType == 3
            ? state.customValue
            : state.exportOrderType == 1
            ? JSON.stringify(jsonStr)
            : props.packageIdList, //对应导出条件的值 当前查询数据,值为查询条件的json字符串 当前勾选的数据,值为包裹id,多个逗号隔开 同理按订单号或运单号查询
        fieldArray, //字符数组(订单字段的array)
        format: state.exportFormatType - 0, //	导出格式 1.按订单 2按包裹 4按商品
        remarkArray, //字符数组(备注字段的array)
        uuid: state.uuid, //导出标识
        orderPackageDTO: jsonStr
      }
      if (state.headerType == 2 && !obj.value)
        return ElMessage.warning({ message: '请选择导出订单的日期' })
      if (fieldArray.length == 0 && remarkArray.length == 0)
        return ElMessage.warning({ message: '请选择导出内容' })
      if (obj.type == 1 && obj.subType == 2 && obj.value == '')
        return ElMessage.warning({ message: '请选择导出订单' })
      if (state.headerType == 2 && obj.value)
        obj.value = obj.value + ' 00:00:00'
      if (state.headerType == 3 && obj.subType == 1 && !obj.value)
        return ElMessage.warning({ message: '请填写导出的内容' })
      if (state.headerType == 3 && obj.subType == 2 && !obj.value)
        return ElMessage.warning({ message: '请填写导出的内容' })
      exportOrderFn(obj)
        .then(res => {
          clearInterval(state.timer)
          state.timerData.timerStatus = false
          state.progressData.number = 0
          if (res.code == 200) {
            state.timerData.timerStatus = true
          } else {
            ElMessage.warning({ message: res.message })
          }
        })
        .catch(res => {
          clearInterval(state.timer)
          state.timerData.timerStatus = false
          state.progressData.number = 0
        })
    }

    //查询进度条信息
    function checkProgressFn(uuid) {
      checkProgress({ uuid }).then(res => {
        if (res.code == 200) {
          state.progressData.number = res.data.percent
          if (state.progressData.number == 100) {
            clearInterval(state.timer)
            state.timerData.timerStatus = false
            state.progressData.number = 0
            window.open(res.data.url, '_blank')
          }
        } else {
          ElMessage.warning({ message: res.message })
        }
      })
    }

    watch(state.timerData, (count, prevCount) => {
      if (state.timerData.timerStatus) {
        clearInterval(state.timer)
        state.timer = setInterval(function () {
          if (state.uuid) {
            checkProgressFn(state.uuid)
          } else {
            clearInterval(state.timer)
            state.timerData.timerStatus = false
            state.progressData.number = 0
          }
        }, 500)
      } else {
        clearInterval(state.timer)
      }
    })
    return {
      ...toRefs(state),
      closeExportOrderView, //关闭弹框
      handleCheckAllChange, //选择了全选
      handleCheckedRightChange, // 右边多选框选择
      changeExportRtypeFn, //控制顶部导出方式
      exportItemsListFn, //获取导出订单选项列表
      ecportModal, //导出数据模板
      // ********************
      itemKey, //
      dragOptions //
    }
  }
}
</script>
<style lang="scss" scoped>
.exportOrderView {
  :deep(.el-select.el-select--small) {
    width: 220px;
  }
  :deep(.el-dialog__body) {
    padding: 0;
    .exportOrderViewHeader {
      border-bottom: 1px solid #e8e8e8;
      box-sizing: border-box;
      .exportOrderViewTypeList {
        font-size: 16px;
        color: #555658;
        margin: 0 20px;
        line-height: 50px;
        border-bottom: 2px solid transparent;
        display: inline-block;
        box-sizing: border-box;
        cursor: pointer;
      }
      .exportOrderViewTypeList.active {
        border-bottom: 2px solid #1890ff;
        color: #1890ff;
      }
    }
    .exportOrderViewBody {
      padding: 5px 20px 30px;
      .exportOrderViewCtrls {
        border-bottom: 1px dashed #e9e9e9;
        padding-bottom: 10px;
        .exportFormat {
          .exportBtn {
            margin: 0 15px;
          }
        }
      }
    }
    .tableContainer {
      margin-top: 10px;
      .tableDataContainer {
        border: 1px solid #e8e8e8;
        background-color: #f5f7fa;
        box-sizing: border-box;
        border-bottom: none;
        max-height: 350px;
        overflow: auto;
        .tableDataList {
          line-height: 32px;
          border-bottom: 1px solid #e8e8e8;
          position: relative;
          .tableDataListLeft {
            box-sizing: border-box;
            text-align: center;
            padding: 10px 0;
            width: 10%;
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            p {
              font-weight: bold;
            }
          }
          .tableDataListRight {
            width: 90%;
            min-height: 84px;
            box-sizing: border-box;
            padding: 0 10px;
            border-left: 1px solid #e8e8e8;
            background-color: #fff;
            position: relative;
          }
        }
      }
    }
  }
  .marginBottom {
    height: 36px;
    line-height: 36px;
  }
  .progressContainer {
    position: absolute;
    width: 70%;
    left: 15%;
    top: 26px;
  }
  .tableDataListRight {
    :deep(.el-checkbox) {
      width: 100px;
    }
  }
  .redColor {
    color: red;
  }
}
.listStr {
	width: 106px;
  white-space: nowrap;
  overflow: hidden;
  -o-text-overflow: ellipsis;
  text-overflow: ellipsis;
}

</style>
