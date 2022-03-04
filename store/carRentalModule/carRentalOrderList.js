import {rentOrderList,rentOrderDetail,selectByRentOnline} from "@/api"

import {isValidResponse,mapOrderListData} from '@/utils'

export default {
	namespaced: true,
	state:() => ({
		rentListInfo:{
			pageIndex : 1,
			isEndSuccess: false,
			allRentListData:[],
			currentRentListData:[]
		},
		selectList:[],
		orderDetail:{},
	}),
	getters:{
		selectListSum : state => {
			let sum = 0;
			state.selectList.map((item) => {
				sum += item.billStatus
			})
			return sum
		},
		isSelectAll : state => {
			return state.rentListInfo.allRentListData.length === state.selectList.length
		}
	},
	actions:{
		async getRentOrderListAction({commit,state},{pageIndex,type}){
			const {data} = await rentOrderList({pageIndex,type})
			if(isValidResponse(data)){
				commit("updateRentOrderList", mapOrderListData(data.obj.list,false))
				// commit("updateRentOrderList",data.obj.list)
			}
			return new Promise((res,rej) => {
				res({ data : mapOrderListData(data.obj.list) })
			})
		},
		async getRentOrderDetailAction({commit,state},orderId){
			const {data} = await rentOrderDetail({orderId:orderId})
			isValidResponse(data) &&  commit("updateRentOrderDetail",data.obj)
		},
		async getSelectByRentOnline({commit,state},rentInfoCode){
			const {data} = await selectByRentOnline({rentInfoCode:rentInfoCode})
			return new Promise((res,rej) => {
				isValidResponse(data) && res(data.obj)
			})
		}
	},
	mutations:{
		updateRentOrderList(state,rentListData){
			state.rentListInfo.isEndSuccess = rentListData.length < 10
			state.rentListInfo.currentRentListData = rentListData
			
			if(state.rentListInfo.pageIndex == 1){
				state.rentListInfo.allRentListData = rentListData
			}else{
				state.rentListInfo.allRentListData = state.rentListInfo.allRentListData.concat(rentListData)
			}
		},
		updateSelectList(state,listData){
			state.selectList = listData
		},
		clearSelectList(state){
			state.selectList = []
		},
		updateRentOrderDetail(state,orderDetail){
			state.orderDetail = orderDetail
		},
	}
}