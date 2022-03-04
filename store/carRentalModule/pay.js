import {rentOrderPay,rentOrderList,cancelRentOrder} from "@/api"

import {isValidResponse} from '@/utils'

export default {
	namespaced: true,
	state:() => ({
		payVisible:false,
		payInfo:{},
		rentList:{
			pageIndex : 1,
			isEndSuccess: false,
			rentListData:[],
			currentRentListData:[]
		}
	}),
	actions:{
		async payAction({commit,state},{orderId,payType}){
			console.log(orderId)
			console.log(payType)
			const {data} = await rentOrderPay({orderId,payType})
			return new Promise((res,rej) => {
				isValidResponse(data) && res(data.obj)
			})
		},
		async cancelRentOrderAction({commit,state},{orderId}){
			const {data} = await cancelRentOrder({orderId})
		},
		async getRentOrderListAction({commit,state},pageIndex){
			const {data} = await rentOrderList({pageIndex:pageIndex})
			isValidResponse(data) && commit("updateRentOrderList",data.obj.list)
		}
	},
	mutations:{
		updatePayVisible(state,value){
			state.payVisible = value
		},
		updatePayInfo(state,payInfo){
			state.payInfo = payInfo
		},
		updateRentOrderList(state,rentListData){
			state.rentList.isEndSuccess = !!rentListData.length >= 10
			state.rentList.currentRentListData = rentListData
			
			if(state.rentList.pageIndex == 1){
				state.rentList.rentListData = rentListData
			}else{
				state.rentList.rentListData = state.rentList.rentListData.concat(rentListData)
			}
		}
	}
}