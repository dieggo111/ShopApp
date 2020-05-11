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

Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)

Vue.config.productionTip = false

Vue.use(VueRouter);

Vue.prototype.$eventBus = new Vue()

const routes = [
    { path: '/login', component: LoginComponent },
    { path: '/logout', component: LogoutComponent },
    { path: '/shop', component: ShopComponent },
    { path: '/signup', component: SignupComponent },
]

const router = new VueRouter({
    routes,
    mode: 'history'
})

new Vue({
    el:'#app',
    router,
    store,
    render: h => h(App)
});

