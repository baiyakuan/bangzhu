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
						<view class="ftweight ft30 rgb27  ellipsis pd20-y ">{{order.goods_name}}</view>
					</view>
					<view class="fcx">
						<view class="ft24 rgba74" v-if="tabStatus == 1 || tabStatus == 2" @click.stop="navigate2OrderDetail">
							查看
						</view>
						<view class="ft22 rgba74"  v-if="tabStatus == 3 " @click.stop="navigate2OrderDetail">
							{{order.refund_type  == 1 ? '已退款' : order.refund_type == 2 ?'过期自动退': ''}}
						</view>
						<uni-icons type="arrowright" size="25" :color="'rgba(74,83,97,0.5)'" class="arrowRight"></uni-icons>
					</view>
				</view>
				<view class="fs pd40-x pdb30" style="align-items: flex-end;">
				  <view style="width:80%;">
						<view class="ft20 rgb74  arrowPay pdl30 mgt20">下单时间 {{order.pay_time }}</view>
						<view class="ft20 rgb74  arrowValid pdl30 mgt20" v-if="tabStatus == 1">
							有效期至 {{order.valid_end_date }}
						</view>
						<view class="ft20 rgb74  arrowPuchase pdl30 mgt20" v-if="tabStatus == 2">
							消费时间 {{order.writeOffTime }}
						</view>
						<view class="ft20 rgb74  arrowRefund pdl30 mgt20" v-if="tabStatus == 3">
							退款时间 {{order.refund_time }}
						</view>
						<view class="ft20 rgb74  arrowRealPay pdl30 mgt20">实付金额 ￥{{order.pay_money }}</view>

					</view>
					<view class="ftweight ft20 exambtn" @click.stop="btnClick">
						{{tabStatus == 1  ? '立即使用' : '再来一单'}}
					</view>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	import { goLink } from '@/utils/link'
	import {getGoodsInfoByStoreId} from '@/api'
	export default {
		props:{
			tabStatus: Number,
			// checkMode: Boolean,
			order: Object,
			index: Number,
			currentTypeId:Number
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
			}	
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
					type:this.currentTypeId, //加油    （1-停车 2-租赁 3-加油 4-洗车 5-保养 6-车检）
					usersPhone: this.$store.state.userInfo.usersPhone,
					lat:this.$store.state.location.latitude,
					lng:this.$store.state.location.longitude
				})
			},
			async btnClick(){
				if(this.tabStatus == 1){
					this.$bus.$emit('showToast', this.order);
				}else{
					// 跳转到车检详情页面
					const {data} = await getGoodsInfoByStoreId({
						id: this.order.merchantId, //商户id
						longitude: '',
						latitude: '',
						type: 2 // 洗车2 保养3
					})
					 if(data.code==1 ){
						const goodsList = data.data.goodsVoList;
						// 判断该商品是否是上架状态
						const flag = goodsList.some(item => {
						  return item.goodId == this.order.goodsId
						});
						if (flag) {
							goLink( this.$store.state.h5Url, {
								path: '#/pages/washCar/fillOrder?id=' + this.order.merchantId + '&goodsId=' + this.order.goodsId + '&isAgain=1',
								token: this.$store.state.token,
								lat:this.$store.state.location.latitude,
								lng:this.$store.state.location.longitude
							})
						}else {
							uni.showToast({
								title: '该商品已下架',
								icon:'none'
							})
						}
					}
				}
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
  border-radius 40rpx
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
.arrowPuchase
	background url(@/assets/orderIconWash.png) no-repeat
	background-size 20rpx 22rpx
	background-position left center
.arrowRealPay
	background url(@/assets/orderIconRealPay.png) no-repeat
	background-size 20rpx 22rpx
	background-position left center
.arrowRefund
	background url(@/assets/orderIconRefund.png) no-repeat
	background-size 22rpx 22rpx
	background-position left center
.arrowValid
	background url(@/assets/orderIconValid.png) no-repeat
	background-size 20rpx 22rpx
	background-position left center
.borderBottom
	border-bottom 1rpx solid #EFF4F8
.exambtn
	width: 120rpx;
	height: 48rpx;
	text-align center
	line-height 48rpx
	background: #F23434;
	border-radius: 8rpx;
	color #FFFFFF
</style>
