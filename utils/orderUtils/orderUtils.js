import {
	groupBy,
	cloneDeep,
	get
} from '@/utils/miniLodash'


export const mapOrders = (orders, status) => {
	const mappedOrders = orders.map((order) => {
		let showMoney = '';
		if (status == 3 || status == 1) { // 3:待支付， 1：进行中， 2：已完成
			showMoney = (order.money - order.discountPlus).toFixed(2) > 0 ?
				(order.money - order.discountPlus).toFixed(2) :
				'0.00'
		} else if (status == 2) {
			showMoney = order.payType == '停车卡支付' ? (order.money || '0.00') : (order.payMoney || '0.00')
		}
		
		if(order.pay_money){
			order.pay_money = (order.pay_money * 1).toFixed(2)
		}
		return {
			...order,
			money: (order.money * 1).toFixed(2),
			payMoney: (order.payMoney * 1).toFixed(2),
			showMoney: (showMoney * 1).toFixed(2),
		}
	})
	return mappedOrders
}

const orderTabsList = [{
		name: '待支付',
		status: '3',
		alias: 'unpaid',
		loadOrderActionName: 'getUnpaiedOrdersAction',
		showPayName: false
	},
	{
		name: '进行中',
		status: '1',
		loadOrderActionName: 'getOngoingOrdersActionAction',
		alias: 'ongoing'
	},
	{
		name: '已完成',
		status: '2',
		loadOrderActionName: 'getFinishedOrdersAction',
		alias: 'finished'
	}
]
// 不要打乱数组顺序， 会影响store里面的getter
export const getOrderTabs = (type = "Array", groupName) => {
	let tabs = [...orderTabsList]
	if (type === 'Object') {
		tabs = groupBy(orderTabsList, groupName)
	}
	return cloneDeep(tabs)
}

export const caculateOrderMoney = (orderList, checkedOrderCodes) => {
	let orderMoney = orderList.reduce((total, order) => {
		if (checkedOrderCodes.includes(order.orderId)) {
			total += (order.showMoney * 1)
		}
		return total
	}, 0)
	return (orderMoney * 1).toFixed(2)
}


const tabBar = [
	{
		name: '停车',
		id: 1,
		isShow:true,
		icon:'order_parking'
	},
	{
		name: '加油',
		id: 3,
		isShow:true,
		icon:'order_oil'
	},
	{
		name: '洗车',
		id: 7,
		isShow:true,
		icon:'order_wash'
	},
	{
		name: '车位租赁',
		id: 2,
		isShow:true,
		icon:'order_rent'
	},
	{
		name: '车辆保养',
		id: 8,
		isShow:true,
		icon:'order_maintain'
	},
	{
		name: '车辆检测',
		id: 6,
		isShow:true,
		icon:'order_exam'
	},
	
	// {
	// 	name: '其他',
	// 	id: 7,
	// 	isShow:true,
	// 	icon:''
	// }
]
export const getTabBars = () => {
	return tabBar
}


// tabBar2按照传参顺序排列 
const tabBar2 = [
	// 停车
	[{
			name: '待支付',
			status: '3',
			alias: 'unpaid',
			loadOrderActionName: 'getUnpaiedOrdersAction',
			showPayName: true
		},
		{
			name: '进行中',
			status: '1',
			alias: 'ongoing',
			loadOrderActionName: 'getOngoingOrdersAction',
			showPayName: false
		},
		{
			name: '已完成',
			status: '2',
			alias: 'finished',
			loadOrderActionName: 'getFinishedOrdersAction',
			showPayName: false
		}
	],
	// 加油
	[{
			name: '已完成',
			status: '1',
			alias: 'unpaid',
			loadOrderActionName: 'getUnpaiedOrdersAction',
			showPayName: false
		},
		{
			name: '退款/售后',
			status: '2',
			alias: 'ongoing',
			loadOrderActionName: 'getOngoingOrdersAction',
			showPayName: false
		}
	],
	// 洗车
	[{
			name: '待使用',
			status: '1',
			alias: 'unpaid',
			loadOrderActionName: 'getUnpaiedOrdersAction',
			showPayName: false
		},
		{ 
			name: '已使用',
			status: '2',
			loadOrderActionName: 'getOngoingOrdersAction',
			alias: 'ongoing',
			showPayName: false
		},
		{
			name: '退款/售后',
			status: '3',
			loadOrderActionName: 'getFinishedOrdersAction',
			alias: 'finished',
			showPayName: false
		}
	],
	// 租赁
	[{
			name: '租赁中',
			status: '1',
			alias: 'unpaid',
			loadOrderActionName: 'getUnpaiedOrdersAction',
			showPayName: false
		},
		{
			name: '待生效',
			status: '2',
			loadOrderActionName: 'getOngoingOrdersAction',
			alias: 'ongoing',
			showPayName: false
		},
		{
			name: '已到期',
			status: '3',
			loadOrderActionName: 'getFinishedOrdersAction',
			alias: 'finished',
			showPayName: false
		}
	],

	// 保养
	[{
			name: '待使用',
			status: '1',
			alias: 'unpaid',
			loadOrderActionName: 'getUnpaiedOrdersAction',
			showPayName: false
		},
		{
			name: '已使用',
			status: '2',
			loadOrderActionName: 'getOngoingOrdersAction',
			alias: 'ongoing',
			showPayName: false
		},
		{
			name: '退款/售后',
			status: '3',
			loadOrderActionName: 'getFinishedOrdersAction',
			alias: 'finished',
			showPayName: false
		}
	],
	// 车检
	[{
			name: '待使用',
			status: '1',
			alias: 'unpaid',
			loadOrderActionName: 'getUnpaiedOrdersAction',
			showPayName: false
		},
		{
			name: '已使用',
			status: '2',
			loadOrderActionName: 'getOngoingOrdersAction',
			alias: 'ongoing',
			showPayName: false
		},
		{
			name: '退款/售后',
			status: '3',
			loadOrderActionName: 'getFinishedOrdersAction',
			alias: 'finished',
			showPayName: false
		}
	],

	// 其他
	// [{
	// 		name: '已完成',
	// 		status: '3',
	// 		alias: 'unpaid',
	// 		loadOrderActionName: 'getUnpaiedOrdersAction',
	// 		showPayName: false
	// 	},
	// 	{
	// 		name: '退款/售后',
	// 		status: '1',
	// 		loadOrderActionName: 'getOngoingOrdersAction',
	// 		alias: 'ongoing',
	// 		showPayName: false
	// 	}
	// ],
]
export const getTabBars2 = (id) => {
	return tabBar2[id]

}
