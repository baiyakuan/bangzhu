<template>
	<view v-if="show" style="z-index: 100;position: relative;top: -40rpx;">
		<swiper style="height: 332rpx;" @change="change" :autoplay="false" :interval="3000">
			<swiper-item v-if="recommendParking.name && !processingList.length && !awaitPayList.length"><parking :recommendParking="recommendParking"></parking></swiper-item>
			<swiper-item v-for="(item, index) in processingList" :key="index"><order :order="item" :wallet="wallet.amount" @openRecharge="openRecharge"></order></swiper-item>
			<swiper-item v-for="(item, index) in awaitPayList" :key="index"><awaitPayOrder :order="item" @pay="openPay"></awaitPayOrder></swiper-item>
		</swiper>

		<!-- swiper指示点 -->
		<view v-if="swiperCount > 1" class="list"><view v-for="(item, index) in swiperCount" :key="index" class="item" :class="{ active: activeIndex == index }"></view></view>
		<view v-else style="height: 6rpx;margin: 12rpx auto;"></view>

		<!-- 支付方式弹框 -->
		<Pay :visible="payVisible" :amount="wallet.amount" :payamount="presentPrice" @cancel="payVisible = false" @enterPay="bgOrdersPay"></Pay>

		<recharge ref="recharge" @close="rechargeVisible = false"></recharge>
	</view>
</template>

<script>
import parking from '@/components/index_new/parking.vue';
import order from '@/components/index_new/order.vue';
import awaitPayOrder from '@/components/index_new/awaitPayOrder.vue';
import pay from '@/components/Pay/Pay.vue';
import recharge from '@/components/index_new/recharge.vue';
import { get } from '@/utils/miniLodash';

import { getOrderByStatus, bgOrdersPay, getUsersInfo, connectSocket } from '@/api';

export default {
	props: {
		recommendParking: {
			default: {}
		}
	},
	components: {
		parking,
		order,
		awaitPayOrder,
		pay,
		recharge
	},
	data() {
		return {
			payVisible: false,
			rechargeVisible: false,
			presentPrice: 20,
			orderIds: '',
			activeIndex: 0,
			interval: null
		};
	},
	computed: {
		processingList() {
			return this.$store.getters.processingList;
		},
		awaitPayList() {
			return this.$store.getters.awaitPayList;
		},
		wallet() {
			return this.$store.state.wallet;
		},
		isLogin() {
			return Object.keys(get(this.$store.state, 'userInfo', {})).length > 0;
		},
		// swiper数量
		swiperCount() {
			if (!this.processingList.length && !this.awaitPayList.length) {
				return this.recommendParking.name ? 1 : 0;
			} else {
				return this.processingList.length + this.awaitPayList.length;
			}
		},
		// 如果swiper数量大于0，显示当前控件
		show() {
			return this.swiperCount > 0;
		},
		// 是否自动轮播
		autoplay() {
			return !this.payVisible && !this.rechargeVisible;
		}
	},
	watch: {
		isLogin(newValue, oldValue) {
			if (newValue != oldValue) {
				this.$store.dispatch('wallet');
				this.$store.dispatch('getHomeOrderList', { istrue: true });
			}
		}
	},
	mounted() {
		const that = this;
		if (this.isLogin) {
			this.connectWebsocket(this.$store.state.userInfo.usersPhone,(res) => {
				var data = JSON.parse(res.data);
				switch (data.msgType) {
					case 'bgParkInfoMsg':
						// 停车场信息变化
						break;
					case 'bgOrderMsg':
						// 停车订单变化
						that.$store.dispatch('getHomeOrderList', { istrue: true });
						break;
				}
			});
		}
		
		// uni.onSocketMessage(function(res) {
		// 	var data = JSON.parse(res.data);
		// 	switch (data.msgType) {
		// 		case 'bgParkInfoMsg':
		// 			// 停车场信息变化
		// 			break;
		// 		case 'bgOrderMsg':
		// 			// 停车订单变化
		// 			that.$store.dispatch('getHomeOrderList', { istrue: true });
		// 			break;
		// 	}
		// });
	},
	methods: {
		compare(property) {
			return function(a, b) {
				var value1 = a[property];
				var value2 = b[property];
				return value1 - value2;
			};
		},
		// 重连websocket
		async connectWebsocket(data,func) {
			await connectSocket(data,func);
		},
		openRecharge(obj) {
			this.$refs.recharge.open(obj.brandNumber);
			this.rechargeVisible = true;
		},
		openPay(order) {
			this.presentPrice = order.awaitPayMoney;
			this.orderIds = order.orderCodeStr;
			this.payVisible = true;
		},
		change(event) {
			this.activeIndex = event.detail.current;
		},
		// 支付
		async bgOrdersPay(payType) {
			var that = this;
			const { data } = await bgOrdersPay({
				orderIds: that.orderIds,
				discountId: '',
				payType: payType
			});
			if (data.code == 1) {
				that.payVisible = false;
				if (payType == 'BALANCE') {
					uni.showToast({
						title: '支付成功',
						icon: 'success'
					});
					this.$store.dispatch('wallet');
					this.$store.dispatch('getHomeOrderList', { istrue: true });
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
								icon: 'success'
							});
							this.$store.dispatch('wallet');
							this.$store.dispatch('getHomeOrderList', { istrue: true });
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
		}
	}
};
</script>

<style lang="scss" scoped>
.list {
	width: 200rpx;
	height: 6rpx;
	margin: 12rpx auto;
	background-color: #fff;
	display: flex;
	align-items: center;
	border-radius: 10rpx;
}
.item {
	flex: 1;
	background-color: #fff;
	height: 100%;
	// transition: background-color 1s;
}
.active {
	background-color: #f33535;
	border-radius: 10rpx;
}
</style>
