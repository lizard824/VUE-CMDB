// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import store from './store'
import 'element-ui/lib/theme-default/index.css'
import '@/icons'
import '@/permission'
import '@/iconfont'

Vue.use(ElementUI)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})

// App flag transition
Vue.filter('flagV',function(value){
  if (value==1){
    return '线上'
  }
  if (value==2){
    return '测试'
  }
  if (value==3){
    return '开发'
  }
  if (value==4){
    return '备机'
  }
  if (value==5){
    return '下线'
  }
  if (value==6){
    return '故障'
  }
})

// Devices status transition
Vue.filter('deviceV',function(value){
  if (value==0){
    return '正常'
  }
  if (value==1){
    return '故障'
  }
  if (value==2){
    return '下架'
  }
})

//Ip Status

Vue.filter('ipV',function(value){
  if (value==0){
    return '已分配'
  }
  if (value==1){
    return '系统占用'
  }
  if (value==2){
    return '未占用'
  }
})

//IDC status
Vue.filter('idcV',function(value){
  if (value==0){
    return '已使用'
  }
  if (value==1){
    return '未使用'
  }

})
