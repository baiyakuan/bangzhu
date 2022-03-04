import store from '@/store'
import http from './requestIntercept'
import {
	get
} from '@/utils/miniLodash'

// 登录
export function userLogin(data) {
	return http.request({
		url: '/users/userLogin',
		data
	})
	// return http.request({
	//     url: '/users/get3rdSession',
	//     data,
	// })
}
//获取手机验证码
export function getPhoneCode(data) {
	return http.request({
		url: '/users/getPhoneCode',
		data
	})
}
//动态菜单
export function getMenu(data) {
	return http.request({
		url: '/config/dynamic/menu',
		data
	})
}
//天气
export function getWeather(data) {
	return http.request({
		url: '/weather/getLocalWeather',
		data
	})
}
// 瀑布流、待支付图片、首页顶部图片
export function getHomeShow(data) {
	return http.request({ 
		url: '/config/ad/homeshow',
		data
	})
}

//获取图形验证码
export function getImgCode(data) {
	return http.request({
		url: '/file/downloadValidateCodeImg',
		method: 'GET',
		data
	})
}

//活动列表
export function appNoticeList(data) {
	return http.request({
		url: '/appnotice/appNoticeList',
		data
	})
}
// 获取用户信息
export function getUsersInfo() {
	return http.request({
		url: '/users/nlg/getUsersInfo',
		method: 'GET'
	})
}

// 获取支付宝会员user_id信息
export function getAliUserinfo(data) {
	return http.request({
		url: '/users/getAliUserinfo',
		data
	})
}
//解析支付宝手机号直接登录（支付宝小程序登录）
export function zfbLogin(data) {
	return http.request({
		url: '/users/zfbLogin',
		data
	})
}

//OpenId存后台（支付宝小程序登录）
export function zfbSaveOpenId(data) {
	return http.request({
		url: '/users/nlg/zfbSaveOpenId',
		data
	})
}

// 获取地图中心3km内推荐停车场
export function searchParkingByRange(data) {
	return http.request({
		url: '/barrierGateParking/searchParkingByRange',
		data
	})
}

// 获取停车场列表
export function getParkingOfLL(data) {
	return http.request({
		url: '/parking/getParkingOfLL',
		data
	})
}

// 获取停车场详情
export function getParkingInfo(data) {
	return http.request({
		url: '/parking/nlg/getParkingInfo',
		data
	})
}
// 获取停车场详情(优化后)
export function getParkingListInfo(data) {
	return http.request({
		url: '/parking/nlg/getParkingListInfo',
		data
	})
}

// 获取停车场详情广告
export function getRentAdvByParkingCode(data) {
	return http.request({
		url: '/advertManage/getRentAdvByParkingCode',
		data
	})
}

// 扫码后获取车场信息
export function toParking(data) {
	return http.request({
		url: '/scavening/toParking',
		data
	})
}

// 获取车牌列表
export function getBrandList() {
	return http.request({
		url: '/brand/nlg/brandList',
		method: 'GET',
		data: {
			istrue: true
		}
	})
}

// 获取停车场空闲车位列表
export function getFreeCarList(data) {
	return http.request({
		url: '/parking/freeCarList',
		method: 'GET',
		data
	})
}

// 实名认证
export function validation(data) {
	return http.request({
		url: '/users/nlg/validation',
		method: 'GET',
		data
	})
}

// 新增车牌
export function addBrand(data) {
	return http.request({
		url: '/brand/nlg/addBrand',
		data
	})
}

// 确认下单
export function confirmOrder(data) {
	return http.request({
		url: '/orders/nlg/confirmOrder',
		data
	})
}
// 修改用户信息
export function updateUserInfo(data) {
	return http.request({
		url: '/users/nlg/updateUserInfo',
		data
	})
}

// 获取用户身份信息
export function getUsersidCard() {
	return http.request({
		url: '/users/nlg/getUsersidCard',
		method: 'GET',
	})
}

// 获取发票地址
export function getInvoiceList() {
	return http.request({
		url: '/invoice/nlg/getInvoiceList'
	})
}

// 新增发票地址
export function addInvoice(data) {
	return http.request({
		url: '/invoice/nlg/addInvoice',
		data
	})
}

// 查询 省、市、去
export function getArea(data) {
	return http.request({
		url: '/users/getArea',
		data
	})
}

