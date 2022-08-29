import request from '@/api/request.js'
function comparisonSku(newSkus, oldSkus) {
    let arr = [];
    newSkus?.forEach((a) => {
      let x = oldSkus?.find((v) => {
       return v.frontId == a.frontId
      });
      if (x && oldSkus?.length > 0) {
        arr.push(x);
      } else {
        a.isAdd = 1 // 是否是新规格
        arr.push(a);
      }
    });
    return arr;
  } // 生成sku时比较新旧sku 保留未修改的旧数据
  function createSku(arr) {
    let newA = [];
    arr.map((item) => {
      let obj = {
        frontId: createSKUId(item),
        sku: null, //商品sku编码
        url: null, //图片链接
        expectPrice: null, // 期望售价
        costPrice: null, //成本价
        skuSwitch: 0, //是否可用
        puhSwitch: 1, //采购报价开关
        lgtSwitch: 1, // 物流报价开关
        codeVal: null, //错码尺码
        weight: null, //重量
        lwh: null, //长宽高 *隔开
        length: null, //长
        width: null, // 宽
        height: null, // 高
        speValues: item,
        isAdd :0,
      };
      newA.push(obj);
    });
    return newA;
    function createSKUId(x) {
      let id = 0;
      x.map((item) => {
        id += item.frontId;
      });
      return id;
    }
  } // 生成多规格sku

  function sortList(data){
    let prevList = [], lastList = [];
      // 处理排序，新增isAdd=1，排在前面
      data.skus.forEach(v => {
        if(v.isAdd){
          prevList.push(v) 
        }else{
          if(v.speValues.filter(item => item.isAdd == 1).length){
            v.isAdd = 1
            prevList.push(v) 
          }else{
            v.isAdd = 0
            lastList.push(v)
          }
        }
      })
      return {
        skus:[...prevList,...lastList],
        spes:data.spes
      }
  }

  function getGoodsInfo(data){
    return request({
      url: 'goods/v1/goods/info',
      method: 'post',
      data
  })
  }
  export {
    comparisonSku, createSku, sortList, getGoodsInfo
}