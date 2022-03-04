	
<template>
	<view>
	<bar :nav="setNav" @onBack="onBack"></bar>
	<view class="pd40-x pdb40">
		<h1 class="ftweight ft50 rgb27 pd50-y">{{pageTitle}}</h1>
		<view>
			<view class="park bgw pd40">
				<view  class="pdb40 fs" style="border-bottom: 2rpx dashed  rgba(239,244,248,1);" @click="nav2parkLotDetail">
					<view class="fst" style="width: 90%;">
						<img :src="staticImg + 'static/img/orderIconAddress.png'" style="width:24rpx;height:28rpx" />
						<view class="mgl20" style="width: 90%;">
							<view class=" ft32 ftweight  rgb27 mgb12 ellipsis">{{rentalDetailReadied.parkingName}}</view>
							<view class=" ft20 rgb74 ellipsis">{{rentalDetailReadied.address}}</view>
						</view>
					</view>
					<!-- <uni-icons type="arrowright" size="30" class="mgt4 arrowRight"></uni-icons> -->
					</view>
				  <view class="mgt40 pr">
				  	<view class="ft24 rgba74 mgb30">起止时间</view>
				  	<view class="fst mgb20">
				  			<img :src="staticImg + 'static/img/red2.png'" style="width:10rpx;height:10rpx;"/>
				  			<view class="ft26  mgl50 rgb44">{{rentalDetailReadied.validTime}}</view>
				  	</view>
				  	<view class="fst">
				  		<img :src="staticImg + 'static/img/red1.png'" style="width:10rpx;height:10rpx;"/>
				  		<view class="ft26  mgl50 rgb44">{{rentalDetailReadied.invalidTime}}</view>
				  	</view>
				  	<view class="line"> </view>
				  </view>
				  <view class="time mgt40 fs">
						<view class="ft24 rgba74 ">选择服务</view>
						<view style="display: flex;align-items: center;">
							<view class="rent_time" v-if="rentalDetailReadied.selectedCardType.rentType == 2">专属区车位</view>
							<view class="ft24 rgb44">{{ rentalDetailReadied.selectedCardType.cardType }}</view>
							<view class="ft24 rgb44" v-if="rentalDetailReadied.selectedCardType.rentType">——{{ rentalDetailReadied.selectedCardType.rentType == 2 ? rentalDetailReadied.selectedCardType.areaName : '全车场' }}</view>
						</view>
				  </view>
				  <view class="time mgt20 fs">
						<view class="ft24 rgba74 ">所选车位</view>
						<view class=" ft24 rgb44">
							{{rentalDetailReadied.selectedLot.lotCode ? rentalDetailReadied.selectedLot.lotCode : '不固定车位'}}
						</view>
				  </view>
				  <view class="time mgt20 fs">
						<view class="ft24 rgba74 ">车辆</view>
						<view class=" ft24 rgb44">{{rentalDetailReadied.selectedBrand.brandNumber}}</view>
				  </view>
				</view>
				<view class="park mgt40  bgw pd40">
					<view class="fs">
						<view class="ft24 rgba74">订单金额:</view>
						<view class="ft24 rgb27">{{moneyShow}}元</view>
					</view>
					<view class="fs mgt20">
						<view class="ft24 rgba74">优惠金额:</view>
						<view class="ft24 rgb86">-{{discountMoneyShow}}元</view>
					</view>
				</view>
				<view class="park mgt40  bgw pd40">
					<view class="fs">
						<view class="ftweight fcx">
							<view class="ft48 rgb27 mgr20">{{payMoneyShow}}</view>
							<view class=" ft26 rgb27">元</view>
						</view>
						<view class="payBtn ft26 ftweight" @click="requestMessage">
							支付
						</view>
					</view>
				</view>
			</view>
			<Pay :visible="showPayTypeModal" :amount="wallet.amount" :payamount="payMoneyShow" @cancel="showPayTypeModal=false" @enterPay="orderPay"></Pay>
			<mask v-if="showMask"></mask>
		</view> 
</view>
</template>
<script>

