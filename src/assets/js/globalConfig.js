function errorHandler(error, vm, info) {
    console.error('抛出全局异常')
    console.error('报错vm:', vm)
    console.error('报错error:', error)
    console.error('报错info:', info)
} //全局报错捕捉
function warnHandler(msg, vm, trace) {
    if (msg && msg.indexOf('non-props') == -1) {
      console.warn('抛出全局警告')
      console.warn('警告vm:', vm)
      console.warn('警告msg:', msg)
      console.warn('警告trace:', trace)
    }
}

const config = {
    install: function (app) {
        // 全局error 处理
        app.config.errorHandler = (err, vm, info) => errorHandler(err, vm, info)
        // 全局warn 处理
        app.config.warnHandler = (msg, vm, trace) => warnHandler(msg, vm, trace)
        // 设置全局的globalProperties 配置
        app.config.performance = true
    }
}
export default config