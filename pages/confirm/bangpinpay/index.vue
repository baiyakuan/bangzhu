<template>
	<div>
		<div class="pd40-x pdb160">
			<!-- 顶部信息 -->
			<div class=" payTop pdt60 mgb40 fs">
				<div class="logo"><image :src="staticImg + 'static/img/bplogo.png'" class="logo_img" /></div>
				<div class="location fcx">
					<div class="icon mgr10"><image :src="staticImg + 'static/img/pblocation.png'" class="icon_img" /></div>
					<div class="name ftweight">{{ merchantInfo.merchant }}</div>
					<!-- (数字大厦) -->
				</div>
			</div>
			<!-- 中间内容 -->
			<div class="bgw paycontent pd40">
				<div class="ft30 mgb40 fst">
					<image :src="staticImg + 'static/img/bpcart.png'" class="carticon" />
					<div class="mgl20 ftweight">当前商品</div>
				</div>
				<!-- 商品列表 -->
				<div class="goodlist pd20-y" v-if="goodsList.length">
					<ul>
						<li class="pd20-y fs" v-for="(item, index) in goodsList" :key="index">
							<div class="good_info fs">
								<div class="good_name rgb74">{{ item.goodsName }}</div>
								<div class="good_num rgb179">*{{ item.num }}</div>
							</div>
							<div class="good_price rgb74">
								<span class="ft20">￥</span>
								<span class="ft26">{{ item.goodsPrice }}</span>
							</div>
						</li>
					</ul>
				</div>
				<!-- 购物袋 会员折扣 -->
				<div class="pd20-y check">
					<ul>
						<li class="fs pd20-y">
							<div class="fcx">
								<image :src="staticImg + 'static/img/bpplus.png'" style="width:80rpx;height:30rpx" />
								<div class="mgl20">会员折扣</div>
							</div>
							<div style="color:rgba(86,201,204)" class="ftweight">
								<span>-</span>
								<span class="ft20">￥</span>
								<span class="ft26">{{ discountMoney }}</span>
							</div>
						</li>
					</ul>
				</div>
				<!-- 合计 -->
				<div class="pdt40 fs">
					<div>合计:</div>
					<div class="ftweight">
						<span class="ft20">￥</span>
						<span class="ft30">{{ totalPrice }}</span>
					</div>
				</div>
			</div>
			<!-- 底部付款 -->
			<div class="paybottom pd40 fs bgw">
				<div class="mgr20 rgb27 fcx">
					<div class="ftweight ft50 mgr20">{{ totalPrice }}</div>
					元
				</div>
				<div class="paybtn ft28" @click="pay">确认支付</div>
			</div>
			<Pay :visible="payVisible" :amount="wallet.amount" :payamount="totalPrice" @cancel="cancelPay" @enterPay="enterPay"></Pay>
		</div>
	</div>
