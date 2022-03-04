import {isArray, isObject} from './common.js'
import cloneDeep from './cloneDeep.js'

export default function get(object, path, defaultValue) {
	if (!isArray(object) && !isObject(object)) {
		return defaultValue
	}

	var pathArr = path
	if (!Array.isArray(path)) {
		var replacedArr = path.replace(/\[/g, '.').replace(/\]/g, '').split('.')
		replacedArr[0] == '' && replacedArr.shift()
		pathArr = replacedArr
	}
	const returnValue = pathArr.reduce((o, k) => (o || {})[k], object) || defaultValue;
	return cloneDeep(returnValue)
}