import common from './common'
// 设置共用的混入
const mixins = {
    install: function(app) {
        app.mixin(common)
    }
}


export default mixins