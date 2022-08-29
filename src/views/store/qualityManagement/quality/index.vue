<template>
<div class="headQuality">
    <div class="headContent">
        <el-form :model="form" @keydown.enter='search'>
            <el-form-item label="搜索类型:">
                <el-select v-model="form.searchContentTypeId" placeholder="商品名称" style="width: 140px" clearable @change="searchContent">
                    <el-option label="商品名" value="1"></el-option>
                    <el-option label="SKU编码" value="2"></el-option>
                    <el-option label="质检人" value="3"></el-option>
                    <el-option label="SKU ID" value="4"></el-option>
                </el-select>
                <el-input :placeholder="placeholderType" style="width: 340px; margin-left: 16px" v-model="form.searchContent" clearable></el-input>
            </el-form-item>

            <el-form-item label="质检结果:" style="margin-top: 10px">
                <el-select v-model="form.checkResultId" placeholder="全部" style="width: 140px" clearable>
                    <el-option label="全部" value=""></el-option>
                    <el-option label="合格" value="2"></el-option>
                    <el-option label="不合格" value="0"></el-option>
                    <el-option label="部分合格" value="1"></el-option>
                </el-select>
                <span style="margin-left: 16px; color: #606266">质检类型:</span>
                <el-select v-model="form.checkTypeId" style="margin-left: 12px; width: 140px" placeholder="全部" clearable>
                    <el-option label="全部" value=""></el-option>
                    <el-option label="QA" value="0"></el-option>
                    <el-option label="QC" value="1"></el-option>
                </el-select>
                <span style="margin-left: 16px; color: #606266">质检时间:</span>
                <el-date-picker
                    v-model="form.createTime"
                    unlink-panels
                    type="daterange"
                    style="width: 280px; margin-left: 10px"
                    
                    range-separator="→"
                    value-format="YYYY-MM-DD"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                   >
                </el-date-picker>
                <el-button style="margin-left: 10px" type="primary"  @click="search">查询</el-button>
                <el-button  @click="reset">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
    <!-- 按钮 -->
    <div class="headButton">
        <el-dropdown @command="handleCommand">
            <el-button type="primary" size="small"> 导出记录 </el-button>
            <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item command="0">按勾选项导出</el-dropdown-item>
                    <el-dropdown-item command="1">按当前页导出</el-dropdown-item>
                    <!-- <el-dropdown-item command="1">按全部页导出</el-dropdown-item> -->
                </el-dropdown-menu>
            </template>
        </el-dropdown>
        <!-- <el-button
          type="primary"
          
          style=""
          >导出记录</el-button
        > -->
    </div>
    <!-- 表格部分 -->
    <div class="headTable" v-loading="loading">
        <el-table :data="data" border style="width: 100%" :header-cell-style="{
          background: '#FAFAFA',
          color: '#606266'
        }" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column label="货品名称" prop="skuImg" width="380px" align="center">
                <template #default="scope">
                    <div class="checkImg">
                        <div class="qualityImgs">
                            <el-popover placement="right-start" trigger="hover" width="auto">
                                <el-image style="width: 200px; height: 200px" :src="scope.row.skuImg" fit="contain"></el-image>
                                <template #reference>
                                    <el-image style="width: 70px; height: 70px;" :src="scope.row.skuImg" fit="contain">
                                        <template #error>
                                            <div class="image-slot">
                                                <el-image style="width: 70px; height: 70px;" fit="contain" :src="img" />
                                            </div>
                                        </template>
                                    </el-image>
                                </template>
                            </el-popover>
                        </div>
                        <div style="margin-left: 16px;text-align: left;">
                            <el-tooltip placement="top" >
                            <template #content>
                                <a v-copy="scope.row.goodsName" style="">复制</a>
                            </template>
                            <div class="skuFont" :title="scope.row.goodsName">
                                <p class="checkFont">{{ scope.row.goodsName }}</p>
                            </div>
                            </el-tooltip>
                            <el-tooltip placement="top">
                            <template #content>
                                <a v-copy="scope.row.sku" style="">复制</a>
                            </template>
                            <div class="skuFonts" :title="scope.row.sku">
                                <p class="checkFont">
                                    {{ scope.row.sku }}
                                </p>
                            </div>
                        </el-tooltip>
                        <!-- sku编码 -->
                         <el-tooltip placement="top">
                            <template #content>
                                <a v-copy="scope.row.skuCode" style="">复制</a>
                            </template>
                            <div class="skuFonts" :title="scope.row.skuCode">
                                <p class="checkFont">
                                    {{ scope.row.skuCode }}
                                </p>
                            </div>
                        </el-tooltip>
                            <a style="color: #1890ff;fontSize:12px" v-if="scope.row.customization" @click="customize(scope.row.type, scope.row.serialNumber)">定制品</a>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="needInspect" label="需检数" width="120px" align="center"></el-table-column>
            <el-table-column prop="actualInspect" label="实检数" width="120px" align="center"></el-table-column>
            <el-table-column prop="qualified" label="合格数" width="120px" align="center"></el-table-column>
            <el-table-column prop="unqualified" label="不合格" width="120px" align="center"></el-table-column>
            <el-table-column label="质检结果" width="120px" align="center">
                <template #default="scope">
                    <p style="color: #1890ff" v-if="scope.row.result == '2'">合格</p>
                    <p style="color: #ff4d4f" v-if="scope.row.result == '0'">不合格</p>
                    <p style="color: #52c41a" v-if="scope.row.result == '1'">
                        部分合格
                    </p>
                </template>
            </el-table-column>
            <el-table-column label="质检类型" width="120px" align="center">
                <template #default="scope">
                    <p v-if="scope.row.type == '0'">QA</p>
                    <p v-if="scope.row.type == '1'">QC</p>
                </template>
            </el-table-column>
            <el-table-column prop="createUser" label="质检人" width="120px" align="center"></el-table-column>
            <el-table-column prop="createTime" label="时间" width="110px" align="center"></el-table-column>
            <el-table-column prop="remark" label="质检备注" align="center">
                <template #default="scope">
                    <div class="remarkClass" :title="scope.row.remark">
                        <p>{{ scope.row.remark }}</p>
                    </div>
                </template>
            </el-table-column>
        </el-table>
         </div>
        <!-- 分页器 -->
        <div class="flex-pagination page-fixed">
            <div>
                已选 <span style="color: #1890ff">{{serialNumbers?serialNumbers.length:0}}</span>条
            </div>
        <div>
        <el-pagination
            style=""
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="form.current"
            :page-sizes="paginationArr"
            :page-size="form.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="paginationTotal">
        </el-pagination>
        </div>
    </div>
    <!-- 订制品 -->
    <el-dialog title="定制信息" v-model="dialogVisible" width="800px" :close-on-click-modal="false" :destroy-on-close="true" >
        <ProductGoods :productType="productType" :productId="productId" :type="type" />
    </el-dialog>
