import Vue from 'vue'
import VueRouter from 'vue-router'

import Editor from './components/Editor';
import Layout from './components/Layout';

Vue.use(VueRouter);

// 2. Define some routes. Each route should map to a component.
const routes = [
    { path: '/', component: Editor }
]

// 3. Create the router instance and pass the `routes` option
const router = new VueRouter({
    routes // short for `routes: routes`
})

// 4. Create and mount the root instance. Make sure to inject the router with the router option to make the whole app router-aware.
const app = new Vue({
    router: router,
    components: {
        Layout,
    }
}).$mount('#app')