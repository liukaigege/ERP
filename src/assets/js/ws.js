import { ElNotification } from 'element-plus'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { computed } from 'vue'
// 获取配置
let config = import.meta.env.VITE_MQTT_CONFIG
config = config.split(',')
let url = config[0]
let connectHeaders = {
  login: config[1],
  passcode: config[2],
  host: config[3],
}
let client = null
let arr = []
export default function() {
  let router = useRouter()
  let store = useStore()
  let MESSAGE_QUEUE = computed(() => `MESSAGE_QUEUE_${store.getters.userInfo.userId}`)
  client = Stomp.client(url) // Stomp  实例  依赖在index.html中
  // 初始化客户端
  client.connect(connectHeaders, () => {  // 连接
    //   client.send("/queue/MESSAGE_QUEUE_138", { priority: 19 }, "Hello, 王蓉");
    client.subscribe(MESSAGE_QUEUE.value, (e) => {
      ElNotification({
        title: '消息通知',
        dangerouslyUseHTMLString: true,
        message: `<div style="cursor: pointer;margin-top: 15px" class ="click-message">${e.body}</div>`,
        type: 'warning',
        onClick: (e) => {
          if (e.target.className == "click-message") {
            router.push({
              name: 'goodsNews'
            })
          }
        }
      })
      // 更新消息数字
      store.dispatch('menu/getMsgNum')
    });
  }, () => {
    // 断开提示
    // ElNotification({
    //   title: '提示',
    //   duration: 0,
    //   message: '你已断开链接，将无法接收报价申请，搁置还原等消息，请刷新网页',
    //   type: 'warning',
    // })
  });
}
// 监听是否在当前页，并置为已读
//document.addEventListener("visibilitychange", notification);
function notification() {
  if (!document.hidden) {   //处于当前页面
    // do something
    console.log(1121);

  }
}
export function closeMq(params) {
  client.disconnect()
  client = null
}