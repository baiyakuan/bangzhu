<template>
	<view>
		<view class="pd40-x" v-if="mounted">
			<view v-if="canPay">
				<view class="pdt60 pdb30"><view class="ft50 ftweight rgb27">停车订单</view></view>
				<view v-if="noPayList.length && !currentOrder.isUnlicensedCar" class="ft36 ftweight rgb27 mgb40">当前订单</view>
				<view class="car_detail fst pd40 bgw">
					<image class="carImg" :src="Imgpath + currentOrder.picture" @click="showImg"></image>
					<view class="mgl100">
						<view class="time">
							<view class="rgb74 ft24">入场时间</view>
							<view class="ft26 text-black mgt10">{{ inTime }}</view>
						</view>
						<view class="car">
							<view class="rgb74 ft24 mgt10">停放车辆</view>
							<view class="text-black ft30 ftweight mgt10">{{ currentOrder.carNumber }}</view>
						</view>
					</view>
				</view>
				<view class="car_detail pd40 bgw">
					<view class="fst">
						<view><image :src="staticImg + 'static/img/orderIconAddress.png'" style="width:24rpx;height:28rpx"></image></view>
						<view class="mgl20">
							<view class="ft30 ftweight rgb27">{{ currentOrder.parkingName }}</view>
							<view class="ft20 rgb74 mgt12">{{ currentOrder.address }}</view>
						</view>
					</view>
					<view class="line mg40-y"></view>
					<view class="fs ft24">
						<view class="rgb74">停车时长:</view>
						<view class="text-black">{{ currentOrder.parkTime }}</view>
					</view>
					<view class="fs ft24 mgt20">
						<view class="rgb74">订单金额:</view>
						<view v-if="currentOrder.isParkingArea" class="text-black" style="color: rgb(86,201,204);" @click="$refs.moneyDetail.open(currentOrder.orderCode)">
							{{ currentOrder.totalMoney }}元
							<uni-icons type="arrowright" size="24" color="rgb(86,201,204)"></uni-icons>
						</view>
						<div v-else class="text-black">{{ currentOrder.totalMoney }}元</div>
					</view>
					<view v-if="true">
						<view class="fs ft24 mgt20">
							<view class="rgb74">优惠券:</view>
							<view v-if="currentOrder.payData.discount" class="ft24 rgb86" @click="chooseop(currentOrder.orderCode)">
								-{{ currentOrder.payData.discount }}元
								<uni-icons type="arrowright" size="24" color="rgb(86,201,204)"></uni-icons>
							</view>
							<view v-else class="ft24 rgb86" @click="chooseop(currentOrder.orderCode)">
								查看可用优惠券
								<uni-icons type="arrowright" size="24" color="rgb(86,201,204)"></uni-icons>
							</view>
						</view>
						<!-- <view class="fs ft24 mgt20" v-if="!noPayList.length">
							<view class="rgb74">PLUS折扣:</view>
							<view class="text-black">-{{currentOrder.payData.plusMoney}}元</view>
						</view> -->
					</view>
				</view>
				<view v-if="noPayList.length && !currentOrder.isUnlicensedCar">
					<view class="mg40-y rgb27"><text class="ft36 ftweight">历史欠缴订单</text></view>
					<view>
						<view v-for="(item, i) in noPayList" :key="i">
							<view class="list bgw fs pd40-x pd30-y mgb40" @click="changeSelected(i, item)">
								<image v-if="item.selectState == 2" :src="staticImg + 'static/img/selected_grey.png'" class="selectedImg"></image>
								<image v-else-if="item.isSelect" :src="staticImg + 'static/img/selected.png'" class="selectedImg"></image>
								<image v-else :src="staticImg + 'static/img/selected_empty.png'" class="selectedImg"></image>
								<image class="historCarImg" :src="Imgpath + item.picture"></image>
								<view class="detail">
									<view class="ft28 ftweight text-black ellipsis">{{ item.parkingName }}</view>
									<view class="ft26 text-black mgt10">{{ item.inTime }}</view>
									<view class="ft26 text-black mgt10">{{ item.parkTime }}</view>
									<view v-if="item.payData.discount" class="ft24 rgb86 mgt10" @click.stop="chooseop(item.orderCode)">
										-{{ item.payData.discount }}元
										<uni-icons type="arrowright" size="24" color="rgb(86,201,204)"></uni-icons>
									</view>
									<view v-else class="ft24 rgb86 mgt10" @click.stop="chooseop(item.orderCode)">
										查看可用优惠券
										<uni-icons type="arrowright" size="24" color="rgb(86,201,204)"></uni-icons>
									</view>
								</view>
								<view class="money ftweight rgb27">
									<text class="ft34">{{ item.totalMoney }}</text>
									<text class="ft26 mgl10">元</text>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="car_detail pd40-x pd20-y mg40-y bgw fs ft26" @click="visible = true">
					<view class="rgb74">若有疑问，请联系客服</view>
					<view class="text-orange">{{ servicePhone }}</view>
				</view>
				<view v-if="canOpenNoFeelPay" class="car_detail pd40-x pd20-y mg40-y bgw fs ft26" @click="openNoFeelPay = !openNoFeelPay">
					<view class="fst">
						<image :src="staticImg + 'static/img/wechat.png'" style="width: 40rpx;height: 40rpx;"></image>
						<view class="rgb74 mgl20 ft26">开通车主免密支付</view>
					</view>
					<view>
						<image class="icon" v-if="openNoFeelPay" :src="staticImg + 'static/img/checked.png'"></image>
						<image class="icon" v-else :src="staticImg + 'static/img/nocheck.png'"></image>
					</view>
				</view>
				<!-- 广告 -->
				<advSwiper :type="advType"></advSwiper>

				<view class="placeholder"></view>
				<view class="footer fs">
					<view class="mgl80 fst ftweight rgb27">
						<text class="ft48">{{ payMoney }}</text>
						<text class="ft26 mgl10">元</text>
					</view>
					<view v-if="discountPrice" class="fst ">
						<image class="plusImg" :src="staticImg + 'static/img/bpplus.png'"></image>
						<text class="ft30 ftweight rgb231 mgl10">-{{ discountPrice }}</text>
					</view>
					<view class="payBtn" @click="debounceEnterPay">{{ openNoFeelPay ? '支付并开通' : '支付' }}</view>
				</view>
				<Pay
					:visible="payVisible"
					:amount="wallet.amount"
					:cardBalance="cardBalance"
					:payamount="payMoney"
					:money="currentOrder.totalMoney"
					@cancel="payVisible = false"
					@enterPay="enterPay"
				></Pay>
			</view>
			<view v-else>
				<view class="pd40-x">
					<view class="noOrder">
						<image :src="staticImg + 'static/img/withdrawFail.png'" class="orderImg"></image>
						<view class="mg60-y ft36">未查询到停车订单</view>
					</view>
					<view class="noOrderContent">
						<view>请您尝试以下解决方案：</view>
						<view>1、将车辆驶出至道闸出口处再进行扫码操作。</view>
						<view>2、请您倒车三米，调整好角度重新尝试出场。</view>
						<view>3、无牌车请务必使用入场扫码时登录的微信、</view>
						<view>帮驻APP账号进行扫码缴费。</view>
						<view>4、若以上操作未能为您解决问题，请拨打客</view>
						<view>
							服电话：
							<view class="phoneText" @click="showPhone">{{ servicePhone }}</view>
						</view>
					</view>
				</view>

				<!-- <view class="callBtn" @click="visible = true">
					<image :src="staticImg + 'static/img/call.png'" class="callImg"></image>
					<text class="mg30-x ft30 ftweight">拨打客服</text>
				</view> -->
				<view class="zblxText">
					<text>停车有位</text>
					<text>出行更美</text>
				</view>
			</view>
		</view>
		<Modal v-if="visible" ok-css="color:#f44a3e;" ok-text="是" cancel-text="否" @ok="call" @cancel="visible = false">
			<view class="pd40-y">
				<view>是否拨打？</view>
				<view>{{ servicePhone }}</view>
			</view>
		</Modal>
		<toastes :visibile="toastVisibile">{{ msg }}</toastes>
		
		<moneyDetail ref="moneyDetail"></moneyDetail>
	</view>
