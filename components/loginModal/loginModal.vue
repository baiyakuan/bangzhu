<template>
	<view>
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
						<button class="canselBtn" @click="cancelGetPhoneNumber">取消</button>
						<button class="okgetUserInfo" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">授权</button>
					</view>
				</view>
			</view>
		</view>

		<!-- 用户信息授权 -->
		<view v-if="getUserInfoVisible" class="fcy pf">
			<view class="authorize">
				<view class="mgt40 ft35 ftweight ">授权提示</view>
				<view class="fcy">
					<view class="mgt40 ft30 gray-t">若需登录帮驻，需要获取您的&nbsp;</view>
					<view class="gray-t mgt15 ft30 mgb40">微信绑定的用户信息&nbsp;&nbsp;</view>
				</view>
				<view style="height:1px;background:#e5e5e5"></view>
				<view>
					<view class="fs">
						<button class="canselBtn" @click="getUserInfoVisible = false">取消</button>
						<button class="okgetUserInfo" open-type="getUserInfo" @getuserinfo="getUserinfo">授权</button>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { getUsersInfo, get3rdSession, getAliUserinfo, zfbLogin, getOpenId, decodeUserInfo, wxLogin } from '@/api';
import { removeToken } from '@/utils/auth';
import { mapQuery } from '@/utils/miniLodash';
export default {
	data() {
		return {
			getUserInfoVisible: false,
			getPhonevisible: false,
			sesscion: null
		};
	},
	props: {
		loginCallBack: {
			type: Function,
			default: () => {}
		},
		navigateState: {
			type: [Number, String],
			default: ''
		},
		cancelLogin: {
			type: Function,
			default: () => {}
		}
	},
	methods: {
		getUserInfoStep() {
			this.getUsersInfo();
		},

		async getUserinfo(e) {
			const that = this;
			that.getUserInfoVisible = false;
			decodeUserInfo({
				encryptedData: e.detail.encryptedData,
				iv: e.detail.iv,
				session: that.session,
				istrue: true
			}).then(res => {
				uni.login({
					success: async ({ code }) => {
						const { data } = await getOpenId({
							code,
							istrue: true
						});
						this.$store.commit('set_openid', data.obj.openid);
						that.loginSuccess();
					}
				});
			});
		},
		cancelGetPhoneNumber() {
			this.getPhonevisible = false;
			this.$emit('cancelLogin');
		},
		async getUsersInfo() {
			this.$store.dispatch('getUsersInfo').then(({ data }) => {
				if (data.code == 1) {
					// #ifdef MP-WEIXIN
					if (data.obj.isReAuth) {
						// 是否需要重新获取微信用户信息授权
						this.getSession();
						this.getUserInfoVisible = true;
						return;
					}
					// #endif
					// #ifdef MP-ALIPAY
					if (!data.obj.alOpenId) {
						removeToken();
						return;
					}
					// #endif
					if (data.obj.isReqGetOpenId) {
						// 是否需要重新获取openID
						uni.login({
							success: async ({ code }) => {
								const { data } = await getOpenId({
									code,
									istrue: true
								});
								this.$store.commit('set_openid', data.obj.openid);
							}
						});
					} else {
						this.$store.commit('set_userInfo', data.obj)
						this.loginSuccess();
					}
				} else if (data.code == -9) {
					this.getSession(() => (this.getPhonevisible = true));
					removeToken();
				}
			});
		},

		// 获取微信解密session_key及支付宝user_id
		async getSession(fn) {
			uni.login({
				success: ({ code }) => {
					// #ifdef MP-WEIXIN
					get3rdSession({
						code: code,
						istrue: true
					}).then(res => {
						if (res.data.code == 1) {
							this.session = res.data.obj.session;
						}
					});
					// #endif
					// #ifdef MP-ALIPAY
					getAliUserinfo({
						authCode: code,
						istrue: true
					}).then(resinfo => {
						if (resinfo.data.obj.user_id) {
							this.user_id = resinfo.data.obj.user_id;
						}
					});
					// #endif
					fn && fn();
				}
			});
		},

		async getPhoneNumber(e) {
			var that = this;
			that.getPhonevisible = false;
			// #ifdef MP-WEIXIN
			if (e.detail.errMsg.indexOf('ok') >= 0) {
				wxLogin({
					session: that.session,
					iv: e.mp.detail.iv,
					encryptedData: e.mp.detail.encryptedData,
					istrue: true
				}).then(res => {
					if (res.data.code == 1) {
						this.$store.commit('set_token', res.data.obj.token);
						this.$store.commit('set_phone', res.data.obj.phone);
						this.getUsersInfo();
					} else {
						that.getPhonevisible = true;
					}
				});
			} else {
				this.$store.commit('userModule/setLoginCallback', this.loginSuccess);
				uni.navigateTo({
					url: `/personal/information/phone/index?navigateState=${this.navigateState}`
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
					this.$store.commit('set_token', res.data.obj.token);
					this.$store.commit('set_phone', res.data.obj.phone);
					this.getUsersInfo();
				});
			} else {
				this.$store.commit('userModule/setLoginCallback', this.loginSuccess);
				uni.navigateTo({
					url: `/personal/information/phone/index?navigateState=${this.navigateState}`
				});
			}
			// #endif
		},

		loginSuccess() {
			this.$emit('loginCallBack');
		}
	}
};
</script>

<style scoped lang="scss">
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
