import { nextTick, ref } from 'vue'


let num = 100 
export let startIndex = ref(0)
export let endIndex = ref(20)

export function setData(length) {
    let scrollTop = document.documentElement.scrollTop
    let offsetHeight = document.documentElement.offsetHeight
    let scrollHeight = document.documentElement.scrollHeight
    //  向下滚动
    if (scrollTop + offsetHeight > scrollHeight - 100) {
        if (endIndex.value >= length) return
        endIndex.value += 10
        if (endIndex.value > num) {
            nextTick(() => {
                document.documentElement.scrollTop = scrollTop - calcScrollTop(1)
            })
            startIndex.value = endIndex.value - num
        } else {
            startIndex.value = 0
        }
    }
    // 向上滚动
    if (scrollTop < 100 && startIndex.value > 0) {
        endIndex.value -= 10
        startIndex.value -= 10
        nextTick(() => {
            document.documentElement.scrollTop = scrollTop + calcScrollTop(0)
        })
    }
}
export function initVirtual() {
    startIndex.value = 0
    endIndex.value = 20
    document.documentElement.scrollTop = 0
}
/**
 * 计算10个数据渲染高度
 * @param {*} flag 0: 向上，1：向下
 */

function calcScrollTop(flag) {
    let tbHead = document.querySelectorAll('.tbHead')
    let list = document.querySelectorAll('.list')
    let h1, h2
    if (flag) {
        h1 = calcH([...tbHead].slice(-10))
        h2 = calcH([...list].slice(-10))

    } else {
        h1 = calcH([...tbHead].slice(0, 10))
        h2 = calcH([...list].slice(0, 10))
    }
    console.log(h1+h2);
    return h1 + h2
}
function calcH(doms) {
    return doms.map(dom => dom.offsetHeight).reduce((total, h) => total + h)
}