</template>
<script>
import store from '@/store';
import { getPayDataByPayCode, bzpayBill } from '@/api';
import Pay from '@/components/Pay/Pay.vue';
export default {
	data() {
		return {
			payCode: '', //支付编号
			goodsList: [], //商品列表
			payinfo: {}, //支付信息
			merchantInfo: {}, //商户信息
			vipInfo: {}, //vip信息
			goodstotalMoney: 0, //没有折扣总付款金额
			discountNum: 100,
			payVisible: false, // 选择支付方式弹窗可见性
			clickbtn: false // 支付按钮是否可点击
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
	onLoad() {
		var that = this;
		let { payCode } = that.$root.$mp.query;
		that.payCode = payCode;
		that.itemid = '';
		that.payVisible = false;
		that.clickbtn = false;
	},
	onShow() {
		var that = this;
		store.dispatch('wallet');
		that.getPayDataByPayCode();
	},
	methods: {
		// 获取商户详情
		async getPayDataByPayCode() {
			var that = this;
			const { data } = await getPayDataByPayCode({
				payCode: that.payCode
			});
			if (data.code == 1) {
				that.goodsList = data.obj.billGoods;
				that.payinfo = data.obj.payBill;
				that.goodstotalMoney = data.obj.payBill.totalMoney;
				that.merchantInfo = data.obj.merchant;
				that.vipInfo = data.obj.merchant.jointlyVip;
				that.discountNum = data.obj.merchant.jointlyVip.discountNum;
			} else {
				wx.showToast({
					title: data.msg,
					icon: 'none'
				});
				setTimeout(function() {
					wx.reLaunch({
						url: '/pages/index/index'
					});
				}, 2000);
			}
		},
		// 点击支付
		pay() {
			var that = this;
			if (that.clickbtn) {
				return;
			}
			that.itemid = '';
			that.payVisible = true;
		},
		// 确认支付订单
		async enterPay(payType) {
			var that = this;
			if (that.clickbtn) {
				return;
			}
			that.clickbtn = true;
			const { data } = await bzpayBill({
				payCode: that.payCode,
				totalMoney: that.goodstotalMoney,
				actualPayMoney: that.totalPrice,
				payType: payType
			});
			if (data.code == '1') {
				//支付成功
				if (payType == 'BALANCE') {
					// 余额支付
					wx.showToast({
						image: that.staticImg + 'static/img/success3x.png',
						title: '支付成功',
						icon: 'none'
					});
					setTimeout(() => {
						that.payVisible = false;
						that.clickbtn = false;
						wx.navigateTo({
							url: `/pages/confirm/scanpay/success/index?num=${that.totalPrice}&merchant=${that.merchantInfo.merchant}`
						});
					}, 1000);
				} else {
					// 微信支付
					let { appId, ...query } = data.obj;
					var num = that.totalPrice;
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
								wx.navigateTo({
									url: `/pages/confirm/scanpay/success/index?num=${num}&merchant=${that.merchantInfo.merchant}`
								});
							}, 1000);
						},
						fail: res => {
							wx.showToast({
								title: '支付失败',
								mask: true,
								icon: 'none'
							});
							that.payVisible = false;
							that.clickbtn = false;
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
				that.payVisible = false;
			}
		},
		// 取消支付
		cancelPay() {
			this.payVisible = false;
		}
	},
	computed: {
		// 钱包
		wallet() {
			store.state.wallet.amount = parseFloat(store.state.wallet.amount).toFixed(2);
			return store.state.wallet;
		},
		//单个商品价格
		goodsPrice() {
			var that = this;
			that.goodsList.forEach(item => {
				item.goodsPrice = (item.price * item.num).toFixed(2);
			});
		},
		//总折扣
		discountMoney() {
			var that = this;
			var price = (that.goodstotalMoney - that.totalPrice).toFixed(2);
			// console.log("折扣"+price)
			return price;
		},
		//实际总付款金额
		totalPrice() {
			var that = this;
			// console.log("原价" + that.goodstotalMoney) //原价
			var goodstotalMoney = ((that.discountNum / 100) * that.goodstotalMoney).toFixed(4); //实付金额
			// console.log("实付金额前"+goodstotalMoney)
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
			// console.log("实付金额后"+goodstotalMoney)
			return goodstotalMoney;
		},
		staticImg() { return store.state.staticImg },
	}
};
</script>
<style lang="stylus">
.logo_img
	width 100rpx
	height 100rpx
.icon_img
	width 24rpx
	height 24rpx
.paycontent
	border-radius 10rpx
.carticon
	width 30rpx
	height 30rpx
.goodlist
	border-top 1rpx solid rgb(239, 244, 248)
	border-bottom 1rpx solid rgb(239, 244, 248)
.good_info
	width 75%
.good_name
	width 80%
.good_num
	width 20%
	text-align right
.good_price
	width 25%
	text-align right
.paybottom
	position fixed
	bottom 0
	left 0
	width 100%
	height 160rpx
	box-sizing border-box
.paybtn
	width 180rpx
	height 80rpx
	line-height 80rpx
	text-align center
	border-radius 10rpx
	color #ffffff
	background rgb(243, 53, 53)
.check
	border-bottom 1rpx solid rgb(239, 244, 248)
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
