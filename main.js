import Vue from 'vue'
import App from './App'

import store from '@/store'
import api from '@/api/'

// #ifdef MP-WEIXIN
import mtjwxsdk from './utils/mtj-wx-sdk';
// #endif

import uView from "uview-ui";
Vue.use(uView);

import Toastes from './components/Toast/index'
Vue.component('toastes', Toastes)

import { dealCarNumber } from '@/utils';
Vue.prototype.$carNumber = dealCarNumber

Vue.config.productionTip = false

Vue.prototype.$api = api

Vue.prototype.$bus = new Vue();

App.mpType = 'app'
const app = new Vue({
	store,
	...App
})
app.$mount()
