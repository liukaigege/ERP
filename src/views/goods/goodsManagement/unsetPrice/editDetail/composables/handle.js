import { goodsInfo } from '@/api/goods/quotedPrice.js'
import { ElMessage } from 'element-plus'
export default function(state) {
  let getGoodsDetailInfo = () => {
    goodsInfo({ goodsId: state.goodsId }).then(res => {
      if (res.code == 200) {
        state.form = res.data
      } else {
        ElMessage.error(res.message)
      }
    })
  }
  return {
    getGoodsDetailInfo
  }
}