import Vue from 'vue'
import App from './App.vue'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
// import VueRouter from 'vue-router';

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// import LoginComponent from './components/LoginComponent'

Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)

Vue.config.productionTip = false

// Vue.use(VueRouter);

// const routes = [
//     { path: '/login', component: LoginComponent },
// ]

// const router = new VueRouter({
//     routes,
//     mode: 'history'
// })

new Vue({
    el:'#app',
    // router,
    render: h => h(App)
});

