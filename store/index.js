import Vue from 'vue'
import Vuex from 'vuex'

import {
	setToken,
	getToken,
	removeToken,
	getStorage,
	setStorage
} from '@/utils/auth'
import mutations from './mutations.js'
import actions from './actions.js'

import carRentalModule from './carRentalModule'
import userModule from './userModule'
import orderModule from './orderModule'
import orderModule2 from './orderModule2'
import addOilModule from './addOilModule'
import menuModule from './menuModule'
import commonModule from './commonModule'
Vue.use(Vuex)
const store = new Vuex.Store({
	state: {
		token: getToken(), // 用户token
		openid: getStorage('openid'), // 用户微信openid
		version: '5.0.18',
		userInfo: getStorage('userInfo') || {}, // 用户信息 
		system: {}, //操作系统
		screen: {
			windowHeight: 0,
			rate: 2
		},
		wallet: {}, // 钱包
		cardBalance: {},
		phone: '', // 用户手机号                                              
		address: {
			province: '',
			city: '',
			detail: '',
			adcode: ''
		},
		location: {
			longitude: undefined,
			latitude: undefined,
		},
		discount: null, // 优惠券
		applyOrderId: '', // 申请发票订单id
		invoice: null, // 申请发票信息
		orderIdDetail: '', // 查看订单详情id
		discountOrder: [], //多笔订单已选优惠券列表
		carId: '', // 查看车位详情id
		address: '',
		headInfo: null, //抬头详情

		isShowAdv: true, //是否显示首页广告
		outOrderInfo: {}, // 扫码出场订单信息
		isDelete:false, //删除订单选择框

		// 正式环境
		// urlImg: 'https://www.zhongbanglaixi.com/renrenbang/wxImg/',
		// staticImg:'https://www.zhongbanglaixi.com/images/mobile/',
		// Imgpath: 'https://www.zhongbanglaixi.com/benevolenceParking/file/downloadImg?path=', //logo图片地址
		// wssUrl: 'www.zhongbanglaixi.com/benevolenceParking', // wss服务器地址 停车
		// wssUrl2: 'www.zhongbanglaixi.com/bzServiceManage', // wss服务器地址 车检
		// webUrl: 'https://www.zhongbanglaixi.com', // 内嵌h5页面地址
		// h5Url:'https://www.zhongbanglaixi.com/h5/ugc/', // 内嵌h5页面地址
		// BASE_URL: 'https://www.zhongbanglaixi.com/benevolenceParking', // 正式fuwu



		// dev测试环境
		// urlImg: 'https://dev.zhongbanglaixi.com/renrenbang/wxImg/',
		// staticImg: 'https://dev.zhongbanglaixi.com/images/mobile/',
		// Imgpath: 'https://dev.zhongbanglaixi.com/benevolenceParking/file/downloadImg?path=', //logo图片地址
		// wssUrl: 'dev.zhongbanglaixi.com/benevolenceParking', // wss服务器地址 停车
		// wssUrl2: 'dev.zhongbanglaixi.com/bzServiceManage', // wss服务器地址 车检
		// webUrl: 'https://dev.zhongbanglaixi.com', // 内嵌h5页面地址
		// h5Url: 'https://dev.zhongbanglaixi.com/h5/ugc/', // 内嵌h5页面地址
		// BASE_URL: 'https://dev.zhongbanglaixi.com/benevolenceParking', // 测试服务器 租赁80端口             	 
 

		// slb测试环境
		// urlImg:'https://slb.zhongbanglaixi.com/renrenbang/wxImg/',
		// Imgpath:'https://slb.zhongbanglaixi.com/benevolenceParking/file/downloadImg?path=', //logo图片地址
		// wssUrl: 'slb.zhongbanglaixi.com/benevolenceParking',                                // wss服务器地址
		// webUrl:'https://slb.zhongbanglaixi.com',                                            // 内嵌h5页面地址
		// BASE_URL : 'https://slb.zhongbanglaixi.com/benevolenceParking',                  	 // 测试服务器 租赁80端口

		// k8s测试环境
		urlImg: 'https://k8s.zhongbanglaixi.com/renrenbang/wxImg/',
		staticImg: 'https://k8s.zhongbanglaixi.com/images/mobile/',
		Imgpath: 'https://k8s.zhongbanglaixi.com/benevolenceParking/file/downloadImg?path=', //logo图片地址
		wssUrl: 'k8s.zhongbanglaixi.com/benevolenceParking', // wss服务器地址 停车
		wssUrl2: 'k8s.zhongbanglaixi.com/bzServiceManage', // wss服务器地址 车检
		webUrl: 'https://k8s.zhongbanglaixi.com', // 内嵌h5页面地址
		h5Url: 'https://k8s.zhongbanglaixi.com/h5/ugc/', // 内嵌h5页面地址
		BASE_URL: 'https://k8s.zhongbanglaixi.com/benevolenceParking', // 测试服务器 租赁80端口




		// BASE_URL : 'https://test.zhongbanglaixi.com：8081/benevolenceParking'             // 测试服务器81端口 
		// BASE_URL : 'http://test.zhongbanglaixi.com:8082/benevolenceParking',              // 测试服务器82端口
		// BASE_URL : 'http://test.zhongbanglaixi.com:9092/benevolenceParking',              // 测试服务器82端口 租赁
		// BASE_URL : 'http://test.zhongbanglaixi.com:8083/benevolenceParking',              // 测试服务器83端口 租赁

		// wssUrl:'10.192.84.12:8080/benevolenceParking',                                // wss服务器地址
		// BASE_URL : 'http://10.192.84.12:808	0/benevolenceParking', //刘慧
		// BASE_URL : 'http://zjbtest.vaiwan.com/benevolenceParking',//刘慧
		// BASE_URL : 'http://192.168.11.149:8080',                  //张凡通
		// BASE_URL : 'http://lhtest.vaiwan.com/benevolenceParking', //刘慧
		// BASE_URL : 'http://10.192.88.22:8080/benevolenceParking', //郑
		// BASE_URL : 'http://10.192.84.13:8080/benevolenceParking', //郭
		// BASE_URL : 'http://10.192.84.11:8083/benevolenceParking', //岳
		// BASE_URL : 'http://yxm666.vaiwan.com/benevolenceParking', //岳
		// BASE_URL : 'http://192.168.4.2:8080/benevolenceParking', //姚亚龙
		// BASE_URL : 'http://10.192.84.54:8080/benevolenceParking_war_exploded', //张灿灿


		// 测试环境
		// urlImg:'http://llttest.vaiwan.com/renrenbang/wxImg/',
		// Imgpath:'http://llttest.vaiwan.com/benevolenceParking/file/downloadImg?path=', //logo图片地址
		// wssUrl: 'llttest.vaiwan.com/benevolenceParking',                                // wss服务器地址
		// webUrl:'http://llttest.vaiwan.com',                                            // 内嵌h5页面地址
		// BASE_URL : 'http://llttest.vaiwan.com/benevolenceParking',                  	 // 测试服务器 租赁80端口
	},
	getters: {},
	mutations,
	actions,
	modules: {
		carRentalModule,
		userModule,
		orderModule,
		orderModule2,
		addOilModule,
		menuModule,
		commonModule
	}
})

export default store
