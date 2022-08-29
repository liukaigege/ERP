/*
 * @Descripttion: Vango ERP
 * @version: 1.0
 * @Author: 朱涛（梅溪）
 * @Date: 2021-06-29 14:19:42
 * @LastEditors: 朱涛（梅溪）
 * @LastEditTime: 2021-06-30 15:38:41
 */ //封装本地storage缓存文件

const storage = {
    set: (key, value) => {
        localStorage.setItem(key, JSON.stringify(value))
    },

    get: key => {
        const value = localStorage.getItem(key)
        if (value && value != 'undefined' && value != 'null') {
            return JSON.parse(value)
        }
        return null
    },
    remove: key => {
        localStorage.removeItem(key)
    },
    clear: () => {
        localStorage.clear()
    }
}

const sessionStorage = {
    set: (key, value) => {
        window.sessionStorage.setItem(key, JSON.stringify(value))
    },

    get: key => {
        const value = window.sessionStorage.getItem(key)
        if (value && value != 'undefined' && value != 'null') {
            return JSON.parse(value)
        }
        return null
    },

    remove: key => {
        window.sessionStorage.removeItem(key)
    },
    clear: () => {
        sessionStorage.clear()
    }
}

export { storage, sessionStorage }