</div>
</template>

<script>
import img from '@/assets/image/zwt_bg.png'
import moment from 'moment'
import { ElMessage } from 'element-plus'
import { resetForm } from '@/utils/tool.js'
import { reactive, toRefs, ref, toRaw } from 'vue'
import ProductGoods from '@/views/store/autarkyWareHouse/come/components/productGoods.vue' //订制品弹框
import {
    getQuality, //质检记录页面查询
    exportQuality, //质检记录页面的导出
    productGoods //定制信息
} from '@/api/store.js'
import { onMounted } from 'vue'
export default {
    ame:'Quality',
    components: {
        ProductGoods //定制品
    },
    setup() {
        const state = reactive({
            loading: true,
            img,
            type: '1',
            productType: '', //带到订制品页面数据
            productId: '', //带到订制品页面数据
            // multipleSelection: [], //表格选择的id
            command: '0',
            dialogVisible: false,
            paginationTotal: 0, //分页总数据条数
            paginationArr: [30, 100, 300, 500], //分页每页选择条数默认数据
            form: {
                searchContentTypeId: '',
                searchContent: '',
                createTime: [],
                checkResultId: '',
                checkTypeId: '',
                startDate: '',
                endDate: '',
                current: 1,
                size: 30
            },
            data: [],
            serialNumbers: [], //存储质检流水号
            serialNumbersList: [],
            placeholderType:'请输入要检索的内容'
        })
        //页面一进入数据渲染
        const init = () => {
            state.loading = true
            let {
                searchContentTypeId,
                searchContent,
                checkResultId,
                checkTypeId,
                createTime,
            } = state.form,
                params = {
                    searchContentTypeId,
                    searchContent,
                    checkResultId,
                    checkTypeId,
                }
                params.startDate=createTime?createTime[0]+' 00:00:00':''
                params.endDate=createTime?createTime[1]+' 23:59:59':''
            params.page = {
                pageNo: state.form.current,
                pageSize: state.form.size
            }
            getQuality(params).then(res => {
                if (res.code == 200) {
                    state.loading = false
                    if (res.data.dataList) {
                        state.data = res.data.dataList
                        state.paginationTotal = res.data.page.totalCount
                    }
                }
            })
        }
        //页面加载时候
        onMounted(() => {
            state.form.createTime = [
                moment()
                .endOf('day')
                .subtract(119, 'days')
                .format('YYYY-MM-DD'),
                moment().format('YYYY-MM-DD')
            ]
            init()
        })
        //订制品
        const customize = (type, id) => {
            state.dialogVisible = true
            state.productType = type + ''
            state.productId = id
        }
        //导出事件
        const handleCommand = command => {
            console.log(command, 888)
            state.command = command
            if (command === '0' && !state.serialNumbers.length) {
                ElMessage.error('请先勾选记录！')
                // init()
                return
            }
            if (command === '1') {
                state.serialNumbersList = []
                state.data.forEach(item => {
                    state.serialNumbersList.push(item.serialNumber)
                })
            }
            let params = {
                exportType: '0',
                serialNumbers: state.command == '0' ? state.serialNumbers : state.serialNumbersList,
                checkQuery: {
                    searchContentTypeId: state.form.searchContentTypeId,
                    searchContent: state.form.searchContent,
                    checkResultId: state.form.checkResultId,
                    checkTypeId: state.form.checkTypeId,
                    startDate: state.form.createTime[0],
                    endDate: state.form.createTime[1]
                }
            }
            exportQuality(params)
                .then(res => {
                    if (res.code == 200) {
                        ElMessage.success('提交成功')
                        window.open(res.data.msg, '_self')
                        init()
                    }
                })
                
        }
        //重置按钮
        const reset = () => {
            let restForm = {
                createTime: [
                    moment()
                    .endOf('day')
                    .subtract(119, 'days')
                    .format('YYYY-MM-DD'),
                    moment().format('YYYY-MM-DD')
                ],
            }
            resetForm(state.form, restForm)
            init()
        }
        //查询
        const search = () => {
            init()
        }
        //表格的多选框
        const handleSelectionChange = selection => {
            state.serialNumbers = []
            selection.forEach(v => {
                state.serialNumbers.push(v.serialNumber)
            })
        }
        // 分页
        const handleSizeChange = val => {
            state.form.size = val
            init()
            console.log(`每页 ${val} 条`)
        }
        const handleCurrentChange = val => {
            state.form.current = val
            init()
            console.log(`当前页: ${val}`)
        }
        //下拉框的选中值
        const searchContent = val => {
            state.form.searchContent = ''
            if(val==='1'||val==='3'){
                state.placeholderType='请输入要检索的内容'
            }else{
                state.placeholderType='请输入要检索的内容多条可用逗号或者空格隔开'
            }
        }
       
      
        return {
            ...toRefs(state),
            handleCurrentChange,
            handleSizeChange,
            customize,
            handleCommand,
            handleSelectionChange,
            search,
            reset,
            searchContent,
        }
    }
}
</script>

