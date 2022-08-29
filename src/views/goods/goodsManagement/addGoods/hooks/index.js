
import { getCurrentInstance } from 'vue'
export default function(data) {
    const { proxy } = getCurrentInstance()

    const changeDate = date => {
            if (date) {
                data.form.start = date[0] + ' 00:00:00'
                data.form.end = date[1] + ' 23:59:59'
            } else {
                data.form.start = data.form.end = null
            }
        } // 选择下单时间

        function confirm (text, callback) {
            proxy.$confirm(text, '提示', {
                closeOnClickModal : false,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(res => {
                    callback()
                })
                .catch(err => { })
        } //封装的提示弹窗

    return {
        changeDate,
        confirm
    }

}
