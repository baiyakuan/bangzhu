import {isFunction } from './common.js'

export default function searchIndex(array, findOption) {
	var i = 0
	for (i; i <= array.length && i>=0; i++) {
		if (i == array.length) {
			i = -1
			break
		} else if (isFunction(findOption) ? findOption(array[i]) : findOption == array[i]) {
			break
		} 
	}
	return i 
}