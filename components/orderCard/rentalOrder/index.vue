<template>
	<view class="pr" @click="nav2orderDetail">
		<img v-if="showType.isInvoice" :src="order.checked ? staticImg + '/static/img/check.png' : staticImg + '/static/img/X_select_0.png'"
		 class="check" style="width:30rpx;height:30rpx;">
		<view class="card mgt50 bgw pd20-y mg40-x" :class="{'move' : showType.isInvoice}">
			<view class="fs mgb20 pdb20 pd40-x" style="border-bottom:2rpx solid rgba(239,244,248,1);" :class="order.orderStatus==3 || order.orderStatus==4?'gray':''">
				<view class="fst" style="max-width: 480rpx;">
					<view class="ftweight ft26 rgb27  ellipsis" style="flex: 1;">{{order.parkingName}}</view>
					<view class="mgl20 fst" style="width: 40rpx;">
						<view class="ft14 ftweight type">{{cardTypeShow}}</view>
					</view>
				</view>
				<view class="ftweight ft20" :class="order.orderStatus == 1?'Leasing':order.orderStatus == 3?'overdue':'noeffective'">
					<!-- {{order.orderStatus == 1?'租赁中':order.orderStatus == 2?'待生效':order.orderStatus == 3 ?'已到期' : '已退款'}} -->
					{{orderStatusShow}}
				</view>
			</view>
			<view class="fs pd40-x" style="align-items: flex-end;">
				<view style="width:80%;" :class="order.orderStatus==3 || order.orderStatus==4?'gray':''">
					<view class="fst pdl30 address">
						<view class="ellipsis ft20 rgb74">{{order.address}}</view>
					</view>
					<view class="ft20 rgb74  parkIcon pdl30 mgt12 fst" v-if="order.lotCode">
						<view class="width160">固定泊位</view>
						<view>{{order.lotCode}}</view>
					</view>
					<view class="ft20 rgb74 mycarIcon pdl30 mgt12 fst">
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
	import {
		nav2parkDetail
	} from '@/utils'
	import {
		mapGetters,
		mapState,
		mapActions
	} from 'vuex'
	export default {
		props: {
			showType: {
				type: Object
			},
			order: {
				type: Object
			}
		},
		data() {
			return {
				order1: {}
			}
		},
		mounted() {
			this.order1 = this.order
		},
		computed: {
			...mapState('carRentalModule/carRentalOrderListModule', ['selectList']),
			...mapGetters('carRentalModule/carRentalOrderListModule', ['isSelectAll']),
			staticImg() {
				return this.$store.state.staticImg
			},
			cardTypeShow() {
				if (this.showType.pageStatus == "carRental") {
					return this.order.cardType == 1 ? '周卡' : this.order.cardType == 2 ? '月卡' : '年卡'
				} else if (this.showType.pageStatus == "manageCar") {
					return this.order.cardType == 1 ? '周费' : this.order.cardType == 2 ? '月费' : '年费'
				}
			},
			orderStatusShow(){
				 if(this.order.orderStatus == 1){
				 	return this.showType.pageStatus == "carRental" ? '租赁中':'生效中'
				 }else if(this.order.orderStatus == 2){
				 	return '待生效'
				 }else if(this.order.orderStatus == 3){
				 	return '已过期'
				 }else{
				 	return '已退款'
				 }
			}
		},
		watch: {
			order(n, o) {
				this.order1 = n
			}
		},
		methods: {
			...mapActions('carRentalModule/carRentalOrderListModule', ['getSelectByRentOnline']),
			nav2orderDetail() {
				if (this.showType.isInvoice) {
					this.order1.checked = !this.order1.checked
					this.$emit('getOrder', this.order1, this.isSelect)
				} else {
					uni.navigateTo({
						url: '/personal/carRental/orderDetail/index?orderId=' + this.order1.id+ '&pageStatus=' + this.showType.pageStatus
					})
				}
			},
			renew() {
				let that = this;
				// 验证是否跳转续费页面
				that.getSelectByRentOnline(that.order1.rentInfoCode).then(res => {
					if (res.result) {
						nav2parkDetail({parkingCode:that.order1.parkingCode,rentInfoCode:that.order1.orderId,pageStatus:that.showType.pageStatus})
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

<style>
</style>
