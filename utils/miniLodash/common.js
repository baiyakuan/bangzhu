var funcTag = '[object Function]'
var objTage = '[object Object]'
var arrTag = '[object Array]'
var dateTag = '[object Date]'

var objectProto = Object.prototype;
	
var objectToString = objectProto.toString;

function isEqualTag(value, tag) {
	return objectToString.call(value) === tag
}

function isArray(value) {
	return isEqualTag(value, arrTag)
}

function isObject(value) {
  return isEqualTag(value, objTage)
}

function isFunction(value) {
	return isEqualTag(value, funcTag)
}

function isDate(value) {
	return isEqualTag(value,dateTag)
}



export {
	isArray,
	isObject,
	isFunction,
	isDate
}
