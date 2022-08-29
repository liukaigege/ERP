<!--
 * @Descripttion: 扫描发货
 * @version: 1.0
 * @Author: 王新国
 * @Date: 2021-07-15 00:00:00
 * @LastEditors: 王新国
 * @LastEditTime: 2021-07-15 00:00:00

-->
<template>
  <div class="scanListPage">
    <div class="pageHeader">
      <div class="headerContainer firstHeaderContainer">
        <span class="warehouseName" v-if="warehouseNameShow">仓库名称</span>
        <el-select
          v-model="warehouseChecked"
          placeholder="请选择"
          v-if="!warehouseNameShow"
          
        >
          <el-option
            v-for="item in warehouseList"
            :key="item.warehouseId"
            :label="item.warehouseName"
            :value="item.warehouseId"
          >
          </el-option>
        </el-select>
        <el-button
          @click="sureChangeWarehouse"
          
          class="headerChangeSureBtn"
          >{{ warehouseNameShow ? '切换' : '保存' }}</el-button
        >
        <!-- <el-button  class="fr" @click="closePage">关闭</el-button> -->
      </div>
      <div class="headerContainer">
        <span class="scanTitle">扫描/输入运单号：</span>
        <el-input
          v-model="shippingId"
          placeholder=""
          class="scanInput"
          
          :maxLength="maxLength"
          ref="shippingIdFocusRef"
          :autofocus="autofocusData.shippingIdFocus"
          @keyup.enter="shippingIdEnter"
        ></el-input>
        <span class="scanTitle">称重(kg)：</span>
        <el-input
          v-model="shippingWeight"
          class="scanInput"
          
          ref="shippingWeightInptRef"
          :autofocus="autofocusData.shippingWeightFocus"
          @keyup.enter="savePackageDelivery"
          @input="weightPattern"
        ></el-input>
      </div>
      <div class="packContainer">
        <span>当前已扫描成功 </span>
        <span class="greenColor">{{ successNum }}</span>
        <span> 个包裹，异常包裹 </span>
        <span class="redColor">{{ faildNum }}</span>
        <span class="lastSpan"> 个 </span>
        <el-button
          type="primary"
          plain
          
          :disabled="faildNum == 0 ? true : false"
          @click="packageDeliveryClearFn"
          >清除异常包裹</el-button
        >
      </div>
    </div>
    <div class="pageNeck clearfix">
      <el-button type="primary"  class="fr" @click="showDialog"
        >导入扫描发货</el-button
      >
      <el-button
        type="primary"
        
        class="fr"
        @click="exportFn"
        style="margin-right: 15px"
        :disabled="faildNum == 0"
        >导出异常包裹</el-button
      >
      <el-dialog
        title="导入扫描发货"
        v-model="importDialogVisible"
        width="36%"
        :close-on-click-modal="closeModal"
        :before-close="importHandleClose"
      >
        <div class="importDialogBody" v-if="importingStatus == 1">
          <div class="btnsContainer clearfix">
            <div class="fl">
              <upload-file
                v-if="importDialogVisible"
                ref="uploadRef"
                accept=".xls,.xlsx"
                :before-upload="beforeUpload"
                @success="uploadSuccess"
                @remove="removeFile"
                class="flex-div"
                button-text="选择导入文件"
                tip=""
                moduleName="scanDelivery"
              >
                <template #download>
                  <el-button type="text" @click="downloadTpl"
                    >下载模版</el-button
                  >
                </template>
              </upload-file>
            </div>
          </div>
          <div class="downLoadConatainer" v-if="excelUrl">
            <el-button  type="primary" @click="dwonFileFn(excelUrl)"
              >下载错误信息</el-button
            >
            <span class="redColor"
              >导入文件失败，请下载错误信息，查看导入失败原因。</span
            >
          </div>
          <div v-if="title != ''">{{ title }}</div>
          <div class="tipsInfo">
            <p><i class="el-icon-warning-outline"></i>&nbsp;功能说明</p>
            <p>
              1、发货的「运单号」对应的包裹当前状态需为待发货或已发货（更换物流）-待发货
            </p>
            <p>2、 提交发货成功后订单会自动移入到「已发货」</p>
          </div>
        </div>
        <div class="importingStatus" v-if="importingStatus == 2">
          <span>表格上传</span>
          <el-progress
            :percentage="100"
            class="importingStatusContainer"
            status="success"
          ></el-progress>
          <div>数据校验</div>
          <el-progress
            :percentage="percent"
            class="importingStatusContainer"
            :status="percent == 100 ? 'success' : ''"
          ></el-progress>
          <div>
            数据整理中，请耐心等待，如长时间进度无反应，请与研发部联系。
          </div>
        </div>
        <div class="importFaild" v-if="importingStatus == 3">
          <span>表格上传</span>
          <el-progress
            :percentage="100"
            class="importingStatusContainer"
            status="success"
          ></el-progress>
          <div style="padding-top: 15px">数据校验</div>
          <el-progress
            :percentage="100"
            status="exception"
            class="importFaildStatusContainer"
          ></el-progress>
          <div class="faildTitle clearfix">
            <span class="fl redColor">导入失败！</span>
            <el-button
              type="text"
              class="fr blueColor"
              @click="dwonFileFn(erroeFile)"
              v-if="erroeFile"
              >下载文档</el-button
            >
          </div>
          <div class="faildTips">{{ faildTips }}</div>
        </div>
        <template #footer>
          <span class="dialog-footer" v-if="importingStatus != 2">
            <el-button @click="importHandleClose" >取 消</el-button>
            <el-button
              type="primary"
              @click="importDialogSure"
              
              v-if="importingStatus != 3"
              :disabled="!isCanSure"
              >确 定</el-button
            >
            <el-button
              type="primary"
              v-if="importingStatus == 3"
              
              @click="reSetUpData"
              >重新上传</el-button
            >
          </span>
        </template>
      </el-dialog>
    </div>
    <div class="tableContainer" style="box-sizing: border-box; padding: 20px">
      <vxe-table
        ref="myTable"
        keep-source
        align="center"
        :height="tableH"
        show-overflow
        :export-config="{}"
        :scroll-y="{ enabled: true, gt: 20 }"
        highlight-hover-row
        :auto-resize="true"
      >
        <vxe-table-column
          prop="logistics"
          align="center"
          width="26%"
          title="物流方式"
        >
          <template #default="{ row }">
            <div class="font12" v-if="row.logistics">
              <el-tooltip
                class="item"
                effect="light"
                :content="
                  row.logistics +
                  (row.lgtcLine ? '-' + row.lgtcLine : '') +
                  (row.trackType ? ' - 手工' : '')
                "
                placement="top-end"
              >
                <p class="shortP blueColor" style="font-size:20px;font-weight:550;">
                  {{ row.logistics }}{{ row.lgtcLine ? '-' + row.lgtcLine : ''
                  }}{{ row.trackType ? ' - 手工' : '' }}
                </p>
              </el-tooltip>
            </div>
          </template>
        </vxe-table-column>
        <vxe-table-column
          prop="trackNumber"
          align="center"
          width="17%"
          title="运单号"
        >
          <template #default="{ row }">
            <div class="font12" v-if="row.trackNumber">
              <el-tooltip
                class="item"
                effect="light"
                :content="row.trackNumber"
                placement="top-end"
              >
                <p class="shortP">{{ row.trackNumber }}</p>
              </el-tooltip>
            </div>
          </template>
        </vxe-table-column>
        <vxe-table-column
          prop="transcationId"
          align="center"
          width="12%"
          title="包裹号/订单号"
        >
          <template #default="{ row }">
            <div class="font12" v-if="row.packageId">
              <el-tooltip
                class="item"
                effect="light"
                :content="row.packageId"
                placement="top-end"
              >
                <p class="shortP">{{ row.packageId }}</p>
              </el-tooltip>
            </div>
            <div class="font12" v-if="row.orderId">
              <el-tooltip
                class="item"
                effect="light"
                :content="row.orderId"
                placement="top-end"
              >
                <p class="shortP">{{ row.orderId }}</p>
              </el-tooltip>
            </div>
          </template>
        </vxe-table-column>
        <vxe-table-column
          prop="goodsCount"
          align="center"
          width="5%"
          title="发货商品件数"
        >
          <template #default="{ row }">
            <div class="font12" v-if="row.goodsCount">
              <el-tooltip
                class="item"
                effect="light"
                :content="row.goodsCount + ''"
                placement="top-end"
              >
                <p>{{ row.goodsCount }}</p>
              </el-tooltip>
            </div>
          </template>
        </vxe-table-column>
        <vxe-table-column
          prop="country"
          align="center"
          width="6%"
          title="发往国家"
        >
          <template #default="{ row }">
            <div class="font12" v-if="row.country">
              <el-tooltip
                class="item"
                effect="light"
                :content="row.country"
                placement="top-end"
              >
                <p>{{ row.country }}</p>
              </el-tooltip>
            </div>
          </template>
        </vxe-table-column>
        <vxe-table-column
          prop="weight"
          align="center"
          width="8%"
          title="重量（g）"
        >
          <template #default="{ row }">
            <div :class="row.weight ? '' : 'redColor'" class="font12">
              <el-tooltip
                class="item"
                effect="light"
                :content="row.weight ? row.weight + '' : '0'"
                placement="top-end"
              >
                <p class="blueColor" style="font-size:20px;font-weight:550;">{{ row.weight ? row.weight + '' : '0' }}</p>
              </el-tooltip>
            </div>
          </template>
        </vxe-table-column>
        <vxe-table-column
          prop="createUserName"
          align="center"
          width="5%"
          title="扫描员"
        >
          <template #default="{ row }">
            <div class="font12" v-if="row.createUserName">
              <el-tooltip
                class="item"
                effect="light"
                :content="row.createUserName"
                placement="top-end"
              >
                <p>{{ row.createUserName }}</p>
              </el-tooltip>
            </div>
          </template>
        </vxe-table-column>
        <vxe-table-column
          prop="createTime"
          align="center"
          width="7%"
          title="扫描时间"
        >
          <template #default="{ row }">
            <div class="font12" v-if="row.createTime">
              <el-tooltip
                class="item"
                effect="light"
                :content="row.createTime"
                placement="top-end"
              >
                <p>{{ row.createTime?.split(' ')[0] }}</p>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="light"
                :content="row.createTime"
                placement="top-end"
              >
                <p>{{ row.createTime?.split(' ')[1] }}</p>
              </el-tooltip>
            </div>
          </template>
        </vxe-table-column>
        <vxe-table-column
          prop="exceptionDesc"
          align="center"
          width="10%"
          title="异常"
        >
          <template #default="{ row }">
            <div class="redColor font12" v-if="row.exceptionDesc">
              <el-tooltip
                class="item"
                effect="light"
                :content="row.exceptionDesc"
                placement="top-end"
              >
                <p>{{ row.exceptionDesc }}</p>
              </el-tooltip>
            </div>
          </template>
        </vxe-table-column>
        <vxe-table-column prop="id" width="4%" align="center" title="操作">
          <template #default="{ row }">
            <div class="redColor cursor font12" @click="deleteFn(row.id)">
              <p>删除</p>
            </div>
          </template>
        </vxe-table-column>
      </vxe-table>
    </div>
    <el-dialog
      title="提示"
      v-model="deleteShow"
      width="460px"
      :close-on-click-modal="closeModal"
      :before-close="closeDeleteFn"
    >
      <div class="tipsContent">
        <i class="el-icon-warning"></i
        ><span> 删除后将不参与提交发货，需重新扫描称重，确认删除？</span>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeDeleteFn" >取 消</el-button>
          <el-button type="primary"  @click="sureDeleteFn"
            >确 定</el-button
          >
        </span>
      </template>
    </el-dialog>
    <!-- 提交发货/清除异常包裹 确认-->
    <el-dialog
      title="提示"
      v-model="reToolsShow"
      width="420px"
      :close-on-click-modal="closeModal"
      :before-close="closeReTools"
    >
      <div class="tipsContent">
        <i class="el-icon-warning"></i><span>{{ reToolsShowTitle }}</span>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeReTools" >取 消</el-button>
          <el-button type="primary"  @click="sureReTools"
            >确 定</el-button
          >
        </span>
      </template>
    </el-dialog>
    <div class="footerContainer">
      <el-button
        type="primary"
        
        class="setUp"
        :disabled="successNum + faildNum == 0 ? true : false"
        @click="packageDeliverySubmitFn"
        >提交发货</el-button
      >
    </div>
  </div>
