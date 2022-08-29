import { ElMessageBox, ElMessage } from 'element-plus'
import { addPublish, exportGoods, remarkDetail ,exportCustomsInfo } from '@/api/goods/quotedPrice'
import { getuuid } from '@/utils/tool.js'
export default function (state, hooks, router, route) {
  let imposeEvent = () => {
    if (state.selections.length == 0) {
      ElMessage.error('请选择商品!')
      return false;
    } else {
      return true
    }
  }
  // 切换tab
  let tabSelectEvent = (type) => {
    state.form.combineType = type
    state.form.page.pageNo = 1
    hooks.getGoodsNum(1)
    hooks.getCategoryEvent()
    hooks.getRemarkTypes()
    hooks.searchEvent()
  }

  // 切换排序
  let sortTypeEvent = () => {
    state.form.sortType == 'desc' ? state.form.sortType = 'asc' : state.form.sortType = 'desc'
    state.form.page.pageNo = 1
    hooks.searchEvent()
  }

  // 备注
  let remarkEvent = (url) => {
    if (!imposeEvent()) return false;
    state.url = url
    state.ifShow = true
  }

  // 设置权限
  let setPermission = (url) => {
    if (!imposeEvent()) return false
    state.url = url
    state.ifShow = true
  }

  // 刊登
  let publishEvent = () => {
    if (!imposeEvent()) return false;
    ElMessageBox.confirm('确认将勾选的商品加入刊登？', '提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(() => {
        addPublish({ goodsIds: state.selections }).then(res => {
          if (res.code == 200) {
            ElMessage({ type: 'success', message: '操作成功!' })
          } else {
            ElMessage.error(res.message)
          }
        })
      })
  }

  // 合并商品
  let goodsMerge = (url) => {
    if (state.selections.length == 0) {
      ElMessage.error('请选择商品!')
      return false;
    }
    // if (state.selections.length > state.goodsCommons.length) {
    //   ElMessage.error('订制品暂不支持合并商品!')
    //   return false;
    // }
    if (state.goodsCommons.length < 2) {
      ElMessage.error('至少选择2个普通商品!')
      return false;
    }
    if (state.goodsCommons.length > 5) {
      ElMessage.error('最多5个商品同时合并!')
      return false;
    }
    if (!state.categorySame) {
      ElMessage.error('商品品类不同不能合并商品!')
      return false;
    }
    // 商品中又已报价申请新规格的商品不能被合并
    const arr = []
    state.selectRows.map(row => {
      if (row.offerStatus !== 0 && row.status === 6) {
        arr.push(row.id)
      }
    })
    if (arr.length > 0) {
      const str = arr.join('、')
      ElMessage.error({ message: `商品编码：${str}为已报价中申请新规格商品，不能被合并！` })
      return false;
    }
    state.url = url
    state.ifShow = true
  }

  // 批量修改标签
  let batchChangeAddLabel = (url) => {
    if (!imposeEvent()) return false;
    state.url = url
    state.ifShow = true
  }

  // 批量移入搁置
  let batchChangeLayAside = (url) => {
    if (!imposeEvent()) return false;
    state.url = url
    state.ifShow = true
  }

  // 批量修改货源渠道
  let batchChangeGoodsSource = (url) => {
    if (!imposeEvent()) return false;
    state.url = url
    state.ifShow = true
  }

  // 批量修改报关信息
  let batchCustomsInfo = () => {
    console.log(1)
    if (!imposeEvent()) return false;
    if (state.selections.length > 20) { // 筛选前20个
      state.selections = state.selections.slice(0, 20)
    }
    let goodsId = state.selections.join(',')
    router.push({
      path: '/goods/goodsManagement/setPrice/batchCustomsInfos',
      query: {
        goodsId
      }
    })
  }

  // 批量修改维护人
  let batchChangeMaintainman = (url) => {
    if (!imposeEvent()) return false;
    state.url = url
    state.ifShow = true
  }

  // 强制同步商品信息
  let syncGoodsInfo = (url) => {
    if (!imposeEvent()) return false;
    state.url = url
    state.ifShow = true
  }

  // 批量更新SKU
  let UpdateSku = (url) => {
    if (!imposeEvent()) return false;
    state.url = url
    state.ifShow = true
  }

  // 批量修改商品品类
  let batchChangeCategory = (url) => {
    if (!imposeEvent()) return false;
    state.url = url
    state.ifShow = true
  }

  // 关闭弹框回调
  let closeEvent = (status) => { // status为true时，刷新列表
    state.ifShow = false
    state.url = ''
    if (status) {
      hooks.getGoodsNum(1)
      hooks.searchEvent()
    }
  }

  // 进入详情
  let openDetail = (row,tableData) => {
		sessionStorage.setItem('goodsLIstStr',JSON.stringify(tableData.filter((v,i)=>i%2===0)))
    router.push({
      path: '/goods/goodsManagement/setPrice/detail',
      query: {
        id: row.id,
        operateStatus: row.operateStatus,
        combineType: row.combineType,
        combination: row.combination
      }
    })
  }

  // 新增组合品
  let addGroupgoods = (url) => {
    if (!imposeEvent()) return false;
    if (state.selectRows.length > 5) {
      ElMessage.error({ message: '暂时最多支持5个商品组合' })
      return false;
    }
    let bole = true
    state.selectRows.some(item => {
      if (item.enableCustom == 1) {
        ElMessage.error({ message: '定制商品不支持组合商品' })
        bole = false
        return true;
      }
      if (item.operateStatus == 1) {
        ElMessage.error({ message: `商品${item.id}【更改品类】申请报价中，不可被组合!` })
        bole = false
        return true;
      }
    })
    if (!bole) return false;
    state.url = url
    state.ifShow = true
    // localStorage.setItem('selectRows', JSON.stringify(state.selectRows))
    // router.push({
    //   name: 'AddGroupgoods',
    //   params: {
    //     goodsInfo: JSON.stringify(state.selectRows)
    //   }
    // })
  }

  // 打开spu列表
  let openSpuDetail = (url, spuId) => {
    state.spuId = spuId
    state.url = url
    state.ifShow = true
  }

  // 导出商品
  let exportGoodsEvent = () => {
    if (!imposeEvent()) return false;
    exportGoods({ goodsIds: state.selections }).then(res => {
      if (res.code == 200) {
        window.open(res.data)
        ElMessage({ type: 'success', message: '操作成功!' })
      } else {
        ElMessage.error(res.message)
      }
    })
  }

  // 查询备注列表
  let showEvent = (goodsId, typeId) => {
    state.remarkDetail = []
    let params = {
      goodsId,
      typeId
    }
    remarkDetail(params).then(res => {
      if (res.code == 200) {
        state.remarkList = res.data
      } else {
        ElMessage.error(res.message)
      }
    }).catch(err => {
      ElMessage.error(err.message)
    })
  }

  let exportXlsx = () => { // 导出xlsx
    // if (!imposeEvent()) return false;
    state.url = 'exportGoods'
    state.ifShow = true
  }

  let importOrExoprt = (command)=>{
    let list = command.split('/')
    if(list[0] == 'importCustomsInformation') return importCustomsInformation(list[1]) // 导入
    if(list[0] == 'exportCustomsInformation') return exportCustomsInformation() // 导出
  }

  let importCustomsInformation = (url)=>{ // 导入报关信息
    state.url = url
    state.ifShow = true
  }

  let exportCustomsInformation = ()=>{ // 导出报关信息
    if(!imposeEvent()) return false
    state.uuid = getuuid()
    exportCustomsInfo({
      goodsIdList:state.selections,
      uuid:state.uuid
    }).then(res=>{
      state.url = 'progressDialog'
      state.ifShow = true
    })
  }
  return {
    sortTypeEvent,
    remarkEvent,
    setPermission,
    publishEvent,
    goodsMerge,
    batchChangeAddLabel,
    batchChangeLayAside,
    batchCustomsInfo,
    batchChangeGoodsSource,
    batchChangeMaintainman,
    syncGoodsInfo,
    UpdateSku,
    closeEvent,
    openDetail,
    tabSelectEvent,
    batchChangeCategory,
    openSpuDetail,
    exportGoodsEvent,
    showEvent,
    addGroupgoods,
    exportXlsx,
    importCustomsInformation,
    exportCustomsInformation,
    importOrExoprt
  }
}