// 设置默认发票地址 invoice/nlg/defualtInvoice
export function defualtInvoice(data) {
	return http.request({
		url: '/invoice/nlg/defualtInvoice',
		data
	})
}

// 获取发票详情
export function getInvoiceInfo(data) {
	return http.request({
		url: '/invoice/nlg/getInvoiceInfo',
		data
	})
}

// 获取银行卡列表
export function getBankLists(data) {
	return http.request({
		url: '/bank/nlg/getBankLists',
		method: 'GET',
		data
	})
}
// 获取银行卡列表
export function getBankLists2(data) {
	return http.request({
		url: '/bank/nlg/getBankLists2',
		method: 'GET',
		data
	})
}

// 新增银行卡
export function addBank(data) {
	return http.request({
		url: '/bank/nlg/addBank',
		data
	})
}

// 删除银行卡
export function deleteBankByKey(data) {
	return http.request({
		url: '/bank/nlg/deleteBankByKey',
		method: 'POST',
		data
	})
}

// 订单列表
export function OrderListOfUser(data) {
	return http.request({
		url: '/orders/nlg/OrderListOfUser',
		method: 'GET',
		data
	})
}

// 删除订单
export function deleteOrderBathch(data) {
	return http.request({
		url: '/barrierGateParking/nlg/deleteOrderBathch',
		method: 'POST',
		data
	})
}

// 订单详情
export function getOrderInfo(data) {
	return http.request({
		url: '/orders/nlg/getOrderInfo',
		method: 'GET',
		data
	})
}

// 进行中的订单详情
export function getDoOrderInfo(data) {
	return http.request({
		url: '/orders/nlg/getDoOrderInfo',
		method: 'GET',
		data
	})
}

// 取消订单
export function updateOrderWaitPay(data) {
	return http.request({
		url: '/orders/nlg/updateOrderWaitPay',
		method: 'POST',
		data
	})
}
// 车位开锁
export function openLock(data) {
	return http.request({
		url: '/lock/nlg/openLock',
		method: 'POST',
		data
	})
}

// 立即开锁
export function atOnceUnlock(data) {
	return http.request({
		url: '/orders/nlg/atOnceUnlock',
		method: 'POST',
		data
	})
}

//车位鸣笛
export function beepLock(data) {
	return http.request({
		url: '/lock/nlg/beepLock',
		method: 'POST',
		data
	})
}
// 订单支付
export function orderPay(data) {
	return http.request({
		url: '/pay/nlg/orderPay',
		data
	})
}
// 用户钱包
export function wallet(data) {
	return http.request({
		url: '/users/nlg/wallet',
		data
	})
}

// 消费记录
export function counsumpotionList(data) {
	return http.request({
		url: '/users/nlg/counsumpotionList',
		method: 'GET',
		data
	})
}

// 我的车位列表
export function carList(data) {
	return http.request({
		url: '/car/nlg/carList',
		data
	})
}

// 根据地质获取停车场列表
export function getParkingOfAddress(data) {
	return http.request({
		url: '/parking/getParkingOfAddress',
		data
	})
}

// 新增车位
export function addCar(data) {
	return http.request({
		url: '/car/nlg/addCar',
		data
	})
}

// 删除车牌
export function delBrand(data) {
	return http.request({
		url: '/brand/nlg/delBrand',
		data
	})
}

// 获取车辆类型
export function brandtypeList() {
	return http.request({
		url: '/brandtype/brandtypeList',
		method: 'GET'
	})
}

// 查看车牌详情
export function getBrandInfo(data) {
	return http.request({
		url: '/brand/nlg/getBrandInfo',
		method: 'GET',
		data
	})
}

// 更新车牌
export function updateBrand(data) {
	return http.request({
		url: '/brand/nlg/updateBrand',
		data
	})
}

// 删除发票
export function delInvoiceById(data) {
	return http.request({
		url: '/invoice/nlg/delInvoiceById',
		data
	})
}

// 更新发票
export function updateInvoice(data) {
	return http.request({
		url: '/invoice/nlg/updateInvoice',
		data
	})
}

// 服务电话
export function getServicePhone() {
	return http.request({
		url: '/servicePhone/getServciePhoneList'
	})
}

