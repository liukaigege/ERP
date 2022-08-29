<template>
<div class="contaner">

  <el-dialog :title="status=='ruleComment'?'编辑通用SKU规则':status=='addSKU'?'添加品类SKU规则':'编辑品类SKU规则'" v-model="dialog" @close="close" :close-on-click-modal="false">
    <el-form :model="tableData" ref="formRef" :inline="false"  style="margin-top:20px">

      <el-form-item label="品类:" v-if="props.status!='ruleComment'" :prop="'commentParamMap'+'.'+'categoryIds'" :rules="{ required: true, message: '请选择品类', trigger: ['blur','change'] }">
        <elSelectTree :data="treeData" :treeProps="treeProps"  :width="445" :multiple="true" defaultExpandAll :checkStrictly="true" @ok="check" :defaultCheckedKeys="tableData.commentParamMap.categoryIds?tableData.commentParamMap.categoryIds.split(','):[]" />
        <el-input v-model="tableData.commentParamMap.categoryIds" class="none-input"></el-input>
      </el-form-item>

      <div class="content">
        <div class="tableBox">
          <div class="sku-left">
            <div class="sku">
              <div class="spu-1">
                <span style="margin-top:16px">主SKU编码（SPU）</span>
              </div>
              <div class="spu-2">
                <span>为保证SPU唯一性，建议添加随机数或自然增长数字段</span>
                <div class="button">
                  <el-dropdown trigger="click" @command="dropdown">
                    <span class="el-dropdown-link">
                      <el-button type="primary" >添加字段<i class="el-icon-arrow-down el-icon--right"></i></el-button>
                    </span>
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item command="shopform">商品形式</el-dropdown-item>
                        <el-dropdown-item command="shoptype">商品类型</el-dropdown-item>
                        <el-dropdown-item command="separator">分隔符</el-dropdown-item>
                        <el-dropdown-item command="sourceChannel">货源渠道</el-dropdown-item>
                        <el-dropdown-item command="date">日期</el-dropdown-item>
                        <el-dropdown-item command="staffcode">员工编号</el-dropdown-item>
                        <el-dropdown-item command="categorycode">品类编码</el-dropdown-item>
                        <el-dropdown-item command="random">随机数</el-dropdown-item>
                        <el-dropdown-item command="sincenumber">自增长数</el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </div>
              </div>
            </div>

          </div>
          <div class="box">

            <table class="table table-striped" cellspacing="0" cellpadding="0">
              <thead class="thead-dark">
                <tr>
                  <th class="w50">序号</th>
                  <th class="w115">字段</th>
                  <th class="w295">设置</th>
                  <th class="w50">操作</th>
                </tr>
              </thead>
              <draggable v-model="tableData.skuRuleDetailList" item-key="key" class="list-group" tag="transition-group" :component-data="{tag: 'tbody', type: 'transition-group', name: !drag ? 'flip-list' : null }" v-bind="dragOptions" @start="drag = true" @end="drag = false">
                <template #item="{ element, index }">
                  <tr>
                    <td class="w50"><i class="el-icon-sort"></i>{{ index + 1 }}</td>
                    <td class="w115 "> {{ element.value?.name?.replace(/[\【\】]/g,'') }}</td>
                    <td class="w295">
                      <div v-if="element.key == 1" class="son">
                        <el-form-item label="单品："  :prop="'skuRuleDetailList.'+index+ '.value'+ '.single'" :rules="[
                                                 { required: true, message: '请填写单品商品编码', trigger: ['blur' ,'change']},
                                                 { validator:rulesText,trigger:['blur' ,'change']}
                                                 ]">
                          <el-input v-model="element.value.single"  style="width:120px;margin-bottom:5px" maxlength="5" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="组合："  :prop="'skuRuleDetailList.'+index+ '.value'+ '.combination'" :rules="
                                                [
                                                { required: true, message: '请填写組合商品编码', trigger: ['blur' ,'change']},
                                                { validator:rulesText,trigger:['blur' ,'change']}
                                                ]">
                          <el-input v-model="element.value.combination"  style="width:120px" maxlength="5" clearable></el-input>
                        </el-form-item>

                      </div>
                      <div v-if="element.key == 2">
                        <el-form-item label="普通："  :prop="'skuRuleDetailList.'+index+ '.value'+ '.ordinary'" :rules="[{
                                                        required: true, message: '请填写普通商品类型', trigger:['blur' ,'change']
                                                        },{ validator:rulesText,trigger:['blur' ,'change']}]">
                          <el-input v-model="element.value.ordinary"  style="width:120px;margin-bottom:5px" maxlength="5" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="定制："  :prop="'skuRuleDetailList.'+index+ '.value'+ '.customize'" :rules="[{
                                                        required: true, message: '请填写定制商品类型', trigger: ['blur' ,'change']
                                                        },{ validator:rulesText,trigger:['blur' ,'change']}]">
                          <el-input v-model="element.value.customize"  style="width:120px" maxlength="5" clearable></el-input>
                        </el-form-item>
                      </div>
                      <div v-if="element.key == 3">
                        请在<span class="color-1890FF" @click="router.push({name:'sourceChanneManagement'})">货源渠道管理</span>设置编码
                      </div>
                      <div v-if="element.key == 4">
                        <el-form-item label="分隔符：" >
                          <el-select v-model="element.value.value" style="width:120px" >
                            <el-option v-for="item in data.separator" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                          </el-select>
                        </el-form-item>

                      </div>
                      <div v-if="element.key == 5">
                        <div class="margin-bottom">
                          <el-radio v-model="element.value.type" :disabled="element.disabled" label="parent" @change="codeRadio(element)" >主品类</el-radio>
                          <el-radio v-model="element.value.type" :disabled="element.disabled" label="sub" @change="codeRadio(element)" >子品类</el-radio>
                        </div>
                        <div>请在<span class="color-1890FF" @click="router.push({name:'categoryManagement'})">品类管理</span>设置编码</div>
                      </div>
                      <div v-if="element.key==6">
                        <div class="margin-bottom">
                          <el-radio v-model="element.value.type" :disabled="element.disabled" label="开品日期" >开品日期</el-radio>
                          <el-radio v-model="element.value.type" :disabled="element.disabled" label="报价日期" >报价日期</el-radio>
                        </div>
                        <el-form-item label="日期格式：" >
                          <el-select v-model="element.value.format" style="width:120px" >
                            <el-option v-for="item in data.timeDate" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </div>
                      <div v-if="element.key==7">
                        <div class="margin-bottom">
                          <el-radio v-model="element.value.type" :disabled="element.disabled" label="开发员工" >开发员工</el-radio>
                          <el-radio v-model="element.value.type" :disabled="element.disabled" label="维护员工" >维护员工</el-radio>
                        </div>
                        <div>请在<span class="color-1890FF" @click="router.push({name:'Usersmanagement'})">用户管理</span>设置编码</div>
                      </div>
                      <div v-if="element.key==8">
                        <el-form-item label="位数：" >
                          <el-select v-model="element.value.length" style="width:120px" >
                            <el-option v-for="item in data.randomData" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </div>
                      <div v-if="element.key==9">
                        <div>
                          <div class="margin-bottom">
                            <el-radio v-model="element.value.type" label="统计型" :disabled="element.id?true:false">统计型</el-radio>
                            <el-radio v-model="element.value.type" label="唯一型" :disabled="element.id?true:false">唯一型</el-radio>
                            <el-tooltip class="item" effect="light" placement="top">
                              <template #content>
                                <div>1、 统计型：根据相同的子品类生成依次递增的自增长数</div>
                                <div>2、 唯一型：不区分品类生成递增的自增长数</div>
                                <div>举例:子品类编码为A和B,自增长数起始值为01。</div>
                                <div>选择“统计型”生成的主sku为:A01,A02,B01,B02;</div>
                                <div>选择“唯一型”生成的主sku为:A01,A02,B03,B04</div>
                              </template>
                              <span class="el-icon-question"></span>
                            </el-tooltip>

                          </div>
                          <div>
                            <el-form-item label="起始：" label-width="50"  :prop="'skuRuleDetailList.'+index+ '.value'+ '.startNum'" :rules="[
                                                        { required: true, message: '请填写起始值', trigger: 'blur'},{ validator:rulesNum,trigger:'blur'}]">
                              <el-input v-model="element.value.startNum"  style="width:120px" maxlength="9" :disabled="element.id?true:false"></el-input>
                            </el-form-item>
                            <el-form-item label="重置:"  label-width="50">
                              <el-radio v-model="element.value.reset" label="none"  :disabled="element.id?true:false">不重置</el-radio>
                              <el-radio v-model="element.value.reset" label="day"  :disabled="element.id?true:false">按天</el-radio>
                              <el-radio v-model="element.value.reset" label="month"  :disabled="element.id?true:false">按月</el-radio>
                            </el-form-item>

                          </div>
                        </div>

                      </div>

                    </td>
                    <td class="w50">
                      <el-popconfirm icon="el-icon-info" iconColor="red" title="确定删除吗？" @confirm="deleteRow(element.key,index)">
                        <template #reference>
                          <span class='color-D9001B'>删除</span>
                        </template>
                      </el-popconfirm>

                    </td>
                  </tr>

                </template>
              </draggable>

            </table>
            <p v-if="tableData.skuRuleDetailList.length==0"  style="text-align:center;font-size:16px;line-height: 285px;color:#000000a6">请添加规则字段</p>
          </div>

        </div>
        <div class="splitline"></div>
        <div class="rule">
          <div>
            <p class="spu-1" style="margin-bottom:17px;margin-top:16px">多属性SKU规则：</p>
          </div>
          <div>
            SKU多属性分隔符：
            <el-select v-model="tableData.commentParamMap.separatorMaster"  style="width:90px">
              <el-option v-for="item in [{label:'不分隔',value:''},...data.separator]" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="sku-desc">
            主SKU和多属性编码之间的分隔符
          </div>
          <div>
            后缀：
            <el-select v-model="tableData.commentParamMap.suffix"  style="width:175px" @change="suffixChange">
              <el-option v-for="item in [{label:'多属性值',value:1},{label:'自增长数字',value:2}]" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="sku-desc">
            区别于多属性的后缀，默认优先取规格参数值设置的SKU编码，若未设置则使用规格参数值
          </div>
          <div v-if="tableData.commentParamMap.suffix==1">
            SKU多属性分隔符：
            <el-select v-model="tableData.commentParamMap.separatorAttr"  style="width:90px">
              <el-option v-for="item in [{label:'不分隔',value:''},...data.separator]" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="sku-desc" v-if="tableData.commentParamMap.suffix==1">
            多属性中属性之间的分隔符
          </div>
          <div v-if="tableData.commentParamMap.suffix==2">
            自增长：
            <el-input v-model="tableData.commentParamMap.startNum" :disabled="suffixDisabled&&tableData.commentParamMap.suffix==2" type="Number" maxlength="5" style="width:160px"  clearable @blur="()=>tableData.commentParamMap.startNum=tableData.commentParamMap.startNum?tableData.commentParamMap.startNum:1"></el-input>
          </div>
          <div class="sku-desc" v-if="tableData.commentParamMap.suffix==2">
            属性自增长数字的起始值
          </div>
        </div>

      </div>
    </el-form>
    <div class="footer-radio-box">
      <span style="color:#000">商品涉及编码字段发生变更时商品SKU：</span>
      <el-radio v-model="tableData.commentParamMap.isChange" :label="1">仍使用初始SKU</el-radio>
      <el-radio v-model="tableData.commentParamMap.isChange" :label="2">商品信息变更后自动重新生成SKU</el-radio>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button  @click="close">取 消</el-button>
        <el-button type="primary"  @click="submit">确 定</el-button>
      </span>
    </template>

  </el-dialog>
