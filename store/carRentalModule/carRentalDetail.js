
import { get } from '@/utils/miniLodash'

import { getParkingRentDetailOfCode, addRentOrder, getNewPortOfType } from '@/api';
import http from '@/api/requestIntercept.js'
import { mapParkingDetailData, isValidResponse } from '@/utils'

export default {
	namespaced: true,
	state: () => ({
		address: '',
		parkingName: '',
		imgUrls: '',
		typeList: '', // 可选服务类型，年卡、月卡、周卡,
		location: {
			longitude: undefined,
			latitude: undefined,
		},
		rentalDetailReadied: {
			orderId: undefined, 
			money: '',
			payMoney: '',
			validTime: '',
			invalidTime: '', 
			selectedBrand: {},	
			selectedCardType: {}, 
			selectedLot: {}, 
			address: '',
			parkingName: '',
			imgUrls: ''
		}
	}),
	actions: {
		async getParkingRentDetailOfCodeAction ({commit, rootState}, {parkingCode, rentInfoCode, type}) {
			const {data} = await getParkingRentDetailOfCode({ parkingCode, rentInfoCode, type })
			let mapedParkingDetail = {}
			if(isValidResponse(data)) {
				mapedParkingDetail = mapParkingDetailData(data.obj, rootState)
				commit('updateRentalParkingDetail', {rootState, mapedParkingDetail})
			}			
			return new Promise((res) => {
				res(mapedParkingDetail.typeList)
			})
		},
		async addRentOrderAction({}, rentInfo) {
			const { roleId, cardCount, areaId, lotId, price, parkingCode, carNum, startTime, type } = rentInfo;
			const {data} = await addRentOrder({ roleId, cardCount, areaId, lotId, price, parkingCode, carNum, startTime, type })
			return new Promise((res,rej) => {
				isValidResponse(data) && res(data.obj)
			})
		},
		async getNewPortOfTypeAction({}, type) {
			const {data} = await getNewPortOfType({ type })
			return new Promise((res,rej) => {
				isValidResponse(data) && res(get(data, 'obj.newPort'))
			})
		}
	},
	mutations: {
		updateRentalParkingDetail(state, {rootState={}, mapedParkingDetail={}}) {
			Object.keys(state).forEach((stateKey) => {
				state[stateKey] = mapedParkingDetail[stateKey]
			})
		},
		updateRentalDetailReadied(state, rentalOrderData) {
			state.rentalDetailReadied = rentalOrderData
		},
	}
}