<!--
 * @Descripttion:
 * @version:
 * @Author: 江澎涛
 * @Date: 2021-07-19 10:10:44
 * @LastEditors: 江澎涛
 * @LastEditTime: 2021-08-22 23:45:43
-->
<template>
<div class="intercept-box">
    <!-- 菜单区域 -->
    <div class="menubox">
        <el-form ref="form" :inline="false"  @keyup.enter="searchList">
            <el-form-item style="margin-bottom:16px">
                时间范围：
                <el-select v-model="timeHorizonSelect" placeholder="请选择"  class="w125">
                    <el-option v-for="item in timeHorizon" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <!-- 日期选择 -->
                <el-date-picker
                    
                    style="width: 290px;margin-right:16px"
                    v-model="dateValue"
                    type="daterange"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :default-time="defaultTime"
                    @change="dateChange"></el-date-picker>

                拦截状态：
                <el-select
                    v-model="interceptStatusSelect"
                    placeholder="请选择"
                    
                    class="w125"
                    clearable
                    @clear="interceptStatusSelect = '全部'">
                    <el-option v-for="item in interceptStatus" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>

                发往国家：
                <el-select
                    v-model="sentCountriesSelect"
                    filterable
                    placeholder="请选择"
                    
                    class="w125"
                    clearable
                    @clear="sentCountriesSelect = '全部'">
                    <el-option v-for="item in sentCountries" :key="item.countryName" :label="item.countryName" :value="item.countryName"></el-option>
                </el-select>

                物流方式：
                <el-cascader
                    v-model="cascaderValue"
                    :props="{label:'name',children:'billWays',checkStrictly: true,expandTrigger:'hover'}"
                    :options="transport"
                    
                    style="width:125px;margin-right:16px"
                    clearable
                    @change="changeC"></el-cascader>

                拦截员：
                <el-select
                    v-model="interceptPartSelect"
                    placeholder="请选择"
                    
                    class="w125"
                    @change="selectchange($event, 'interceptPartId')"
                    clearable
                    @clear="interceptPartSelect = '全部'">
                    <el-option v-for="item in interceptPart" :key="item.userName" :label="item.userName" :value="item.userId"></el-option>
                </el-select>

                扫描员：
                <el-select
                    style="margin-right:0"
                    v-model="scanPersonSelect"
                    placeholder="请选择"
                    
                    class="w125"
                    @change="selectchange($event, 'scanPersonId')"
                    clearable
                    @clear="scanPersonSelect = '全部'">
                    <el-option v-for="item in scanPerson" :key="item.userName" :label="item.userName" :value="item.userId"></el-option>
                </el-select>

            </el-form-item>

            <el-form-item>

                搜索内容：
                <el-select v-model="searchContentSelect" placeholder="请选择"  style="width: 135px;;margin-right:16px" @change="selectchange($event, 'searchContentId')">
                    <el-option v-for="item in searchContent" :key="item.label" :label="item.value" :value="item.label"></el-option>
                </el-select>
                <div style="display: inline-block; width: 355px;margin-right:16px">
                    <el-input v-model="searchInput" placeholder="请输入要检索的内容，多条可用逗号或空格隔开" ></el-input>
                </div>
                <el-button type="primary"  @click="searchList">查询</el-button>
                <el-button  @click="resetSelect" style="margin-left:16px">重置</el-button>

            </el-form-item>

        </el-form>

    </div>
    <!-- 楚河 -->
    <div class="btn-box">
        <el-button type="primary"  @click="batchCancelled">批量取消拦截</el-button>
        <el-button type="primary"  @click="dialogShow = true" style="margin-left:16px">新增拦截</el-button>
    </div>
    <!-- 汉界 -->
    <!-- 表格区域 -->

    <div class="table-box">
        <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" :selectable="selectable">
            </el-table-column>
            <el-table-column label="包裹号/订单号" width="250">
                <template #default="scope">
                    <div class="table-col">
                        <el-tooltip placement="right">
                            <template #content>
                                <a v-copy="scope.row.packageId">复制</a>
                            </template>
                            <span class="rowOdd" :title="scope.row.packageId">{{scope.row.packageId ? scope.row.packageId : '-'}}</span>
                        </el-tooltip>
                        <el-tooltip placement="right">
                            <template #content>
                                <a v-copy="scope.row.orderId">复制</a>
                            </template>
                            <span class="rowOdd" :title="scope.row.orderId">{{ scope.row.orderId ? scope.row.orderId : '-' }}</span>
                        </el-tooltip>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="物流方式/运单号" width="200">
                <template #default="scope">
                    <div class="table-col">
                        <span class="nocenter" :title="`${scope.row.logistics ? scope.row.logistics : '-'} ${ scope.row.lgtcLine ? '-' + scope.row.lgtcLine : ''}${scope.row.trackType?' - 手工':''}`">
                            {{scope.row.logistics ? scope.row.logistics : '-'}}{{scope.row.lgtcLine ? '-' + scope.row.lgtcLine : ''}}{{scope.row.trackType?' - 手工':''}}
                        </span>
                        <el-tooltip placement="right">
                            <template #content>
                                <a v-copy="scope.row.trackNumber">复制</a>
                            </template>
                            <span class="nocenter" :title="scope.row.trackNumber ? scope.row.trackNumber : '-'">
                                {{scope.row.trackNumber ? scope.row.trackNumber : '-'}}
                            </span>
                        </el-tooltip>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="goodsCount" label="发货商品件数"></el-table-column>
            <el-table-column prop="country" label="发往国家"></el-table-column>
            <el-table-column prop="createTime" label="设置拦截时间" width="120">
                <template #default="scoped">
                    {{scoped.row.createTime1}}<br>
                    {{scoped.row.createTime2}}
                </template>
            </el-table-column>
            <el-table-column prop="scanTime" label="扫描时间" width="105">
                <template #default="scoped">
                    {{scoped.row.scanTime?scoped.row.scanTime1:'-'}}<br>
                    {{scoped.row.scanTime?scoped.row.scanTime2:''}}
                </template>
            </el-table-column>
            <el-table-column label="拦截员/扫描员" width="200">
                <template #default="scope">
                    {{ scope.row.createUser ? scope.row.createUser : '-' }}/
                    {{ scope.row.scanUser ? scope.row.scanUser : '-' }}
                </template>
            </el-table-column>
            <el-table-column prop="warehouseName" label="发货仓库">
                <template #default="scope">
                    {{scope.row.warehouseName?scope.row.warehouseName:'万众智谷仓'}}
                </template>
            </el-table-column>
            <el-table-column prop="status" label="拦截状态">
                <template #default="scope">
                    <span style="color: #7f7f7f" v-if="scope.row.status == '0'">未扫描</span>
                    <span style="color: #70b603" v-else>拦截成功</span>
                </template>
            </el-table-column>
            <el-table-column prop="interceptCause" label="拦截原因">
                <template #default="scope">
                    <span style="color: red" class="rowOdd" :title="scope.row.reason">{{ scope.row.reason }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template #default="scope">
                    <span v-if="scope.row.status == '0'" class="callspan" @click="cancelInterception(scope.row.id)">取消拦截</span>
                </template>
            </el-table-column>
        </el-table>
        <div class="flex-pagination page-fixed">
            <div>
                <span @click="selectClick" :style="{backgroundColor: selectOptions.length ? 'rgb(64, 158, 255)' : '#fff'}" class="el-icon-check span-check"></span>
                <span :style="{color: selectOptions.length ? 'rgb(64, 158, 255)' : 'unset'}">已选择{{ selectOptions.length }}条</span>
            </div>
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[10, 20, 30, 40, 100]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </div>
    </div>

    <interDialog v-if="dialogShow" />
    <successDialog @search="searchList" />
</div>
</template>

<script>
import { reactive, toRefs, onMounted, onActivated } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { interceptCancel, interceptors, interceptScanners, interceptListPage } from '@/api/order/orderProcessing'
import { countryCode } from '@/api/order/orderManagement.js'
import moment from 'moment'
import { channelWithManual } from '@/api/order/orderManagement.js'
import interDialog from './components/interDialog.vue'
import successDialog from './components/successDialog.vue'
import { successData } from './composable/index.js'
import { useRoute } from 'vue-router'
export default {
    name: 'InterceptShipping',
    components: { interDialog, successDialog },
    setup() {
        const route = useRoute()
        const state = reactive({
            dialogShow: false,
            searchData: {},
            //时间范围相关
            timeHorizon: [
                { lable: 'option1', value: '扫描时间' },
                { lable: 'option2', value: '设置拦截时间' }
            ],
            timeHorizonSelect: '设置拦截时间',
            dateValue: [
                moment().subtract(29, 'days').format('YYYY-MM-DD 00:00:00'), // 默认时间
                moment().subtract(0, 'days').format('YYYY-MM-DD 23:59:59') // 默认时间
            ],
            defaultTime: [
                new Date(2000, 1, 1, 0, 0, 0),
                new Date(2000, 2, 1, 23, 59, 59)
            ],
            //拦截状态相关
            interceptStatus: [
                { lable: 'option1', value: '全部' },
                { lable: 'option2', value: '未扫描' },
                { lable: 'option3', value: '已拦截' }
            ],
            interceptStatusSelect: '未扫描',
            //发往国家相关
            sentCountries: [],
            sentCountriesSelect: '全部',
            //物流方式相关
            transport: [],
            cascaderValue: [''],
            // 拦截员相关
            interceptPartId: '',
            interceptPart: [],
            interceptPartSelect: '全部',
            //扫描员相关
            scanPersonId: '',
            scanPerson: [],
            scanPersonSelect: '全部',
            //搜索内容相关
            searchContent: [
                { label: 0, value: '订单号' },
                { label: 1, value: '包裹号' },
                { label: 2, value: '运单号' }
            ],
            searchContentId: 0,
            searchContentSelect: '订单号',
            searchInput: '',
            tableData: [],
            selectOptions: [], // 复选框勾选的内容
            currentPage: 1,
            total: 0,
            pageSize: 10,
            form:null
        })

        // 页面初始化
        onMounted(() => {
            const params = route.params.data?JSON.parse(route.params.data):{}
            if(Object.keys(params).length){
                if(params.date){
                    params.startDate = moment().format('YYYY-MM-DD 00:00:00')
                    params.endDate = moment().format('YYYY-MM-DD 23:59:59')
                    state.dateValue = [ params.startDate, params.endDate]
                }else{
                    state.dateValue = null
                    params.startDate = null
                    params.endDate = null
                }
                state.interceptStatusSelect = params.status ==0?'未扫描':params.status ==1?'已拦截':'全部'
            }
            searchList(params)
            // 拦截员
            interceptors().then(res => {
                state.interceptPart = [{ userId: '', userName: '全部' }, ...res.data.interceptors]
            })
            // 扫描员
            interceptScanners().then(res => {
                state.scanPerson = [{ userId: '', userName: '全部' }, ...res.data.scanners]
            })
            // 国家
            countryCode().then(res => {
                state.sentCountries = [{ countryName: '全部', countryEnName: '' }, ...res.data]
            })
            // 物流方式
            channelWithManual().then(res => {
                state.transport = [{ name: '全部', value: '' }, { name: '其他', value: 'other' }, ...res.data]
            })
        })
        // 下拉选择内容
        const selectchange = (e, i) => {
            state[i] = e
        }
        const dateChange = e => {
            if (!e) return
            state.dateValue[0] = moment(e[0]).format('YYYY-MM-DD HH:mm:ss')
            state.dateValue[1] = moment(e[1]).format('YYYY-MM-DD HH:mm:ss')

        }
        // 查询事件
        const searchList = (value = {}) => {
            const data = {
                dateType: state.dateValue ? state.timeHorizonSelect == '扫描时间' ? 0 : 1 : '',
                startDate: state.dateValue ? state.dateValue[0] : '', // 开始时间
                endDate: state.dateValue ? state.dateValue[1] : '', //结束时间
                status: state.interceptStatusSelect == '未扫描' ? 0 : state.interceptStatusSelect == '已拦截' ? 1 : '',
                country: state.sentCountriesSelect == "全部" ? "" : state.sentCountriesSelect, // 发往国家
                logistics: state.cascaderValue[0], // 物流方式
                lgtcLine: state.cascaderValue[1], // 物流专线
                interceptorId: state.interceptPartId, // 拦截员id
                scanPersonId: state.scanPersonId, // 扫描员id
                searchContentTypeId: state.searchContentId, // 搜索类型
                searchContent: state.searchInput, // 搜索内容
                page: {
                    pageNo: state.currentPage,
                    pageSize: state.pageSize
                }
            }
            Object.assign(data,value)
            console.log(data);
            interceptListPage(data).then(res => {
                state.tableData = res.data.dataList
                state.tableData.forEach(item=>{
                    item.createTime1 = item.createTime.split(' ')[0]
                    item.createTime2 = item.createTime.split(' ')[1]
                    item.scanTime1 = item.scanTime?item.scanTime.split(' ')[0]:item.scanTime
                    item.scanTime2 = item.scanTime?item.scanTime.split(' ')[1]:item.scanTime
                })
                state.total = res.data.page.totalCount
            })
        }
        // table 业务

        // 勾选复选框事件
        const handleSelectionChange = e => {
            state.selectOptions = [...e]
        }

        // 该复选框是否禁用
        const selectable = e => {
            return e.status == "0"
        }

        // 分页数量改变事件
        const handleSizeChange = e => {
            state.pageSize = e
            state.currentPage = 1
            searchList()
        }

        // 分页页数改变事件
        const handleCurrentChange = e => {
            state.currentPage = e
            searchList()
        }

        // 批量取消拦截
        const batchCancelled = e => {
            if (state.selectOptions.length == 0) {
                return ElMessage.warning('请选择订单')
            } else {
                let arr = state.selectOptions.map(item => item.id)
                ElMessageBox.confirm('确定批量取消拦截?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    interceptCancel({ ids: arr }).then(res => {
                        ElMessage.success('取消拦截成功')
                        searchList()
                    })
                })
            }
        }
        // 取消拦截
        const cancelInterception = e => {
            ElMessageBox.confirm('确定取消拦截?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                interceptCancel({ ids: [e] }).then(res => {
                    ElMessage.success('取消拦截成功')
                    searchList()
                })
            })
        }

        // 重置选择
        const resetSelect = (params) => {
            state.timeHorizonSelect = '设置拦截时间'
            if(!params.date){
                state.dateValue = [
                moment().subtract(29, 'days').format('YYYY-MM-DD 00:00:00'), // 默认时间
                moment().subtract(0, 'days').format('YYYY-MM-DD 23:59:59') // 默认时间
                ]
                state.interceptStatusSelect = '未扫描'
            }
            state.sentCountriesSelect = '全部'
            state.interceptPartSelect = '全部'
            state.scanPersonSelect = '全部'
            state.searchContentSelect = '订单号'
            state.cascaderValue = ['']
            state.searchInput = ''
            searchList(params)
        }

        const changeC = e => {
            if (!e) {
                state.cascaderValue = ['']
            }
        }

        function selectClick() {
            if (state.tableData.length) document.querySelector('thead .el-checkbox').click()
        }
   
        return {
            ...toRefs(state),
            ...toRefs(successData),
            batchCancelled,
            searchList, // 查询列表
            selectchange,
            selectable,
            handleSizeChange,
            handleCurrentChange,
            handleSelectionChange,
            dateChange,
            cancelInterception,
            resetSelect,
            changeC,
            selectClick

        }
    }
}
</script>

