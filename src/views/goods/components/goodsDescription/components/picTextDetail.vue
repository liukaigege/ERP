<!--
 * @Descripttion: 'picTextDetail.vue 图文信息=>图文描述'
 * @version: 2.0
 * @Author: 王新国
 * @Date: 2021-09-06 00:00:00
 * @LastEditors: 王新国
 * @LastEditTime: 2021-09-06 00:00:00
-->
<template>
  <div class="picTextDetail">
    <el-form :model="form" label-width="80px">
      <el-form-item label="简短描述:">
        <el-input
          v-model="form.brief"
          
          :disabled="!isEdit"
          :style="styleCss"
        ></el-input>
      </el-form-item>
      <el-form-item label="图文描述:">
        <el-radio-group v-model="textStatus" @change="language" >
          <el-radio-button
            v-for="item in statusList"
            :key="item"
            :label="item"
          ></el-radio-button>
        </el-radio-group>
        <div class="editContainer">
          <Editor
            :content="textStatus == '英文' ? form.descriptionEn : form.descriptionCn"
            @editChange="editorBack"
            :readonly="!isEdit || combine == 1  || routeName== 'PurchaseQuote' || routeName == 'logisticsQuote'"
            ref="myEditor"
          />
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { reactive, toRefs, watch, ref, onMounted } from 'vue'
import Editor from '@/components/editor/index.vue'
import initEditorInfo from '@/components/editor/js/handle.js'
import { useRoute } from 'vue-router'
export default {
  components: {
    Editor
  },
  emits: ['change'],
  props: {
    modelValue: {
      type: Object,
      default: null
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  setup(props, context) {
    const styleCss = 'max-width:850px;'
    const route = useRoute()
    const routeName = route.name
    let { descriptionCn, descriptionEn, brief } = props.modelValue
    const combine = route.query.combine || null
    const statusList = ['英文', '中文']
    let myEditor = ref(null)
    
    let state = reactive({
      textStatus: '英文',
      form: {
        descriptionCn,
        descriptionEn,
        brief
      }
    })
    watch(state.form, () => context.emit('change', state.form))
    function editorBack(data) {
      // 富文本信息回传
      if (state.textStatus == '英文') {
        state.form.descriptionEn = data
      } else {
        state.form.descriptionCn = data
      }
    }
    
    function language() {
      if (state.textStatus == '英文') {
        myEditor.value.myContent = state.form.descriptionEn
      } else {
        myEditor.value.myContent = state.form.descriptionCn
      }
    }

    onMounted(() => {
      if (state.form.descriptionEn) {
        initEditorInfo(state.form.descriptionEn).then(res => {
          myEditor.value.myContent = res
        })
      } else {
        state.form.descriptionEn = ''
      }
      if (state.form.descriptionCn) {
        initEditorInfo(state.form.descriptionCn).then(res => {
          state.form.descriptionCn = res
        })
      } else {
        state.form.descriptionCn = ''
      }
    })

    return {
      ...toRefs(state),
      styleCss,
      editorBack,
      statusList,
      language,
      myEditor,
      combine,
      routeName
    }
  }
}
</script>
<style lang="scss" scoped>
.editContainer {
  width: 100%;
  background-color: #ccc;
  margin-top: 20px;
  position: relative;
  .maker {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 2;
    cursor: not-allowed;
  }
}
</style>