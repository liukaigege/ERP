<!--
 * @Descripttion: 导入发货
 * @version:
 * @Author: 朱涛
 * @Date: 2021-07-15 17:01:59
 * @LastEditors: 朱涛
 * @LastEditTime: 2021-08-22 10:58:26
-->

<template>
  <div class="importOrder">
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      :width="width"
      @close="close"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div v-if="!runType">
        <UploadFile
          ref="updFile"
          @success="getFileList"
          :data="fileList"
          :moduleName="'directDelivery'"
					:notAcceptedType="['xls','xlsx','csv','vnd.openxmlformats-officedocument.spreadsheetml.sheet']"
          @remove="successMsg = ''"
        >
          <template v-slot:download>
            <!-- <el-button
              type="text"
              style="margin-left: 20px"
              @click="downloadFile(templatePath)"
              >下载模板</el-button
            > -->
          </template>
        </UploadFile>

        <p>{{ successMsg }}</p>

        <div class="info">
          <p class="infoTitle"><i class="el-icon-warning-outline"></i> 功能说明</p>

          <p class="text">支持shopify标准商品及Vshop商品表格格式</p>
          <p class="text red">注:</p>

          <p class="text red">
            由于商品图片较大，上传较慢，上传完成后图片不会立即加载出来，请耐心等待。
            导入其他平台导出的CSV格式表格时，请使用微软的Excel软件编辑保存后再上传。
          </p>
        </div>
      </div>
      <p v-if="!runType">{{ msg }}</p>


      <div v-if="runType">
           <div class="progress">
              <el-progress :percentage="percentage" :format="format"></el-progress>
             </div>
             <p>正在导入,请耐心等待,如长时间进度无反应,请与研发部联系</p>
      </div>


      <template #footer  v-if="!runType">
        <span class="dialog-footer">
          <el-button  @click="cancel">取 消</el-button>
          <el-button
            type="primary"

            @click="dialogHandOk"

            :disabled="isDisabled"
            >确 定</el-button
          >

        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import UploadFile from "@/components/uploadFile/index.vue";
import { reactive, toRefs, getCurrentInstance, inject, ref, onMounted,watch } from "vue";
import { upload, importGoods } from "@/api/goods/addGoods.js";
import { progressInfo } from "@/api/basic.js";
export default {
  components: { UploadFile },
  props: {
    dialog: {
      type: Object,
      default: null,
    },
    dialogTitle: {
      type: String,
      default: "提示",
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

    let updFile = ref(null);
    const data = reactive({
      fileList: [],
      activeType: "1",
      successMsg: "",
      runType: false,
      isError: false,
      msg: "",
      uuid: "",
      timer: null,
      errorFile: "",
      percentage: 0,
      isDisabled: false,
      templatePath:
        "http://vango-erp-prod.oss-cn-beijing.aliyuncs.com/template/import_deliver_template.xlsx",
    });

    const dialogHandOk = () => {
      if (!data.uuid) {
        proxy.$message.error("请上传文件");
        return;
      }

      progress(data.uuid);
      const param = {
        uuid: data.uuid,
      };
       data.runType = true;
      importGoods(param)
        .then((res) => {
          if (res.code == 200) {
            console.log(res.data);
            // const a = JSON.parse(res.data);
            data.percentage = 100;

           clearInterval(data.timer);
              setTimeout(() => {
                cancel();
              }, 1000);
          }
        })
        .catch((err) => {

          clearInterval(data.timer);
        });
    };


    const close = () => {
      cancel()
    };
    const cancel = () => {
      context.emit('cancel',true)
       data.fileList = [];
      data.successMsg = "";
      data.uuid = "";
      data.activeType = "1";
    };

    const getFileList = (val) => {
      data.fileList = [val];
      data.successMsg = "";
      data.uuid = "";
      const { fileUrl } = val;
      upload({ ids:fileUrl })
        .then((res) => {
          if (res.code == 200) {
            const { uuid,msg } = res.data;
            data.successMsg = msg
            data.uuid = uuid;
          }
        })
        .catch((err) => {
          console.log(err)
          data.fileList = [];
          updFile.value.upd.clearFiles()

        });
    };

    const changeActive = (tab, event) => {
      console.log(event);
    };

    const progress = (uuid) => {
      data.timer = setInterval(() => {
        progressInfo(uuid).then((res) => {
          const response = res.data;
          if (typeof response !== "String") {
            data.percentage = response.percent;
          }
        });
      }, 1000);
    };

    const again = () => {
      data.isError = false;
      data.errorFile = "";
      data.runType = false;
      data.fileList = [];
      data.successMsg = "";
      data.isDisabled = false;
    };
    const format = (percentage) => (percentage === 100 ? "完成" : `${percentage}%`);

    watch(()=>data.percentage,(a)=>{
      console.log(a)
    })


    onMounted(() => {
    });

    return {
      ...toRefs(data),
      dialogHandOk,
      cancel,
      close,
      getFileList,
      changeActive,
      again,
      updFile,
      format,
    };
  },
};
</script>

<style lang="scss" scoped>
.importOrder {
  :deep(.el-tabs__item) {
    font-size: 16px;
  }
  :deep(.el-dialog__body) {
    padding-top: 10px;
  }
  .infoTitle {
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #606266;
    margin: 20px 0 5px 0;
  }
  .text {
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.65);
    margin-bottom: 5px;
  }
  .red {
    color: #ff3b30;
  }
  .index {
    text-indent: 23px;
  }
  .error {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .success {
      color: #1890ff;
    }
    .error {
      color: #ff3b30;
    }
  }
}
</style>