// 获取协议
export function getNewPortInfo(data) {
	return http.request({
		url: '/newsport/getNewPortOfType',
		method: 'POST',
		data
	})
}
// 获取协议详情
export function getNewPortInfoDetails(data) {
	return http.request({
		url: '/newsport/getNewPortInfo',
		method: 'POST',
		data
	})
}

// 故障上报
export function addSOS(data) {
	return http.request({
		url: '/sos/nlg/addSOS',
		data
	})
}

// 故障类型
export function faultList() {
	return http.request({
		url: '/fault/faultList',
		method: 'GET',
	})
}

// 新增发票
export function addBill(data) {
	return http.request({
		url: '/bill/nlg/addBill',
		data
	})
}

// 获取优惠券
export function discountList(data) {
	return http.request({
		url: '/usersDiscount/nlg/discountList',
		method: 'GET',
		data
	})
}
// 获取优惠券
export function orderDiscountList(data) {
	return http.request({
		url: '/usersDiscount/nlg/orderDiscountList',
		method: 'GET',
		data
	})
}

// 获取车位详情
export function getCarInfo(data) {
	return http.request({
		url: '/car/nlg/getCarInfo',
		data
	})
}

// 后台获取openId
export function getOpenId(data) {
	return http.request({
		url: '/users/nlg/getOpenId',
		data
	})
}

// 获取小程序自定义登录状态
export function get3rdSession(data) {
	return http.request({
		url: '/users/get3rdSession',
		method: 'POST',
		data
	})
}
// 解密 用户自动登录
export function wxLogin(data) {
	return http.request({
		url: '/users/wxLogin',
		data
	})
}
// 解密用户敏感数据
export function decodeUserInfo(data) {
	return http.request({
		url: '/users/nlg/decodeUserInfo',
		data
	})
}
// 第三方登录
export function userAppLogin(data) {
	return http.request({
		url: '/users/userAppLogin',
		data
	})
}

// binding手机 /users/programBindPhone
export function bindPhone(data) {
	return http.request({
		url: '/users/bindPhone',
		data
	})
}

// binding手机 /users/programBindPhone
export function programBindPhone(data) {
	return http.request({
		url: '/users/programBindPhone',
		data
	})
}
// 充值 recharge
export function recharge(data) {
	return http.request({
		url: '/recharge/nlg/recharge',
		data
	})
}
// 获取充值列表
export function optionsListqd() {
	return http.request({
		url: '/options/optionsListqd',
		method: 'get'
	})
}
// 根据充值位置获取充值列表
export function getOptionsListqd(data) {
	return http.request({
		url: '/options/nlg/selectByOptions',
		data
	})
}

// 消费详情
export function orderInfo(data) {
	return http.request({
		url: '/users/nlg/orderInfo',
		data
	})
}

// 提现
export function frontAddWithdrawCash(data) {
	return http.request({
		url: '/withdrawcash/nlg/frontAddWithdrawCash',
		data
	})
}

// 更新车位锁编号
export function updateCarParklock(data) {
	return http.request({
		url: '/car/nlg/updateCarParklock',
		data
	})
}

// 删除车位
export function setCar(data) {
	return http.request({
		url: '/car/nlg/setCar',
		data,
		method: 'GET'
	})
}

// 设置共享时间
export function updateCarTime(data) {
	return http.request({
		url: '/car/nlg/updateCarTime',
		data
	})
}

// 获取白名单列表
export function whitelistListOfcarId(data) {
	return http.request({
		url: '/whitelist/whitelistListOfcarId',
		data,
		method: 'GET'
	})
}

// 删除白名单
export function delWhitelist(data) {
	return http.request({
		url: '/whitelist/nlg/delWhitelist',
		data
	})
}

// 新增白名单 
export function addWhitelist(data) {
	return http.request({
		url: '/whitelist/nlg/addWhitelist',
		data
	})
}

