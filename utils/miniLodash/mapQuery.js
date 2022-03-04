import{ isObject } from './common.js'

export default function mapQuery (obj) {
	if (!isObject(obj)) {
		return ''
	}
	let result = [];
	for(let key in obj) {
		let val=obj[key]
		val=encodeURIComponent(val)
		let query = `${key}=${val}`
		result.push(query)
	}
	return result.join('&')
}