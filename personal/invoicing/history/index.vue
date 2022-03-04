<template>
	<view>
		<view class="pd40-x pd50-y bgw">
		  <view class="ft50 ftweight rgb51">开票历史</view>
		</view>
		<view class="pd40">
			<view class="list pd40-x pd30-y bgw fs mgb40" @click="goDetail">
				<view class="fst">
					<view class="icon">
						<image :src="staticImg + 'static/img/history_rent.png'"></image>
					</view>
				    <view>
						<view class="mgb24 fst">
							<view class="rgb27 mgr40 ft26 ftweight">租赁服务</view>
							<view class="rgb74 ft24">2020/05/15 13:20</view>
						</view>
						<view class="fst">
							<view class="rgb27 mgr40 ft26 ftweight">电子发票</view>
							<view class="rgb74 ft24">￥153.50</view>
						</view>
					</view>
				</view>
				<view class="arrow">
					<image :src="staticImg + 'static/img/icon_exchange_more.png'"></image>
				</view>
			</view>
			<view class="list pd40-x pd30-y bgw fs mgb40" @click="goDetail">
				<view class="fst">
					<view class="icon">
						<image :src="staticImg + 'static/img/history_vip.png'"></image>
					</view>
				    <view>
						<view class="mgb24 fst">
							<view class="rgb27 mgr40 ft26 ftweight">会员服务</view>
							<view class="rgb74 ft24">2020/05/15 13:20</view>
						</view>
						<view class="fst">
							<view class="rgb27 mgr40 ft26 ftweight">电子发票</view>
							<view class="rgb74 ft24">￥153.50</view>
						</view>
					</view>
				</view>
				<view class="arrow">
					<image :src="staticImg + 'static/img/icon_exchange_more.png'"></image>
				</view>
			</view>
			<view class="list pd40-x pd30-y bgw fs mgb40" @click="goDetail">
				<view class="fst">
					<view class="icon">
						<image :src="staticImg + 'static/img/history_park.png'"></image>
					</view>
				    <view>
						<view class="mgb24 fst">
							<view class="rgb27 mgr40 ft26 ftweight">停车订单</view>
							<view class="rgb74 ft24">2020/05/15 13:20</view>
						</view>
						<view class="fst">
							<view class="rgb27 mgr40 ft26 ftweight">电子发票</view>
							<view class="rgb74 ft24">￥153.50</view>
						</view>
					</view>
				</view>
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
			goDetail(){
				uni.navigateTo({
					url:'/personal/invoicing/history/detail/index'
				})
			}
		}
	}
</script>

<style lang="stylus">
image
	width 100%
	height 100%
	display block
.list
	border-radius 40rpx
.icon
	width 40rpx
	height 40rpx
	margin-right 40rpx
.arrow
	width 10rpx
	height 20rpx
</style>