</template>

<script>
import store from '@/store';
import { toFixed2 } from '@/utils';
import { parkingOrderView, getOrderByCode, interceptPay, getServicePhone } from '@/api';
import { formatTime, relativeDate } from '@/utils';
import { goLink } from '@/utils/link';
import { mapActions, mapState } from 'vuex';
import Modal from '@/components/Modal/index.vue';
import Pay from '@/components/Pay/Pay.vue';
import advSwiper from '@/components/adv_swiper/index.vue';
import moneyDetail from '../component/moneyDetail.vue';
import { debounce } from '@/utils/miniLodash';
export default {
	data() {
		return {
			advType: 26, //扫码缴费页
			toastVisibile: false, // toast弹窗展示
			msg: '', // toast弹窗内容
			mounted: false, // 后台是否已返回数据
			serialno: '', // 出场二维码携带参数
			currentOrder: {
				payData: {
					discount: 0,
					plusMoney: 0,
					payMoney: 0
				}
			}, // 当前欠缴订单详情
			noPayList: [], // 历史欠缴订单
			brand: {}, // 车牌信息
			inTime: '', // 车辆进场时间
			canOpenNoFeelPay: false, // 用户是否可开通微信无感支付
			payVisible: false, // 支付方式选择弹窗
			discountOrder: [], // 已选优惠券订单
			updata: false, // 使用优惠券触发视图更新
			orderInfos: '', // 已选支付订单
			noSelectOrders: '', // 未选支付订单
			orderCode: '', // 当前需支付订单
			openNoFeelPay: true, // 用户选择开通微信无感支付
			qrCodeScanTime: '', // 扫码时间
			canPay: true, // 是否有可缴费订单
			visible: false, // 拨打客服弹窗
			advInfo: {
				isShowAdv: true,
				imgUrl: 'imgUrl',
				url: 'url'
			},
			servicePhone: ''
		};
	},
	components: {
		Pay,
		Modal,
		advSwiper,
		moneyDetail
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
	onLoad(option) {
		store.commit('set_discountOrder', []);
		this.serialno = option.serialno;
		this.parkingOrderView();
		this.qrCodeScanTime = relativeDate(2);
		this.getServicePhone();
	},
	async onShow() {
		this.discountOrder = store.state.discountOrder;
		this.getOrderByCode();
		// this.getAdverUrl()

		// 停车卡余额
		this.$store.dispatch('getCardBalance', {
			parkingCode: this.currentOrder.parkingId,
			brandNumber: this.currentOrder.carNumber
		});
	},
	computed: {
		...mapState('commonModule', ['advertisement']),
		staticImg() {
			return this.$store.state.staticImg;
		},
		Imgpath() {
			return store.state.Imgpath;
		},
		wallet() {
			store.state.wallet.amount = parseFloat(store.state.wallet.amount).toFixed(2);
			return store.state.wallet;
		},
		cardBalance() {
			if (this.orderInfos.indexOf(',') > -1 || this.orderInfos.indexOf(';') > -1) {
				return null;
			}
			return this.$store.state.cardBalance ? this.$store.state.cardBalance.balance : null;
		},
		// 实际支付金额
		payMoney() {
			if (this.updata) {
				var a = null;
			}
			var money = 0;
			if (this.noPayList.length) {
				this.noPayList.map(item => {
					if (item.isSelect || item.selectState == 2) {
						money += item.payData.payMoney;
					}
				});
			}
			money += this.currentOrder.payData.payMoney;
			money = money.toFixed(3);
			money = toFixed2(money);
			return money;
		},
		// PLUS会员优惠金额
		discountPrice() {
			if (this.updata) {
				var a = null;
			}
			var money = 0;
			const payData = this.currentOrder.payData;
			money += payData.plusMoney;
			if (this.noPayList.length) {
				this.noPayList.map(item => {
					if (item.isSelect) {
						money += item.payData.plusMoney;
					}
				});
			}
			money = money.toFixed(3);
			money = toFixed2(money);
			return money;
		}
	},
	mounted() {
		this.debounceEnterPay = debounce(this.pay, 2000, true);
	},
	methods: {
		...mapActions('commonModule', ['getAdvertisement']),
		// 获取广告位信息
		getAdverUrl() {
			this.getAdvertisement({
				type: 2
			}); //1-待支付卡片 2-扫码缴费页 3-缴费完成页 4-停车场详情页 5-新手指南 6-领停车券 7-UGCBanner管理'     8-加油活动
		},
		//广告位跳转
		navDetail() {
			goLink(this.advertisement.miniprogramurl);
		},
		//获取客服电话
		async getServicePhone() {
			const { data } = await getServicePhone();
			if (data.code == 1) {
				this.servicePhone = data.obj.sevicePhoneList[0].servcePhone;
			}
		},
		// 获取订单数据
		async parkingOrderView() {
			let data = this.$store.state.outOrderInfo;

			const that = this;
			// const {
			// 	data
			// } = await parkingOrderView({
			// 	serialno: that.serialno
			// });
			if (data.code == 1) {
				if (data.obj) {
					this.advInfo = data.obj.advInfo;
					this.mounted = true;
					that.canPay = true;

					that.currentOrder = data.obj.currentOrder;
					that.currentOrder.payData = {
						discount: 0,
						plusMoney: that.currentOrder.discountedMoney,
						payMoney: that.currentOrder.payMoney
					};
					that.noPayList = data.obj.noPayList;
					that.noPayList.map(item => {
						item.inTime = formatTime(item.inTime.time);
						item.isSelect = item.selectState ? true : false;
						item.payData = {
							discount: 0,
							plusMoney: item.discountedMoney,
							payMoney: item.payMoney
						};
					});
					// 显示最优优惠券 （当前订单使用当前优惠券）
					if (that.currentOrder.usersDiscount) {
						that.discountOrder = [
							{
								id: that.currentOrder.orderCode,
								discount: {
									userDisCountId: that.currentOrder.usersDiscount.userDisCountId
								}
							}
						];
						that.chooseop2(that.currentOrder.orderCode);
					}
					that.inTime = formatTime(that.currentOrder.inTime.time);
					// #ifdef MP-WEIXIN
					if (data.obj.brand) {
						if (data.obj.brand.wxBrandState == 'UNAUTHORIZED' && data.obj.brand.userId == store.state.userInfo.userId) {
							this.canOpenNoFeelPay = true;
							this.openNoFeelPay = true;
						} else {
							this.canOpenNoFeelPay = false;
							this.openNoFeelPay = false;
						}
					} else {
						this.canOpenNoFeelPay = false;
						this.openNoFeelPay = false;
					}
					// #endif
					// #ifndef MP-WEIXIN
					this.canOpenNoFeelPay = false;
					this.openNoFeelPay = false;
					// #endif
				} else {
					this.mounted = true;
					that.canPay = false;
				}
			} else {
				this.mounted = true;
				that.canPay = false;
			}
		},
		// 订单选中优惠券
		getOrderByCode() {
			const that = this;
			that.discountOrder.map(item => {
				if (item.id == store.state.orderIdDetail) {
					var id = item.id;
					var discount = item.discount;
					if (item.discount == null) {
						discount = {
							userDisCountId: ''
						};
					}
					getOrderByCode({
						orderCode: id,
						discountId: discount.userDisCountId,
						userFlag: 1
					}).then(res => {
						const data = res.data;
						if (data.code == 1) {
							if (item.id == that.currentOrder.orderCode) {
								var currentPayMoey = that.currentOrder.totalMoney - data.obj.order.discountCoupon - data.obj.order.discountPlus;
								var payData = {
									discount: data.obj.order.discountCoupon,
									userDisCountId: discount.userDisCountId,
									plusMoney: data.obj.order.discountPlus,
									payMoney: currentPayMoey > 0 ? currentPayMoey : 0
								};
								that.currentOrder.payData = payData;
							} else {
								that.noPayList.map(item2 => {
									if (item.id == item2.orderCode) {
										var itemPayMoney = item2.totalMoney - data.obj.order.discountCoupon - data.obj.order.discountPlus;
										var payData = {
											discount: data.obj.order.discountCoupon,
											userDisCountId: discount.userDisCountId,
											plusMoney: data.obj.order.discountPlus,
											payMoney: itemPayMoney > 0 ? itemPayMoney : 0
										};
										item2.payData = payData;
									}
								});
							}
							that.updata = !that.updata;
						}
					});
				}
			});
		},
		// 选择优惠券
		chooseop(id) {
			store.commit('set_orderIdDetail', id);
			var isPush = true;
			this.discountOrder.map(item => {
				if (item.id == id) {
					isPush = false;
				}
			});
			if (isPush) {
				this.discountOrder.push({
					id
				});
			}
			store.commit('set_discountOrder', this.discountOrder);
			uni.navigateTo({
				url: `/personal/wallet/selectCoupon/index?type=2&state=1`
			});
		},
		chooseop2(id) {
			store.commit('set_orderIdDetail', id);
			var isPush = true;
			this.discountOrder.map(item => {
				if (item.id == id) {
					isPush = false;
				}
			});
			if (isPush) {
				this.discountOrder.push({
					id
				});
			}
			store.commit('set_discountOrder', this.discountOrder);
			this.getOrderByCode();
		},
		// 选取与取消历史订单支付
		changeSelected(i, item) {
			if (item.selectState == 2) return;
			this.$set(this.noPayList, i, { ...this.noPayList[i], isSelect: !this.noPayList[i].isSelect });
		},
		// 点击支付
		pay() {
			if (this.currentOrder.payData.discount) {
				this.orderInfos = this.currentOrder.orderCode + ',' + this.currentOrder.payData.userDisCountId;
			} else {
				this.orderInfos = this.currentOrder.orderCode;
			}
			this.noPayList.map(item => {
				if (item.isSelect || item.selectState == 2) {
					if (item.payData.discount) {
						this.orderInfos += ';' + item.orderCode + ',' + item.payData.userDisCountId;
					} else {
						this.orderInfos += ';' + item.orderCode;
					}
				} else {
					this.noSelectOrders += item.orderCode + ',';
				}
			});
			this.orderCode = this.currentOrder.orderCode;
			if (this.payMoney == '0.00') {
				this.enterPay('BALANCE');
			} else {
				if (this.openNoFeelPay) {
					this.enterPay('JSAPI');
				} else {
					this.payVisible = true;
				}
			}
		},
		// 确认支付
		async enterPay(payType) {
			const that = this;
			const { data } = await interceptPay({
				orderInfos: that.orderInfos,
				noSelectOrders: that.noSelectOrders,
				orderCode: that.orderCode,
				money: payType == 'PARKINGCARD' ? that.currentOrder.totalMoney : that.payMoney,
				payType,
				wxAppType: 6,
				isOpenWxNoFeelPay: that.openNoFeelPay,
				qrCodeScanTime: that.qrCodeScanTime
			});
			if (data.code == 1) {
				that.payVisible = false;
				if (payType == 'BALANCE') {
					uni.showToast({
						title: '支付成功',
						duration: 2000
					});
					setTimeout(() => {
						store.commit('set_discount', null);
						store.commit('set_orderIdDetail', '');
						store.commit('set_discountOrder', []);
						uni.reLaunch({
							url: `/personal/order/orderPay/success?plate=${that.currentOrder.carNumber}&money=${that.payMoney}`
						});
					}, 2000);
				} else if (payType == 'PARKINGCARD') {
					uni.showToast({
						title: '支付成功',
						duration: 2000
					});
					setTimeout(() => {
						store.commit('set_discount', null);
						store.commit('set_orderIdDetail', '');
						store.commit('set_discountOrder', []);
						uni.reLaunch({
							url: `/personal/order/orderPay/success?plate=${that.currentOrder.carNumber}&money=${that.currentOrder.totalMoney}`
						});
					}, 2000);
				} else {
					let { appId, ...query } = data.obj;
					uni.requestPayment({
						...query,
						orderInfo: query.data,
						success: function(res) {
							// #ifdef MP-ALIPAY
							if (res.resultCode != 9000) {
								uni.showToast({
									title: '支付失败！',
									icon: 'none'
								});
								return;
							}
							// #endif
							uni.showToast({
								title: '支付成功',
								icon: 'none'
							});
							setTimeout(() => {
								store.commit('set_discount', null);
								store.commit('set_orderIdDetail', '');
								store.commit('set_discountOrder', []);
								uni.reLaunch({
									url: `/personal/order/orderPay/success?plate=${that.currentOrder.carNumber}&money=${that.payMoney}`
								});
							}, 2000);
						},
						fail: function(err) {
							uni.showToast({
								title: '支付失败',
								icon: 'none'
							});
						}
					});
				}
			} else {
				uni.showToast({
					title: data.msg,
					icon: 'none'
				});
			}
		},
		call() {
			uni.makePhoneCall({
				phoneNumber: this.servicePhone,
				success: () => {
					this.visible = false;
				}
			});
		},
		showImg() {
			uni.navigateTo({
				url: '/personal/order/orderPay/img?imgpath=' + this.currentOrder.picture
			});
		},
		showPhone() {
			this.visible = true;
		}
	}
};
</script>

<style lang="scss">
.text-black {
	color: #2c2837;
}

.text-orange {
	color: #ff4610;
}

.car_detail {
	border-radius: 30rpx;
}

.carImg {
	width: 160rpx;
	height: 160rpx;
	border-radius: 20rpx;
}

.plusImg {
	width: 60rpx;
	height: 30rpx;
}

.selectedImg {
	width: 50rpx;
	height: 50rpx;
	position: absolute;
	top: 0;
	right: 0;
}

.historCarImg {
	width: 140rpx;
	height: 185rpx;
	border-radius: 20rpx;
}

.line {
	width: 100%;
	height: 1px;
	background: #eff4f8;
}

.icon {
	width: 30rpx;
	height: 30rpx;
}

.placeholder {
	width: 100%;
	height: 200rpx;
}

.detail {
	width: 50%;
}

.ellipsis {
	width: 100%;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.footer {
	position: fixed;
	left: 0;
	bottom: 0;
	background: #fff;
	width: 100%;
	height: 160rpx;
}

.payBtn {
	// width:200rpx;
	// height:80rpx;
	padding: 20rpx 50rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	// line-height: 80rpx;
	// text-align: center;
	background: rgba(255, 70, 16, 1);
	border-radius: 20rpx;
	font-size: 30rpx;
	font-weight: bold;
	color: #fefefe;
	margin-right: 40rpx;
}

.list {
	border-radius: 30px 0 30rpx 30rpx;
	position: relative;
}

.money {
	align-self: flex-end;
}

.callBtn {
	width: 600rpx;
	height: 80rpx;
	border-radius: 20rpx;
	background: #ff4610;
	color: #ffffff;
	margin: 240rpx auto;
	display: flex;
	justify-content: center;
	align-items: center;
}

.advertisingSpace {
	margin-top: 60rpx;
	height: 221rpx;

	image {
		width: 100%;
		height: 221rpx;
	}
}

.noOrder {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	padding-top: 150rpx;
	color: #f33535;
	font-family: 'PingFang SC';
	font-weight: 600;
}

.noOrderContent {
	color: #1b1a22;
	background-color: #e8e8e8;
	display: flex;
	flex-direction: column;
	opacity: 0.7;
	justify-content: space-around;
	// width: 598rpx;
	// height: 330rpx;
	margin: auto;
	padding: 20rpx 17rpx;
	border-radius: 30rpx;
	padding-left: 40rpx;
	font-size: 24rpx;
	line-height: 70rpx;
}

.phoneText {
	display: inline-block;
	color: #f33535;
}

.callBtn {
	width: 600rpx;
	height: 80rpx;
	border-radius: 20rpx;
	background: #ff4610;
	color: #ffffff;
	display: flex;
	justify-content: center;
	align-items: center;
	position: fixed;
	bottom: 200rpx;
	margin: 0 auto;
	left: 50%;
	transform: translateX(-50%);
}

.zblxText {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	position: fixed;
	color: #636d74;
	bottom: 120rpx;
	width: 250rpx;
	left: 50%;
	transform: translateX(-50%);
}

.orderImg {
	width: 100rpx;
	height: 100rpx;
}

.callImg {
	width: 30rpx;
	height: 30rpx;
}
</style>