// 获取车位收入
export function getCarProfitList(data) {
	return http.request({
		url: '/car/nlg/getCarProfitList',
		data
	})
}
// 会员详情
export function memberinfo(data) {
	return http.request({
		url: '/renew/nlg/info',
		data
	})
}
// plus购买选项
export function getPlusOptions(data) {
	return http.request({
		url: '/plus/getPlusOptions',
		data
	})
}
// 会员续费
export function renew(data) {
	return http.request({
		url: '/renew/nlg/renew',
		data
	})
}
// PLUS优惠订单列表
export function OrderListOfUserPlus(data) {
	return http.request({
		url: '/orders/nlg/OrderListOfUserPlus',
		data
	})
}
// PLUS会员专属帮贝列表
export function getBangBeiByUserPlus(data) {
	return http.request({
		url: '/bangBei/nlg/getBangBeiByUserPlus',
		data
	})
}
// plus用户专属优惠券列表
export function discountListPlus(data) {
	return http.request({
		url: '/usersDiscount/nlg/discountListPlus',
		data
	})
}
//PLUS会员专属VIP卡列表
export function vipCard(data) {
	return http.request({
		url: '/renew/nlg/vipCard',
		data
	})
}
//PLUS会员专属VIP卡列表
export function getAllVipCodeByUser(data) {
	return http.request({
		url: '/merchant/nlg/getAllVipCodeByUser',
		data
	})
}
//获取联名vip卡详情
export function getVipCardInfoById(data) {
	return http.request({
		url: '/renew/nlg/getVipCardInfoById',
		data
	})
}
//发票邮费支付
export function payBill(data) {
	return http.request({
		url: '/bill/nlg/payBill',
		data
	})
}
//获取所有车位信息
export function getAllCarListByParking(data) {
	return http.request({
		url: '/parking/getAllCarListByParking',
		data
	})
}

// 扫码后获取商店详细数据
export function getPayPageData(data) {
	return http.request({
		url: '/merchant/nlg/getPayPageData',
		data
	})
}

// 商店扫码支付
export function sweepCodePay(data) {
	return http.request({
		url: '/pay/nlg/sweepCodePay',
		data
	})
}

// 扫描商品条码支付
export function buyGoodsPay(data) {
	return http.request({
		url: '/pay/nlg/buyGoodsPay',
		data
	})
}

// 微信支付商品失败
export function cancelPay(data) {
	return http.request({
		url: '/pay/nlg/cancelPay',
		data
	})
}
// 激活充值卡接口
export function actRefillCard(data) {
	return http.request({
		url: '/im/nlg/actRefillCard',
		data
	})
}
//根据支付编码获取支付信息
export function getPayDataByPayCode(data) {
	return http.request({
		url: '/merchant/nlg/getPayDataByPayCode',
		data
	})
}
//帮驻支付账单
export function bzpayBill(data) {
	return http.request({
		url: '/pay/nlg/payBill',
		data
	})
}
//获取分区车位数据
export function subCarList(data) {
	return http.request({
		url: '/ps/nlg/SubCarList',
		data
	})
}
//获取购物省钱订单列表
export function getBuyDiscount(data) {
	return http.request({
		url: '/renew/nlg/getBuyDiscount',
		data
	})
}
//获取购物省钱订单详情
export function getBuyDiscountMsg(data) {
	return http.request({
		url: '/renew/nlg/getBuyDiscountMsg',
		data
	})
}
//根据状态获取用户进行中订单列表
export function getOrderByStatus(data, cancelToken) {
	return http.request({
		url: '/barrierGateParking/nlg/getOrderByStatus',
		data,
		cancelToken
	})
}
//获取用户订单列表 (加油和停车)
export function getMyOrderList(data, cancelToken) {
	return http.request({
		url: '/barrierGateParking/nlg/getMyOrderList',
		data,
		cancelToken
	})
}
//获取用户订单列表type显示
export function getServiceManageBannerIsShow(data) {
	return http.request({
		url: '/barrierGateOrder/nlg/getServiceManageBannerIsShow',
		data
	})
}

// 首页进行中和待支付订单
export function getHomeOrderList(data) {
	return http.request({
		url: '/homeShow/nlg/orderTypeInfoWx',
		data
	})
}


//根据搜索词获取搜索停车场列表
export function getSearchParkingOfAddress(data) {
	return http.request({
		url: '/barrierGateParking/getParkingOfAddress',
		data
	})
}
// 获取停车场详情
export function getParkingByCode(data) {
	return http.request({
		url: '/barrierGateParking/getParkingByCodeNew',
		data
	})
}
//道闸 订单详情
export function getOrderByCode(data) {
	return http.request({
		url: '/barrierGateParking/nlg/getOrderByCode',
		data
	})
}

