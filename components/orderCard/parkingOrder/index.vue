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
				<view class="fs mgb20" >
					<view style="width:80%;">
						<view class="ftweight ft32 rgb27  ellipsis">创意大厦停车场</view>
					</view>
					<view class="fcx">
						<view class="ft24 ftweight rgba74 mgr6">查看</view>
						<uni-icons type="arrowright" size="30" class="mgt4 arrowRight rgba74" color="#4A5361"></uni-icons>
					</view>
				</view>
				<view class="fs" style="align-items: flex-end;">
				    <view style="width:80%;">
						<view class="fst pdl30 address" >
							<view class="ellipsis ft20 rgb74">山东省济宁市高新区海川路69号创意大厦</view>
						</view>
						<view class="ft20 rgb74  arrowIn pdl30 mgt12">2020.04.01   11:01:25</view>
						<view class="ft20 rgb74 arrowOut pdl30 mgt12">2020.04.01   11:01:25</view>
					</view>
					<view class="ftweight ft32 rgb27">
						￥2.00
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
