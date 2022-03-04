<template>
	<div>
		<div class="pd40-x bte pdb50"><div class="ft50 ftweight pdt20">购买会员</div></div>
		<div class="ft34 ftweight pd40-x pdt50">会员套餐</div>
		<div class="pdt10 mg40-x mgb250">
			<div class="mgt40" v-for="(item, index) in plusOptions" :key="item">
				<div class="fs setmeal" :class="[setmealIndex == index ? 'setmeal-b' : '']" @click="sum(item, index)">
					<div class="pd40-x">
						<view v-if="item.buyingcycle != 1200" class="ftweight ft34">{{ item.buyingcycle }}个月</view>
						<view v-else class="ftweight ft34">终身会员</view>
						<view class="ft24">（停车{{ item.discountmultiple }}折）</view>
					</div>
					<div class="pd40-x fe">
						<div class="gray-a ft24 positionori">¥{{ item.originalprice }}</div>
						<div class="ftweight ft34 rgb243">¥{{ item.payamount }}</div>
					</div>
				</div>
			</div>
		</div>
		<div class="footer-b bgw">
			<div class="fc mgt20" style="height:40rpx">
				<div class="pdl14 ft24 fcx">
					<view>开通即视为同意</view>
					<view class="rgb243" @click="PlusAgreement">《帮驻PLUS会员协议》</view>
				</div>
			</div>
			<div class="mgt20 btt fs" style="height:160rpx">
				<div class="pd40-x fst">
					<view class="ft50 ftweight">{{ payamount }}</view>
					<view class="pdl30 ft28">元</view>
				</div>
				<div class="pd40-x" @click="pay"><button class="btn white-t ft28">确认支付</button></div>
			</div>
		</div>
		<Pay :visible="payVisible" :amount="amount" :payamount="payamount" @cancel="cancelPay" @enterPay="orderPay"></Pay>
	</div>
</template>
<script>
import store from '@/store';
import { getPlusOptions, renew } from '@/api';
import Pay from '@/components/Pay/Pay.vue';
import { requestSubscribeMessage } from '@/utils/subscribeMsgUtils';
export default {
	data() {
		return {
			setmealIndex: 0,
			plusOptions: '',
			payamount: 0,
			itemplus: {},
			balance: false,
			payVisible: false, // 选择支付方式弹窗可见性
			amount: 0 ,// 钱包余额
			tmplIds: ['WkNfmKY2IIADNnzPibabyxj0oB_HwQRY0S5F9aj5_Gs', 'zE1vD9ZGoC6StBiFbGgCBaXwci9fYiyne4wnFm4sOVk']
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
	components: {
		Pay
	},
	methods: {
		//显示列表
		async getPlusOptions() {
			let that = this;
			const { data } = await getPlusOptions({
				type: 'all'
			});
			// console.log(data);
			that.plusOptions = data.obj.plusOptions;
			that.itemplus = that.plusOptions[0];
			that.payamount = that.plusOptions[0].payamount.toFixed(2);
		},
		//点击充值框
		sum(item, index) {
			this.setmealIndex = index;
			this.itemplus = item;
			this.payamount = item.payamount.toFixed(2);
		},
		//Plus协议
		PlusAgreement() {
			wx.navigateTo({
				url: `/personal/law/index?type=6`
			});
		},
		// 点击支付
		pay() {
			var that = this;
			requestSubscribeMessage(that.tmplIds, () => {
				that.amount = (store.state.wallet.amount * 1).toFixed(2);
				that.payVisible = true;
			});
		},
		// 取消支付
		cancelPay() {
			this.payVisible = false;
		},
		// 确认支付订单
		async orderPay(payType) {
			let that = this;
			const { data } = await renew({
				optionsId: that.itemplus.plusoptionsid,
				payType: payType,
				istrue: true
			});
			if (data.code == '1') {
				// 余额支付
				if (payType == 'BALANCE') {
					store.state.discount = null; //清空优惠券
					setTimeout(() => {
						wx.showToast({
							title: '支付成功',
							icon: 'success'
						});
					}, 500);
					store.dispatch('getUsersInfo');
					setTimeout(() => {
						that.payVisible = false;
						// wx.navigateBack({
						// 	delta: 1
						// });
						uni.navigateTo({
							url: '/personal/member/index'
						})
					}, 1200);
				} else {
					// 微信支付
					let { appId, ...query } = data.obj;
					wx.requestPayment({
						...query,
						orderInfo: query.data,
						success: res => {
							// #ifdef MP-ALIPAY
							if (res.resultCode != 9000) {
								setTimeout(() => {
									wx.showToast({
										title: '支付失败！',
										icon: 'none'
									});
								}, 500);
								return;
							}
							// #endif
							setTimeout(() => {
								wx.showToast({
									title: '支付成功',
									icon: 'success'
								});
							}, 500);
							store.dispatch('getUsersInfo');
							setTimeout(() => {
								// wx.navigateBack({
								// 	delta: 1
								// });
								uni.navigateTo({
									url:'/personal/member/index'
								})
							}, 1200);
						},
						fail: res => {
							setTimeout(() => {
								wx.showToast({
									title: '支付失败！',
									icon: 'none'
								});
							}, 500);
							that.payVisible = false;
						}
					});
				}
			} else {
				setTimeout(() => {
					wx.showToast({
						title: data.msg,
						icon: 'none'
					});
				}, 500);
				that.payVisible = false;
			}
		}
	},
	computed: {
		wallet() {
			store.state.wallet.amount = parseFloat(store.state.wallet.amount).toFixed(2);
			return store.state.wallet;
		}
	},
	onLoad() {},
	onShow() {
		let that = this;
		that.setmealIndex = 0;
		that.payVisible = false;
		that.amount = 0;
		that.getPlusOptions();
		store.dispatch('wallet');
	}
};
</script>

<style lang="stylus">
page
	background-color #fff
.icon
	width 20rpx
	height 20rpx
.rgb243
	color rgb(243, 53, 53)
.setmeal
	width 670rpx
	height 130rpx
	border-radius 10rpx
	border 1px solid #eff4f8
.setmeal-b
	border 2px solid rgb(243, 53, 53)
.positionori
	position absolute
	right 200rpx
	text-decoration line-through
.footer-b
	position fixed
	bottom 0rpx
	width 100%
.btn
	width 180rpx
	height 80rpx
	line-height 80rpx
	background-color rgb(27, 25, 33)
	border-radius 10rpx
.d_mask
	position absolute
	top 0
	left 0
	right 0
	bottom 0
	background-color rgba(25, 25, 25, 0.3)
.d_modal_content
	background-color #fff
	// border-radius 16rpx 16rpx 0 0
	position fixed
	bottom 0
	width 100%
.icon_pay
	width 50rpx
	height 50rpx
.height
	height 120rpx
.btn-b
	height 100rpx
	line-height 100rpx
	background-color rgb(27, 25, 33)
	border-radius 10rpx
.container-ban
	height 100%
	overflow hidden
/* .pfb{
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;}
.h120{
  height: 120rpx;
  line-height: 120rpx;} */
</style>
