import { getBrandList, addBrand } from '@/api'
import { isValidResponse } from '@/utils'


export default {
	namespaced: true,
	state: () => ({
		brandList: [],
		loginCallback: undefined,
	}),
	actions: {
		async getBrandListAction({commit}) {
			const {data} = await getBrandList()
			isValidResponse(data) && commit('updateBrandList', data.obj.brandList)
			return new Promise((res,rej) => {
				res(data.obj.brandList)
			})
		},
		async addBrandAction({commit}) {
			await addBrand()
		}
	},
	mutations: {
		updateBrandList(state, newBrandList) {
			state.brandList = newBrandList
		},
		setLoginCallback(state, fn) {
			state.loginCallback = fn
		},
		resetLoginCallback(state) {
			state.loginCallBack = undefined
		}
	}
}