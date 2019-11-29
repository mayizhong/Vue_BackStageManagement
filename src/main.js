import Vue from 'vue'
import App from './App'
import router from './router'
// 导入 字体图标的样式表
import './assets/fonts/iconfont.css'
// 导入 ElementUI 组件库
import ElementUI from 'element-ui'
import axios from 'axios'
// 导入 树形表格组件
import TreeGrid from 'vue-table-with-tree-grid'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'

// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 导入自己的全局样式
import './assets/css/global.css'

Vue.use(VueQuillEditor)

Vue.config.productionTip = false

// 安装 elementUI
Vue.use(ElementUI)
// 把 导入的树形表格，注册为 全局组件
Vue.component('tree-table', TreeGrid)

// 为 axios 挂载 token 请求头，需要使用 request 拦截器实现
axios.interceptors.request.use(function(config) {
  // 手动为 axios 的请求，追加 Authorization 请求头
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// 全局挂载请求的 baseURL
// axios.defaults.baseURL = 'http://api.xiaomadagege.cn:3001/api/private/v1/'
axios.defaults.baseURL = 'http://39.108.193.251:8811/api/private/v1/'

// 挂载 axios
Vue.prototype.$http = axios

// 定义全局的时间过滤器
Vue.filter('dateFormat', function(originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1).toString().padStart(2, '0')
  const d = dt
    .getDate()
    .toString()
    .padStart(2, '0')

  const hh = dt
    .getHours()
    .toString()
    .padStart(2, '0')
  const mm = dt
    .getMinutes()
    .toString()
    .padStart(2, '0')
  const ss = dt
    .getSeconds()
    .toString()
    .padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
