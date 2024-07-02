import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css
// import '@/assets/styles/index.scss' // global css
import '@/assets/styles/base.scss' // ruoyi css

import App from './App'
import store from './store'
import router from './router'

import '@/assets/icons' // icon
import '@/permission' // permission control
import { handleTree, parseTime, resetForm, selectDictName } from '@/utils/base'
import Pagination from '@/components/Pagination'
import '@/utils/dialog'
import { getDicts, getSoleDict } from '@/api/dict'
import * as echarts from 'echarts'

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

// 修改 el-dialog 默认点击遮照为不关闭
ElementUI.Dialog.props.closeOnClickModal.default = false

// 全局方法挂载
Vue.prototype.$echarts = echarts
Vue.prototype.getDicts = getDicts
Vue.prototype.getSoleDict = getSoleDict
Vue.prototype.handleTree = handleTree
Vue.prototype.parseTime = parseTime
Vue.prototype.resetForm = resetForm
Vue.prototype.selectDictName = selectDictName
Vue.prototype.msgSuccess = function(msg) {
  this.$message({ showClose: true, message: msg, type: 'success' })
}
Vue.prototype.msgError = function(msg) {
  this.$message({ showClose: true, message: msg, type: 'error' })
}

// 全局挂载组件
Vue.component('Pagination', Pagination)

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
