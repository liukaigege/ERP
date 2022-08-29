import {
  ArrowLeft, ArrowRight, ArrowUp, ArrowDown, CaretTop, CaretBottom, Upload, Delete, Plus, QuestionFilled, Check,
  Edit,Lock,Warning,Search,Refresh,Close,Sort,Link,ZoomIn,InfoFilled,SuccessFilled,Right,Bell,User,Download,Document,
} from '@element-plus/icons-vue'

export default {
  install(app) {
    let icons = {
      ArrowLeft, ArrowRight, ArrowUp, ArrowDown, CaretTop, CaretBottom, Upload, Delete, Plus, QuestionFilled, Check,
      Edit,Lock,Warning,Search,Refresh,Close,Sort,Link,ZoomIn,SuccessFilled,Right,Bell,User,Download,Document,InfoFilled
    }
    Reflect.ownKeys(icons).forEach(key => {
      app.component('elIcon'+ key, icons[key])
    })
    app.component('el-icon-info', InfoFilled)
  }
}