<style lang="scss" scoped>
.headQuality {
    padding-bottom: 60px;
  position: relative;
  :deep(.el-dialog__header){
      padding-bottom: 0px;
  }
 
  :deep(.el-pagination) {
        margin-top: 0;
    }
    :deep(.el-button) {
        height: 32px;
    }

    .headContent {
        background: #fff;
        padding: 20px 30px;
        padding-bottom: 1px;
    }

    .headContent {
        :deep(.el-input--suffix .el-input__inner) {
            height: 32px;
        }

        :deep(.el-input__inner) {
            height: 32px;
        }

        :deep(.el-input) {
            line-height: 32px;
        }

        :deep(.el-range-editor--small .el-range-separator) {
            width: 38px;
        }
    }

    .checkFont {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        color: rgba(0, 0, 0, 0.65);
    }

    .checkImg {
        display: flex;
       
    }
  .qualityImgs{
      display: flex;
      align-items: center;
  }
    //   /* 表格样式 */
    .headTable {
        /* height: 570px; */
        background-color: #ffffff;

        border-radius: 2px 2px 2px 0px;
        padding: 20px 25px;

        .remarkClass {
            p {
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;
            }
        }

        .skuFont {
            width: 250px;
            margin:0;
           font-weight: 600;
            p {
                line-height: 20px;
                font-size: 12px;
                overflow: hidden;
                white-space: nowrap; //表示不换
                text-overflow: ellipsis //加省略号;
            }
        }

        .skuFonts {
            width: 250px;
            // margin-bottom: 2px;
            p {
            line-height: 20px;
            font-size: 12px;
            overflow: hidden;
            white-space: nowrap; //表示不换
            text-overflow: ellipsis; //加省略号;
            }
        }
    }

    .headTable:after {
        content: '';
        display: block;
        visibility: hidden;
        clear: both;
    }

    .headTable {
        // :deep(.el-pagination) {
        //     float: right;
        //     padding-top: 200px !important;
        // }
    }

    //   /* 按钮 */
    .headButton {
        text-align: right;
        margin: 24px 0;
    }
}

a{
    color:#fff;
}
</style>
