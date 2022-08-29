import { nextTick, ref } from 'vue'


let num = 100 
export let startIndex = ref(0)
export let endIndex = ref(20)

export function setData(length) {
   
    let scrollTop = document.documentElement.scrollTop // 滚动的高度
    let offsetHeight = document.documentElement.offsetHeight // 可视区域高度
    let scrollHeight = document.documentElement.scrollHeight // 全文高度
    //  向下滚动
    if (scrollTop + offsetHeight > scrollHeight - 100) {
        if (endIndex.value >= length) return
        endIndex.value += 10
        if (endIndex.value > num) {
            nextTick(() => {
                document.documentElement.scrollTop = scrollTop - calcScrollTop(1,10)
            })
            startIndex.value = endIndex.value - num
        } else {
            startIndex.value = 0
        }
    }
    // 向上滚动
    if (scrollTop < 100 && startIndex.value > 0) {
        let n
        if( startIndex.value > 50) {
            startIndex.value -= 50
            endIndex.value -= 50
            n= 50
        }else {
            n = startIndex.value
            endIndex.value = endIndex.value - startIndex.value
            startIndex.value = 0
        }
        nextTick(() => {
            document.documentElement.scrollTop = scrollTop + calcScrollTop(0,n)
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

function calcScrollTop(flag,num) {
    let tbHead = document.querySelectorAll('.tbHead')
    let list = document.querySelectorAll('.list')
    let h1, h2
    if (flag) {
        h1 = calcH([...tbHead].slice(-num))
        h2 = calcH([...list].slice(-num))

    } else {
        h1 = calcH([...tbHead].slice(0, num))
        h2 = calcH([...list].slice(0, num))
    }
    console.log(h1+h2);
    return h1 + h2
}
function calcH(doms) {
    return doms.map(dom => dom.offsetHeight).reduce((total, h) => total + h)
}