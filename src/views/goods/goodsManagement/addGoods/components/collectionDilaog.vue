<template>
  <div>
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      :width="width"
      @close="close"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div class="content">
        <p v-if="dialog.successCount">采集成功{{ dialog.successCount }}条</p>
        <p v-if="dialog.errorCount">采集失败{{ dialog.errorCount }}条</p>
        <div class="reason" v-html="resData(dialog)"></div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button  @click="cancel">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, toRefs, getCurrentInstance, onMounted, nextTick } from "vue";
export default {
  props: {
    dialog: {
      type: Object,
      default: null,
    },
    dialogTitle: {
      type: String,
      default: "采集结果",
    },
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    width: {
      type: String,
      default: "30%",
    },
  },
  setup(props, context) {
    const { proxy } = getCurrentInstance();
    const data = reactive({});

    const dialogHandOk = () => {};

    const close = () => {
      proxy.$parent.dialogVisible = false;
    };
    const cancel = () => {
      proxy.$parent.dialogVisible = false;
    };

    function resData(val) {
      const { errorMsg, successMsg } = val;
      let text = "";
      successMsg?.forEach((item) => {
        let x = `<p><a href="${item.link}" target="_blank"> ${item.link}</a> (${item.reason})</p>`;
        text += x;
      });
      errorMsg?.forEach((item) => {
        let x 
        if(item.reason =='无效链接'){
           x = `<p>${item.link}(${item.reason})</p>`
        }else{
           x = `<p><a href="${item.link}" target="_blank"> ${item.link}</a> (${item.reason})</p>`;
        }
        
        text += x;
      });
      return text;
    }

    onMounted(() => {
      console.log(props);
    });

    return {
      ...toRefs(data),
      dialogHandOk,
      cancel,
      close,
      resData,
    };
  },
};
</script>

<style lang="scss" scoped>
.reason {
  margin-top: 10px;
}
</style>
