<template>
	<view class="pr" @click="handleClick(index)">
		<image v-if="checkMode" :src="isChecked ?staticImg + 'static/img/check.png':staticImg + 'static/img/X_select_0.png'" class="check" style="width:30rpx;height:30rpx;" alt=""></image>
		<view :class="[{move: checkMode}, 'card mgt50 bgw mg40-x'] " >
			<view class="fs pd20-y pd40-x" style="border-bottom:2rpx solid rgba(239,244,248,1);" :class="order.orderStatus==3 || order.orderStatus==4?'gray':''">
				<view class="fst" style="max-width: 480rpx;">
					<view class="ftweight ft26 rgb27  ellipsis" style="flex: 1;">{{order.parkingName}}</view>
					<view class="mgl20 fst" style="width: 40rpx;">
						<view class="ft14 ftweight type">{{cardTypeShow}}</view>
						
					</view>
				</view>
				<view class="ftweight ft20" :class="order.orderStatus == 1?'Leasing':order.orderStatus == 3?'overdue':'noeffective'">
					{{orderStatusShow}}
				</view>
			</view>
			<view class="fs pd40-x pdb30" style="align-items: flex-end;">
				<view style="width:80%;" :class="order.orderStatus==3 || order.orderStatus==4?'gray':''">
					<view class="fst pdl30 address mgt20">
						<view class="ellipsis ft20 rgb74">{{order.address}}</view>
					</view>
					<view class="ft20 rgb74  parkIcon pdl30 mgt20 fst" v-if="order.lotCode">
						<view class="width160">固定泊位</view>
						<view>{{order.lotCode}}</view>
					</view>
					<view class="ft20 rgb74 mycarIcon pdl30 mgt20 fst">
						<view class="width160">{{order.carNum}}</view>
						<view>{{order.validTime}}至{{order.incalidTime}}</view>
					</view>
				</view>
				<view class="renew" @click.stop="renew">再次购买</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {getSelectByRentOnline} from '@/api'
	import {
		mapGetters,
		mapState,
		mapActions
	} from 'vuex'
	import {
		nav2parkDetail
	} from '@/utils'
	export default {
		props:{
			tabStatus: Number,
			// checkMode: Boolean,
			order: Object,
			index: Number,
			pageStatus:{
				type:String,
				default:'carRental'
			}
		},
		data(){
			return{
				checkMode:false,
			}
		},
		mounted() {
		    const that=this
		    uni.$on('delOrder',(res)=>{
		      that.checkMode=res
		    })
			that.checkMode = that.$store.state.isDelete
		 },
		inject:['checkedCollection', 'itemCheckClick'],
		computed:{
			staticImg() { return this.$store.state.staticImg },
			checkedCodes() {
				return this.checkedCollection.checkedOrderCodes
			},
			isChecked() {
				return this.checkedCollection.checkedOrderCodes.includes(this.order.orderId)
			},	
			cardTypeShow() {
				if (this.pageStatus == "carRental") {
					return this.order.cardType == 1 ? '周卡' : this.order.cardType == 2 ? '月卡' : '年卡'
				} else if (this.pageStatus == "manageCar") {
					return this.order.cardType == 1 ? '周费' : this.order.cardType == 2 ? '月费' : '年费'
				}
			},
			orderStatusShow(){
				if(this.order.orderStatus == 1){
				 	return this.pageStatus == "carRental" ? '租赁中':'生效中'
				}else if(this.order.orderStatus == 2){
				 	return '待生效'
				}else if(this.order.orderStatus == 3){
				 	return '已过期'
				}else{
				 	return '已退款'
				}
			}
		},
		methods: {
			...mapActions('carRentalModule/carRentalOrderListModule', ['getSelectByRentOnline']),
			handleClick() {
				if(this.checkMode) {
					this.itemCheckClick(this.order.orderId)
				} else {
					this.nav2orderDetail()
				}
			},
			navigate2OrderDetail() {
				let url = ''
				if (this.order.typeFlag == 1) {
					this.$store.commit('set_orderIdDetail', this.order.orderId)
					url = '/personal/order/orderDetail/index'
				} else if (this.order.typeFlag == 2) {
					url = `/personal/wallet/addoildetails/index?payTypes=加油消费&orderId=${this.order.orderId}&from=orderPage`
				}
				uni.navigateTo({ url })
			},
			nav2orderDetail() {
				// if (this.showType.isInvoice) {
				// 	this.order1.checked = !this.order1.checked
				// 	this.$emit('getOrder', this.order1, this.isSelect)
				// } else {
					uni.navigateTo({
						url:'/personal/carRental/orderDetail/index?orderId=' + this.order.id + '&pageStatus=' + this.pageStatus
					})
				// }
			},
			renew() {
				let that = this;
				// 验证是否跳转续费页面
				that.getSelectByRentOnline(that.order.rentInfoCode).then(res => {
					if (res.result) {
						nav2parkDetail({parkingCode:that.order.parkingCode,rentInfoCode:that.order.rentInfoCode,pageStatus:that.pageStatus})
					} else {
						uni.showToast({
							title: res.msg,
							icon: "none"
						})
					}
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
  border-radius 32rpx
  box-sizing border-box
.ellipsis
  overflow hidden
  white-space nowrap 
  text-overflow ellipsis
.fsy
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
::-webkit-scrollbar
  width 0
  height 0
  color transparent
.iconload 
  animation load 1s ease infinite
@-webkit-keyframes load
  0% {transform:rotate(0)}
  100% {transform:rotate(360deg)}
.arrowRight
	margin-right -4rpx
	margin-top 4rpx

.orderIcon
	width 20rpx!important
	height 22rpx
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
.mycarIcon
	background url(@/assets/orderIconCar.png) no-repeat
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
.renew
	width:120rpx;
	height:48rpx;
	line-height 48rpx
	background rgba(242,52,52,1)
	border-radius 8rpx
	text-align center
	color #FFFFFF
	font-size 20rpx
.Leasing
	color #F33535
.noeffective
	color #4A5360
.overdue
	color #4A5361
.gray
	opacity 0.5
	.type
		background #4A5362
</style>

