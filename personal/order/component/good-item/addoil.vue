<!-- 商品列表组件 <pd-list :list="xx"></pd-list> -->
<template>
	<view class="card-wrap" @click="handleClick(index)">
		<image v-if="checkMode" :src="isChecked ?staticImg + 'static/img/check.png':staticImg + 'static/img/X_select_0.png'" class="check" style="width:30rpx;height:30rpx;" alt=""></image>
		<view :class="[{move: checkMode}, 'card mgt50 bgw mg40-x'] " >
			<view class="">
				<view class="fs borderBottom pd40-x" >
					<view style="width:75%;" class="fst">
						<!-- <view class="order-icon">
							<image :src="staticImg + 'static/img/oil-order.png'" ></image>
						</view> -->
						<view class="ftweight ft30 rgb27  ellipsis pd20-y ">{{order.name}}</view>
					</view>
					<view class="fcx">
						<view class="ft24 rgba74" v-if="tabStatus == 1" @click.stop="navigate2OrderDetail">
							查看
						</view>
						<view class="ft22 rgba74"  v-if="tabStatus == 2 " @click.stop="navigate2OrderDetail">
							{{order.refundStatus == 1 ? '退款处理中' : order.refundStatus == 2 ?'已退款': order.refundStatus == 3 ?'退款被驳回' : '退款已完成'}}
							<!-- refundStatus 0 未退款  1 退款处理中 2 已退款 3 申请驳回 4 已完成 -->
						</view>
						<uni-icons type="arrowright" size="25" :color="'rgba(74,83,97,0.5)'" class="arrowRight"></uni-icons>
					</view>
				</view>
				<view class="fs pd40-x pdb30" style="align-items: flex-end;">
				  <view style="width:80%;">
					<view class="fst pdl30 address mgt20" >
						<view class="ellipsis ft20 rgb74">{{order.address}}</view>
					</view>
						<view class="ft20 rgb74  arrowPay pdl30 mgt20" v-if="tabStatus == 1">{{order.payTime}}</view>
						<view class="ft20 rgb74  arrowPay pdl30 mgt20" v-if="tabStatus == 2 ">{{order.applyTime}}</view>
					</view>
					<view class="ftweight ft32 rgb27">
						￥{{order.payMoney}}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { goLink } from '@/utils/link'
	export default {
		props:{
			tabStatus: Number,
			order: Object,
			index: Number,
			
		},
		data(){
			return{
				checkMode:false,
			}
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
		},
		mounted() {
		    const that=this
		    uni.$on('delOrder',(res)=>{
		      that.checkMode=res
		    })
			that.checkMode = that.$store.state.isDelete
		 },
		methods:{
			handleClick() {
				if(this.checkMode) {
					this.itemCheckClick(this.order.orderId)
				} else {
					this.navigate2OrderDetail()
				}
			},
			navigate2OrderDetail() {
				goLink( this.$store.state.h5Url, {
				// goLink( 'http://10.192.84.34:8080/h5/ugc/', {
					path: '#/pages/orderDetails/index',
					token: this.$store.state.token,
					orderId: this.order.orderId,
					type:3, //加油    （1-停车 2-租赁 3-加油 4-洗车 5-保养 6-车检）
					version:this.$store.state.version,
					areaId:this.$store.state.address.adcode,
					lat:this.$store.state.location.latitude,
					lng:this.$store.state.location.longitude
				})
			}
		}
	}
</script>

<style lang='stylus' scoped>
.card-wrap
  position relative
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
.order-icon
	width 36rpx
	height 36rpx
	margin-right: 11rpx;
.order-icon image
	width 36rpx
	height 36rpx
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
  width 600rpx
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
.arrowRight
	margin-right -4rpx
.orderIcon
	width 20rpx!important
	height 22rpx
.address 
	background url('@/assets/orderIconAddress.png') no-repeat
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
.arrowPay
	background url(@/assets/orderIconPay.png) no-repeat
	background-size 20rpx 22rpx
	background-position left center
.borderBottom
	border-bottom 1rpx solid #EFF4F8
</style>
