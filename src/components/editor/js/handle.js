import $ from 'jquery'
import { ElMessage } from 'element-plus';
let initEditorInfo = (url) => { // 本地调试：let url = '/src/components/editor/js/demo.html'
  return new Promise(reslove => {
    let index = url.indexOf('.com')
    url.substring(index + 5)
    // let url = '/src/components/editor/js/demo.html'
    $('#editor').load(url, '', (response, status, xhr) => {
      let text = $('#editor').html()
      if (status !== 'error') {
        reslove(text)
      } else {
        ElMessage.error('文本解析错误！')
        reslove('')
      }
    })
  })
}
export default initEditorInfo