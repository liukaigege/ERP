const styleCss = 'width:850px;'
const tipsData = {
    placeholder: '请输入参考/采集产品链接',
    errorMessage: '请输入正确的链接'
}

const tips = {
  titleTips:'请输入产品标题',
  suggestPriceTips:'请输入建议售价',
  costPriceTips:'请输入成本价',
}

const radioList = [
    {
      title: '图文描述',
      components: 1,
      dataTitle:'ptInfo'
    },
    {
      title: '产品图片',
      components: 2, //test vue file
      dataTitle:'goodsImages'
    },
    {
      title: '产品视频',
      components: 3, //test vue file
      dataTitle:'videoInfo'
    },
    {
      title: '属性图片',
      components: 4, //test vue file
      dataTitle:'attrImages'
    },
    {
      title: '实物图片',
      components: 5, //test vue file
      dataTitle:'trueImages'
    }
  ]
const showSTyle = [{
  id:1,
  label:'下拉'
},{
  id:2,
  label:'展开'
}]
const customTypeList = [{
  id:1,
  label:'规格选项'
},{
  id:2,
  label:'文字输入'
},{
  id:3,
  label:'图片上传'
}]

const baseInfoRule = {
  titleName: {
    required: true,
    message: tips.titleTips,
    trigger: ['blur', 'change']
  },
  suggestPrice:
    {
      required: true,
      message: tips.suggestPriceTips,
      trigger: 'blur'
    },
  costPrice:
    {
      required: true,
      message: tips.costPriceTips,
      trigger: 'blur'
    }
}

const statusTipsData = [
  '更改品类申请',
  '已有新规格在申请',
  '有规格在申请开启！',
  '采购信息变更申请物流',
	'更改类型申请'
]
export {
    styleCss,
    tipsData,
    radioList,
    tips,
    showSTyle,
    customTypeList,
    baseInfoRule,
    statusTipsData
}
