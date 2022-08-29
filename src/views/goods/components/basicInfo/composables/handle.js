import { ElMessage } from 'element-plus';
import { deepClone } from '@/utils/tool.js'
import { baiduTranslate } from '@/utils/translate.js'
export default function(state, formRef, routeName, cascaderRef, ctx, myEditor, initEditorInfo) {
  let changeCategory = (value) => {
    let labelValue = cascaderRef.value.getCheckedNodes(true)[0] ? cascaderRef.value.getCheckedNodes(true)[0].label : null
    ctx.emit('changeCategory', labelValue)
  }

  let editCategory = () => {
    state.form.categoryId = state.categoryOldVal
  }

  let clickEvent = (index) => {
    if (index == 0) {
      state.form.referenceUrls.push('')
    } else {
      state.form.referenceUrls.splice(index, 1)
    }
  }

  let radioGroupChange = () => {
    if (state.tabPosition2 == 1) { // 中文
      myEditor.value.myContent = state.form.descriptionCn
    } else { // 英文
      myEditor.value.myContent = state.form.descriptionEn
    }
  }

  let translate = () => {
    let { nameEn, nameCn } = state.form
    let text = state.tabPosition == 0 ? nameEn : nameCn
    let form = state.tabPosition == 0 ? 'en' : 'zh'
    let to = state.tabPosition == 0 ? 'zh' : 'en'
    baiduTranslate(text, form, to).then(res => {
      if (state.tabPosition == 0) {
        state.form.nameCn = res.str
      } else {
        state.form.nameEn = res.str
      }
    })
  }

  // 富文本内容发生变化时的回调
  let editChange = (value) => {
    // console.log(value)
    if (state.tabPosition2) {
      state.form.descriptionCn = value
    } else {
      state.form.descriptionEn = value
    }

  }

  let cancelReturnVal = () => {
    return new Promise((reslove,reject)=>{
      reslove({
        info: deepClone(state.form),
        type: "basicInfo",
      })
    })
  } // 退出时给最新的数据

  let validStatusEvent = () => {
    let { nameEn, nameCn, referenceUrls, descriptionEn, descriptionCn } = state.form
    if (![0, 1].includes(state.form.mode) && routeName !== 'goodsPublishDeatil') {
      let arr = []
      referenceUrls.forEach((item, index) => {
        if (item !== '') arr.push(item)
      })
      if (arr.length == 0) {
        ElMessage.error('请填写参考商品链接！')
        return false;
      }
      state.form.referenceUrls = arr
    } else {
      state.form.referenceUrls = null
    }

		// 校验商品标题
		if (nameEn == '' && nameCn == '') {
			ElMessage.error('请填写商品标题！')
			return false;
		}

    // 中英文标题互补
    // if (nameEn !== '' && nameCn == '') state.form.nameCn = nameEn
    // if (nameEn == '' && nameCn !== '') state.form.nameEn = nameCn

    // 中英文标题不能输入http
    if (nameEn.indexOf('http') !== -1 || nameCn.indexOf('http') !== -1) {
      ElMessage.error('中英文标题不能包含 http ！')
      return false
    }

    // 中英文富文本互补
    if ((descriptionEn !== '' && descriptionEn !== null) && (descriptionCn == '' || descriptionCn == null)) state.form.descriptionCn = descriptionEn
    if ((descriptionEn == '' || descriptionEn == null) && (descriptionCn !== '' && descriptionCn !== null)) state.form.descriptionEn = descriptionCn

    let result
    formRef.value.validate((valid) => {
      if (valid) {
        result = state.form
      } else {
        ElMessage.error('信息填写错误，提交失败')
        result = false
      }
    })
    return result
  }
  return {
    clickEvent,
    editChange,
    validStatusEvent,
    changeCategory,
    radioGroupChange,
    cancelReturnVal,
    editCategory,
    translate
  }
}
