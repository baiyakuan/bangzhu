<template>
	<view></view>
</template>

<script>
import { mapQuery } from '@/utils/miniLodash';
export default {
	data() {
		return {
			orderInfo: {},
			failPath: '',
			successPath: ''
		};
	},
	onLoad(option) {
		console.log(option);
		for (let key in option) {
			option[key] = decodeURIComponent(option[key]);
		}
		this.failPath = option.failPath;
		delete option.failPath;
		this.successPath = option.successPath;
		delete option.successPath;
		this.orderInfo = option;
		this.pay();
	},
	methods: {
		pay() {
			let { appId, ...query } = this.orderInfo;
			uni.requestPayment({
				...query,
				orderInfo: query.alipayStr,
				success: res => {
					uni.showToast({
						title: '支付成功',
						icon: 'none'
					});
					if (this.successPath) {
						uni.redirectTo({
							url: '/pages/web_view/index?url=' + encodeURIComponent(this.successPath)
						});
					} else if (this.orderInfo.isAgain == 1) {
						uni.$emit('update', 0);
						uni.navigateBack();
					} else {
						let tabName = this.orderInfo.tabType == 6 ? '车辆检测' : this.orderInfo.tabType == 7 ? '洗车' : this.orderInfo.tabType == 8 ? '车辆保养' : '';
						uni.redirectTo({
							url: '/personal/order/index?tabName=' + tabName
						});
					}
				},
				fail: res => {
					uni.showToast({
						title: '支付失败',
						icon: 'none'
					});

					setTimeout(() => {
						uni.redirectTo({
							url: '/pages/web_view/index?url=' + encodeURIComponent(this.failPath)
						});
					}, 1000);
				}
			});
		}
	}
};
</script>

<style></style>
