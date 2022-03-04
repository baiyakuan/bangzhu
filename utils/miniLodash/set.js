import {isArray, isObject} from './common.js'
import cloneDeep from './cloneDeep.js'

export default function set(object, path, value) {
	if (!isArray(object) && !isObject(object)) {
		return
	}
	var pathArr = path
	if (!Array.isArray(path)) {
		var replacedArr = path.replace(/\[/g, '.').replace(/\]/g, '').split('.')
		replacedArr[0] == '' && replacedArr.shift()
		pathArr = replacedArr
	}
	pathArr.reduce((o, k, i) => {
		if (i == pathArr.length-1) {
			o[k] = value
		}
		return (o || {})[k]
	}, object);
	return object
}