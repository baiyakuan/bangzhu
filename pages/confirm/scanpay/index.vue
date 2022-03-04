<template>
	<div>
		<div class="camera_box">
			<camera v-if="camearShow" mode="scanCode" device-position="back" flash="off" @scancode="scan" @error="error" class="camera">
				<cover-view class="carCode_box"><cover-image :src="staticImg + 'static/img/barCode.png'" style="width:100%;height:100%;" /></cover-view>
			</camera>
			<!-- <canvas v-if="canvas" canvas-id='h' style="width: 100vw; height: 30vh;position:absolute;top:0;z-index:999;"></canvas> -->
		</div>
		<p class="words">扫描商品条形码，自助结算</p>
		<div class="goodlist">
			<div class="ft36 tac mgt20 mgb30">商品列表</div>
			<scroll-view class="scroll" scroll-y="true" :scroll-into-view="itemid" scroll-with-animation="true">
				<div class="list_item pd10-y" v-for="(item, index) in goodsArr" :key="index" :id="item.goodsId">
					<div class="fleft mgl30 name_box">
						<p class="ft36 itemName">{{ item.name }}</p>
						<p class="ft28 rgb243">
							<span>￥</span>
							<span>{{ item.price }}</span>
						</p>
					</div>
					<div class="fright mgr30 ft32 num_box">
						<img class="num_img" @click="releaseNum(item.barCode)" :src="staticImg + 'static/img/jian.png'" alt="" />
						<span class="mg10-x num tac">{{ item.num }}</span>
						<img class="num_img" @click="addNum(item.barCode)" :src="staticImg + 'static/img/jia.png'" alt="" />
					</div>
				</div>
			</scroll-view>
			<div v-if="footerVisible" class="footer">
				<div v-if="plus" class="plus_info tac">
					<span>原价: {{ originalPrice }}元</span>
					<span class="mg20-x">{{ plusTime }}: {{ discountNum }}</span>
					<span>现价: {{ presentPrice }}元</span>
				</div>
				<div v-else-if="openPlus" class="openPlus tac" @click="purchase">
					<!-- 立刻开通PLUS会员，享受更多优惠 -->
					立即续费,可继续享受优惠折扣!
				</div>
				<div v-else></div>
				<div class="button tac ft32 pd20-y" @click="pay">需支付 {{ presentPrice }}元</div>
			</div>
		</div>

		<!-- 支付方式弹框 -->
		<Pay :visible="payVisible" :amount="wallet.amount" :payamount="presentPrice" @cancel="cancelP" @enterPay="enterPay"></Pay>
	</div>
</template>

