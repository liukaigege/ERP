import path from 'path'
export default function loadPlugin() {
    const nameList = ['hooks', 'tool', 'ruleOptions', 'storage']
    return {
        name: 'load-plugin', 
        resolveId(id) {
            if (nameList.includes(id)) {
                return path.resolve(__dirname, './src/utils', id + '.js')
            }
            return null
        },

    }
}