</div>
</template>

<script>
import { reactive, toRefs, computed, watch, watchEffect, onMounted } from "vue"
import draggable from 'vuedraggable'
import elSelectTree from '@/components/elSelectTree/index.vue'
import { data } from '../js/data.js'
import { ElMessage } from "element-plus"
import { deepCopy } from '@/utils/tool.js'
import { ruleCommentDetail, ruleCommentEdit, rulecClassify, ruleAdd, ruleDetail, ruleEdit } from '@/api/goods/rules.js'
import { useRouter } from "vue-router"

export default ({
  components: {
    draggable,
    elSelectTree
  },
  props: {
    status: {},
    id: {}
  },
  emits: ['close', 'search', 'comment'],
  setup(props, context) {
    const router = useRouter()
    const state = reactive({
      dialog: true,
      tableData: {
        skuRuleDetailList: [],
        commentParamMap: {
          separatorAttr: '',
          separatorMaster: '',
          suffix: 1,
          categoryIds: '', //品类id 多个逗号隔开
          isChange: 1,
          startNum: 1
        }
      },
      drag: false,
      treeData: [],
      treeProps: {
        value: 'id', // ID字段名
        label: 'name', // 显示名称
        children: 'child', // 子级字段名
        disabled: 'disabled'
      },
      formRef: '',
      suffixDisabled: false
    })

    onMounted(() => {
      rulecClassify().then(res => {
        state.treeData = res.data
        if (props.status == 'editSKU') {
          ruleDetail({ id: props.id }).then(res => {
            if (res.data.commentParamMap.suffix == 2) state.suffixDisabled = true
            res.data.skuRuleDetailList.forEach(item => {
              item.value = JSON.parse(item.value)
            })
            state.tableData = res.data

            // 将当前sku绑定的品类转换成数组来进行查询
            const arr = state.tableData.commentParamMap.categoryIds.split(',')

            loop(state.treeData, arr)
            isdisabled()

            const list = []

            for (let index = 0; index < arr.length; index++) {
              delClassify(state.treeData, arr[index], list)
            }
            state.tableData.commentParamMap.categoryIds = list.join(',')
          })
        }
      })

    })

    function delClassify(data, id, arr) {
      data.forEach(item => {
        if (item.id == id) arr.push(id)
        if (item.child) delClassify(item.child, id, arr)
      })
    }
    watchEffect(() => {
      if (props.status == 'ruleComment') {
        ruleCommentDetail().then(res => {
          if (res.data.commentParamMap.suffix == 2) state.suffixDisabled = true
          res.data.skuRuleDetailList.forEach(item => {
            item.value = JSON.parse(item.value)
          })
          state.tableData = res.data
          isdisabled()
        })
      }
    })

    function loop(data, arr) { // 修改sku时回显品类禁用
      data.forEach(item => {
        if (arr.some(val => item.id == val)) {
          item.disabled = false
        }
        if (item.child && item.child.length > 0) loop(item.child, arr)
      })
    }

    function isdisabled() { //判断有没有需要禁用的选项
      [5, 6, 7].forEach(val => {
        let arr = state.tableData.skuRuleDetailList.filter(item => item.key == val)
        if (arr.length == 2) {
          arr[0].disabled = true
          arr[1].disabled = true
        }
      })
    }

    function close() {
      state.dialog = false
      setTimeout(() => {
        context.emit('close')
      }, 500)
    }

    function deleteRow(key, index) {
      state.tableData.skuRuleDetailList.splice(index, 1)
      if (key == 5 || key == 6 || key == 7) {
        const arr = state.tableData.skuRuleDetailList.filter(item => {
          return item.key == key
        })
        if (arr.length) arr[0].disabled = false
      }
    }

    function codeRadio(e) {
      e.value.name = e.value.type == 'parent' ? '【主级品类编码】' : "【子级品类编码】"
    }

    function dropdown(key) { // 表格添加行
    console.log('触发了');
      const obj = deepCopy(data.addList[key]) //
      const arr = state.tableData.skuRuleDetailList.filter(item => {
        return item.key == obj.key
      })
      if (obj.max == arr.length) return ElMessage.error(`该类型只能添加${obj.max}次`)
      state.tableData.skuRuleDetailList.push(obj)
      //如果添加的key为567 则调用唯一选项函数
      if (obj.key == 5 || obj.key == 6 || obj.key == 7) onlyValue(obj.key)
    }

    function onlyValue(key) { // 唯一选项
      const arr = state.tableData.skuRuleDetailList.filter(item => {
        return item.key == key
      })
      if (arr.length == 2) {
        arr[0].disabled = true
        arr[1].disabled = true
        if (arr[0].value.type == 'sub') {
          arr[1].value.type = 'parent'
          arr[1].value.value = '【主级品类编码】'
        }
        if (arr[0].value.type == '开品日期') {
          arr[1].value.type = '报价日期'
        }
        if (arr[0].value.type == '开发员工') {
          arr[1].value.type = '维护员工'
        }
      }
    }

    const dragOptions = computed(() => {
      return {
        animation: 200,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost'
      }
    })

    function check(e) {
      console.log(e, '选中的id');
      state.tableData.commentParamMap.categoryIds = e ? e.join(',') : e
    }

    function rulesText(rule, value, callback) {
      const rge = new RegExp(/^[A-Za-z0-9]+$/)
      console.log(rge.test(value), value);
      if (rge.test(value)) {
        return callback()
      }

      return callback('仅可录入大小写字母、数字')
    }

    function rulesNum(rule, value, callback) {
      const rge = new RegExp(/^[0-9]+$/)
      if (rge.test(value)) {
        return callback()
      }
      return callback('仅可录入数字')
    }

    function submit() {
      state.formRef.validate().then(val => {
        if (state.tableData.skuRuleDetailList.length == 0) return ElMessage.error('请在添加字段中选择SKU字段')
        const data = deepCopy(state.tableData)
        data.skuRuleDetailList.forEach(item => {
          item.value = JSON.stringify(item.value)
        })
        data.commentParamMap.skuId = props.id
        switch (props.status) {
          case 'ruleComment':
            ruleCommentEdit({
              skuRuleDetailVO: data,
              userId: '1'
            }).then(val => {
              ElMessage.success('编辑成功')
              context.emit('comment')
              close()
            })
            break;
          case 'addSKU':
            ruleAdd({
              skuRuleDetailVO: data,
              userId: '1'
            }).then(val => {
              ElMessage.success('编辑成功')
              context.emit('search')
              close()

            })
            break;
          case 'editSKU':
            ruleEdit({
              skuRuleDetailVO: data,
              userId: '1'
            }).then(val => {
              ElMessage.success('编辑成功')
              context.emit('search')
              close()

            })
            break;
          default:
            break;
        }
      })
    }

    function suffixChange() {
      if (state.tableData.commentParamMap.suffix == 1) {
        state.tableData.commentParamMap.startNum = 1
      } else {
        state.tableData.commentParamMap.separatorAttr = ''
      }
    }
    return {
      ...toRefs(state),
      close,
      deleteRow,
      codeRadio,
      dropdown,
      dragOptions,
      check,
      data,
      rulesText,
      rulesNum,
      submit,
      props,
      suffixChange,
      router
    }
  }

})
</script>

