import Vue from 'vue'
import App from './App.vue'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import VueRouter from 'vue-router';

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import {store} from './store'

import LoginComponent from './components/LoginComponent'
import LogoutComponent from './components/LogoutComponent'
import SignupComponent from './components/SignupComponent'
import ShopComponent from './components/ShopComponent'
import CheckOutComponent from './components/CheckOutComponent'

Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)

Vue.config.productionTip = false

Vue.use(VueRouter);

Vue.prototype.$eventBus = new Vue()

const routes = [
    { path: '/login', component: LoginComponent },
    { path: '/logout', component: LogoutComponent },
    { path: '/shop', component: ShopComponent, meta: {requiresAuth: true}},
    { path: '/signup', component: SignupComponent },
    { path: '/checkout', component: CheckOutComponent, meta: {requiresAuth: true}},
]

const router = new VueRouter({
    routes,
    mode: 'history'
})

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!store.getters.loggedIn) {
            next({
                path: '/shop',
                query: { redirect: '/login' }
            })
        } else {
            next()
        }
        if (!store.getters.loggedIn) {
            next({
                path: '/checkout',
                query: { redirect: '/login' }
            })
        } else {
            next()
        }
    } else {
      next()
    }
  })

new Vue({
    el:'#app',
    router,
    store,
    render: h => h(App)
});