//道闸 订单详情 （加油和停车）
export function getOrderByOrderId(data) {
	return http.request({
		url: '/barrierGateParking/nlg/getOrderByOrderId',
		data
	})
}
// 金额明细
export function getOrderMoneyDetail(data) {
	return http.request({
		url: '/barrierGateParking/nlg/getOrderMoneyDetail',
		data
	})
}
//道闸 获取白名单列表
export function getBgWhiteListByUser(data) {
	return http.request({
		url: '/bgWhiteList/nlg/getBgWhiteListByUser',
		data
	})
}
//道闸 设置无感支付
export function setNoFeelingToPay(data) {
	return http.request({
		url: '/barrierGatePay/nlg/setNoFeelingToPay',
		data
	})
}
//道闸 未支付订单详情 
export function unpaidOrderMsg(data) {
	return http.request({
		url: '/barrierGatePay/nlg/unpaidOrderMsg',
		data
	})
}
// 单笔订单支付
export function bgOrderPay(data) {
	return http.request({
		url: '/pay/nlg/bgOrderPay',
		data
	})
}
//道闸 多订单的支付 
export function bgOrdersPay(data) {
	return http.request({
		url: '/pay/nlg/bgOrdersPay',
		data
	})
}
//道闸 获取抓包停车场详情
export function getParkingLotMsg(data) {
	return http.request({
		url: '/barrierGateParking/getParkingLotMsg',
		data
	})
}

// 获取引导开通免密支付参数
export function getWxNoFeelPayGuideInfo(data) {
	return http.request({
		url: '/wx/nlg/getWxNoFeelPayGuideInfo',
		data
	})
}
// 取消使用优惠券
export function noUseDiscount(data) {
	return http.request({
		url: '/pay/nlg/noPay',
		data
	})
}
// 取消使用小票抵扣优惠券
export function cancelPayByOrderId(data) {
	return http.request({
		url: '/pay/nlg/cancelPayByOrderId',
		data
	})
}
// 查询用户车牌免密 无感开通情况
export function brandStatus(data) {
	return http.request({
		url: '/wx/nlg/brandStatus',
		data
	})
}

// 扫入场二维码获取信息 （无牌车 入场）
export function scanUnlicensedQrCode(data) {
	return http.request({
		url: '/postPay/record/scanUnlicensedQrCode',
		data
	})
}
// 入场手动开闸更新订单信息 （无牌车 入场）
export function inOpenGate(data) {
	return http.request({
		url: '/postPay/record/nlg/unlicensedCarInOpenGate',
		data
	})
}
// 出场手动开闸 （无牌车 出场）
export function outOpenGate(data) {
	return http.request({
		url: '/postPay/nlg/unlicensedCarOpenGate',
		data
	})
}

//  拦截出场获取付费订单数据
export function parkingOrderView(data) {
	return http.request({
		url: '/postPay/nlg/parkingOrderView',
		data
	})
}
//  拦截出场订单支付
export function interceptPay(data) {
	return http.request({
		url: '/postPay/nlg/interceptPay',
		data
	})
}


// 扫二维码绑定车牌领取优惠券
export function scanQrCode(data) {
	return http.request({
		url: '/pbg/nlg/scanQrCode',
		data
	})
}
// 领取抵扣券
export function addCouponRecord(data) {
	return http.request({
		url: '/pbg/nlg/addCouponRecord',
		data
	})
}
// 绑车牌领取抵扣券
export function addCouponRecord2(data) {
	return http.request({
		url: '/postPay/nlg/addCouponRecord',
		data
	})
}

//  配置无感支付
export function configNoSensePay(data) {
	return http.request({
		url: '/users/nlg/configNoSensePay',
		data
	})
}


//  记录充值入口
export function recordRechargeEntry(data) {
	return http.request({
		url: '/recharge/nlg/recordRechargeEntry',
		data
	})
}

//  租赁停车场查询
export function searchParkingOfRent(data, cancelToken) {
	return http.request({
		url: '/rent/nlg/searchParkingOfRent',
		data,
		cancelToken
	})
}

//  获取支持租赁业务停车场的租赁信息
export function getParkingRentDetailOfCode(data) {
	return http.request({
		url: '/rent/nlg/getParkingRentDetailOfCode',
		data
	})
}