<style lang="scss" scoped>
::v-deep(.el-dialog) {
  width: 830px !important;
}

.contaner {
  :deep(.el-dialog__body) {
    padding-top: 0;
    padding-bottom: 0;
  }
}

.rule {
  width: 235px;
}

.content {

  display: flex;
  justify-content: space-between;

  .el-radio {
    margin-bottom: 0;
  }
}

.tableBox {
  padding: 0px;

  .box {
    height: 320px;
    overflow-y: auto;
    padding-bottom: 3px;
  }
}

.w50 {
  width: 60px;
  text-align: center;
}

.w115 {
  width: 110px;
  text-align: center;
}

.w295 {
  width: 295px;
  display: flex;
  justify-content: center;
}

th,
td {

  border-left: 1px solid #f2f2f2;
  margin: 0;
  padding: 0;
  border-collapse: collapse;
}

tr:nth-child(n+2) td {
  border-top: 1px solid #f2f2f2;
}

th:last-child,
td:last-child {
  border-right: 1px solid #f2f2f2;
}

tbody tr:last-child td {
  border-bottom: 1px solid #f2f2f2;
}

td {
  padding: 10px;
  padding-top: 15px;

  .el-icon-sort {
    margin-right: 5px;
  }
}

th {
  background-color: #f2f2f2;
  height: 30px;
  line-height: 30px;
}

.color-1890FF {
  color: #1890FF;
  cursor: pointer;
}

.color-D9001B {
  color: #D9001B;
  cursor: pointer;
}

.margin-bottom {
  margin-bottom: 5px;

  .el-icon-question {
    position: relative;
    top: -10px;
    left: -30px;
  }
}

.color-6B6D71 {
  color: #6B6D71;
}

.spu-1 {
  font-size: 16px;
  color: #1890FF;
  display: flex;
}

.spu-2 {
  font-size: 12px;
  color: #FD4C60;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.el-form-item+.el-form-item {
  margin-bottom: 7px;
}

.sku-desc {
  color: rgba($color: #000000, $alpha: 45%);
  margin-bottom: 16px;
  margin-top: 5px;
}

.splitline {
  width: 1px;
  border-right: 1px dashed rgba($color: #000000, $alpha:0.1);
}

.footer-radio-box {
  margin: 25px 0 20px 0;
}

.el-form-item--small.el-form-item {
  margin-bottom: 0rem;
}
.none-input{
  display: none;
}
</style>
