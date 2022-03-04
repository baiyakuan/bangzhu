import cloneDeep from './cloneDeep.js'

export default function omit(obj, value) {
	let result = {}
	let cloneObj = cloneDeep(obj)
	for (let key in cloneObj) {
		if (key !== value) {
			result[key] = cloneObj[key]
		}
	}
	return result
}