//  租赁订单支付
export function rentOrderPay(data) {
	return http.request({
		url: '/pay/nlg/rentOrdersPay',
		data
	})
}
//  取消未支付租赁订单
export function cancelRentOrder(data) {
	return http.request({
		url: '/rent/nlg/cancelRentOrder',
		data
	})
}
//  获取租赁订单列表
export function rentOrderList(data) {
	return http.request({
		url: '/rent/nlg/rentOrderList',
		data
	})
}
//  验证是否跳转续费页面
export function selectByRentOnline(data) {
	return http.request({
		url: '/rent/nlg/selectByRentOnline',
		data
	})
}

//  获取租赁订单详情
export function rentOrderDetail(data) {
	return http.request({
		url: '/rent/nlg/rentOrderDetail',
		data
	})
}
// 添加租赁订单
export function addRentOrder(data, toastFn) {
	return http.request({
		url: '/rent/nlg/addRentOrder',
		data,
		isShowToast: true,
		toastFn
	})
}

// 查询协议
export function getNewPortOfType(data) {
	return http.request({
		url: '/newsport/getNewPortOfType',
		data
	})
}
// 获取距离当前加油站信息 + 加油站列表
export function getNearStation(data) {
	return http.request({
		url: '/bzRefuel/nlg/getNearStation',
		data
	})
}
//计算支付金额
export function countStationPayMoney(data) {
	return http.request({
		url: '/bzRefuel/nlg/countStationPayMoney',
		data
	})
}
// 加油站支付
export function paymethods(data) {
	return http.request({
		url: '/bzRefuel/nlg/payMethods',
		data
	})
}
// 获取广告或者Banner接口
export function selectByManage(data) {
	return http.request({
		url: '/advertManage/selectByManage',
		data
	})
}
// 获取广告或者Banner接口-------- 新版
export function getAdvertPutingList(data) {
	return http.request({
		url: '/advertApi/getAdvertPutingList',
		data
	})
}
// 广告点击记录
export function saveAdvertClickRecord(data) {
	return http.request({
		url: '/advertApi/saveAdvertClickRecord',
		data
	})
}
// 车检再来一单
export function getBookingGoodsInfo(data) {
	return http.request({
		url: store.state.webUrl + '/bzServiceManage/carService/nlg/getBookingGoodsInfo',
		method: 'GET',
		data

	})
}
// 洗车保养再来一单
export function getGoodsInfoByStoreId(data) {
	return http.request({
		url: store.state.webUrl + '/bzServiceManage/carService/nlg/getGoodsInfoByStoreId',
		method: 'GET',
		data
	})
}
// 首页优惠券绑定车牌 显示广告
export function selectNotGainCoupon(data) {
	return http.request({
		url: store.state.BASE_URL + '/pbg/nlg/selectNotGainCoupon',
		method: 'GET',
		data
	})
}
// 消息通知
export function addUserSubscribeMsg(data) {
	return http.request({
		url: '/sendMessage/addUserSubscribeMsg',
		data
	})
}

// 扫码领券 不同类型停车券列表
export function selectToReceiveList(data) {
	return http.request({
		url: '/pbg/nlg/selectToReceiveList',
		data,
		method: 'POST'
	})
}
// 扫码领券 不同类型停车券数量
export function selectByParkCouponCount(data) {
	return http.request({
		url: '/pbg/nlg/selectByParkCouponCount',
		data,
		method: 'POST'
	})
}
// 扫码领券 获取已绑定车牌/历史缴费车牌
export function selectBindPlateList(data) {
	return http.request({
		url: '/pbg/nlg/selectBindPlateList',
		data,
		method: 'POST'
	})
}
// 扫码领券 Banner接口
// export function selectByManage(data) {
// 	return http.request({
// 		url: '/advertManage/selectByManage',
// 		data,
// 		method: 'POST'
// 	})
// }
// 扫码领券 更改绑定车牌
export function updateCouponPlate(data) {
	return http.request({
		url: '/pbg/nlg/updateCouponPlate',
		data,
		method: 'POST'
	})
}
// 扫码领券 绑车牌领取抵扣券
// export function addCouponRecord2(data) {
// 	return http.request({
// 		url: '/postPay/nlg/addCouponRecord',
// 		data
// 	})
// }
// 扫码领券 点击立即使用
export function getCouponGainCode(data) {
	return http.request({
		url: '/pbg/nlg/getCouponGainCode',
		data
	})
}

