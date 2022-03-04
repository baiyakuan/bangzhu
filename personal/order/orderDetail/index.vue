<template>
	<div style="width: 100%; height: 100%;">
		<div class="pd40-x pdb40" v-if="apiNum > 1">
			<h1 class="ftweight ft50 rgb27 pd50-y">订单详情</h1>
			<div class="card_title fst mgb40">
				<div class="mgr40"><image :src="orderInfo.orderIcon" class="card_icon"></image></div>
				<div>
					<p class="ftweight ft36 rgb27">{{ orderInfo.status == 1 ? '停车中' : orderInfo.status == 3 ? '待支付' : '已完成' }}</p>
					<p class=" ft24 rgb74 mgt10">{{ orderInfo.status == 1 ? 'PARKING' : orderInfo.status == 3 ? 'PLEASE PAY' : 'COMPLETED' }}</p>
				</div>
				<view class="refund" v-if="orderInfo.status == 2 && orderInfo.refund_status == 6">已退款</view>
			</div>
			<!-- 停车中 -->
			<div v-if="orderInfo.status == 1">
				<div class="park bgw pd40">
					<div class=" fs" @click="nav2parkLotDetail(orderInfo.parkingId)">
						<div class="fst" style="width:80%">
							<img :src="staticImg + 'static/img/orderIconAddress.png'" style="width:24rpx;height:28rpx" />
							<div class="mgl20" style="width: 90%;">
								<div class=" ft32 ftweight  rgb27 mgb12 ellipsis">{{ orderInfo.parkingName }}</div>
								<div class=" ft20 rgb74 ellipsis">{{ orderInfo.address }}</div>
							</div>
						</div>
						<image :src="staticImg + 'static/img/parking-09.png'" class="nav_icon" @click.stop="mapnavigation"></image>
					</div>
				</div>
				<div class="park mgt40  bgw pd40">
					<div class="fcy pdb40" style="border-bottom: 2rpx dashed  rgba(239,244,248,1);">
						<div class="ft48 ftweight rgb44">{{ time.h }}：{{ time.m }}：{{ time.s }}</div>
						<div class="ft24 rgba74">停车时长</div>
					</div>
					<div class="fs pdt40 mgb20">
						<div class="ft24 rgba74" style="display: flex;align-items: center;">
							入场时间
							<image @click="openModal" style="width: 20rpx;height: 20rpx;margin-left: 16rpx;" src="@/static/img/question.png" mode=""></image>
						</div>
						<div class="ft24 rgb27">{{ orderInfo.inTime }}</div>
					</div>
					<div class="fs mgb20">
						<div class="ft24 rgba74">车辆</div>
						<div class=" ft24 rgb27">{{ orderInfo.carNumber }}</div>
					</div>
					<div class="fs mgb20" v-if="orderInfo.areaTime">
						<div class="ft24 rgba74">专属区停车时长</div>
						<div class=" ft24 rgb27">{{ s2time(orderInfo.areaTime) }}</div>
					</div>
					<div class="fs">
						<div class="ft24 rgba74">金额</div>
						<div class=" ft24 rgb27">{{ orderInfo.money }}元</div>
					</div>
				</div>
			</div>

			<!-- 已完成 待支付 -->
			<div v-else>
				<div class="park bgw pd40">
					<div class="pdb40 fs" style="border-bottom: 2rpx dashed  rgba(239,244,248,1);" @click="nav2parkLotDetail(orderInfo.parkingId)">
						<div class="fst" style="flex:1">
							<img :src="staticImg + 'static/img/orderIconAddress.png'" style="width:24rpx;height:28rpx" />
							<div class="mgl20" style="width: 500rpx;">
								<div class=" ft32 ftweight  rgb27 mgb12 ellipsis">{{ orderInfo.parkingName }}</div>
								<div class=" ft20 rgb74 ellipsis">{{ orderInfo.address }}</div>
							</div>
						</div>
						<uni-icons type="arrowright" size="30" class="mgt4 arrowRight"></uni-icons>
					</div>
					<div class="mgt30 pr">
						<div class="ft24 rgba74 mgb30" style="display: flex;align-items: center;">
							起止时间
							<image @click="openModal" style="width: 20rpx;height: 20rpx;margin-left: 16rpx;" src="@/static/img/question.png" mode=""></image>
						</div>
						<div class="fst mgb20">
							<img :src="staticImg + 'static/img/red2.png'" style="width:10rpx;height:10rpx;" />
							<div class="ft26  mgl50 rgb44" style="height: 36rpx;line-height: 36rpx;">{{ orderInfo.inTime }}</div>
						</div>
						<div class="fst">
							<img :src="staticImg + 'static/img/red1.png'" style="width:10rpx;height:10rpx;" />
							<div class="ft26  mgl50 rgb44" style="height: 36rpx;line-height: 36rpx;">{{ orderInfo.outTime }}</div>
						</div>
						<div class="line"></div>
					</div>
					<div class="time mgt30 fs">
						<div class="ft24 rgba74 ">停车时长</div>
						<div class=" ft24 rgb44">{{ time.h }}：{{ time.m }}：{{ time.s }}</div>
					</div>
					<div class="time mgt30 fs">
						<div class="ft24 rgba74 ">车辆</div>
						<div class=" ft24 rgb44">{{ orderInfo.carNumber }}</div>
					</div>
				</div>
				<div class="park mgt40 bgw pd40">
					<div class="fs mgb20">
						<div class="ft24 rgba74">订单金额:</div>
						<div v-if="orderInfo.isParkingArea" class=" ft24 rgb27" style="color: rgb(86,201,204);" @click="$refs.moneyDetail.open(orderId)">
							{{ orderInfo.money }}元
							<uni-icons type="arrowright" size="24" color="rgb(86,201,204)"></uni-icons>
						</div>
						<div v-else class="ft24 rgb27">{{ orderInfo.money }}元</div>
					</div>
					<!-- 已完成 -->
					<div class="fs mgb20" v-if="orderInfo.status == 2">
						<div class="ft24 rgba74">优惠券:</div>
						<div class=" ft24 rgb86">-{{ orderInfo.payType == 'PARKINGCARD' ? '0.00' : discountCoupon }}元</div>
					</div>
					<!-- 待支付 -->
					<div class="fs mgb20" v-if="orderInfo.status == 3">
						<div class="ft24 rgba74">优惠券:</div>
						<div v-if="orderInfo.money == 0.0" class=" ft24 rgb86">-0.00元</div>
						<div v-if="orderInfo.money != 0.0 && (orderInfo.discountCoupon != 0.0 || discount)" class="ft24 rgb86" @click="chooseop">
							-{{ orderInfo.discountCoupon }}元
						</div>
						<div v-if="orderInfo.money != 0.0 && orderInfo.discountCoupon == 0.0 && !discount && hasCoupon" class=" ft24 rgb86" @click="chooseop">
							查看可用优惠券
							<uni-icons type="arrowright" size="24" color="rgb(86,201,204)"></uni-icons>
						</div>
						<div v-if="orderInfo.money != 0.0 && orderInfo.discountCoupon == 0.0 && !discount && !hasCoupon" @click="chooseop" class="rgba74 ft24">
							暂无可用优惠券
							<uni-icons type="arrowright" size="24" class="rgba74"></uni-icons>
						</div>
					</div>
					<div class="fs" :class="orderInfo.status == 2 ? 'mgb20' : ''">
						<div class="ft24 rgba74  ">PLUS折扣:</div>
						<div class=" ft24 rgb86">-{{ orderInfo.discountPlus }}元</div>
					</div>
					<div class="fs mgb20" v-if="orderInfo.status == 2 && orderInfo.wxDiscountPay != '0.00'">
						<div class="ft24 wxDiscountPay">微信补贴:</div>
						<div class=" ft24 wxDiscountPay">-{{ orderInfo.wxDiscountPay }}元</div>
					</div>
					<div class="fs" v-if="orderInfo.status == 2">
						<div class="ft24 rgba74 ">实付款:</div>
						<div class=" ft24 rgb27 fs">
							<img class="payIcon" src="/static/img/cardPayIcon.png" v-if="orderInfo.payType == 'PARKINGCARD'" />
							<img class="payIcon" :src="staticImg + 'static/img/gold.png'" v-if="orderInfo.payType == 'BALANCE'" />
							<img class="payIcon" :src="staticImg + 'static/img/pay_wechat.png'" v-if="orderInfo.payType == 'JSAPI' || orderInfo.payType == 'APP'" />
							<img class="payIcon" :src="staticImg + 'static/img/pay_ali.png'" v-if="orderInfo.payType == 'AL_MY' || orderInfo.payType == 'AL_APP'" />
							{{ orderInfo.payType == 'PARKINGCARD' ? orderInfo.money : orderInfo.payMoney }}元
						</div>
					</div>
				</div>
				<div class="park mgt40  bgw pd40" v-if="orderInfo.status == 3">
					<div class="fs">
						<div class="ftweight fcx">
							<div class="ft48 rgb27 mgr20">{{ orderInfo.payMoney }}</div>
							<div class=" ft26 rgb27">元</div>
						</div>
						<div class="payBtn ft26 ftweight" @click="pay">支付</div>
					</div>
				</div>
			</div>
			<Pay
				:visible="payVisible"
				:amount="wallet.amount"
				:cardBalance="cardBalance.balance"
				:payamount="orderInfo.payMoney"
				:money="orderInfo.money"
				@cancel="payVisible = false"
				@enterPay="bgOrderPay"
			></Pay>
		</div>
		<div v-else class="loadingWrapper"><u-loading mode="circle" size="65"></u-loading></div>

		<inOutPic ref="inOutPic"></inOutPic>
		<!-- 广告 -->
		<view class="mgb40"><advSwiper :type="advType" v-if="advType"></advSwiper></view>

		<moneyDetail ref="moneyDetail"></moneyDetail>
	</div>
