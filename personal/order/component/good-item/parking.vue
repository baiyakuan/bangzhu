<!-- 商品列表组件 <pd-list :list="xx"></pd-list> -->
<template>
	<view class="card-wrap" @click="handleClick(index)">
		<image
			v-if="checkMode2"
			:src="isChecked ? staticImg + 'static/img/check.png' : staticImg + 'static/img/X_select_0.png'"
			class="check"
			style="width:30rpx;height:30rpx;"
			alt=""
		></image>
		<view :class="[{ move: checkMode2 }, 'card mgt50 bgw mg40-x']">
			<view class="">
				<view class="fs  borderBottom pd40-x">
					<view style="width:80%;" class="fst">
						<view class="ftweight ft30 rgb27  ellipsis pd20-y">{{ order.name }}</view>
						<view class="refund" v-if="order.status == 2 && order.refund_status == 6">已退款</view>
					</view>
					<view class="fcx">
						<view class="ft24 rgb243" v-if="tabStatus == 3" @click.stop="navigate2OrderDetail">去支付</view>
						<view class="ft22 rgba74" v-if="tabStatus != 3" @click.stop="navigate2OrderDetail">查看</view>
						<uni-icons type="arrowright" size="25" :color="tabStatus == 3 ? 'rgba(243,53,53,1)' : 'rgba(74,83,97,0.5)'" class="arrowRight"></uni-icons>
					</view>
				</view>
				<view class="fs pd40-x pdb30" style="align-items: flex-end;">
					<view style="width:80%;">
						<view class="fst pdl30 address mgt20">
							<view class="ellipsis ft20 rgb74">{{ order.address }}</view>
						</view>
						<view class="ft20 rgb74  arrowPay pdl30 mgt20" v-if="order.typeFlag == 2">{{ order.createTime }}</view>
						<view class="ft20 rgb74  arrowIn pdl30 mgt20" v-if="order.typeFlag == 1">{{ order.startTime }}</view>
						<view class="ft20 rgb74 arrowOut pdl30 mgt20" v-if="order.typeFlag == 1 && tabStatus != 1">{{ order.endTime }}</view>
					</view>
					<view class="ftweight ft32 rgb27">￥{{ order.showMoney }}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		tabStatus: Number,
		order: Object,
		index: Number,
		checkMode:Boolean
	},
	data(){
		return{
			isDelete:false,
		}
	},
	mounted() {
	    const that=this
	    uni.$on('delOrder',(res)=>{
	      that.isDelete=res
	    })
		that.isDelete = that.$store.state.isDelete
	 },
	inject: ['checkedCollection', 'itemCheckClick'],
	computed: {
		staticImg() {
			return this.$store.state.staticImg;
		},
		checkedCodes() {
			return this.checkedCollection.checkedOrderCodes;
		},
		isChecked() {
			return this.checkedCollection.checkedOrderCodes.includes(this.order.orderId);
		},
		checkMode2(){
			return this.checkMode||this.isDelete
		}
	},
	methods: {
		handleClick() {
			if (this.checkMode2) {
				this.itemCheckClick(this.order.orderId);
			} else {
				this.navigate2OrderDetail();
			}
		},
		navigate2OrderDetail() {
			let url = '';
			if (this.order.typeFlag == 1) {
				this.$store.commit('set_orderIdDetail', this.order.orderId);
				url = '/personal/order/orderDetail/index';
			} else if (this.order.typeFlag == 2) {
				url = `/personal/wallet/addoildetails/index?payTypes=加油消费&orderId=${this.order.orderId}&from=orderPage`;
			}
			uni.navigateTo({ url });
		}
	}
};
</script>

<style lang="stylus" scoped>
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
	margin-right 11rpx
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
	width 20rpx !important
	height 22rpx
.address
	background url('@/assets/orderIconAddress.png') no-repeat
	background-size 20rpx 22rpx
	background-position left center
.arrowIn
	background url('@/assets/orderIconIn.png') no-repeat
	background-size 20rpx 22rpx
	background-position left center
.arrowOut
	background url('@/assets/orderIconOut.png') no-repeat
	background-size 20rpx 22rpx
	background-position left center
.arrowPay
	background url('@/assets/orderIconPay.png') no-repeat
	background-size 20rpx 22rpx
	background-position left center
.borderBottom
	border-bottom 1rpx solid #EFF4F8
</style>

<style lang="scss" scoped>
.refund {
	background-color: #f33535;
	color: #fff;
	font-size: 20rpx;
	border-radius: 20rpx;
	padding: 6rpx 20rpx;
	margin-left: auto;
	flex-shrink: 0;
}
</style>
