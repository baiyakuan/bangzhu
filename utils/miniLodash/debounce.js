export default function debounce(func, wait, immediate) {
    let timeout, result;
    let debounced = function() {
		let context = this;
		let args = arguments;
		if (timeout) clearTimeout(timeout);
			let later = function() {
		    timeout = null;
		    if (!immediate) result = func.apply(context, args);
		};
        let callNow = immediate && !timeout;
        timeout = setTimeout(later, wait);
        if (callNow) result = func.apply(this, args);
        return result;
    }
    debounced.cancel = function() {
        clearTimeout(timeout);
        timeout = null;
    };
    return debounced;
}