<!--
 * @Descripttion: 
 * @version: 
 * @Author: 江澎涛
 * @Date: 2021-08-04 18:11:40
 * @LastEditors: 江澎涛
 * @LastEditTime: 2021-08-23 00:05:20
-->
<template>
<div class="dialog">
    <el-dialog
        :title="dialogTitle"
        v-model="dialogVisible"
        :width="width"
        @close="close"
        :close-on-click-modal="false"
        :close-on-press-escape="false">

        <div class="header">
            <div class="left">
                <div class="imgbox">
                    <img :src="fjIcon" alt="暂无图片">
                </div>
                <div class="orderInfo">
                    <div class="orderNum">
                        <span class="textOdd">{{dataList.trackNumber?dataList.trackNumber:pageId.trackNumber}}</span>
                        <span class="el-icon-document-copy" v-copy="dataList.trackNumber?dataList.trackNumber:pageId.trackNumber"></span>
                    </div>
                    <div class="orderDate" v-if="dataList.statusZh">{{dataList.statusZh}} <span v-if="dataList.dt!=0">（{{date}}）</span></div>
                </div>
            </div>
            <div class="right">

                <span>{{dataList.fromCountry?dataList.fromCountry:"中国"}}</span> (<span style="color:#359EFF">{{logistics?logistics:pageId.logisticsName}}{{lgtcLine?'-'+lgtcLine:pageId.lgtcLineName?'-'+pageId.lgtcLineName:'-手工'}}</span>)<span class="el-icon-right"></span> <span>{{dataList.toCountry?dataList.toCountry:pageId.packageRels[0].country}}</span>
            </div>
        </div>
        <div class="content">
            <p>发货地：{{dataList.fromCountry?dataList.fromCountry:"中国"}}</p>
            <p>目的地：{{dataList.toCountry?dataList.toCountry:pageId.packageRels[0].country}}</p>
            <el-timeline v-if="dataList&&dataList.tracks&&dataList.tracks.length">
                <el-timeline-item v-for="(activity, index) in dataList.tracks" :key="index" :color="index==0?'#1890FF':''">
                    {{activity.time}} &nbsp;&nbsp;&nbsp;&nbsp; {{activity.desc}}
                </el-timeline-item>
            </el-timeline>
            <div v-else class="nullTracks">
                暂无物流轨迹
            </div>
        </div>
    </el-dialog>
</div>
</template>

<script>
import { reactive, toRefs, watch } from 'vue'
import { computed, getCurrentInstance, onMounted } from 'vue'
import { copy } from '@/directives/erpToolsDirective'
import { logisticsTrackInfo, channelWithManual } from '@/api/order/orderManagement.js'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import fjIcon from '@/assets/image/fj_icon.png'
export default {
    name: 'Dia',
    directives: { copy },
    props: {
        dialog: {
            type: Object,
            default: null
        },
        dialogTitle: {
            type: String,
            default: '提示'
        },
        dialogVisible: {
            type: Boolean,
            default: false
        },
        width: {
            type: String,
            default: '30%'
        },
        data: {
            type: Object,
            default: null
        }
    },
    setup(props) {
        const { proxy } = getCurrentInstance()
        const state = reactive({
            isShow: props.show,
            dataList: '',
            logisticsList: [],
            logistics: '',
            lgtcLine: '',
            pageId: props.data.pageId,
            fjIcon
        })

        const close = () => {
            proxy.$parent.dialogVisible = false
        }
        const cancel = () => {
            proxy.$parent.dialogVisible = false
        }

        onMounted(() => {
            getlist()
            console.log(state.pageId,'pageId');
        })

        const date = computed(() => {
            dayjs.locale('zh-cn')
            dayjs.extend(relativeTime)

            if(state.dataList.dtD&&state.dataList.dtD!=0){
                console.log(state.dataList.dtD,'存在签收时间');
                return dayjs(state.dataList.dt).from(dayjs(state.dataList.dtD), true)
            }else{
                return dayjs(state.dataList.dt).fromNow(true)
            }
            

        })

        const getlist = () => {
            logisticsTrackInfo({ trackNumber: state.pageId.trackNumber }).then(res => {
                
                state.dataList = res.data
                console.log(state.dataList);
                channelWithManual().then(res => {
                    state.logisticsList = res.data
                })
            })
        }

        watch(() => state.logisticsList, val => {
            console.log(state.dataList);
            val.forEach(item => {
                if (item.value == state.dataList.logistics) {
                    state.logistics = item.name
                    console.log(item.name);
                    if (item.billWays) {
                        item.billWays.forEach(val => {
                            if (val.value == state.dataList.lgtcLine) {
                                state.lgtcLine = val.name
                            }
                        })
                    }
                }
            })
        })

        return {
            ...toRefs(state),
            close,
            date
        }
    }
}
</script>

<style lang="scss" scoped>
.header {
    height: 92px;
    border-bottom: 1px dashed #E9E9E9;
    display: flex;
    margin-bottom: 23px;

    .left {
        display: flex;
        align-items: center;
        margin-right: 110px;

        .imgbox {
            width: 60px;
            height: 60px;
            border-radius: 10px;
            overflow: hidden;
            margin-right: 15px;

            img {
                width: 60px;
                height: 60px;
            }
        }

        .orderInfo {
            font-size: 12px;

            .orderNum {
                height: 14px;
                margin-bottom: 5px;

                .textOdd {
                    display: inline-block;
                    width: 106px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    margin-right: 15px;
                }

                .el-icon-document-copy {
                    cursor: pointer;
                }
            }

            .orderDate {
                margin-top: 5px;
            }
        }
    }

    .right {
        line-height: 92px;
        font-size: 12px;
    }
}

.content {
    p {
        margin-bottom: 15px;
    }

    max-height: 500px;
    overflow-x: auto;
    padding-left: 3px;
}
.nullTracks{
    text-align: center;
    line-height: 70px;
    line-height: 70px;
    background-color: rgb(233,233,233);
}
</style>
