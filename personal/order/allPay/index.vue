<template>
	<div class="pd40-x pdb40">
		<h1 class="ftweight ft50 rgb27 pd50-y">订单详情</h1>
		<div class="card_title fst mgb40">
			<div class="mgr40"><image :src="staticImg + 'static/img/orderIcon3.png'" class="card_icon"></image></div>
			<div>
				<p class="ftweight ft36 rgb27">待支付</p>
				<p class=" ft24 rgb74 mgt10">PLEASE PAY</p>
			</div>
		</div>

		<!-- 已完成 待支付 -->
		<div class="park mgt40  bgw pd40">
			<div class="fs mgb20">
				<div class="ft24 rgba74">订单金额:</div>
				<div class=" ft24 rgb27">{{ unpaidOrderInfo.money }}元</div>
			</div>
			<!-- 待支付 -->
			<div class="fs mgb20">
				<div class="ft24 rgba74">优惠券:</div>
				<div v-if="unpaidOrderInfo.money == 0.0" class=" ft24 rgb86">-0.00元</div>
				<div v-if="unpaidOrderInfo.money != 0.0 && unpaidOrderInfo.discountNum != 0" class="ft24 rgb86" @click="chooseop">
					-{{ unpaidOrderInfo.discountNum }}元
					<uni-icons type="arrowright" size="24" color="rgb(86,201,204)"></uni-icons>
				</div>
				<div v-if="unpaidOrderInfo.money != 0.0 && unpaidOrderInfo.discountNum == 0 && hasCoupon" class=" ft24 rgb86" @click="chooseop">
					查看可用优惠券
					<uni-icons type="arrowright" size="24" color="rgb(86,201,204)"></uni-icons>
				</div>
				<div v-if="unpaidOrderInfo.money != 0.0 && unpaidOrderInfo.discountNum == 0 && !hasCoupon" @click="chooseop" class="rgba74 ft24">
					暂无可用优惠券
					<uni-icons type="arrowright" size="24" class="rgba74"></uni-icons>
				</div>
			</div>
			<div class="fs">
				<div class="ft24 rgba74">PLUS折扣:</div>
				<div class=" ft24 rgb86">-{{ unpaidOrderInfo.discountPlus }}元</div>
			</div>
			<!-- <div class="fs">
			<div class="ft24 rgba74 ">实付款:</div>
			<div class=" ft24 rgb27">{{unpaidOrderInfo.payMoney}}元</div>
		  </div> -->
		</div>
		
		<div class="park mgt40  bgw pd40 mgb40">
			<div class="fs">
				<div class="ftweight fcx">
					<div class="ft48 rgb27 mgr20">{{ unpaidOrderInfo.payMoney }}</div>
					<div class=" ft26 rgb27">元</div>
				</div>
				<div class="payBtn ft26 ftweight" @click="pay">支付</div>
			</div>
		</div>
		<advSwiper :type="advType" v-if="advType"></advSwiper>
		<Pay :visible="payVisible" :amount="wallet.amount" :payamount="unpaidOrderInfo.payMoney" @cancel="payVisible = false" @enterPay="bgOrdersPay"></Pay>
	</div>
</template>

<script>
import { unpaidOrderMsg, bgOrdersPay, noUseDiscount, orderDiscountList } from '@/api';
import store from '@/store';
import { createNamespacedHelpers } from 'vuex';

