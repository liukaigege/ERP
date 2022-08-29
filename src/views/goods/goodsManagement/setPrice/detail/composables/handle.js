import { ElMessageBox, ElMessage } from 'element-plus'
import { goodsDetail } from '@/api/goods/quotedPrice.js'
export default function (state, componentRef_01, componentRef_02, componentRef_03, componentRef_04, router, route) {
  let handleClick = (tab) => {
    switch (tab.index) {
      case '0': // 商品信息
        state.viewModal = 'GoodsDescription'
        state.isEdit = state.isEditGoodsInfo
        break
      case '1': // 采购信息
        state.viewModal = 'PurchaseInfo'
        state.isEdit = state.isEditPurchase
        break
      case '2': // 物流信息
        state.viewModal = 'Logistics'
        state.isEdit = state.isEditLogistics
        break
      case '3': // 备注信息
        state.viewModal = 'RemarkMessage'
        state.isEdit = false
        break
      case '4': // 日志
        state.viewModal = 'LogsList'
        break
    }
  }

  // 通知备注组件，需要init数据
  let addRemarkFn = () => {
    state.addRemarkShow = false
    componentRef_04.value.getRemarkList()
  }


  // 保存
  let saveEvent = () => {
    switch (state.tabIndex) {
      case '0':
        componentRef_01.value.save().then(res => {
          state.changeGoodsInfo = false
          state.isEditGoodsInfo = false
          state.isEdit = false
        })
        break;
      case '1':
        componentRef_02.value.submit(2).then(res => {
          state.changePurchase = false
          state.isEditPurchase = false
          state.isEdit = false
        })
        break;
      case '2':
        componentRef_03.value.save(2).then(res => {
          state.changeLogistics = false
          state.isEditLogistics = false
          state.isEdit = false
        })
        break;
    }
  }

  // 获取operateStatus
  function getOperateStatus() {
    return new Promise((resolve, reject) => {
      goodsDetail({ goodsId: state.goodsId }).then(r => {
        state.operateStatus = r.data.operateStatus
        resolve()
      })
    })
  }

  // 打开关联商品系数弹窗
  function openFullRelationDialog() {
    if (Number.isNaN(state.operateStatus)) {
      getOperateStatus().then(() => {
        handle()
      })
    } else {
      handle()
    }
    function handle() {
      if (state.operateStatus !== 0) {
        const strArr = ['更改品类申请', '已有新规格在申请', '有规格在申请开启', '采购信息变更申请物流']
        let message = `商品${strArr[state.operateStatus - 1]}报价中，不可执行此操作!`
        ElMessage.error({ message })
        return false
      }
      componentRef_02.value.openFullRelationDialog()
    }
  }

  // 按钮的事件
  let btnEvent = () => {
    if (Number.isNaN(state.operateStatus)) {
      getOperateStatus().then(() => {
        handle()
      })
    } else {
      handle()
    }
    function handle() {
      if (state.tabIndex === '1' || state.tabIndex === '2') {
        // 操作状态： 0: 正常 1: 更改品类 2：申请新规格 3：开启并申请报价 4.采购信息变更申请物流报价 5.更换类型
        console.log(state.operateStatus);
        if (state.operateStatus !== 0) {
          const strArr = ['更改品类申请', '已有新规格在申请', '有规格在申请开启', '采购信息变更申请物流','更改类型']
          let message = `商品${strArr[state.operateStatus - 1]}报价中，不可执行此操作!`
          ElMessage.error({ message })
          return false
        }
      }
      switch (state.tabIndex) {
        case '0':
          state.isEditGoodsInfo = true
          state.isEdit = true
          break;
        case '1':
          state.isEditPurchase = true
          state.isEdit = true
          break;
        case '2':
          state.isEditLogistics = true
          state.isEdit = true
          break;
        case '3':
          state.addRemarkShow = true
          break;
      }
    }
  }

  // 取消编辑
  let cancelEvent = () => {
    switch (state.tabIndex) {
      case '0':
        state.isEditGoodsInfo = false
        state.isEdit = false
        componentRef_01.value.initData()
        break;
      case '1':
        state.isEditPurchase = false
        state.isEdit = false
        componentRef_02.value.initData()
        break;
      case '2':
        state.isEditLogistics = false
        state.isEdit = false
        componentRef_03.value.initData()
        break;
    }

  }

  // 返回事件
  let goBack = () => {
    if (route.name == 'QuotationCombine') {
      router.push({
        name: 'Quotation'
      })
      return false;
    }
    console.log(state.changeGoodsInfo, state.changePurchase, state.changeLogistics, '是否已编辑')
    let { changeGoodsInfo, changePurchase, changeLogistics, isEditGoodsInfo, isEditPurchase, isEditLogistics } = state
    if (changeGoodsInfo && isEditGoodsInfo || changePurchase && isEditPurchase || changeLogistics && isEditLogistics) {
      ElMessageBox.confirm('当前改动未保存，是否返回商品列表？', '提示', {
        confirmButtonText: '保存并退出',
        cancelButtonText: '退出',
        type: 'warning',
        distinguishCancelAndClose: true
      })
        .then(() => { // 保存并退出
          let saveArr = []
          if (changeGoodsInfo) saveArr.push(componentRef_01.value.save())
          if (changePurchase) saveArr.push(componentRef_02.value.submit(2))
          if (changeLogistics) saveArr.push(componentRef_03.value.save(2))
          Promise.all([...saveArr]).then(res => {
            router.push({
              name: 'SetPrice',
              params: {
                goodsId: route.query.id
              }
            })
          }).catch((err) => {
            console.log(err)
          })
        }).catch((e) => { // 直接退出
          if (e == 'cancel') {
            router.push({
              name: 'SetPrice',
              params: {
                goodsId: route.query.id
              }
            })
          }
        })
    } else { // 未修改直接退出
      router.push({
        name: 'SetPrice',
        params: {
          goodsId: route.query.id
        }
      })
    }
  }
  let isChange = () => {
    console.log('change')
    switch (state.tabIndex) {
      case '0':
        state.changeGoodsInfo = true
        break;
      case '1':
        state.changePurchase = true
        break;
      case '2':
        state.changeLogistics = true
        break;
    }
  }
  return {
    handleClick,
    addRemarkFn,
    saveEvent,
    btnEvent,
    cancelEvent,
    goBack,
    isChange,
    openFullRelationDialog
  }
}
