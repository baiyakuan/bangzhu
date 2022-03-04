import {isFunction} from './common.js'
import get from './get.js'

export default function groupBy(array, fn) {
	let execute = isFunction(fn) ? fn : (o) => get(o, fn)
	let groups = {}
	array.forEach((item) => {
		let group = execute(item)
		groups[group] = groups[group] || [];
		groups[group].push( item );
	})
	return groups
}