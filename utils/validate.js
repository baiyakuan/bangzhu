
/* 手机号码*/
export function validatePhone(str) {
  // const reg = /^0?(13[0-9]|19[0-9]|15[012356789]|18[0123456789]|14[57]|17[678]|170[059]|14[57]|166)[0-9]{8}$/
  const reg = /^1[3|4|5|8|9|7][0-9]\d{8}$/
  return reg.test(str)
}
// 1开头并且11位数字
export function validatePhone1(str) {
  // const reg = /^0?(13[0-9]|19[0-9]|15[012356789]|18[0123456789]|14[57]|17[678]|170[059]|14[57]|166)[0-9]{8}$/
  const reg = /^1[0-9]{10}$/
  return reg.test(str)
}
/**
 * 身份证
 */
export function validateIdCard (str) {
  const reg18 = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/
  return reg18.test(str)
}
/**
 * 验证码
 */
export function validateQRcode (str) {
  const pattern  = /^[A-Za-z0-9]+$/
  return pattern.test(str)
}

// 不能输入emoji
export function validateEMoji(str){
  const regEmoji =  /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig;
  return regEmoji.test(str)
}

