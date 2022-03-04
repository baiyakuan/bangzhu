import {get, baseUtil} from '@/utils/miniLodash'

const defaultToastFn = (data) => {
	uni.showToast({
		mask: true,
		icon: 'none',
		title: get(data, 'msg')
	})
}

export const isValidResponse = (responseData) => get(responseData, 'code', '') === '1'

export const showToast = ({
	isShowToast,
	toastFn,
	data
}) => {
	if (isShowToast) {
		if (baseUtil.isFunction(toastFn)) {
			toastFn(data)
		} else {
			defaultToastFn(data)
		}
	}
}