<template>
	<u-popup v-model="show" mode="bottom" border-radius="40" @close="close">
		<view class="popup">
			<view class="popup_title">{{ title }}</view>
			<view class="popup_list">
				<view v-for="(item, index) in rechargeList" :key="index" @click="selectItem(item)" :class="{ active: optionId == item.optionId }" class="popup_item">
					{{ item.realInvestMoney }}元
					<view v-if="item.realInvestMoney != item.optionNumber" class="popup_item_tip">赠{{ item.optionNumber - item.realInvestMoney }}元</view>
				</view>
			</view>
			<view class="paytype">
				<image :src="staticImg + 'static/img/pay_wechat.png'" style="width: 50rpx;height: 50rpx;"></image>
				<view class="name">微信支付</view>
				<image v-if="false" :src="staticImg + 'static/img/unChecked.png'" class="check"></image>
				<image v-else :src="staticImg + 'static/img/checked.png'" class="check"></image>
			</view>
			<view class="btn_pay" @click="debounceRecharge">确认支付</view>
		</view>
	</u-popup>
</template>

<script>
import { recharge, getOptionsListqd, recordRechargeEntry } from '@/api';
import { debounce } from '@/utils/miniLodash'

export default {
	data() {
		return {
			title: '立即充值',
			show: false,
			rechargeList: [],
			money: '',
			optionId: '',
			payMoney: 0,
			saveMoney: 0,
			brandNumber: '' // 需要开通无感支付的车牌号
		};
	},
	computed:{
		staticImg() { return this.$store.state.staticImg },
	},

	mounted() {
		this.debounceRecharge = debounce(this.surePay, 500)
	},
	methods: {
		open(brandNumber) {
			this.show = true;
			this.brandNumber = brandNumber;
			if (this.brandNumber) {
				this.title = '充值体验无感支付';
			} else {
				this.title = '立即充值';
			}
			this.getOptionsListqd();
		},
		close() {
			this.$emit('close');
		},
		selectItem(item) {
			this.money = '';
			this.optionId = item.optionId;
			this.payMoney = parseInt(item.realInvestMoney);
			this.saveMoney = parseInt(item.optionNumber - item.realInvestMoney);
		},
		// 获取充值列表
		async getOptionsListqd() {
			const { data } = await getOptionsListqd({
				type: 'miniprogram',
				apposition: this.brandNumber ? 2 : 3,
				istrue: true
			});
			if (data.code == 1 && data.obj) {
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
		async surePay() {
			const that = this;
			if (!this.optionId) {
				uni.showToast({
					title: '请选择充值金额',
					icon: 'none'
				});
				return;
			}
			const params = {
				money: this.money,
				optionsId: this.optionId,
				istrue: true
			};

			// #ifdef MP-WEIXIN
			params.payType = 'JSAPI';
			// #endif

			// #ifdef MP-ALIPAY
			params.payType = 'AL_MY';
			// #endif

			if (this.brandNumber) {
				params.carNumber = this.brandNumber;
			}
			const { data } = await recharge(params);
			if (data.code == 1) {
				let { appId, ...query } = data.obj;
				uni.requestPayment({
					...query,
					orderInfo: query.alipayStr,
					success: res => {
						uni.showToast({
							title: this.brandNumber ? '开通并充值成功！' : '充值成功！',
							icon: 'success'
						});
						setTimeout(() => {
							that.show = false;
							// this.$store.dispatch('wallet');
							// this.$store.dispatch('getHomeOrderList', { istrue: true });
							uni.navigateTo({
								url: '/personal/wallet/index'
							});
						}, 1000);
					},
					fail: res => {
						console.log('err', res);
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
		}
	}
};
</script>

<style scoped lang="scss">
.popup {
	background-color: #fff;
	padding: 40rpx;
	box-sizing: border-box;
}
.popup_title {
	font-size: 30rpx;
	color: #1b1921;
	font-weight: bold;
	font-family: PingFang SC;
}
.popup_list {
	display: flex;
	flex-wrap: wrap;
}
.popup_item {
	width: 200rpx;
	height: 80rpx;
	line-height: 80rpx;
	position: relative;
	border-radius: 20rpx;
	background-color: #f6f8fb;
	text-align: center;
	margin-top: 40rpx;
	margin-right: 35rpx;
	box-sizing: border-box;
	border: 2rpx solid #f6f8fb;
	font-size: 28rpx;
	color: #4a5362;
	font-weight: bold;
	font-family: PingFang SC;
}
.active {
	border-color: #f33535;
	color: #f33535;
}
.popup_item:nth-child(3n) {
	margin-right: 0;
}
.popup_item_tip {
	width: 80rpx;
	height: 20rpx;
	line-height: 20rpx;
	position: absolute;
	top: 0;
	right: 0;
	background-color: #f33535;
	color: #fff;
	border-radius: 0 20rpx 0 20rpx;
	font-size: 12rpx;
	text-align: center;
	font-family: PingFang SC;
}
.paytype {
	display: flex;
	align-items: center;
	margin-top: 80rpx;
	.name {
		font-size: 30rpx;
		color: #1b1912;
		margin-left: 30rpx;
		font-family: PingFang SC;
	}
	.check {
		width: 30rpx;
		height: 30rpx;
		margin-left: auto;
	}
}
.btn_pay {
	background-color: #f33535;
	margin-top: 80rpx;
	height: 100rpx;
	line-height: 100rpx;
	border-radius: 20rpx;
	font-family: PingFang SC;
	color: #fefefe;
	font-size: 30rpx;
	font-weight: bold;
	text-align: center;
}
</style>