<script>
import store from '@/store';
import { getPayPageData, buyGoodsPay, cancelPay } from '@/api';
import Pay from '@/components/Pay/Pay.vue';
export default {
	data() {
		return {
			isScan: true, // 是否可以扫码 默认true为可以
			merchantId: '', // 商户ID
			goodsList: {}, // 商户所有商品列表
			goodsCode: [], // 扫描到的商品条码
			goodsObj: {}, // 当前条码所属商品信息
			goodsArr: [], // 历史条码所属商品数组
			showStatus: 0, // 商户及用户是否开启联名VIP，1为商户未开通，2为商户开通用户未开通，3为商户开通用户开通但联名卡过期，4为已开通
			merchantObj: {}, // 扫码付款商户信息
			jointlyVip: {}, // 用户开通会员后的优惠信息
			plus: false, // 商户及用户均开通会员
			openPlus: false, // 商户开通但用户未开通或过期
			plusTime: '', // 用户plus会员年限
			footerVisible: false, // 底部付款按钮可见性
			itemid: '', // scroll-view子元素id
			payVisible: false, // 选择支付方式弹窗可见性
			clickbtn: false, // 支付按钮是否可点击
			isonshow: false, //是否执行onshow
			camearShow: true
			// canvas:false,
		};
	},
	components: {
		Pay
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
	onLoad() {
		var that = this;
		that.merchantId = '';
		let { merchantId } = that.$root.$mp.query;
		that.merchantId = merchantId;
		that.isonshow = false;
		// that.ctx = wx.createCameraContext()
		that.goodsArr = [];
		that.goodsList = {};
		that.goodsCode = [];
		that.goodsObj = {};
		that.showStatus = 0;
		that.merchantObj = {};
		that.jointlyVip = {};
		that.plus = false;
		that.openPlus = false;
		that.plusTime = '';
		that.footerVisible = false;
		that.itemid = '';
		that.payVisible = false;
		that.clickbtn = false;
	},
	onShow() {
		var that = this;
		that.camearShow = true;
		if (!that.isonshow) {
			that.isScan = true;
		}
		store.dispatch('wallet');
		that.getPayPageData();
	},
	methods: {
		pay() {
			this.payVisible = true;
		},
		// 获取商户详情
		async getPayPageData() {
			var that = this;
			const { data } = await getPayPageData({
				merchantId: that.merchantId,
				barCodeDealFlag: 'noDeal',
				istrue: true
			});
			if (data.code == 1) {
				that.goodsList = data.obj.goods;
				that.merchantObj = data.obj.merchant;
				that.showStatus = data.obj.showStatus;
				if (that.showStatus == 2 || that.showStatus == 3) {
					// 商户已开通联名VIP功能，但用户未开通会员或会员过期
					that.openPlus = true;
				} else if (that.showStatus == 4) {
					// 商户及用户均开通会员
					that.plus = true;
					that.jointlyVip = data.obj.merchant.jointlyVip;
					that.plusTime = data.obj.plus;
				}
			} else {
			}
		},
		// 扫一扫
		scan(e) {
			var that = this;
			if (that.payVisible) {
				return;
			}
			if (!that.isScan) {
				return;
			}
			that.isScan = false;
			// wx.showToast({
			//   title:'请稍等...',
			//   icon:'loading',
			//   duration:800,
			// })
			setTimeout(() => {
				let bgm = wx.createInnerAudioContext();
				bgm.autoplay = true;
				bgm.loop = false;
				bgm.src = that.staticImg + 'static/sound/1374.mp3';
				// if(e.mp.detail.result.length==13 || e.mp.detail.result.length == 8){
				var index = that.goodsCode.indexOf(e.mp.detail.result);
				if (index >= 0) {
					that.goodsArr.map((value, i) => {
						if (value.barCode == e.mp.detail.result) {
							if (value.num >= value.number) {
								wx.showToast({
									title: '已到库存容量',
									icon: 'none'
								});
							} else {
								value.num += 1;
							}
						}
					});
					that.goodsArr.push({});
					that.goodsArr.pop();
				} else {
					if (that.goodsList[e.mp.detail.result]) {
						that.footerVisible = true;
						that.goodsCode.push(e.mp.detail.result);
						that.goodsObj = that.goodsList[e.mp.detail.result];
						that.itemid = that.goodsList[e.mp.detail.result].goodsId;
						that.goodsObj.num = 1;
						that.goodsObj.barCode = e.mp.detail.result;
						that.goodsArr.push(that.goodsList[e.mp.detail.result]);
					} else {
						wx.showToast({
							title: '管理员未录入此商品',
							icon: 'none'
						});
					}
				}
				// } else {
				//   wx.showToast({
				//     title:'条码错误',
				//     icon:'none'
				//   });
				// };
				setTimeout(() => {
					that.isScan = true;
				}, 2000);
			}, 400);
		},
		// 点击加号
		addNum(code) {
			var that = this;
			that.itemid = '';
			that.goodsArr.map((value, i) => {
				if (value.barCode == code) {
					if (value.num >= value.number) {
						wx.showToast({
							title: '已到库存容量',
							icon: 'none'
						});
					} else {
						value.num += 1;
					}
				}
			});
			that.goodsArr.push({});
			that.goodsArr.pop();
		},
		// 点加减号
		releaseNum(code) {
			var that = this;
			that.itemid = '';
			that.goodsArr.map((value, i) => {
				if (value.barCode == code) {
					if (value.num == 1) {
						that.goodsArr.splice(i, 1);
						that.goodsCode.splice(that.goodsCode.indexOf(code), 1);
					} else {
						value.num -= 1;
					}
				}
			});
			that.goodsArr.push({});
			that.goodsArr.pop();
			if (that.goodsArr.length == 0) {
				that.footerVisible = false;
			}
		},
		//立即开通PLUS会员
		purchase() {
			var that = this;
			that.isonshow = true;
			wx.navigateTo({
				// url: `/pages/personal/member/purchase/index`
				url: `/personal/member/purchase/index`
			});
		},
		// 取消支付
		cancelP() {
			this.payVisible = false;
		},
		// 确认支付订单
		async enterPay(payType) {
			var that = this;
			if (that.clickbtn) {
				return;
			}
			that.clickbtn = true;
			that.isonshow = true;
			var goodsarr = [];
			for (var i = 0; i < that.goodsArr.length; i++) {
				goodsarr.push({
					goodsId: that.goodsArr[i].goodsId,
					buyNum: that.goodsArr[i].num
				});
			}
			var goods = { goods: goodsarr };
			const { data } = await buyGoodsPay({
				merchantId: that.merchantId,
				totalMoney: that.originalPrice,
				actualPayMoney: that.presentPrice,
				goods: JSON.stringify(goods),
				payType: payType
			});
			if (data.code == '1') {
				// 余额支付
				if (payType == 'BALANCE') {
					wx.showToast({
						image: that.staticImg + 'static/img/success3x.png',
						title: '支付成功',
						icon: 'none'
					});
					setTimeout(() => {
						this.payVisible = false;
						that.clickbtn = false;
						that.isonshow = false;
						wx.navigateTo({
							// url:`/pages/index/confirm/scanpay/success/index?num=${that.presentPrice}&merchant=${that.merchantObj.merchant}`
							url: `/pages/confirm/scanpay/success/index?num=${that.presentPrice}&merchant=${that.merchantObj.merchant}`
						});
					}, 1000);
				} else {
					// 微信支付
					let { appId, ...query } = data.obj;
					var num = that.presentPrice;
					wx.requestPayment({
						...query,
						orderInfo: query.data,
						success: res => {
							// #ifdef MP-ALIPAY
							if (res.resultCode != 9000) {
								wx.showToast({
									title: '支付失败！',
									icon: 'none'
								});
								that.payVisible = false;
								that.clickbtn = false;
								that.isonshow = false;
								return;
							}
							// #endif
							wx.showToast({
								image: that.staticImg + 'static/img/success3x.png',
								title: '支付成功',
								mask: true,
								icon: 'none'
							});
							setTimeout(() => {
								that.payVisible = false;
								that.clickbtn = false;
								that.isonshow = false;
								wx.navigateTo({
									// url:`/pages/index/confirm/scanpay/success/index?num=${num}&merchant=${that.merchantObj.merchant}`
									url: `/pages/confirm/scanpay/success/index?num=${num}&merchant=${that.merchantObj.merchant}`
								});
							}, 1000);
						},
						fail: res => {
							// that.payVisible = false;
							// 微信支付失败时调用接口通知后台支付失败
							cancelPay({
								payCode: data.obj.payCode,
								istrue: true
							});
							setTimeout(() => {
								wx.showToast({
									title: '支付失败',
									mask: true,
									icon: 'none'
								});
								that.payVisible = false;
								that.clickbtn = false;
								that.isonshow = false;
							}, 1000);
						}
					});
				}
			} else {
				// 支付失败
				wx.showToast({
					title: data.msg,
					mask: true,
					icon: 'none'
				});
				that.clickbtn = false;
				that.isonshow = false;
				that.payVisible = false;
			}
		},
		error() {
			var that = this;
			wx.getSetting({
				success(res) {
					if (!res.authSetting['scope.camera']) {
						wx.showModal({
							content: '扫码页面需要授权使用摄像头',
							confirmText: '授权',
							success(res) {
								if (res.confirm) {
									// console.log('用户点击确定')
									that.camearShow = false;
									wx.openSetting();
								} else if (res.cancel) {
									// console.log('用户点击取消')
									wx.reLaunch({
										url: '/pages/index/index'
									});
								}
							}
						});
					}
				}
			});
		}
	},
	computed: {
		staticImg() { return store.state.staticImg } ,
		// 钱包
		wallet() {
			store.state.wallet.amount = parseFloat(store.state.wallet.amount).toFixed(2);
			return store.state.wallet;
		},
		// 原价
		originalPrice() {
			var that = this,
				num = 0;
			that.goodsArr.map(item => {
				num += item.price * item.num;
			});
			return (num * 1).toFixed(2);
		},
		// 现价
		presentPrice() {
			var that = this;
			if (that.showStatus == 4) {
				var goodstotalMoney = (that.originalPrice * (that.jointlyVip.discountNum / 100)).toFixed(4); //实付金额
				var len = goodstotalMoney.toString().split('.'); //是否是小数
				if (len.length < 2) {
					//整数
					goodstotalMoney = len[0] + '.00';
				} else {
					var num = len[1].length; //小数位数
					if (num < 2) {
						//一位小数
						goodstotalMoney = goodstotalMoney + '0';
					} else if (num == 2) {
						//两位小数
						goodstotalMoney = goodstotalMoney;
					} else {
						//多位小数
						goodstotalMoney = len[0] + '.' + len[1].substring(0, 2);
					}
				}
				return goodstotalMoney;
				// return (that.originalPrice*(that.jointlyVip.discountNum/100)).toFixed(2)
			} else {
				return that.originalPrice;
			}
		},
		// 折扣
		discountNum() {
			var str = `${this.jointlyVip.discountNum}`;
			return str.lastIndexOf('0') == 1 ? `${str.substring(0, str.length - 1)}折` : `${str.substring(0, 1)}.${str.substring(1, str.length)}折`;
		}
	}
};
</script>

<style lang="stylus">
.camera_box, .camera
	width 100vw
	height 40vh
	margin 0 auto
.carCode_box
	width 80vw
	height 25vh
	margin 8vh auto 0
.scroll
	height 30vh
.goodlist
	z-index 2
	position absolute
	bottom 0
	height 52vh
	background #fff
	width 90vw
	left 5vw
	border-radius 20rpx 20rpx 0 0
.words
	width 60vw
	height 50rpx
	line-height 50rpx
	background #333
	color #ffffff
	text-align center
	border-radius 25rpx
	margin 20rpx auto 0
.list_item
	width 100%
	height 100rpx
.list_item::after
	display block
	content ''
	clear both
.name_box
	line-height 50rpx
	width 60%
.itemName
	width 80%
	overflow hidden
	white-space nowrap
	text-overflow ellipsis
.num_box
	line-height 100rpx
.num_img
	position relative
	top 5rpx
	width 40rpx
	height 40rpx
.num
	display inline-block
	width 50rpx
.footer
	width 90%
	position fixed
	bottom 30rpx
	white-space nowrap
.plus_info
	width 85%
	margin 0 auto
	color #999
.openPlus
	color #00A2E8
.button
	width 85%
	margin 30rpx auto 0
	background #000000
	color #fff
	border-radius 10rpx
.pfb
	position absolute
	left 0
	right 0
	bottom 0
	background #fff
.h120
	height 120rpx
	line-height 120rpx
</style>
