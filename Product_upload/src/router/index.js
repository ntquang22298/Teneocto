import Vue from 'vue'
import Router from 'vue-router'
import ProductUpload from '@/components/ProductUpload'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'ProductUpload',
      component: ProductUpload
    }
  ]
})
