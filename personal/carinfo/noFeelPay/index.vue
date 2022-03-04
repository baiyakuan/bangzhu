<template>
	<view class="page">
		<div class="title pdl40 pdt60 pdb80"><div class="ft50 ftweight rgb51">无感支付</div></div>
		<div class="bar"></div>
		<view class="pd40 fs">
			<view class="fst">
				<image class="icon" :src="staticImg + 'static/img/bangzhu.png'" mode=""></image>
				<text class="mgl20 ft28 ftweight rgb51">帮驻智停无感支付</text>
			</view>
			<view class="">
				<evan-switch :value="brandDetail.noFeelingToPay ? true : false" size="30" inactive-color="#EFF4F8" active-color="#F33535" @aaa="bangzhu"></evan-switch>
			</view>
		</view>
		<view class="pd40 fs">
			<view class="fst">
				<image class="icon" :src="staticImg + 'static/img/pay_wechat.png'" mode=""></image>
				<text class="mgl20 ft28 ftweight rgb51">微信无感免密支付</text>
			</view>
			<view class="wx_nofeeling_icon" @click="wx">
<!-- 				<evan-switch
					:value="(userState == 'NORMAL' || userState == 'OVERDUE') && brandDetail.wxNofeelPay ? true : false"
					size="30"
					inactive-color="#EFF4F8"
					active-color="#F33535"
					@aaa="wx"
				></evan-switch> -->
				<img :src="staticImg + 'static/img/right_row.png'" alt="">
			</view>
		</view>
		<Modal
			v-if="overdueVisible"
			ok-css="color:#FA4242;font-size:30rpx;font-weight:bold;"
			cancel-css="color:#aaa;font-size:30rpx;font-weight:bold;"
			cancel-text="否"
			ok-text="是"
			@ok="toPayOverdue"
			@cancel="overdueVisible = false"
		>
			<view class="pd40 mgt30 ft28 ftweight rgb51">您目前无感账户已欠费，是否结清费用继续使用</view>
		</Modal>
		<Modal
			v-if="autoVisible"
			ok-css="color:#FA4242;font-size:30rpx;font-weight:bold;"
			cancel-css="color:#aaa;font-size:30rpx;font-weight:bold;"
			cancel-text="否"
			ok-text="是"
			@ok="toOpenAuto"
			@cancel="autoVisible = false"
		>
			<view class="pd40 mgt30 ft28 ftweight rgb51">您已经达到开通无感支付条件，是否开通</view>
		</Modal>
	</view>
</template>