// 停车卡 订单支付查询停车卡余额
export function getParkingCarBalance(data) {
	return http.request({
		url: '/parkingCardApi/nlg/getParkingCarBalance',
		data
	})
}



var onopen = false
var onopen2 = false
//打开websocket链接
// export function connectSocket(data) {
// 	if (data) {
// 		uni.onNetworkStatusChange(function(res) {
// 			console.log('当前是否有网络连接', res.isConnected)
// 			console.log(res.networkType)
// 			// 当前是否有网络连接
// 			// uni.closeSocket()
// 			uni.connectSocket({
// 				// #ifdef MP-ALIPAY
// 				url: 'wss://' + store.state.wssUrl + '/websocket?token=' + data + 'my',
// 				// #endif
// 				// #ifdef MP-WEIXIN
// 				url: 'wss://' + store.state.wssUrl + '/websocket?token=' + data + 'wx',
// 				// #endif
// 				header: {
// 					'content-type': 'application/json',
// 				},
// 				method: "GET"
// 			})
// 			uni.onSocketOpen(function(res) {
// 				onopen = true
// 				console.log('WebSocket连接已打开！');
// 			})
// 		})
// 		// uni.closeSocket()
// 		uni.onSocketClose(function(res) {
// 			console.log('WebSocket 已关闭！')
// 			connectSocket(data)
// 		})
// 		uni.connectSocket({
// 			// #ifdef MP-ALIPAY
// 			url: 'wss://' + store.state.wssUrl + '/websocket?token=' + data + 'my',
// 			// #endif
// 			// #ifdef MP-WEIXIN
// 			url: 'wss://' + store.state.wssUrl + '/websocket?token=' + data + 'wx',
// 			// #endif
// 			header: {
// 				'content-type': 'application/json',
// 			},
// 			// #ifdef MP-WEIXIN
// 			method: "GET",
// 			// #endif
// 		})
// 		uni.onSocketOpen(function(res) {
// 			onopen = true;
// 			console.log('WebSocket连接已打开！');
// 			// uni.sendSocketMessage()
// 		})

// 	}
// }
export function connectSocket(data, func) {
	console.log("开始连接1")
	if (data) {
		var socketTask1 = uni.connectSocket({
			// #ifdef MP-ALIPAY
			url: 'wss://' + store.state.wssUrl + '/websocket?token=' + data + 'my',
			// #endif
			// #ifdef MP-WEIXIN
			url: 'wss://' + store.state.wssUrl + '/websocket?token=' + data + 'wx',
			// #endif
			header: {
				'content-type': 'application/json',
			},
			method: "GET",
			complete: () => {}
		})
		socketTask1.onOpen(function(res) {
			onopen = true
			console.log('WebSocket1连接已打开！');
		})
		socketTask1.onClose(function(res) {
			console.log('WebSocket1已关闭！')
			connectSocket(data, func)
		})
		socketTask1.onMessage(function(res) {
			var data = JSON.parse(res.data);
			data && func(res)
		})
	}
}
// export function connectSocket2(data, func) {
// 	console.log("开始连接2")
// 	if (data) {
// 		var socketTask2 = uni.connectSocket({
// 			// #ifdef MP-ALIPAY
// 			url: 'wss://' + store.state.wssUrl2 + '/websocket?token=' + data + 'my',
// 			// #endif
// 			// #ifdef MP-WEIXIN
// 			url: 'wss://' + store.state.wssUrl2 + '/websocket?token=' + data + 'wx',
// 			// #endif
// 			header: {
// 				'content-type': 'application/json',
// 			},
// 			method: "GET",
// 			complete: () => {}
// 		})
// 		socketTask2.onOpen(function(res) {
// 			onopen2 = true
// 			console.log('WebSocket2连接已打开！');
// 		})
// 		socketTask2.onClose(function(res) {
// 			console.log('WebSocket2已关闭！')
// 			connectSocket2(data, func)
// 		})
// 		socketTask2.onMessage(function(res) {
// 			var data = JSON.parse(res.data);
// 			data && func(res)
// 		})

// 	}
// }
