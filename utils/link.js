import {
	mapQuery
} from './miniLodash'

export const goLink = (url, data) => {
	if (!url) {
		return false
	}
	if (url[0] == '/') {
		if (data) {
			if (url.indexOf('?') > 0) {
				uni.navigateTo({
					url: url + '&' + mapQuery(data)
				});
			} else {
				uni.navigateTo({
					url: url + '?' + mapQuery(data)
				});
			}
		} else {
			uni.navigateTo({
				url
			});
		}
	} else {
		if (data) {
			const {
				path,
				...params
			} = data
			const completeUrl = url + '?' + mapQuery(params) + path
			uni.navigateTo({
				url: '/pages/web_view/index?url=' + encodeURIComponent(completeUrl)
			});
		} else {
			uni.navigateTo({
				url: '/pages/web_view/index?url=' + encodeURIComponent(url)
			});
		}
	}
}
