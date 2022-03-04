<template>
	<div class="page">
		<div class="title pd40-x pd50-y  ft50 ftweight rgb51 mgb20 bgw">充值中心</div>
		<div class="body">
			<div class="select pdt30 pdb40 bgw pd40-x mgb40">
				<div class="ft30 ftweight rgb51">选择充值金额</div>
				<div class="listBox">
					<div class="list mgt40 fcy rgb51" v-for="(item, index) in rechargeList" :key="index" :class="optionId == item.optionId ? 'active' : ''" @click="onClick(item)">
						<div class="ftweight ft28 listMoney">{{ item.realInvestMoney }}元</div>
						<div class="gift" v-if="item.optionNumber != item.realInvestMoney">赠{{ item.optionNumber - item.realInvestMoney }}元</div>
					</div>
				</div>
			</div>
			<div class="pdt30 pdb40 bgw pd40-x">
				<div class="ft30 ftweight rgb51 mgb40">自定义充值金额</div>
				<div class="diyMoney pd40-x">
					<text class="rgb51 ft36 ftweight">￥</text>
					<input
						@focus="focus"
						@blur="blur"
						class="mgl10 rgb51 ft36 ftweight"
						style="display:inline-block;"
						placeholder-class="rgb187 ft28"
						maxlength="4"
						type="number"
						v-model="money"
						placeholder="请输入金额"
					/>
				</div>
			</div>
			<div class="bgw pd40 footer" v-if="rechargeVisible"><div class="btn ft26 ftweight" @click="debounceRecharge">充值</div></div>
		</div>
	</div>
</template>

<script>
import Dbutton from '@/components/Button';
import { debounce } from '@/utils/miniLodash'
import { recharge, getOptionsListqd, recordRechargeEntry } from '@/api';
import store from '@/store';
export default {
	components: {
		Dbutton
	},
	data() {
		return {
			rechargeList: [], // 充值列表
			optionId: '', // 充值项ID
			money: '', // 自定义充值金额
			saveMoney: 0, //
			payMoney: 0,
			options: {},
			rechargeVisible: true
		};
	},
	onLoad(options) {
		this.options = options;
		console.log(options)
		this.recordRechargeEntry();
		this.optionsListqd();
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
	mounted() {
		this.debounceRecharge = debounce(this.onRecharge, 1500, true)
	},
	methods: {
		async recordRechargeEntry() {
			const entryType = this.options.entryType;

			// #ifdef MP-WEIXIN
			const appType = 1;
			// #endif

			// #ifdef MP-ALIPAY
			const appType = 2;
			// #endif

			const { data } = await recordRechargeEntry({ entryType, appType });
		},
		// 充值
		async onRecharge() {
			let res;
			if (this.money > 9999 && !this.optionId) {
				wx.showToast({
					title: '最大充值金额为9999元',
					icon: 'none'
				});
				return;
			} else if (this.money <= 0 && !this.optionId) {
				wx.showToast({
					title: '充值金额必须大于0',
					icon: 'none'
				});
				return;
			}
			if (this.optionId) {
				// #ifdef MP-WEIXIN
				res = await recharge({
					money: this.money,
					optionsId: this.optionId,
					payType: 'JSAPI',
					requestType: 'miniprogram'
				});
				// #endif
				// #ifdef MP-ALIPAY
				res = await recharge({
					money: this.money,
					optionsId: this.optionId,
					payType: 'AL_MY'
				});
				// #endif
			} else {
				// #ifdef MP-WEIXIN
				res = await recharge({
					money: this.money,
					payType: 'JSAPI',
					requestType: 'miniprogram'
				});
				// #endif
				// #ifdef MP-ALIPAY
				res = await recharge({
					money: this.money,
					payType: 'AL_MY'
				});
				// #endif
			}
			if (res.data.code === '1') {
				let { appId, ...query } = res.data.obj;
				uni.requestPayment({
					...query,
					orderInfo: query.alipayStr,
					success: res => {
						// #ifdef MP-ALIPAY
						if (res.resultCode != 9000) {
							uni.showToast({
								title: '充值失败！',
								icon: 'none'
							});
							return;
						}
						// #endif
						uni.showToast({
							title: '充值成功！',
							icon: 'none'
						});
						setTimeout(() => {
							// uni.redirectTo({
							// 	url: '/personal/wallet/index'
							// });
							if (this.options.entryType == 2) {
								uni.navigateTo({
									url: '/pages/index/index'
								});
							} else {
								uni.navigateBack({
									delta: 1
								});
							}
						}, 1200);
					},
					fail: res => {
						uni.showToast({
							title: '充值失败！',
							icon: 'none'
						});
					}
				});
			} else {
				uni.showToast({
					title: '支付失败！',
					icon: 'none'
				});
			}
		},
		// 获取充值列表
		async optionsListqd() {
			const { data } = await getOptionsListqd({
				type: 'miniprogram',
				apposition: 1,
				istrue: true
			});
			if (data.code === '1') {
				data.obj.list.sort();
				var optionsList = data.obj.list.map(item => {
					item.realMoney = parseInt(item.optionNumber - item.realInvestMoney);
					return item;
				});
				this.rechargeList = optionsList;
				this.optionId = this.rechargeList[0].optionId;
				this.payMoney = parseInt(this.rechargeList[0].realInvestMoney);
				this.saveMoney = parseInt(this.rechargeList[0].realMoney);
			}
		},
		// 充值项点击
		onClick(item) {
			this.money = '';
			this.optionId = item.optionId;
			this.payMoney = parseInt(item.realInvestMoney);
			this.saveMoney = parseInt(item.optionNumber - item.realInvestMoney);
		},
		// input聚焦
		focus() {
			this.optionId = 0;
			this.rechargeVisible = false;
		},
		blur() {
			this.rechargeVisible = true;
		}
	}
};
</script>

<style scoped lang="stylus">
.page
	height 100%
.listBox:after
	display block
	content ''
	clear both
.listBox
	display flex
	flex-wrap wrap
	.list:nth-child(3n)
		margin-right 0rpx
.list
	width 200rpx
	height 100rpx
	background #F6F8FB
	border-radius 20rpx
	margin-right 34rpx
	position relative
.active
	box-sizing border-box
	background #FFFFFF
	color #f33535
	border 1rpx solid #F33535
.gift
	position absolute
	top 0
	right 0
	width 76rpx
	height 26rpx
	background #F33535
	border-radius 0rpx 20rpx 0rpx 20rpx
	font-size 14rpx
	color #FFFFFF
	text-align center
	line-height 26rpx
.footer
	position fixed
	bottom 0
	width 100%
	box-sizing border-box
.btn
	height 80rpx
	line-height 80rpx
	background #f33535
	border-radius 20rpx
	color #FFFFFF
	text-align center
.listMoney
	color #4A5362
.diyMoney
	height 100rpx
	background #F6F8FB
	border-radius 20rpx
	display flex
	align-items center
	justify-content flex-start
	input
		background #F6F8FB
</style>
