<!--
 * @Descripttion: Vango ERP
 * @version: 1.0
 * @Author: 朱涛（梅溪）
 * @Date: 2021-07-06 12:01:33
 * @LastEditors: 朱涛
 * @LastEditTime: 2021-07-28 14:28:47
-->
<template>
  <el-config-provider :locale="locale">
    <router-view v-slot="{ Component }">
      <transition name="el-fade-in" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </el-config-provider>
</template>

<script>
import { computed, onMounted, watch, } from 'vue'
import { useStore } from 'vuex'
import ELConfigProvider from './components/ELConfigProvider.vue'
import locale from 'element-plus/lib/locale/lang/zh-cn'
export default {
  components: {
    ELConfigProvider
  },
  setup() {
    const store = useStore()
    let themeColor = computed(() => store.state.com.themeColor)
    let sideBarWidth = computed(() => store.state.menu.sideBarWidth)
     watch(themeColor, (newVal, oldVal) => {
      /* ... */
      document
        .getElementById('app')
        .style.setProperty('--themeColor', store.state.com.themeColor)
    })
    watch(sideBarWidth, (newVal, oldVal) => {
      /* ... */
      document
        .getElementById('app')
        .style.setProperty('--sideBarWidth', store.state.menu.sideBarWidth)
    })
    return {
      themeColor,
      sideBarWidth,
      locale
    }
  },

}
</script>

<style lang="scss">
@import './src/assets/scss/index.scss';
</style>
