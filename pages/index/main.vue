<template>
	<view class="">
		<!-- 手机号授权：-->
		<view v-if="getPhonevisible" class="fcy pf">
			<view class="authorize">
				<view class="mgt40 ft35 ftweight ">授权提示</view>
				<view class="fcy">
					<view class="mgt40 ft30 gray-t">若需登录帮驻，需要获取您的&nbsp;</view>
					<!-- #ifdef MP-ALIPAY -->
					<view class="gray-t mgt15 ft30 mgb40">支付宝绑定的手机号&nbsp;&nbsp;</view>
					<!-- #endif -->
					<!-- #ifdef MP-WEIXIN -->
					<view class="gray-t mgt15 ft30 mgb40">微信绑定的手机号&nbsp;&nbsp;</view>
					<!-- #endif -->
				</view>
				<view style="height:1px;background:#e5e5e5"></view>
				<view>
					<view class="fs">
						<button class="authBtn canselBtn" @click="cancelGetPhoneNumber">取消</button>
						<button class="authBtn okgetUserInfo" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">授权</button>
					</view>
				</view>
			</view>
		</view>
		<!-- 地理位置授权：-->
		<view v-if="getOpenSetting" class="fcy pf">
			<view class="authorize">
				<view class="mgt40 ft35 ftweight ">授权提示</view>
				<view class="fcy">
					<view class="mgt40 ft30 gray-t">若需使用帮驻，需要获取您的&nbsp;</view>
					<view class="gray-t mgt15 ft30 mgb40">地理位置&nbsp;&nbsp;</view>
				</view>
				<view style="height:1rpx;background:#e5e5e5"></view>
				<view>
					<view>
						<!-- #ifdef MP-WEIXIN -->
						<button class="okgetUserInfo" style="margin:0 auto;" open-type="openSetting">授权</button>
						<!-- #endif -->
						<!-- #ifdef MP-ALIPAY -->
						<button class="okgetUserInfo" style="margin:0 auto;" @click="getLocation">授权</button>
						<!-- #endif -->
					</view>
				</view>
			</view>
		</view>

		<toastes :visibile="toastVisibile">{{ msg }}</toastes>
	</view>
</template>

