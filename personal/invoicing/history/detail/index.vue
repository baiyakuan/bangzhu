<template>
	<view>
		<view class="pd40-x pd50-y bgw">
		  <view class="ft50 ftweight rgb51">发票详情</view>
		</view> 
		<view>
			<view class="pd40-x pd30-y fst bgw mgt16 border">
				<view class="rgb27 ft28 ftweight mgr40">发票抬头</view>
				<view class="rgb74 ft26">济宁市众帮来袭信息科技有限公司</view>
			</view>
			<view class="pd40-x pd30-y fst bgw">
				<view class="rgb27 ft28 ftweight mgr40">税号</view>
				<view class="rgb74 ft26">HJKL258AS14DF7G369</view>
			</view>
			<view class="pd40-x pd30-y fst bgw mgt16 border">
				<view class="rgb27 ft28 ftweight mgr40">接收邮箱</view>
				<view class="rgb74 ft26">666@zhongbanglaixi.cn</view>
			</view>
			<view class="pd40-x pd30-y fst bgw border">
				<view class="rgb27 ft28 ftweight mgr40">申请时间</view>
				<view class="rgb74 ft26">2020/05/15 13:20</view>
			</view>
			<view class="pd40-x pd30-y fst bgw">
				<view class="rgb27 ft28 ftweight mgr40">发票金额</view>
				<view class="rgb74 ft26">￥156.50</view>
			</view>
			<view class="pd40-x pd30-y fs bgw mgt16 border" @click="goOrder">
				<view class="rgb27 ft28 ftweight">查看包含订单</view>
				<view class="arrow">
					<image :src="staticImg + 'static/img/icon_exchange_more.png'"></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		computed:{
			staticImg() { return this.$store.state.staticImg } ,
		},
		methods: {
			goOrder(){
				uni.navigateTo({
					url:"/personal/invoicing/history/detail/orderList/index"
				})
			}
		}
	}
</script>

<style lang="stylus">
.border
	border-bottom 2rpx solid #F6F8FB
image
	width 100%
	height 100%
	display block
.arrow
	width 10rpx
	height 20rpx
.mgr40
	width 115rpx
</style>