<style lang="scss" scoped>
.btn-box {
    padding: 20px 0;
    display: flex;
    justify-content: space-between;
}

.menubox {
    background-color: #fff;
    padding: 20px;
    padding-bottom: 1px;
    border-radius: 4px;

    .w125 {
        width: 135px;
        margin-right: 16px
    }
}

.table-box {

    background-color: #fff;
    padding: 24px;
    margin-bottom: 32px;

    .table-col {
        display: flex;
        flex-direction: column;
        line-height: 27px;

        .nocenter {
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            text-align: left;
        }
    }

    .callspan {
        color: #1880E7;
        cursor: pointer;
    }

    .pageRow {
        height: 40px;
        padding: 0 5px;
        border: 1px solid rgb(215, 215, 215);
        border-top: 0;
        line-height: 38px;
        background-color: #fff;
        display: flex;
        justify-content: space-between;
        box-sizing: border-box;

        :deep(.el-pagination) {
            padding-top: 5px;
            margin-top: unset;
        }
    }

    :deep(table) {
        .cell {
            text-align: center;
        }

        .has-gutter {
            color: black;

            tr th:nth-child(3) {
                .cell {
                    text-align: left;
                }
            }
        }

        tbody {
            tr td {
                height: 51px;
                padding: 0;
            }
            font-size: 12px;
        }
    }
}

.el-icon-check {
    color: #fff;
    font-size: 10px;
    line-height: 14px;
    text-align: center;
  
}
.span-check{
     text-align: center;
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 1px solid #eee;
    margin: 0 10px;
}

.rowOdd {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

:deep(.tableBox) {

    th,
    td {
        padding: 0
    }
}

p {
    text-align: center;
    color: #000;

}

a {
    color: #fff;
}

// .interBox{
//     max-height: 500px;
//     overflow: hidden;
//     overflow-y: auto;
// }
</style>