</template>
<script>
import {
  reactive,
  toRefs,
  ref,
  getCurrentInstance,
  watch,
  onMounted
} from 'vue'
import { ElMessage } from 'element-plus'
import { patternFn, audioPlay } from '@/utils/tool.js'
import UploadFile from '@/components/uploadFile/index.vue'

import {
  packageDeliveryList,
  packageDeliverySave,
  packageDeliveryClear,
  packageDeliverySubmit,
  packageDeliveryDel,
  packageDeliveryImport,
  packageDeliveryImportSubmit,
  packageDeliveryCount,
  checkProgress,
  exportErrorData
} from '@/api/order/scan.js'
export default {
  components: {
    UploadFile
  },
  setup(props, context) {
    const { proxy } = getCurrentInstance()
    let myTable = ref(null)
    const state = reactive({
      maxLength: 60,
      tableH: '400',
      //********************* */
      title: '',
      upLoadFileNameList: [],
      reToolsShow: false,
      reToolsShowTitle: '',
      reToolsShowType: '',
      recordStatus: true,
      weightPatternStatus: true,
      status: true,
      statusTimer: null,
      uuid: '', //上传文件成功返回的uuid
      checkFlag: true, //上传文件校验是否成功
      excelUrl: '', //上传文件校验失败后返回的下载地址
      upLoadFileName: '', //上传文件名称
      limit: 1, //上传文件数量
      fileType: '.xls,.xlsx', //上传文件类型
      showFileList: false, //是否显示已上传文件列表
      buttonSize: 'small', //上传文件按钮大小
      UploadFileStyle: {
        //上传文件按钮外层父元素样式
        width: '',
        margin: '0 20px 0 0',
        height: '36px',
        overflow: 'hidden'
      },
      autofocusData: {
        //输入框是否默认获取焦点
        //input 焦点
        shippingIdFocus: true,
        shippingWeightFocus: false
      },
      closeModal: false, //禁止点击masker关闭弹框
      importDialogVisible: false, //导入扫描发货弹框是否隐藏
      warehouseNameShow: false, //顶部是否展示仓库名称
      warehouseList: [
        {
          //仓库列表信息
          warehouseName: '万众智谷仓',
          warehouseId: 1
        }
      ],
      warehouseChecked: 1, //选择的仓库id
      shippingId: '', //顶部输入框内的运单号
      shippingWeight: '', //顶部输入框内的重量
      tableData: [],
      requestData: {
        //页面接口调用使用的数据(入参)
        packageDeliveryList: {
          //发货记录列表
          warehouseId: 1 //仓库id
        },
        packageDeliverySave: {
          //录入发货记录
          warehouseId: 1, //仓库ID
          trackNumber: '', //运单号
          weight: '' //重量(单位:克，类型:字符串)
        },
        packageDeliveryClear: {
          //清除异常包裹
          warehouseId: 1 //仓库ID
        },
        packageDeliverySubmit: {}, //提交发货
        packageDeliveryDel: {
          //删除包裹
          id: 0
        }
      },
      successNum: 0, //扫描成功数量
      faildNum: 0, //扫描失败数量
      deleteShow: false, //删除弹框
      waitTrackNumber: '', //等待删除的运单号
      emptyXLSX:
        'http://vango-erp-prod.oss-cn-beijing.aliyuncs.com/template/scan_delivery_template.xlsx', //默认下载模板链接
      reg: RegExp(/\s/), //正则是否存在空格
      mp3: 'http://47.99.122.19/erp/export/mp3/0939910f-15c5-495c-bea9-8faed23d8217.mp3', //语音播报数据
      isCanSure: false, //是否可以点击确定按钮
      importingStatus: 1, //导入文件的状态 1可导入文件 2.上传文件中 3.上传失败 (上传成功返回1状态)
      importantTitmer: null, //导入文件的定时器
      percent: 0, //进度条百分比
      faildTips: '', //上传错误提示
      erroeFile: '' //上传错误模型
    })

    const shippingWeightInptRef = ref(null)
    const shippingIdFocusRef = ref(null)

    //发货记录列表
    packageDeliveryListFn()
    function packageDeliveryListFn() {
      packageDeliveryList(state.requestData.packageDeliveryList)
        .then(res => {
          if (res.code == 200) {
            state.tableData = [...res.data.list]
            state.successNum = res.data.totalCount - res.data.errorCount
            state.faildNum = res.data.errorCount
            myTable.value.loadData(state.tableData)
          } else {
            ElMessage.warning({ message: res.message })
          }
        })
     
    }

    // 查询总包裹数和异常包裹数(取消使用此接口)
    function packageDeliveryCountFn(warehouseId) {
      packageDeliveryCount({ warehouseId })
        .then(res => {
          if (res.code == 200) {
            state.successNum = res.data.totalCount - res.data.errorCount
            state.faildNum = res.data.errorCount
          } else {
            ElMessage.warning({ message: res.message })
          }
        })
      
    }

    //录入发货记录
    function packageDeliverySaveFn() {
      if (state.shippingWeight - 0 > 999.999) {
        ElMessage.warning({ message: '重量最大为999.999' })
        state.shippingWeight = '999.999'
        state.weightPatternStatus = true
        return
      }
      if (!state.weightPatternStatus) {
        if (state.shippingWeight == '') {
          state.shippingWeight = '0'
        } else {
          return ElMessage.warning({ message: '重量最大为999.999' })
        }
      }
      if (state.recordStatus) {
        state.recordStatus = false
        setTimeout(() => (state.recordStatus = true), 2000)
        state.requestData.packageDeliverySave = {
          warehouseId: state.requestData.packageDeliverySave.warehouseId, //仓库ID
          trackNumber: state.shippingId.trim(), //运单号
          weight: (state.shippingWeight.trim() - 0) * 1000 + '' || '0' //重量(单位:克，类型:字符串)
        }
        if (state.shippingId == '')
          return ElMessage.warning({ message: '请录入运单号' })
        if (!patternFn(state.shippingId.trim(), 'shinpping'))
          return ElMessage.warning({ message: '请录入正确的运单号' })
        if (state.shippingWeight == '')
          return ElMessage.warning({ message: '请录入重量' })
        if (!patternFn(state.shippingWeight, 'weght'))
          return ElMessage.warning({ message: '重量仅支持0-5位小数点的数字' })

        packageDeliverySave(state.requestData.packageDeliverySave)
          .then(res => {
            if (res.code == 200) {
              state.mp3 = res.data.url
              state.tableData.unshift(res.data)
              myTable.value.loadData(state.tableData)
              state.shippingId = ''
              state.shippingWeight = ''
              state.autofocusData = {
                shippingIdFocus: true,
                shippingWeightFocus: false
              }
              shippingIdFocusRef.value.focus()
              audioPlay(state.mp3, 3000)
              packageDeliveryCountFn(
                state.requestData.packageDeliverySave.warehouseId
              )
            } else {
              ElMessage.warning({ message: res.message })
            }
          })
          
      } else {
        ElMessage.warning({ message: '2秒只能内录入一次' })
      }
    }
    const savePackageDelivery = () => {
      packageDeliverySaveFn()
    }

    //清除异常包裹
    const packageDeliveryClearFn = () => {
      state.reToolsShow = true
      state.reToolsShowTitle = '是否确认清除异常包裹？'
      state.reToolsShowType = 1
    }

    //提交发货
    const packageDeliverySubmitFn = () => {
      state.reToolsShow = true
      state.reToolsShowTitle = '是否确认提交发货？'
      state.reToolsShowType = 2
    }

    function checkProgressFn(uuid) {
      checkProgress({ uuid })
        .then(res => {
          if (res.code == 200) {
            state.percent = res.data.percent
            if (res.data.percent == 100) {
              clearInterval(state.importantTitmer)
              packageDeliveryListFn()
              state.importDialogVisible = false
              reSetUpData()
              ElMessage.success({ message: '导入成功' })
            }
          } else {
            clearInterval(state.importantTitmer)
            state.faildTips = res.message
            state.importingStatus = 3
          }
        })
        .catch(res => {
          clearInterval(state.importantTitmer)
         
        })
    }

    //删除包裹
    function packageDeliveryDelFn() {
      packageDeliveryDel(state.requestData.packageDeliveryDel)
        .then(res => {
          if (res.code == 200) {
            state.tableData = state.tableData.filter(
              v => v.id != state.requestData.packageDeliveryDel.id
            )
            myTable.value.loadData(state.tableData)
            ElMessage.success({ message: '删除成功' })
            state.deleteShow = false
            packageDeliveryCountFn(
              state.requestData.packageDeliveryClear.warehouseId
            )
          } else {
            ElMessage.warning({ message: res.message })
          }
        })
       
    }

    //   隐藏导入按钮的弹框
    const importHandleClose = () => {
      reSetUpData()
      state.importDialogVisible = false
    }

    //    导入按钮的弹框确定
    const importDialogSure = () => {
      state.isCanSure = false
      if (!state.uuid) return ElMessage.warning({ message: '请先导入文件' })
      packageDeliveryImportSubmit({
        uuid: state.uuid
      })
        .then(res => {
          if (res.code == 200) {
            let data = JSON.parse(res.data)
            clearInterval(state.importantTitmer)
            if (data.flag) {
              state.importingStatus = 2
              state.erroeFile = ''
              state.importantTitmer = setInterval(function () {
                checkProgressFn(state.uuid)
              }, 300)
            } else {
              state.faildTips = data.msg
              state.importingStatus = 3
              state.erroeFile = data.url
            }
          } else {
            state.isCanSure = true
            ElMessage.warning({ message: res.message })
          }
        })
        .catch(res => {
         
          state.isCanSure = true
        })
    }

    // 重新上传
    function reSetUpData() {
      state.uuid = ''
      state.isCanSure = false
      state.importingStatus = 1
      clearInterval(state.importantTitmer)
      state.percent = 0
      state.faildTips = ''
      state.erroeFile = ''
      state.title = ''
    }

    // 显示导入按钮的弹框
    const showDialog = () => {
      state.uuid = '' //上传文件成功返回的uuid
      state.checkFlag = true //上传文件校验是否成功
      state.excelUrl = '' //上传文件校验失败后返回的下载地址
      state.upLoadFileName = '' //上传文件名称
      state.importDialogVisible = true
    }

    // 当运单号有焦点时按enter键函数
    const shippingIdEnter = () => {
      state.shippingId = state.shippingId.trim()
      if (!patternFn(state.shippingId, 'shinpping'))
        return ElMessage.warning({ message: '运单号为大小写字母或数字' })
      state.autofocusData.shippingIdFocus = false
      state.autofocusData.shippingWeightFocus = true
      shippingWeightInptRef.value.focus()
    }

    // 唤起删除弹框
    const deleteFn = id => {
      state.waitTrackNumber = state.tableData.filter(
        v => id == v.id
      )[0].trackNumber
      state.requestData.packageDeliveryDel.id = id
      state.deleteShow = true
    }

    // 取消删除弹框
    const closeDeleteFn = () => {
      state.deleteShow = false
    }

    // 确认删除弹框
    const sureDeleteFn = () => {
      packageDeliveryDelFn()
    }

    //上传文件返回接收函数
    const getFileList = data => {
      if (data[0]) {
        state.upLoadFileName = data[0].fileUrl
        // 导入扫描发货 将文件路径换取uuid
        packageDeliveryImport({
          warehouseId: state.requestData.packageDeliverySave.warehouseId,
          fileUrl: state.upLoadFileName
        })
          .then(res => {
            if (res.code == 200) {
              if (res.data.checkFlag) ElMessage.success({ message: '上传成功' })
              state.checkFlag = res.data.checkFlag
              state.excelUrl = res.data.excelUrl
              state.uuid = res.data.uuid
              state.isCanSure = res.data.checkFlag
              state.title = res.data.msg
            } else {
              ElMessage.warning({ message: res.message })
            }
          })
         
      }
    }

    // 下载文件
    const dwonFileFn = url => window.open(url, '_blank')

    //删除上传的文件
    const deleteUpLoadFile = () => {
      state.uuid = '' //上传文件成功返回的uuid
      state.checkFlag = true //上传文件校验是否成功
      state.excelUrl = '' //上传文件校验失败后返回的下载地址
      state.upLoadFileName = '' //上传文件名称
    }

    // 确认切换仓库
    const sureChangeWarehouse = () => {
      state.requestData.packageDeliveryList.warehouseId = state.warehouseChecked
      state.requestData.packageDeliverySave.warehouseId = state.warehouseChecked
      state.requestData.packageDeliveryClear.warehouseId =
        state.warehouseChecked
    }
    // 扫码自动处理函数
    watch(state, (count, prevCount) => {
      if (state.reg.test(state.shippingId.trim())) {
        state.shippingWeight = state.shippingId.trim().split(' ')[1] - 0 + ''
        state.shippingId = state.shippingId.trim().split(' ')[0]
        packageDeliverySaveFn()
      } else {
        if (state.shippingId.trim().split(' ')[1]) {
          state.shippingWeight = state.shippingId.trim().split(' ')[1] - 0 + ''
          state.shippingId = state.shippingId.trim().split(' ')[0]
          packageDeliverySaveFn()
        }
      }
    })

    const closePage = () => history.go(-1)

    //对重量正则
    const weightPattern = () => {
      //重量去空格
      state.shippingWeight = state.shippingWeight.replace(/\s+/g, '')
      if (state.shippingWeight) {
        if (state.shippingWeight - 0 >= 1000) {
          state.weightPatternStatus = false
          return ElMessage.warning({ message: '重量最大为999.999' })
        }
        state.weightPatternStatus = patternFn(state.shippingWeight, 'weght')
        if (!patternFn(state.shippingWeight, 'weght'))
          ElMessage.warning({ message: '重量仅支持0-5位小数点的数字' })
      }
    }
    const closeReTools = () => {
      state.reToolsShow = false
      state.reToolsShowTitle = ''
      state.reToolsShowType = ''
    }

    const sureReTools = () => {
      if (state.reToolsShowType == 1) {
        // 清除异常包裹
        packageDeliveryClear(state.requestData.packageDeliveryClear)
          .then(res => {
            if (res.code == 200) {
              ElMessage.success({ message: '清除异常包裹成功' })
              closeReTools()
              packageDeliveryListFn()
            } else {
              ElMessage.warning({ message: res.message })
            }
          })
         
      } else if (state.reToolsShowType == 2) {
        // 提交发货
        packageDeliverySubmit({
          warehouseId: state.requestData.packageDeliveryClear.warehouseId
        })
          .then(res => {
            if (res.code == 200) {
              ElMessage.success({ message: '提交发货成功' })
              closeReTools()
              packageDeliveryListFn()
            } else {
              ElMessage.warning({ message: res.message })
            }
          })
         
      }
    }

    // 上传前
    const beforeUpload = file => {
      let arr = file.name.split('.')
      const fileType = arr[arr.length - 1]
      if (fileType !== 'xls' && fileType !== 'xlsx') {
        ElMessage.warning({
          message: '请上传符合格式要求的后缀为xls或xlsx文件'
        })
        return false
      }
    }
    const uploadSuccess = e => {
      packageDeliveryImport({
        warehouseId: state.requestData.packageDeliverySave.warehouseId,
        fileUrl: e.fileUrl
      })
        .then(res => {
          if (res.code == 200) {
            if (res.data.checkFlag) ElMessage.success({ message: '上传成功' })
            state.checkFlag = res.data.checkFlag
            state.excelUrl = res.data.excelUrl
            state.uuid = res.data.uuid
            state.isCanSure = true
            state.isCanSure = res.data.checkFlag
            state.title = res.data.msg
          } else {
            ElMessage.warning({ message: res.message })
          }
        })
       
    }
    const removeFile = e => {
      state.excelUrl = ''
      state.uuid = ''
      state.title = ''
    }
    const downloadTpl = _ => {
      window.open(state.emptyXLSX, '_self')
    }

    //导出异常包裹
    function exportFn() {
      exportErrorData({
        warehouseId: state.requestData.packageDeliverySave.warehouseId
      })
        .then(res => {
          if (res.code == 200) {
            window.open(JSON.parse(res.data).url, '_blank')
          } else {
            ElMessage.warning({ message: res.message })
          }
        })
       
    }

    onMounted(() => {
      state.tableH = document.body.clientHeight - 500 + ''
    })
    return {
      ...toRefs(state),
      myTable,
      downloadTpl,
      exportFn, //导出异常包裹
      beforeUpload,
      uploadSuccess,
      removeFile,
      weightPattern, //对重量正则
      importHandleClose, //隐藏导入按钮的弹框
      importDialogSure, //导入按钮的弹框确定
      showDialog, //显示导入按钮的弹框
      savePackageDelivery, //录入发货记录
      shippingIdEnter, //当运单号有焦点时按enter键函数
      closeDeleteFn, //取消删除弹框
      sureDeleteFn, //确认删除弹框
      deleteFn, //唤起删除弹框
      packageDeliveryClearFn, //清除异常包裹
      getFileList, //上传文件返回接收函数
      dwonFileFn, //下载文件
      deleteUpLoadFile, //删除上传的文件
      sureChangeWarehouse, //确认切换仓库
      packageDeliverySubmitFn, //提交发货
      closePage, //关闭页面(返回上一页)
      // autoChangeFn,//扫码自动处理函数
      shippingWeightInptRef, //获取发货重量输入框的DOM
      shippingIdFocusRef, //获取发货运单号输入框的DOM
      closeReTools, //
      sureReTools, //
      reSetUpData //重新上传
    }
  }
}
</script>
<style lang="scss" scoped>
:deep(.vxe-header--column) {
  color: #000;
}
:deep(.el-dialog__body) {
  padding-top: 10px;
  padding-bottom: 10px;
}
:deep(.el-icon-warning) {
  font-size: 24px;
  color: #e6a23c;
  margin-right: 10px;
  position: relative;
  top: 4px;
}
.tipsContent {
  line-height: 32px;
}
.scanListPage {
  padding-bottom: 60px;
  .pageHeader {
    border-radius: 2px;
    background-color: #fff;
    padding: 0 30px;
    .headerContainer {
      height: 80px;
      line-height: 80px;
      .scanTitle {
        font-size: 16px;
      }
      .scanInput {
        margin-right: 74px;
        width: 290px;
        font-size: 14px;
      }
    }
    .firstHeaderContainer {
      border-bottom: 1px dashed #e9e9e9;
      .headerChangeSureBtn {
        margin-left: 15px;
        position: relative;
        top: -2px;
      }
      .fr {
        margin-top: 24px;
      }
    }
    .packContainer {
      padding: 0 0 20px;
      .lastSpan {
        margin-right: 30px;
      }
    }
  }
  .pageNeck {
    padding: 20px 0;
    .exceilInfo {
      padding: 20px 0;
      span {
        margin-right: 20px;
        font-size: 12px;
      }
      i {
        cursor: pointer;
      }
    }
    .tipsInfo {
      margin-top: 20px;
      p {
        line-height: 2;
        font-size: 12px;
      }
    }
    .downLoadConatainer {
      margin-bottom: 20px;
      margin-top: 20px;
      span {
        margin-left: 10px;
        font-size: 12px;
      }
    }
  }
  .tableContainer {
    border-radius: 2px;
    background-color: #fff;
    padding: 0 30px;
    // :deep(.cell) {
    //   font-size: 12px;
    // }
  }
  .footerContainer {
    position: fixed;
    width: 100%;
    height: 52px;
    left: 0;
    bottom: 0;
    background-color: #fff;
    z-index: 998;
    .setUp {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }
  .blueColor {
    color: #1890ff;
  }
  .redColor {
    color: #fd4c60;
  }
  .greenColor {
    color: #67c23a;
  }
  .cursor {
    cursor: pointer;
  }
  .cursor:hover {
    opacity: 0.75;
  }
  .importingStatus {
    width: 80%;
    .importingStatusContainer {
      margin-bottom: 20px;
    }
    div {
      font-size: 12px;
    }
  }
  .importFaild {
    width: 80%;
    margin-left: 10%;
    .importFaildStatusContainer {
      margin-bottom: 20px;
    }
    .faildTitle {
      font-size: 14px;
      line-height: 40px;
    }
    .faildTips {
      color: #555658;
      font-size: 12px;
      margin-top: 5px;
      text-indent: 2em;
    }
  }
  .font12 {
    font-size: 12px;
    width: 100%;
    p {
      height: 24px;
      line-height: 24px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      cursor: pointer;
    }
    .shortP {
      width: 90%;
      margin-left: 5%;
    }
  }
}
</style>
