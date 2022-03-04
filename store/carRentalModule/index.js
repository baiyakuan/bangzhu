import { searchParkingOfRent } from '@/api';
import http from '@/api/requestIntercept.js'
import {concatImgUrls, isValidResponse} from '@/utils'
import carRentalDetailModule from './carRentalDetail.js'
import carRentalOrderListModule from './carRentalOrderList.js'
import carRentalOrderPayModule from './carRentalOrderPay.js'
import { get } from '@/utils/miniLodash'

const getParkingTokenSet = new Set();

const invokeParkingListApi = ({ commit, rootState }, selectedParkingInfo={}, type) => {
	let cancelToken = + new Date()
	const { longitude, latitude } = rootState.location
	return new Promise((res,rej) => {
		http.cancelRequests(getParkingTokenSet)
		getParkingTokenSet.add(cancelToken)
		searchParkingOfRent({ ...selectedParkingInfo, lut: longitude, lat: latitude, type }, cancelToken).then((data) => {
			getParkingTokenSet.delete(cancelToken)
			res(data)
		})
	})
}

export default {
	namespaced: true,
	state: () => ({
		rentalParkings: [],
		parkingSearch: {
			searchResults: [],
			searchHistories: [],
			searchValue: ''
		},
		parkingFilter: {
			filterRule: {
				cardType: 0,
				timeInterval: 0,
				dayParkRule: 0,
				rentArea: 1
			}
		}
	}),
	actions: {
		getParkingOfRentAction ({ commit, rootState, state }, { type }) {
			return new Promise(async (resolve, reject) => {
				const {data} = await invokeParkingListApi({ commit, rootState }, state.parkingFilter.filterRule, type);
				if (isValidResponse(data)) {
					const parkings = get(data, 'obj.parkings', [])
					commit('updateRentalParkings', parkings)
					resolve(parkings)
				} else {
					reject(data)
				}
			})
		},
		async searchParkingOfRentAction ({ commit, rootState }, {parkingName, type}) {
			const {data} = await invokeParkingListApi({ commit, rootState }, {parkingName}, type);
			isValidResponse(data) && commit('updateSearchPrkings', get(data, 'obj.parkings'));
		}
		
	},
	mutations: {
		updateRentalParkings(state, rentalParkings) {
			state.rentalParkings = rentalParkings
		},
		updateSearchPrkings(state, searchResults) {
			state.parkingSearch.searchResults = searchResults
		},
		clearSearchResults(state) {
			state.parkingSearch.searchResults = []
		},
		updateFilterParkings(state, filterRule) {
			state.parkingFilter.filterRule = filterRule
		},
		resetFilterParkings(state) {
			state.parkingFilter.filterRule = {
				cardType: 0,
				timeInterval: 0,
				dayParkRule: 0,
				rentArea: 1
			}
		}
	},
	modules: {
		carRentalDetailModule,
		carRentalOrderListModule,
		carRentalOrderPayModule,
	}
}


