import { getMyOrderList } from '@/api'
import { isValidResponse, orderUtils } from '@/utils'

import { get } from '@/utils/miniLodash'

const { mapOrders, getOrderTabs } = orderUtils


const getDefaultOrderDetail = (type) => {
	let orderDetails = {
		unpaidOrderDetail: {
			pageIndex: 1,
			hasNext: true,
			curPageLen: 0,
			orders: [],
			firstLoad: true
		},
		ongoingOrderDetail: {
			pageIndex: 1,
			hasNext: true,
			curPageLen: 0,
			orders: [],
			firstLoad: true
		},
		finishedOrderDetail: {
			pageIndex: 1,
			hasNext: true,
			curPageLen: 0,
			orders: [],
			firstLoad: true
		}
	}
	if (type) {
		return orderDetails[type]
	} else {
		return orderDetails
	}
	
}

const invokeGetOrderByStatusApi = async ({ pageIndex, status, type, hasZero, cancelToken }) => {
	const {data} = await getMyOrderList({ pageIndex, status, type, hasZero, istrue:true}, cancelToken)
	// return isValidResponse(data) ? {mappedOrders:mapOrders(get(data, 'obj.myOrderList'), status),time:data.obj.timestamp} : 'error',
	return isValidResponse(data) ? mapOrders(get(data, 'obj.myOrderList'),status): 'error'
}

const afterLoadOrders = (state, mappedOrders, type) => {
	state[type].firstLoad = false
	if (mappedOrders.length < 10) {
		state[type].hasNext = false
	} else {
		state[type].pageIndex += 1
		state[type].hasNext = true
	}
	state[type].curPageLen = mappedOrders.length
	
	const reducedOrders = mappedOrders.reduce((orders, currentValue) => {
		const orderRepeated = orders.some((order) => order.orderId === currentValue.orderId )
		if (orderRepeated) {
			return orders
		} else {
			return orders.concat(currentValue)
		}
	}, state[type].orders)
	state[type].orders = reducedOrders
}

export default {
	namespaced: true,
	state: () => (getDefaultOrderDetail()),
	getters: {
		selectedOrderDetail: (state) => (tab) => {
			let orderDetail = {}
			if (tab.alias === 'unpaid') {
				orderDetail = state.unpaidOrderDetail
			} else if (tab.alias === 'ongoing') {
				orderDetail = state.ongoingOrderDetail
			} else if (tab.alias === 'finished') {
				orderDetail = state.finishedOrderDetail
			}
			return orderDetail
		}
	},
	actions: {
		async getUnpaiedOrdersAction({commit, state}, { pageIndex,status, type, hasZero,reset, cancelToken }) {
			if (reset) commit('resetUnpaidOrderDetail')
			// const {mappedOrders,time} = await invokeGetOrderByStatusApi({ pageIndex, status, type, hasZero, cancelToken })
			// Array.isArray(mappedOrders) && time == cancelToken ? commit('afterLoadUnpaidOrders', mappedOrders) : commit('resetUnpaidOrderDetail')
			const mappedOrders = await invokeGetOrderByStatusApi({ pageIndex, status, type, hasZero, cancelToken })
			Array.isArray(mappedOrders) ? commit('afterLoadUnpaidOrders', mappedOrders) : commit('resetUnpaidOrderDetail')
		},
		async getOngoingOrdersAction({commit, state},{ pageIndex, status, type,hasZero, reset, cancelToken }) {
			if (reset) commit('resetOngoingOrderDetail')
			const mappedOrders = await invokeGetOrderByStatusApi({ pageIndex, status, type, hasZero, cancelToken })
			Array.isArray(mappedOrders) ? commit('afterLoadOngoingOrders', mappedOrders) : commit('resetOngoingOrderDetail')
		},
		async getFinishedOrdersAction({commit, state},{ pageIndex,status, type, hasZero, reset, cancelToken }) {
			if (reset) commit('resetFinishedOrderDetail')
			const mappedOrders = await invokeGetOrderByStatusApi({ pageIndex, status, type, hasZero, cancelToken })
			Array.isArray(mappedOrders) ? commit('afterLoadFinishedOrders', mappedOrders) : commit('resetFinishedOrderDetail')
		} 
	},
	mutations: {
		resetOrderDetails(state) {
			state.unpaidOrderDetail = getDefaultOrderDetail('unpaidOrderDetail');
			state.ongoingOrderDetail = getDefaultOrderDetail('ongoingOrderDetail');
			state.finishedOrderDetail = getDefaultOrderDetail('finishedOrderDetail');
		},
		resetUnpaidOrderDetail(state) {
			state.unpaidOrderDetail = getDefaultOrderDetail('unpaidOrderDetail')
		},
		resetOngoingOrderDetail(state) {
			state.ongoingOrderDetail = getDefaultOrderDetail('ongoingOrderDetail');
		},
		resetFinishedOrderDetail(state) {
			state.finishedOrderDetail = getDefaultOrderDetail('finishedOrderDetail');
		},
		afterLoadUnpaidOrders(state, mappedOrders) {
			afterLoadOrders(state, mappedOrders, 'unpaidOrderDetail')
		},
		afterLoadOngoingOrders(state, mappedOrders) {
			afterLoadOrders(state, mappedOrders, 'ongoingOrderDetail')
		},
		afterLoadFinishedOrders(state, mappedOrders) {
			afterLoadOrders(state, mappedOrders, 'finishedOrderDetail')
		},
		deletePaidOrder(state, orderIds) {
			const orders = state.unpaidOrderDetail.orders.filter((orderItem, index) => {
				return !orderIds.includes(orderItem.orderId)
			})
			state.unpaidOrderDetail.orders = orders
		}
	}
}