import uniIcons from "@/components/uni-icons/uni-icons.vue"
import bar from '@/components/bar/bar.vue';
import { mapState, mapActions,mapMutations } from 'vuex'
import { requestSubscribeMessage } from '@/utils/subscribeMsgUtils';
export default {
	components:{
		uniIcons,
		bar
	},
	data () {
		return {
			// 自定义导航栏对象
			setNav:{
				'bg':'white',  //背景色
				'size':'48',
				'color':'black',  //字体颜色
				'isdisPlayNavTitle':true, //是否显示返回按钮，
				'navTitle':'租赁订单详情' //导航标题
			},
			showMask: false,
			showPayTypeModal: false,
			pageStatus:'carRental',
			pageTitle:'租赁详情',
			tmplIds: ['bulNr5qqjfMq5uRT77zUNxNDkfYbsu0JzUyjs9S3z_M', '0y1eHfaiaCuTPy4itLMT0ZYs5uDjoEHiDzvfLiAJxTA', 'kr12KDLc44jCDtupx4vyq7gG9QVkwP3-jgbQ62Pc7RA']
		}
	},
	computed: {
	    ...mapState('carRentalModule/carRentalOrderPayModule',['payVisible','payInfo']),
		...mapState('carRentalModule/carRentalDetailModule',['rentalDetailReadied']),
		staticImg() { return this.$store.state.staticImg },
		wallet(){
			return this.$store.state.wallet
		},
		moneyShow(){
			return this.rentalDetailReadied.money.toFixed(2);
		},
		
		payMoneyShow(){
			return this.rentalDetailReadied.payMoney.toFixed(2);
		},
		discountMoneyShow(){
			return (this.rentalDetailReadied.money - this.rentalDetailReadied.payMoney).toFixed(2);
		}
		
	},
	onLoad(options) {
		console.log(options)
		this.$store.dispatch('wallet')
		this.pageStatus = options.pageStatus
		this.pageStatus == "carRental" ? this.pageTitle = '租赁详情' : this.pageTitle = '车辆管理详情'
	},
	onUnload() {
		this.cancelRentOrderAction({
			orderId:this.rentalDetailReadied.orderId,
		})
	},
	methods: {
		...mapActions('carRentalModule/carRentalOrderPayModule',['payAction','cancelRentOrderAction']),
		requestMessage(){
			var that = this;
			requestSubscribeMessage(that.tmplIds, () => {
				that.showPayOptions();
			});
		},
		async showPayOptions(){
			let that = this;
			if(!this.rentalDetailReadied.payMoney){
				const payType = 'BALANCE';
				this.payAction({
					orderId:this.rentalDetailReadied.orderId,
					payType:payType
				}).then(res => {
					uni.showToast({
						title: '支付成功',
						icon:'none',
					});
					setTimeout(() => {
						uni.redirectTo({
							url:'/personal/carRental/orderDetail/index?orderId=' + that.rentalDetailReadied.orderId +'&pageStatus='+ that.pageStatus
						})
					},2000)
				})
			}else{
				this.showPayTypeModal = true
			}
		},
		orderPay(payType){
			let that = this;
			this.payAction({
					orderId:this.rentalDetailReadied.orderId,
					payType:payType
				}).then(res => {
				this.showPayTypeModal = false
				if(payType == "BALANCE"){
					uni.showToast({
						title: '支付成功',
						icon:'none',
					});
					setTimeout(() => {
						uni.redirectTo({
							url:'/personal/carRental/orderDetail/index?orderId=' + that.rentalDetailReadied.orderId +'&pageStatus='+ that.pageStatus
						})
					},2000)
				} else {
					let { appId, ...query } = res;
					wx.requestPayment({
						...query,
						orderInfo:query.data,
						success: function (res) {
							// #ifdef MP-ALIPAY
								if(res.resultCode != 9000){
									wx.showToast({
										title: '支付失败！',
										icon: 'none'
									})
									return false;
								}
							// #endif
							wx.showToast({
								title: "支付成功",
								icon: "none"
							});
							setTimeout(() => {
								uni.redirectTo({
									url:'/personal/carRental/orderDetail/index?orderId=' + that.rentalDetailReadied.orderId +'&pageStatus='+ that.pageStatus
								})
							},2000)
						},
						fail: function (err) {
							uni.showToast({
								title: '支付失败',
								icon: "none"
							});
						}
					})
				}
			})
		},
		// 导航去停车场详情
		nav2parkLotDetail(){
			// uni.navigateTo({
			// 	url: '/basic/parkLotDetail/index?id=' + this.rentalDetailReadied.parkingCode
			// })
		},
		onBack() {
			const that = this;
			uni.showModal({
			    title: '提示',
			    content: this.pageStatus == "carRental" ? '是否取消租赁订单': '是否取消车辆管理订单',
			    success: function (res) {
			        if (res.confirm) {
						if (getCurrentPages().length > 1) {
							uni.navigateBack({
								delta:1
							})
						} else {
							uni.navigateTo({
								// url: `/personal/carRental/index?pageStatus=${that.pageStatus}`
								url: '/pages/index/index'
							})
						}
						
						uni.showToast({
							title:'取消成功',
							icon:'none'
						})
			        }
			    }
			});
		}
  },

}
</script>
<style lang='stylus'>
/* @import '../../../styles/color.scss' */
page
  background rgba(246,248,251,1)
.red_line
  width 640rpx
  margin 0 auto
  border 2px solid red
  border-color transparent transparent red transparent
  border-top none
.card
  border-radius 20rpx
  box-shadow 4rpx 4rpx 50rpx #ccc
.park_detail
  border-top 1px dashed #ccc
  border-bottom 1px dashed #ccc
.park:after 
  content ''
  display block
  clear both
.no_wrap
  white-space nowrap
  overflow hidden
  text-overflow ellipsis
.card_icon
	width 80rpx
	height 80rpx
	border-radius 20rpx
.park
	border-radius 32rpx
.nav_icon
	width 60rpx
	height 60rpx
.payBtn
	width 180rpx
	height 80rpx
	background rgba(27,25,33,1)
	border-radius 20rpx
	color #FFFFFF
	text-align center
	line-height 80rpx
.ellipsis
  overflow hidden
  white-space nowrap 
  text-overflow ellipsis	
.line
 position absolute
 content ''
 left 3rpx
 bottom 29rpx
 width 4rpx
 height 32rpx
 background rgba(239,244,248,1)
.arrowRight
	width 30rpx
</style>

<style lang="scss">
.rent_time {
	width: 96rpx;
	height: 28rpx;
	line-height: 24rpx;
	border: 2rpx solid #f23434;
	border-radius: 14rpx;
	font-size: 16rpx;
	color: #f23434;
	text-align: center;
	box-sizing: border-box;
	margin-right: 20rpx;
}
</style>