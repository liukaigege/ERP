import { ElMessage } from 'element-plus'
import { remarkDetail } from '@/api/goods/quotedPrice'
export default function(state, hooks, router) {
  let imposeEvent = () => {
    if (state.selections.length == 0) {
      ElMessage.error('请选择商品!')
      return false;
    } else {
      return true
    }
  }
  // 排序
  let sortEvent = type => {
    if (state.form.sortName !== type) {
      state.form.sortType = 'desc'
      state.form.sortName = type
    } else {
      state.form.sortType == 'desc'
        ? (state.form.sortType = 'asc')
        : (state.form.sortType = 'desc')
    }
    state.form.page.pageNo = 1
    hooks.searchEvent()
  }

  // 编辑
  let opneDetail = (id) => {
    router.push({
      path: '/goods/goodsManagement/layAside/detail',
      query: {
        id
      }
    })
  }

  // 移出搁置
  let batchChangeLayAside = (url) => {
    if (!imposeEvent()) return false;
    state.url = url
    state.ifShow = true
  }

  // 关闭弹框回调
  let closeEvent = (value) => {
    console.log(value)
    state.ifShow = false
    state.url = ''
    if (value) hooks.searchEvent()
  }

  let openSpuDetail = (url, spuId) => {
    state.spuId = spuId
    state.url = url
    state.ifShow = true
  }

  let openRemark = (url, value) => {
    state.layAsidecause = value
    state.url = url
    state.ifShow = true
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
    })
  }
  return {
    sortEvent,
    opneDetail,
    batchChangeLayAside,
    closeEvent,
    openSpuDetail,
    openRemark,
    showEvent
  }
}