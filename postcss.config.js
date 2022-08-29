/*
 * @Descripttion: Vango ERP
 * @version: 1.0
 * @Author: 朱涛（梅溪）
 * @Date: 2021-07-14 23:38:49
 * @LastEditors: 韦剑
 * @LastEditTime: 2021-07-28 14:14:01
 */

module.exports = {
    plugins: {
        autoprefixer: {
            overrideBrowserslist: [
                "Chrome > 31",
                "ff > 31",
                "ie >= 8",
                "last 10 versions", // 所有主流浏览器最近10版本用
            ],
            grid: true,
        },
        // 'postcss-pxtorem': {
        //     rootValue: 192,
        //     propList: ['*'],
        //     // unitPrecision: 5
        // }
    }
}