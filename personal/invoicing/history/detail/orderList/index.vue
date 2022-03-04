<!-- 商品列表组件 <pd-list :list="xx"></pd-list> -->
<template>
	<view class="pdt50">
		<!-- 停车订单 -->
		<view class="card mgb50 bgw pd20-y mg40-x" v-for="(order,index) in list" :key="index" @click="nav2orderDetail(index)">
		  <view class="pd40-x">
			<view class="fs mgb20" >
				<view style="width:80%;">
					<view class="ftweight ft32 rgb27  ellipsis">{{order.parkingName}}</view>
				</view>
				<view class="fcx">
					<view class="ft24 ftweight rgba74 mgr6">查看</view>
					<uni-icons type="arrowright" size="30" class="mgt4 arrowRight rgba74" color="#4A5361"></uni-icons>
				</view>
			</view>
		    <view class="fs" style="align-items: flex-end;">
		      <view style="width:80%;">
		        <view class="fst pdl30 address" >
					<view class="ellipsis ft20 rgb74">{{order.parkingAddress}}</view>
				</view>
				<view class="ft20 rgb74  arrowIn pdl30 mgt12">{{order.inTime}}</view>
				<view class="ft20 rgb74 arrowOut pdl30 mgt12">{{order.outTime}}</view>
		      </view>
		      <view class="ftweight ft32 rgb27">
				￥{{order.showMoney}}
		      </view>
		    </view>
		  </view>
		</view>
		<!-- 会员订单 -->
		<view class="card mgb50 bgw pd20-y mg40-x" v-for="(order,index) in list2" :key="index" @click="nav2orderDetail(index)">
		  <view class="pd40-x">
			<view class="fs" >
				<view style="width:80%;">
					<view class="ftweight ft32 rgb27  ellipsis">{{order.parkingName}}</view>
					<view class="ft20 rgb74 memberTime pdl30 mgt20">{{order.inTime}}</view>
				</view>
				<view class="ftweight ft32 rgb27">
					￥{{order.showMoney}}
				</view>
			</view>
		    </view>
		</view>	
		<!-- 租赁服务订单 -->
		<view class="card mgb50 bgw pd20-y mg40-x" v-for="(order,index) in list1" :key="index" @click="nav2orderDetail(index)">
			<view class="fst mgb20 pdb20 pd40-x"  style="border-bottom:2rpx solid rgba(239,244,248,1);">
				<view class="ftweight ft32 rgb27  ellipsis">{{order.parkingName}}</view>
				<view class="mgl20 fst">
					<view class="ft14 ftweight type">月卡</view>
				</view>
			</view>
		    <view class="fs pd40-x" style="align-items: flex-end;">
		      <view style="width:80%;">
		        <view class="fst pdl30 address" >
					<view class="ellipsis ft20 rgb74">{{order.parkingAddress}}</view>
				</view>
				<view class="ft20 rgb74  parkIcon pdl30 mgt12 fst">
					<view class="width160">{{order.placeType}}</view>
					<view>{{order.placeNumber}}</view>
				</view>
				<view class="ft20 rgb74 mycar pdl30 mgt12 fst">
					<view class="width160">{{order.carNumber}}</view>
					<view>{{order.inTime}}</view>
				</view>
		      </view>
		    </view>
		</view>
	</view>
</template>

<script>
	import store from '@/store'
	export default {
		data() {
			return {
				list: [{ // 数据列表
					parkingName:"创意大厦地下停车场",
					parkingAddress:"山东省济宁市高新区海川路69号创意大厦",
					inTime:'2020.04.01   11:01:25',
					outTime:'2020.04.01   11:01:25',
					showMoney:'2.00',
				}],
				list1: [{ // 数据列表
					parkingName:"置城国际地下停车场",
					parkingAddress:"山东省济宁市高新区海川路69号创意大厦",
					carNumber:"鲁H·54188",
					inTime:'2020.04.01   11:01:25',
					placeNumber:'A003',
					placeType:"固定泊位"
				}],
				list2: [{ // 数据列表
					parkingName:"PLUS半年会员",
					inTime:'2020.04.01   11:01:25',
					showMoney:'2.00',
				}],
			}
		},
		methods:{
			//去订单详情
			nav2orderDetail (index) {
			  store.commit('set_orderIdDetail', this.list[index].orderCode)
			  uni.navigateTo({
			    url: '/personal/order/orderDetail/index'
			  })
			},
		}
		
	}
</script>

<style lang='stylus'>
.noorderimg
  width 305rpx
  height 298rpx
  position fixed
  top 30%
  left 50%
  margin-left -152rpx
.card
  /* height 212rpx */
  border-radius 32rpx
  box-sizing border-box
  /* box-shadow -10rpx 0 50rpx #ccc */
.ellipsis
  overflow hidden
  white-space nowrap 
  text-overflow ellipsis
.fsy
	/* height 170rpx */
	display flex
	flex-direction column
	align-items flex-end
	justify-content space-between
.move
  transform translate(70rpx)
.check
  position absolute
  top 50%
  left 40rpx
  margin-top -15rpx
.footer
  width 100%
  background #fff
  z-index 1000
  box-sizing border-box
.footer:after 
  content ''
  display block
  clear both
.btn
  width 180rpx
  height 80rpx
  background #000
  line-height 80rpx
  color #fff
  border-radius 20rpx
  position absolute
  top 50%
  right 40rpx
  margin-top -40rpx
/* ::-webkit-scrollbar
  width 0
  height 0
  color transparent
.iconload 
  animation load 1s ease infinite
@-webkit-keyframes load
  0% {transform:rotate(0)}
  100% {transform:rotate(360deg)} */
.arrowRight
	margin-right -4rpx
.orderIcon
	width 20rpx!important
	height 22rpx
.address 
	background url(@/assets/orderIconAddress.png) no-repeat
	background-size 20rpx 22rpx
	background-position left center
.arrowIn
	background url(@/assets/orderIconIn.png) no-repeat
	background-size 20rpx 22rpx
	background-position left center
.arrowOut
	background url(@/assets/orderIconOut.png) no-repeat
	background-size 20rpx 22rpx
	background-position left center
.memberTime
	background url(@/assets/parkingIcon4.png) no-repeat
	background-size 20rpx 22rpx
	background-position left center
.mycar
	background url(@/assets/mycar.png) no-repeat
	background-size 20rpx 22rpx
	background-position left center
.parkIcon
	background url(@/assets/orderIconPark.png) no-repeat
	background-size 20rpx 22rpx
	background-position left center
.type
	color #FFFFFF
	background #56C9CC
	padding 4rpx
	border-radius 4rpx
.width160
	width 160rpx
</style>
