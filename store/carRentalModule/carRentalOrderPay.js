import {rentOrderPay,cancelRentOrder} from "@/api"

import {isValidResponse} from '@/utils'

export default {
	namespaced: true,
	state:() => ({
		payVisible:false,
		payInfo:{}
	}),
	actions:{
		async payAction({commit,state},{orderId,payType}){
			const {data} = await rentOrderPay({orderId,payType})
			return new Promise((res,rej) => {
				isValidResponse(data) && res(data.obj)
			})
		},
		async cancelRentOrderAction({commit,state},{orderId}){
			const {data} = await cancelRentOrder({orderId})
		},
	},
	mutations:{
		updatePayVisible(state,value){
			state.payVisible = value
		},
		updatePayInfo(state,payInfo){
			state.payInfo = payInfo
		}
	}
}