<script>
import store from '@/store';
import { get3rdSession, getAliUserinfo, zfbLogin, getOpenId, decodeUserInfo, wxLogin, getPayDataByPayCode, getPayPageData, scanQrCode,getParkingRentDetailOfCode,parkingOrderView } from '@/api';
import { mapQuery } from '@/utils/miniLodash';
export default {
	data() {
		return {
			value: '',
			session: '',
			user_id: '',
			getPhonevisible: false,
			getOpenSetting: false,
			navName: '', // 小程序跳转携带信息
			q: '', // 微信扫码连接携带信息
			orderID: '', // 公众号模板消息携带订单号
			toastVisibile: false,
			msg: ''
		};
	},
	// #ifdef MP-WEIXIN
	// 微信分享小程序给朋友
	onShareAppMessage() {
		return {
			title: '推荐一个好用的停车工具',
			path: '/pages/index/index'
		};
	},
	// #endif
	onLoad(options) {
		const that = this;
		if (options.navName) {
			that.navName = options.navName;
		} else if (options.q) {
			that.q = decodeURIComponent(options.q);
		} else if (options.orderID) {
			that.orderID = options.orderID;
		}
		this.logon();
	},
	methods: {
		getLocation(callback) {
			const that = this;
			that.getOpenSetting = false;
			return new Promise((resolve, reject) => {
				uni.getLocation({
					// #ifdef MP-WEIXIN
					type: 'gcj02',
					// #endif
					success({ longitude, latitude }) {
						that.ownLocation = { longitude, latitude };
						store.commit('setLocationInfo', that.ownLocation);
						callback();
						resolve();
					},
					fail(err) {
						that.checkAuth();
						reject(err);
					}
				});
			});
		},
		// 检查是否有定位权限
		checkAuth() {
			let that = this;
			uni.getSetting({
				success: res => {
					// #ifdef MP-WEIXIN
					let auth = res.authSetting;
					let str = 'scope.userLocation';
					if (!auth.str) {
						that.getPhonevisible = false;
						that.getOpenSetting = true;
					} else {
						uni.showToast({
							title: '未获取到地理位置信息',
							icon: 'none',
							mask: true
						});
					}
					// #endif
					// #ifdef MP-ALIPAY
					if (!res.authSetting.location) {
						that.getPhonevisible = false;
						that.getOpenSetting = true;
					}
					// #endif
				}
			});
		},
		async logon() {
			const that = this;
			store
				.dispatch('getUsersInfo')
				.then(({ data }) => {
					if (data.code == 1) {
						store.dispatch('wallet');
						store.commit('set_userInfo', data.obj);
						if (data.obj.isReqGetOpenId) {
							// 是否需要重新获取openID
							uni.login({
								success: async ({ code }) => {
									const { data } = await getOpenId({
										code,
										istrue: true
									});
									store.commit('set_openid', data.obj.openid);
									that.loginSuccess();
								}
							});
						} else {
							that.loginSuccess();
						}

						// #ifdef MP-ALIPAY
						if (!data.obj.alOpenId) {
							that.getSession();
							that.getPhonevisible = true;
						}
						// #endif
					} else {
						that.getSession();
						that.getPhonevisible = true;
					}
				})
				.catch(error => {
					console.log(error);
				});
		},
		// 获取微信解密session_key及支付宝user_id
		async getSession() {
			const that = this;
			uni.login({
				success: ({ code }) => {
					// #ifdef MP-WEIXIN
					get3rdSession({
						code: code,
						istrue: true
					}).then(ress => {
						if (ress.data.code == 1) {
							that.session = ress.data.obj.session;
						}
					});
					// #endif
					// #ifdef MP-ALIPAY
					getAliUserinfo({
						authCode: code,
						istrue: true
					}).then(resinfo => {
						if (resinfo.data.obj.user_id) {
							that.user_id = resinfo.data.obj.user_id;
						}
					});
					// #endif
				}
			});
		},
		// 授权获取手机号
		async getPhoneNumber(e) {
			var that = this;
			that.getPhonevisible = false;
			that.isonshow = true;
			// #ifdef MP-WEIXIN
			if (e.detail.errMsg.indexOf('ok') >= 0) {
				wxLogin({
					session: that.session,
					iv: e.mp.detail.iv,
					encryptedData: e.mp.detail.encryptedData
				}).then(res => {
					if (res.data.code == 1) {
						store.commit('set_token', res.data.obj.token);
						store.commit('set_phone', res.data.obj.phone);
						store.dispatch('wallet');
						store
							.dispatch('getUsersInfo')
							.then(({ data }) => {
								if (data.code == 1) {
									that.isLogin = true;
									store.commit('set_userInfo', data.obj);
									if (data.obj.isReqGetOpenId) {
										// 是否需要重新获取openID
										uni.login({
											success: async ({ code }) => {
												const { data } = await getOpenId({
													code,
													istrue: true
												});
												store.commit('set_openid', data.obj.openid);
												that.loginSuccess();
											}
										});
									} else {
										that.loginSuccess();
									}
								} else {
									that.getSession();
									that.getPhonevisible = true;
								}
							})
							.catch(err => {
								console.log(err);
							});
					} else {
						that.getPhonevisible = true;
					}
				});
			} else {
				uni.reLaunch({
					url: '/pages/index/index'
				});
			}
			// #endif
			// #ifdef MP-ALIPAY
			if (e.detail.errMsg.indexOf('response') >= 0) {
				var i = e.detail.errMsg.indexOf('{');
				var str = e.detail.errMsg.substring(i);
				zfbLogin({
					resultStr: str,
					openId: that.user_id
				}).then(res => {
					store.commit('set_token', res.data.obj.token);
					store.commit('set_phone', res.data.obj.phone);
					store.dispatch('wallet');
					store
						.dispatch('getUsersInfo')
						.then(({ data }) => {
							if (data.code == 1) {
								that.isLogin = true;
								store.commit('set_userInfo', data.obj);
								that.loginSuccess();
							} else {
								that.getSession();
								that.getPhonevisible = true;
							}
						})
						.catch(err => {
							console.log(err);
						});
				});
			} else {
				uni.reLaunch({
					url: '/pages/index/index'
				});
			}
			// #endif
		},
		// 取消获取手机号
		async cancelGetPhoneNumber() {
			var that = this;
			uni.reLaunch({
				url: '/pages/index/index'
			});
		},
		loginSuccess() {
			const that = this;
			// #ifdef MP-ALIPAY
			var options = getApp().globalData.query;
			that.q = options.qrCode;
			// #endif
			if (that.navName) {
				if (that.navName == 'member') {
					uni.reLaunch({
						url: '/personal/member/index'
					});
				} else if (that.navName == 'recharge') {
					uni.reLaunch({
						url: '/personal/wallet/recharge/index'
					});
				} else if (that.navName == 'wallet') {
					uni.reLaunch({
						url: '/personal/wallet/index'
					});
				} else if (that.navName == 'coupon') {
					uni.reLaunch({
						url: '/personal/wallet/coupon/index1'
					});
				} else if (that.navName == 'order') {
					uni.reLaunch({
						url: '/personal/order/index'
					});
				} else if (that.navName == 'carinfo') {
					uni.reLaunch({
						url: '/personal/carinfo/index'
					});
				} else if (that.navName == 'information') {
					uni.reLaunch({
						url: '/personal/information/index'
					});
				}
			} else if (that.orderID) {
				store.commit('set_orderIdDetail', that.orderID);
				uni.reLaunch({
					url: '/personal/order/orderDetail/index'
				});
			} else if (that.q) {
				var data = that.q;
				if (data.indexOf('/s/') !== -1) {
					let i = data.indexOf('/s/');
					let val = data.slice(i + 3);
					getPayPageData({
						merchantId: val
					}).then(res => {
						if (res.data.code == 1) {
							uni.reLaunch({
								url: `/pages/confirm/scanpay/index?merchantId=${val}`
							});
						} else {
							uni.showToast({
								title: data.msg,
								icon: 'none'
							});
							setTimeout(() => {
								uni.reLaunch({
									url: `/pages/index/index`
								});
							}, 1000);
						}
					});
				} else if (data.indexOf('/o/') !== -1) {
					//帮品支付
					let j = data.indexOf('/o/');
					let value = data.slice(j + 3);
					console.log(value);
					// 获取商户详情
					getPayDataByPayCode({
						payCode: value,
						istrue: true
					}).then(function(data) {
						var data = data.data;
						if (data.code != 1) {
							uni.showToast({
								title: data.msg,
								icon: 'none'
							});
							setTimeout(() => {
								uni.reLaunch({
									url: `/pages/index/index`
								});
							}, 1000);
						} else {
							uni.reLaunch({
								url: `/pages/confirm/bangpinpay/index?payCode=${value}`
							});
						}
					});
				} else if (data.indexOf('/dk/') !== -1) {
					// 绑定车牌领取优惠券
					let k = data.indexOf('/dk/');
					let value = data.slice(k + 4);
					scanQrCode({
						key: value
					}).then(({ data }) => {
						if (data.code == 1) {
							uni.reLaunch({
								url: `/pages/receiveCoupon/bindCarNumber?key=${data.obj.advAndCoupon.key}&parkingName=${data.obj.advAndCoupon.parkingName}&couponTypeName=${data.obj.advAndCoupon.couponTypeName}`
							});
						} else {
							uni.showToast({
								title: data.msg,
								icon: 'none'
							});
							setTimeout(() => {
								uni.reLaunch({
									url: '/pages/index/index'
								});
							}, 2000);
						}
					});
				} else if (data.indexOf('/pp/') !== -1) {
					// 出场
					let h = data.indexOf('/pp/');
					let value = data.slice(h + 4);
					parkingOrderView({
						serialno: value,
						istrue: true
					}).then(({ data }) => {
						store.commit('saveOutOrderInfo', data);
						if( data.code == 1 ){
							if(data.obj.isUnlicensedVehicle && !data.obj.currentOrder.payMoney){
								uni.reLaunch({
									url: `/pages/noPlateCar/out?serialno=${value}`
								});
							}else{
								uni.reLaunch({
									url: `/personal/order/orderPay/index?serialno=${value}`
								});
							}
						}else{
							uni.reLaunch({
								url: `/personal/order/orderPay/index?serialno=${value}`
							});
						}
					})
				} else if (data.indexOf('/uv/') !== -1) {
					// 入场（无牌车）
					let h = data.indexOf('/uv/');
					let value = data.slice(h + 4);
					uni.reLaunch({
						url: `/pages/noPlateCar/in?serialno=${value}`
					});
				} else if (data.indexOf('/cz/') !== -1) {
					uni.reLaunch({
						url: '/personal/wallet/recharge/index?entryType=2'
					});
				} else if (data.indexOf('/doubleNinth') !== -1) {
					//重阳节活动
					uni.reLaunch({
						url: '/basic/activity/doubleNinth/index?url=' + encodeURIComponent(data)
					});
				} else if (data.indexOf('lease') !== -1) {
					// 租赁
					this.getLocation(() => {
						uni.reLaunch({
							url: '/personal/carRental/index'
						});
					});
				} else if (data.indexOf('/rent/') !== -1) {
					let h = data.indexOf('/rent/');
					let value = data.slice(h + 6);
					getParkingRentDetailOfCode({
						parkingCode: value,
						rentInfoCode: 1,
						istrue:true
					}).then(({ data }) => {
						if (data.code == 1) {
							if(data.obj.data.length){
								uni.reLaunch({
									url: '/personal/carRental/parkDetail/index?parkingCode=' + value
								});
							}else{
								wx.showToast({
									title: '暂无商品',
									icon: 'none'
								});
							}
						}else{
							setTimeout(() => {
								wx.showToast({
									title: data.msg,
									icon: 'none'
								});
							},2000)
						}
					});
				} else if (data.indexOf('myCar') !== -1) {
					uni.reLaunch({
						url: '/personal/carinfo/index'
					});
				} else if (data.indexOf('/vehicle') !== -1) {
				let code = data.split('/').pop()
				getParkingRentDetailOfCode({
					parkingCode: code,
					rentInfoCode: 1,
					istrue:true,
					type: 2
				}).then(({ data }) => {
					if (data.code == 1) {
						if(data.obj.data.length){
							uni.reLaunch({
								url: '/personal/carRental/parkDetail/index?pageStatus=manageCar&rentInfoCode=1&parkingCode=' + code
							});
						}else{
							uni.showToast({
								title: '暂无商品',
								icon: 'none'
							});
						}
					}else{
						setTimeout(() => {
							uni.showToast({
								title: data.msg,
								icon: 'none'
							});
						},2000)
					}
				});
			}
			}
			// getApp().globalData = {};
		}
	}
};
</script>

<style lang="scss">
.authorize {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 600rpx;
	text-align: center;
	border-radius: 10rpx;
	background: white;
}
.canselBtn {
	width: 50%;
	background: #fff;
	border: none;
	outline: none;
	border-right: 2rpx solid #eee;
	box-sizing: border-box;
}
.canselBtn::after {
	display: none;
}
.okgetUserInfo {
	width: 50%;
	border: none;
	outline: none;
	background: white;
	line-height: 90rpx;
	font-size: 35rpx;
	font-weight: bold;
	color: #f44a3e;
}
.okgetUserInfo::after {
	display: none;
}
</style>
