	import { getNearStation,paymethods,countStationPayMoney,selectByManage} from '@/api'
	import { isValidResponse } from '@/utils'
	export default {
		namespaced: true,
		state: () => ({
			nearStation:{},
			gasList:[],
			stationList:[],
			
			discountMoney:'---',
			payMoney:'---',
			
			// iconInfo:''
		}),
		actions: {
			async getNearStation ({commit, state, rootState}, {longitude, latitude,range,gasType}) {
				const {data} = await getNearStation({ longitude, latitude,range,gasType ,istrue:true})
				if(isValidResponse(data)) {
					if(data.obj.refuelStationInfo.length){
						commit('updateNearStation', data.obj.refuelStationInfo[0])
						commit('updatestationList', data.obj.refuelStationInfo)
					}else{
						commit('clearStationData')
					}
				}		
			},
			async toPay ({commit, state, rootState}, postData) {
				const {data} = await paymethods(postData)		
				return new Promise((res) => {
					res(data.obj)
				})
			},
			async countStationPayMoneyFun ({commit, state, rootState}, postData) {
				const {data} = await countStationPayMoney({...postData,istrue:true})
				if(isValidResponse(data)) {
					commit('setMoney',data.obj)
				}
			},
			// async selectByManage ({commit, state, rootState}, {type,requestType,version}) {
			// 	const {data} = await selectByManage({type,requestType,version,istrue:true})
			// 	if(isValidResponse(data)) {
			// 		commit('setIconInfo',data.obj.list[0])
			// 	}	
			// },
		},
		mutations:{
			setMoney(state,money){
				state.payMoney = (money.litre).toFixed(2)
				state.discountMoney = (money.discount).toFixed(2)
			},
			resetMoney(state,money){
				state.payMoney = '---'
				state.discountMoney = '---'	
			},
			updateNearStation(state,stationData){
				state.gasList = stationData.gasList
				state.nearStation = stationData	
			},
			updatestationList(state,stationListData){
				state.stationList = stationListData
			},
			clearStationData(state){
				state.nearStation = ''
				state.gasList = []
				state.stationList = []
			},
			// setIconInfo(state,info){
			// 	state.iconInfo = info
			// },
		}
	}