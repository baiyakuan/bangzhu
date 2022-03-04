import store from '@/store';
import {
	get,
	baseUtil
} from '@/utils/miniLodash'
import {
	showToast
} from '@/utils'

let istrue = true;
const requesetSet = new Set();

const deleteRequest = (set, req) => {
	set.forEach((item) => {
		item.cancelToken === req.cancelToken
		set.delete(item)
	})
}

export default {
	config: {
		header: {
			'Content-Type': 'application/json;charset=UTF-8',
			'Content-Type': 'application/x-www-form-urlencoded',
			'Authorization': store && store.state.token
			// 'Authorization':'eyJhbGciOiJIUzI1NiJ9.eyJ1c2Vyc1Bob25lIjoiMTAyMzEwMTk5NTExQHFxLmNvbSIsInVzZXJzSWQiOiJCVlVJMTAwMTIyMjAxMzUzIiwiY3RpbWUiOjE2MDc1Njk2MTkwMDB9.nGcWzs1L1doK4KCtJHp8k5suUt4pu3FRjbkX-SAWfSM'
		},
		data: {},
		method: "POST",
		dataType: "json",
		success() {},
		fail() {},
		complete() {},
		cancelToken: undefined, //必须传入Number类型
		toastFn: undefined,
		isShowToast: false
	},
	request(options) {
		if (!options) {
			options = {}
		}
		if (!options.data) {
			options.data = {};
		}
		istrue = options.data.istrue;
		if (istrue === false) {
			uni.showLoading({
				title: '加载中',
				// #ifdef MP-WEIXIN
				mask: true
				// #endif
			});
		}

		options.dataType = options.dataType || this.config.dataType
		if (options.url.indexOf('http') == -1) {
			options.url = store.state.BASE_URL + options.url
		}
		options.data = options.data || {}
		options.method = options.method || this.config.method

		return new Promise((resolve, reject) => {
			let _config = null
			let requestTask = null

			options.complete = (response) => {
				if (istrue === false) uni.hideLoading()
				let statusCode = response.statusCode
				response.config = _config
				deleteRequest(requesetSet, requestTask)
				if (statusCode === 200) {
					resolve(response);
				} else {
					reject(response)
				}
				showToast({
					toastFn: _config.toastFn,
					isShowToast: _config.isShowToast,
					data: response.data
				});
			}
			this.config.header.Authorization = store.state.token
			_config = Object.assign({}, this.config, options)
			_config.requestId = new Date().getTime()
			requestTask = uni.request(_config);
			_config.cancelToken && requesetSet.add({
				requestTask,
				cancelToken: _config.cancelToken
			})
		});
	},
	get(url, data, options) {
		if (!options) {
			options = {}
		}
		options.url = url
		options.data = data
		options.method = 'GET'
		return this.request(options)
	},
	post(url, data, options) {
		if (!options) {
			options = {}
		}
		options.url = url
		options.data = data
		options.method = 'POST'
		return this.request(options)
	},
	put(url, data, options) {
		if (!options) {
			options = {}
		}
		options.url = url
		options.data = data
		options.method = 'PUT'
		return this.request(options)
	},
	delete(url, data, options) {
		if (!options) {
			options = {}
		}
		options.url = url
		options.data = data
		options.method = 'DELETE'
		return this.request(options)
	},
	// cancelRequests 只接受Set容器
	cancelRequests(abortTokens) {
		requesetSet.forEach((requestItem) => {
			abortTokens.has(requestItem.cancelToken) && requestItem.requestTask.abort();
		})
	}

}
