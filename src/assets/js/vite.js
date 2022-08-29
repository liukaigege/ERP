/*
 * @Descripttion: Vango ERP
 * @version: 1.0
 * @Author: 朱涛（梅溪）
 * @Date: 2021-06-03 11:33:45
 * @LastEditors: 朱涛（梅溪）
 * @LastEditTime: 2021-07-25 21:46:14
 */
import dotenv from 'dotenv'

export function loadEnv() {
    const env = process.env.VITE_PROJECT_ENV
    const result = {}
    const envList = [`.env.${env}.local`, `.env.${env}`, '.env.local', '.env', ]
    envList.forEach(e => {
        dotenv.config({
            path: e
        })
    })
    for (const envName of Object.keys(process.env)) {
        let realName = process.env[envName].replace(/\\n/g, '\n')
        realName =
            realName === 'true' ? true : realName === 'false' ? false : realName
        if (envName === 'VITE_PORT') {
            realName = Number(realName)
        }
        if (envName === 'VITE_PROXY') {
            try {
                realName = JSON.parse(realName)
            } catch (error) {
                console.log(error)
            }
        }
        result[envName] = realName
        process.env[envName] = realName
    }
    return result
}

export function createProxy(list) {
    const result = {}
    for (const [prefix, target] of list) {
        result[prefix] = {
            target,
            changeOrigin: true,
            rewrite: path => path.replace(new RegExp(`^${prefix}`), '')
        }
    }
    console.log(result)
    return result
}
// 创建代理