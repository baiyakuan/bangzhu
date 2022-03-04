import {
	getMenu,
	getHomeShow,
	getHomeOrderList,
	selectNotGainCoupon,
	selectToReceiveList
} from '@/api'

import {
	get
} from '@/utils/miniLodash'

export default {
	state: () => ({
		menu: {},
		homeShow: {},
		orderAdList: [], // 地图左下角广告
		waterList: [], // 瀑布流
		topBarInfo: {},
		processingList: [], // 停车中
		awaitPayList: [], // 待支付
		awaitPayOrderInfo: {}, // 待支付卡片广告
		openInductivePay: [], // 充值气泡
		refuelAdList: [],
		couponInfo: {
			data: false
		},
	}),
	getters: {
		menu: (state) => state.menu,
		homeShow: (state) => state.homeShow,
		waterList: (state) => state.waterList,
		orderAdList: (state) => state.orderAdList,
		topBarInfo: (state) => state.topBarInfo,
		processingList: (state) => state.processingList,
		awaitPayList: (state) => state.awaitPayList,
		awaitPayOrderInfo: (state) => state.awaitPayOrderInfo,
		openInductivePay: (state) => state.openInductivePay,
		refuelAdList: (state) => state.refuelAdList,
		couponInfo: (state) => state.couponInfo
	},
	actions: {
		async getMenuAction({
			commit
		}, params) {
			const {
				data
			} = await getMenu(params)
			commit('updateMenu', data.obj)
			return new Promise((res, rej) => {
				res(data.obj)
			})
		},
		async getHomeShow({
			commit
		}, params) {
			const {
				data
			} = await getHomeShow(params)
			commit('updateHomeShow', data.obj)
			return new Promise((res, rej) => {
				res(data.obj)
			})
		},
		async getHomeOrderList({
			commit
		}, params) {
			params.requestType = 'miniprogram'
			params.version = '5.0'
			const {
				data
			} = await getHomeOrderList(params)
			commit('updateHomeOrderList', data.obj)
			return new Promise((res, rej) => {
				res(data.obj)
			})
		},
		async selectNotGainCoupon({
			commit
		}, params) {
			const {
				data
			} = await selectNotGainCoupon(params)
			if (data.code == 1) {
				commit('updateCouponInfo', data.obj)
			}
			return new Promise((res, rej) => {
				res(data.obj)
			})
		},
	},
	mutations: {
		updateCouponInfo(state, couponInfo) {
			state.couponInfo = couponInfo
		},
		updateMenu(state, menu) {
			state.menu = menu
		},
		updateHomeShow(state, homeShow) {
			state.homeShow = homeShow
			if (homeShow && homeShow.orderAdList) {
				state.orderAdList = homeShow.orderAdList
			}
			if (homeShow && homeShow.waterList) {
				state.waterList = homeShow.waterList
			}
			if (homeShow && homeShow.topBarInfo) {
				state.topBarInfo = homeShow.topBarInfo
			}
			state.refuelAdList = get(homeShow, 'refuelAdList', [])
		},
		updateHomeOrderList(state, obj) {
			if (obj) {
				obj.processingList.forEach((item) => {
					item.imgList = item.parkingPic ? item.parkingPic.split(',') : [];
					item.money = item.money.toFixed(2)
				})
				state.processingList = obj.processingList


				obj.awaitPayList.forEach((item) => {
					item.awaitPayMoney = item.awaitPayMoney.toFixed(2)
				})
				// 排序, 金额大的优先展示
				for (let i = 0; i < obj.awaitPayList.length - 1; i++) {
					for (let j = 0; j < obj.awaitPayList.length - 1 - i; j++) {
						if (obj.awaitPayList[j].awaitPayMoney < obj.awaitPayList[j + 1].awaitPayMoney) {
							let temp = obj.awaitPayList[j]
							obj.awaitPayList[j] = obj.awaitPayList[j + 1]
							obj.awaitPayList[j + 1] = temp
						}
					}
				}
				state.awaitPayList = obj.awaitPayList

				state.awaitPayOrderInfo = obj.awaitPayOrderInfo

				state.openInductivePay = obj.openInductivePay
			}
		}
	}
}