</template>

<script>
import { getOrderByOrderId, connectSocket, bgOrderPay, cancelPayByOrderId, orderDiscountList } from '@/api';
import { get } from '@/utils/miniLodash';
import { duration, duration1, accMul, accSubtr } from '@/utils/index';
import { createNamespacedHelpers } from 'vuex';

const { mapMutations, mapState } = createNamespacedHelpers('orderModule');

import uniIcons from '@/components/uni-icons/uni-icons.vue';
import inOutPic from '../component/inOutPic.vue';
import advSwiper from '@/components/adv_swiper/index.vue';
import moneyDetail from '../component/moneyDetail.vue';

export default {
	components: {
		uniIcons,
		inOutPic,
		advSwiper,
		moneyDetail
	},
	data() {
		return {
			orderId2: '',
			// 订单详情
			orderInfo: {
				parkingName: '',
				address: '',
				inTime: '',
				outTime: '',
				carNumber: '',
				money: '',
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
			timer: null, // 停车中计时器
			apiNum: 0
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
			if (this.orderInfo.payMoney == '0.00') {
				this.bgOrderPay('BALANCE');
			} else {
				this.payVisible = true;
			}
		},
		async getCoupon() {
			const { data } = await orderDiscountList({
				pageIndex: 1,
				orderId: this.orderId,
				type: 2
			});
			this.apiNum += 1;
			if (data.code == 1 && data.obj.discountList.length > 0) {
				this.hasCoupon = true;
			}
		},
		// 订单详情
		async getOrderInfo() {
			var that = this;
			console.log(that.discount);
			const { data } = await getOrderByOrderId({
				orderId: that.orderId,
				discountId: that.discount ? that.discount.userDisCountId : '',
				type: this.typeFlag
			});
			this.apiNum += 1;
			if (data.code == 1) {
				that.orderInfo = data.obj;
				// 停车卡余额
				this.$store.dispatch('getCardBalance', {
					parkingCode: that.orderInfo.parkingId,
					brandNumber: that.orderInfo.carNumber
					// brandNumber:'鲁H4635H'
				});
				that.orderInfo.payMoney = (
					(that.orderInfo.money - that.orderInfo.discountCoupon - that.orderInfo.discountPlus - get(that, 'orderInfo.wxDiscountPay', 0)) *
					1
				).toFixed(2);
				that.orderInfo.money = (that.orderInfo.money * 1).toFixed(2);
				that.orderInfo.discountCoupon = (that.orderInfo.discountCoupon * 1).toFixed(2);
				that.orderInfo.discountPlus = (that.orderInfo.discountPlus * 1).toFixed(2);
				that.orderInfo.orderIcon = this.staticImg + 'static/img/orderIcon' + that.orderInfo.status + '.png';
				that.orderInfo.wxDiscountPay = (that.orderInfo.wxDiscountPay * 1).toFixed(2);

				if (parseFloat(that.orderInfo.payMoney) < 0) {
					that.orderInfo.payMoney = '0.00';
				}

				if (that.orderInfo.status == 1) {
					clearInterval(this.timer);
					var time = data.time;
					this.time = duration1(that.orderInfo.inTime, time, 2);
					var timer = setInterval(() => {
						this.time = duration1(that.orderInfo.inTime, time, 2);
						time += 1000;
					}, 1000);
					this.timer = timer;
				} else {
					clearInterval(this.timer);
					this.time = duration1(that.orderInfo.inTime, that.orderInfo.outTime, 1);
				}
			}
		},
		// 支付
		async bgOrderPay(payType) {
			var that = this;
			const { data } = await bgOrderPay({
				orderId: that.orderId,
				discountId: that.discount ? that.discount.userDisCountId : '',
				payType: payType
			});
			if (data.code == 1) {
				that.payVisible = false;
				if (payType == 'BALANCE' || payType == 'PARKINGCARD') {
					uni.showToast({
						title: '支付成功',
						duration: 2000
					});
					this.deletePaidOrder([that.orderId]);
					setTimeout(() => {
						that.$store.commit('set_discount', null);
						that.getOrderInfo();
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
								that.cancelPayByOrderId();
								return;
							}
							// #endif
							wx.showToast({
								title: '支付成功',
								icon: 'none'
							});
							this.deletePaidOrder([that.orderId]);
							// this.$store.dispatch("getUsersInfo");
							setTimeout(() => {
								that.$store.commit('set_discount', null);
								that.getOrderInfo();
							}, 2000);
						},
						fail: function(err) {
							uni.showToast({
								title: '支付失败',
								icon: 'none'
							});
							that.cancelPayByOrderId();
						}
					});
				}
			} else {
				wx.showToast({
					title: data.msg,
					icon: 'none'
				});
				that.cancelPayByOrderId();
			}
		},
		// 选择优惠券
		chooseop() {
			wx.navigateTo({
				url: `/personal/wallet/selectCoupon/index?type=2`
			});
		},
		//取消使用优惠券
		async cancelPayByOrderId() {
			var that = this;
			const { data } = await cancelPayByOrderId({
				orderId: that.orderId,
				istrue: true
			});
		},
		//点击导航
		mapnavigation() {
			uni.openLocation({
				latitude: this.orderInfo.latitude,
				longitude: this.orderInfo.longitude,
				name: this.orderInfo.parkingName,
				address: this.orderInfo.address
			});
		},
		// 导航去停车场详情
		nav2parkLotDetail(id) {
			uni.navigateTo({
				url: '/basic/parkLotDetail/index?id=' + id
			});
		},
		openModal() {
			this.$refs.inOutPic.open(this.orderInfo);
		},
		s2time(seconds) {
			seconds = seconds || 0;
			seconds = parseInt(seconds) / 1000;
			let h = parseInt(seconds / 3600);
			let m = parseInt((seconds % 3600) / 60);
			let s = parseInt((seconds % 3600) % 60);
			h = h < 10 ? '0' + h : h;
			m = m < 10 ? '0' + m : m;
			s = s < 10 ? '0' + s : s;
			return h + ':' + m + ':' + s;
		}
	},
	computed: {
		...mapState({
			orderList: state => [...state.unpaidOrderDetail.orders, ...state.ongoingOrderDetail.orders, ...state.finishedOrderDetail.orders]
		}),
		advType() {
			if (this.orderInfo.status == 1) {
				return 20; // 停车中
			} else if (this.orderInfo.status == 2) {
				return 21; // 已完成
			} else if (this.orderInfo.status == 3) {
				return 19; // 待支付
			}
		},
		staticImg() {
			return this.$store.state.staticImg;
		},
		wallet() {
			this.$store.state.wallet.amount = parseFloat(this.$store.state.wallet.amount).toFixed(2);
			return this.$store.state.wallet;
		},
		cardBalance() {
			if (this.orderInfo.money != 0.0 && (this.orderInfo.discountCoupon != 0.0 || this.discount)) {
				return null;
			} else {
				return this.$store.state.cardBalance;
			}
		},
		// 获取单个orderId
		orderId() {
			return this.orderId2 ? this.orderId2 : this.$store.state.orderIdDetail;
		},
		typeFlag() {
			const findOrder = this.orderList.find(order => order.orderId == this.orderId);
			if (findOrder) {
				return findOrder.typeFlag;
			} else {
				return 1;
			}
		},
		//待支付---选择的优惠券金额
		discount() {
			return this.$store.state.discount;
		},
		// 已完成---
		discountPrice() {
			return (this.orderInfo.discountPlus * this.orderInfo.money).toFixed(2);
		},
		// 已完成---
		discountCoupon() {
			return (this.orderInfo.discountCoupon * 1).toFixed(2);
		}
	},
	onLoad(options) {
		this.orderId2 = options.orderId;
	},
	onShow() {
		var that = this;
		this.payVisible = false;

		this.getOrderInfo();
		this.getCoupon();
		uni.onSocketMessage(function(res) {
			var data = JSON.parse(res.data);
			switch (data.msgType) {
				case 'bgOrderMsg':
					// 停车订单变化
					setTimeout(() => {
						that.getOrderInfo();
					}, 500);
					break;
			}
		});
		this.$store.dispatch('wallet');
	},
	onUnload() {
		this.$store.commit('set_discount', null);
	}
};
</script>
<style lang="stylus" scoped>
@import '../../../styles/color.styl'

page
	width 100%
	height 100%
	background rgba(246, 248, 251, 1)
.loadingWrapper
	width 100%
	height 100%
	display flex
	justify-content center
	align-items center
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
	width 100%
.line
	position absolute
	content ''
	left 3rpx
	bottom 30rpx
	width 4rpx
	height 32rpx
	background rgba(239, 244, 248, 1)
.wxDiscountPay
	color #C69E68
.payIcon
	width 30rpx
	height 30rpx
	margin-right 10rpx
</style>

<style lang="scss" scoped>
.refund {
	background-color: #f33535;
	color: #fff;
	font-size: 20rpx;
	border-radius: 20rpx;
	padding: 6rpx 20rpx;
	margin-left: auto;
	flex-shrink: 0;
}
</style>