<script>
import Modal from '@/components/Modal/index.vue';
import { brandStatus, setNoFeelingToPay, getWxNoFeelPayGuideInfo, getBrandInfo } from '@/api';
import store from '@/store';
export default {
	data() {
		return {
			brandId: '', // 车牌ID
			brandNumber: '', // 车牌号
			brandDetail: {}, // 用户车牌详情
			userState: '', // 用户微信无感免密支付状态 NORMAL：正常用户，已开通车主服务，且已授权访问 PAUSED：已暂停车主服务 OVERDUE: 用户已开通车主服务，但欠费状态。提示用户还款，请跳转到车主服务 UNAUTHORIZED：用户未授权使用当前业务，或未开通车主服务。请跳转到授权接口
			deductMode: '', // 用户支付方式 PROACTIVE：免密 ; AUTOPAY:无感
			common_use_flag: '', // 是否拥有常用车牌
			back: false, // 页面是否从车主服务小程序返回
			// brandNumber:'',  // 开通无感支付车牌号
			overdueVisible: false, // 欠费弹窗
			autoVisible: false // 无感弹窗
		};
	},
	components: {
		Modal
	},
	// #ifdef MP-WEIXIN
	// 微信分享小程序给朋友
	onShareAppMessage() {
		return {
			title: '推荐一个好用的停车工具',
			path: '/pages/index/index'
		};
	},
	computed:{
		staticImg() { return this.$store.state.staticImg } ,
	},
	// #endif
	onLoad(option) {
		const that = this;
		that.brandId = option.brandId;
		that.brandNumber = option.brandNumber;
	},
	onShow() {
		this.overdueVisible = false;
		this.autoVisible = false;
		this.getBrandInfo();
		// this.brandStatus();
	},
	methods: {
		// 查询帮驻平台车牌详情
		async getBrandInfo() {
			const that = this;
			const { data } = await getBrandInfo({
				brandId: that.brandId
			});
			if (data.code == 1) {
				that.brandDetail = data.obj.brand;
				await this.brandStatus();
				if(that.brandDetail.wxNofeelPay && that.deductMode == 'PROACTIVE' && that.common_use_flag == 'COMMON_USE') {
					that.autoVisible = true;
				}
			}
		},
		// 查询用户微信车牌无感 免密开通状态
		async brandStatus() {
			const that = this;
			const { data } = await brandStatus({
				appId: 'wxe015a7167b0f27ce',
				plateNumber: that.brandNumber,
				openId: store.state.userInfo.openid,
				appType: 1
			});
			if (data.code == 1) {
				that.userState = data.obj.userState;
				that.deductMode = data.obj.deductMode;
				if (data.obj.plateNumberInfo) {
					that.common_use_flag = data.obj.plateNumberInfo.plate_number_info[0].common_use_flag;
				}
				if (that.brandDetail.wxNofeelPay) { // 是否开通了wx无感
					if (data.obj.userState == 'OVERDUE') {
						that.overdueVisible = true;
					} else if (data.obj.deductMode == 'PROACTIVE' && data.obj.plateNumberInfo.plate_number_info[0].common_use_flag == 'COMMON_USE') {
						if(data.obj.wxNoFeelPayOpenId == store.state.userInfo.openid){
							that.autoVisible = true;
						}
					}
				}
				if (this.back) {
					if (data.obj.userState == 'NORMAL') {
						that.setNoFeelingToPay(1, 2);
					}
					this.back = false;
				}
			}
		},
		// 设置帮驻无感支付
		bangzhu() {
			var status = this.brandDetail.noFeelingToPay ? 0 : 1;
			this.setNoFeelingToPay(status, 1);
		},
		// 设置微信无感支付
		async wx() {
			const that = this;
			if (that.userState == 'UNAUTHORIZED') {
				const { data } = await getWxNoFeelPayGuideInfo({
					type: 1,
					openIdType: 1,
					plateNumber: that.brandNumber,
					openId: store.state.userInfo.openid
				});
				if (data.code == 1) {
					var obj = data.obj.params;
					// #ifndef MP-ALIPAY
					wx.navigateToMiniProgram({
						appId: 'wxbcad394b3d99dac9',
						path: 'pages/route/index',
						extraData: {
							appid: obj.appid,
							mch_id: obj.mchId,
							nonce_str: obj.nonceStr,
							sign_type: obj.signType,
							sign: obj.sign,
							trade_scene: obj.tradeScene,
							plate_number: obj.plateNumber,
							openid: obj.openid
						},
						success() {
							that.back = true;
						}
					});
					// #endif
				}
			} else {
				// that.setNoFeelingToPay(1, 2);
				const { data } = await getWxNoFeelPayGuideInfo({
					type: 1,
					openIdType: 1,
					plateNumber: that.brandNumber,
					openId: store.state.userInfo.openid
				});
				if (data.code == 1) {
					var obj = data.obj.params;
					// #ifndef MP-ALIPAY
					wx.navigateToMiniProgram({
						appId: 'wxbcad394b3d99dac9',
						path: 'pages/index/index',
						extraData: {
							appid: obj.appid,
							mch_id: obj.mchId,
							nonce_str: obj.nonceStr,
							sign_type: obj.signType,
							sign: obj.sign,
							trade_scene: obj.tradeScene,
							plate_number: obj.plateNumber,
							openid: obj.openid
						},
						success() {
							that.back = false;
						}
					});
					// #endif
				}
			}
			// else if (that.userState == 'NORMAL') {
			// 	var status = this.brandDetail.wxNofeelPay ? 0 : 1;
			// 	that.setNoFeelingToPay(status, 2);
			// } else if (that.userState == 'OVERDUE') {
			// 	if (this.brandDetail.wxNofeelPay) {
			// 		that.setNoFeelingToPay(0, 2);
			// 	} else {
			// 		that.overdueVisible = true;
			// 	}
			// }
		},
		// 设置帮驻后台无感支付状态
		async setNoFeelingToPay(status, type) {
			const that = this;
			const { data } = await setNoFeelingToPay({
				brandId: that.brandDetail.brandId,
				status,
				type
			});
			if (data.code == 1) {
				setTimeout(async () => {
					await that.getBrandInfo();
						uni.showToast({
							title: status ? '开启成功' : '关闭成功',
							icon: 'none'
						});
				}, 1000);
			}
		},
		// 结清欠费
		async toPayOverdue() {
			const that = this;
			const { data } = await getWxNoFeelPayGuideInfo({
				type: 3,
				openIdType: 1,
				plateNumber: that.brandNumber,
				openId: store.state.userInfo.openid
			});
			if (data.code == 1) {
				var obj = data.obj.params;
				// #ifndef MP-ALIPAY
				wx.navigateToMiniProgram({
					appId: 'wx5e73c65404eee268',
					path: 'pages/invest_list/invest_list',
					extraData: {
						appid: obj.appid,
						mch_id: obj.mchId,
						nonce_str: obj.nonceStr,
						sign_type: obj.signType,
						sign: obj.sign,
						openid: obj.openid
					},
					success() {
						that.back = true;
					}
				});
				// #endif
			}
		},
		// 开通无感
		async toOpenAuto() {
			const that = this;
			const { data } = await getWxNoFeelPayGuideInfo({
				type: 2,
				openIdType: 1,
				plateNumber: that.brandNumber,
				openId: store.state.userInfo.openid
			});
			if (data.code == 1) {
				var obj = data.obj.params;
				// #ifndef MP-ALIPAY
				wx.navigateToMiniProgram({
					appId: 'wxbcad394b3d99dac9',
					path: 'pages/no-sense-payment/index',
					extraData: {
						appid: obj.appid,
						mch_id: obj.mchId,
						nonce_str: obj.nonceStr,
						sign_type: obj.signType,
						sign: obj.sign,
						trade_scene: obj.tradeScene,
						plate_number: obj.plateNumber,
						openid: obj.openid
					},
					success() {
						// that.back = true;
					}
				});
				// #endif
			}
		}
	}
};
</script>

<style lang="scss">
page {
	background-color: #fff;
}
.icon {
	width: 40rpx;
	height: 40rpx;
}
.wx_nofeeling_icon {
	width: 50rpx;
	height: 100%;
}
.wx_nofeeling_icon image {
	vertical-align: baseline;
	width: 20rpx;
	height: 20rpx;
}
.text {
}
</style>