const { mapMutations } = createNamespacedHelpers('orderModule');
import advSwiper from '@/components/adv_swiper/index.vue'
import uniIcons from '@/components/uni-icons/uni-icons.vue';
export default {
	components: {
		uniIcons,
		advSwiper
	},
	data() {
		return {
			advType:19,
			//未支付信息
			unpaidOrderInfo: {
				money: '',
				discountNum: '',
				discountPlus: '',
				payMoney: ''
			},
			time: {
				h: '00',
				m: '00',
				s: '00'
			},
			payVisible: false,
			hasCoupon: false,
			unpaidShow: false
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
	methods: {
		...mapMutations(['deletePaidOrder']),
		// 点击支付
		pay() {
			if (this.unpaidOrderInfo.payMoney == '0.00') {
				this.bgOrdersPay('BALANCE');
			} else {
				this.payVisible = true;
			}
		},
		async getCoupon() {
			const { data } = await orderDiscountList({
				pageIndex: 1,
				orderId: this.orderId,
				type: 1
			});
			if (data.code == 1 && data.obj.discountList.length > 0) {
				this.hasCoupon = true;
			}
		},
		// 未支付订单详情
		async unpaidOrderMsg() {
			var that = this;
			const { data } = await unpaidOrderMsg({
				orderCodes: that.orderId,
				discountId: that.discount ? that.discount.userDisCountId : ''
			});
			if (data.code == 1) {
				that.unpaidOrderInfo = data.obj.order;
				that.unpaidOrderInfo.payMoney = (that.unpaidOrderInfo.payMoney * 1).toFixed(2);
				that.unpaidOrderInfo.money = (that.unpaidOrderInfo.money * 1).toFixed(2);
				that.unpaidOrderInfo.discountNum = (that.unpaidOrderInfo.discountNum * 1).toFixed(2);
				that.unpaidOrderInfo.discountPlus = (that.unpaidOrderInfo.discountPlus * 1).toFixed(2);
			}
		},
		// 支付
		async bgOrdersPay(payType) {
			var that = this;
			const { data } = await bgOrdersPay({
				orderIds: that.orderId,
				discountId: that.discount ? that.discount.userDisCountId : '',
				payType: payType
			});
			if (data.code == 1) {
				that.payVisible = false;
				if (payType == 'BALANCE') {
					uni.showToast({
						title: '支付成功',
						duration: 2000
					});
					that.deletePaidOrder(that.orderId.split(','));
					setTimeout(() => {
						uni.navigateBack({
							delta: 1
						});
					}, 2000);
				} else {
					let { appId, ...query } = data.obj;
					wx.requestPayment({
						...query,
						orderInfo: query.data,
						success: function(res) {
							// #ifdef MP-ALIPAY
							if (res.resultCode != 9000) {
								wx.showToast({
									title: '支付失败！',
									icon: 'none'
								});
								that.noUseDiscount();
								return;
							}
							// #endif
							wx.showToast({
								title: '支付成功',
								icon: 'none'
							});
							that.deletePaidOrder(that.orderId.split(','));
							store.dispatch('getUsersInfo');
							setTimeout(() => {
								wx.navigateBack({
									delta: 1
								});
							}, 1200);
						},
						fail: function(err) {
							uni.showToast({
								title: '支付失败',
								icon: 'none'
							});
							that.noUseDiscount();
						}
					});
				}
			} else {
				wx.showToast({
					title: data.msg,
					icon: 'none'
				});
				that.noUseDiscount();
			}
		},
		// 选择优惠券
		chooseop() {
			wx.navigateTo({
				url: `/personal/wallet/selectCoupon/index?type=1`
			});
		},
		//取消使用优惠券
		async noUseDiscount() {
			var that = this;
			const { data } = await noUseDiscount({
				orderIds: that.orderId,
				istrue: true
			});
		}
	},
	computed: {
		wallet() {
			store.state.wallet.amount = parseFloat(store.state.wallet.amount).toFixed(2);
			return store.state.wallet; 
		},
		// 获取多orderId
		orderId() {
			return store.state.applyOrderId;
		},
		//待支付---选择的优惠券金额
		discount() {
			return store.state.discount;
		}, 
		// 已完成---
		discountPrice() {
			return (this.unpaidOrderInfo.discountPlus * this.unpaidOrderInfo.money).toFixed(2);
		},
		// 已完成---
		discountCoupon() {
			return (this.unpaidOrderInfo.discountCoupon * 1).toFixed(2);
		},
		staticImg() { return store.state.staticImg } ,
	},
	onShow() {
		this.payVisible = false;
		store.dispatch('wallet');
		this.unpaidOrderMsg();
		this.getCoupon();
	},
	onUnload() {
		store.commit('set_discount', null);
	}
};
</script>
<style lang="stylus">
/* @import '../../../styles/color.scss' */
page
	background rgba(246, 248, 251, 1)
.red_line
	width 640rpx
	margin 0 auto
	border 2px solid red
	border-color transparent transparent red transparent
	border-top none
.card
	border-radius 20rpx
	box-shadow 4rpx 4rpx 50rpx #ccc
.park_detail
	border-top 1px dashed #ccc
	border-bottom 1px dashed #ccc
.park:after
	content ''
	display block
	clear both
.no_wrap
	white-space nowrap
	overflow hidden
	text-overflow ellipsis
.card_icon
	width 80rpx
	height 80rpx
.park
	border-radius 32rpx
.nav_icon
	width 60rpx
	height 60rpx
.payBtn
	width 180rpx
	height 80rpx
	background rgba(27, 25, 33, 1)
	border-radius 20rpx
	color #FFFFFF
	text-align center
	line-height 80rpx
.ellipsis
	overflow hidden
	white-space nowrap
	text-overflow ellipsis
</style>
