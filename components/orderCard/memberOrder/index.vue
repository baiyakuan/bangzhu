<template>
<view>
	<view class="pr" v-for="(order,index) in rentListData" :key="index">
		<img v-if="showType.isInvoice"
		:src="order.checked ? staticImg + '/static/img/check.png' : staticImg + '/static/img/X_select_0.png'" 
		class="check" style="width:30rpx;height:30rpx;" >
		<view class="card mgt50 bgw pd20-y mg40-x" 
		 :class="{'move' : showType.isInvoice}"
		@click="nav2orderDetail(index)">
			<view class="pd40-x">
				<view class="fs" >
					<view style="width:80%;">
						<view class="ftweight ft32 rgb27  ellipsis">PLUS半年会员</view>
						<view class="ft20 rgb74 memberTime pdl30 mgt20">2020.04.01   11:01:25</view>
					</view>
					<view class="ftweight ft32 rgb27">
						￥50.00
					</view>
				</view>
			</view>
		</view>
	</view>
</view>
</template>

<script>
	export default {
		props:{
			showType:{
				type: Object
			},
			rentListData : {
				type: Array
			}
		},
		computed:{
			staticImg() { return this.$store.state.staticImg },
		},

	}
</script>

<style>
</style>
