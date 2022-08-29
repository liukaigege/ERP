import globalDirectives from "./erpGlobalDirective"

const directives = {
    install: function(app) {
        Object.keys(globalDirectives).forEach(key => {
            app.directive(key,globalDirectives[key])
        })
    }
}

export default directives