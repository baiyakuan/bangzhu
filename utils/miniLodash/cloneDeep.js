import {isArray, isObject, isDate} from './common.js'

export default function cloneDeep(obj) {
    let result = isArray(obj) ? [] : {};
    if (isArray(obj) || isObject(obj)) {
        for (let key in obj) {
			result[key] = cloneDeep(obj[key]);
        }
        return result;
    }
	if (isDate(obj)) {
		return new Date(obj)
	}
    return obj;
}