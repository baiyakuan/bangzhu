
const authKey  = 'token'

// 获取本地存储的token
export function getToken () {
  return uni.getStorageSync(authKey)
}

// 保存token到本地缓存
export function setToken (token) {
  uni.setStorageSync(authKey, token)
}
// 清除本地token
export function removeToken () {
  uni.removeStorageSync(authKey)
}
// 获取到本地缓存
export function getStorage (key) {
  return uni.getStorageSync(key)
}
// 保存本地缓存
export function setStorage (key,data) {
  uni.setStorageSync(key,data)
}