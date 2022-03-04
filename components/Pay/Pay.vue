<template>
	<view class="">
		<view v-if="visible" class="pf" @click="cancel" style="background:rgba(0,0,0,0.6);z-index:1111;">
			<view class="pfb " @click.stop="">
				<view class="fs h120 pd40-x">
					<view class="ftweight ft34" style="width:60%;color: $main-black">付款金额</view>
					<view class="fe">
						<view class="ftweight ft50">{{ payType == 'PARKINGCARD' ? money : payamount }}</view>
						<view class="ft28 mgl20">元</view>
					</view>
				</view>
				<view class="" v-if="cardBalance !== null">
					<view @click="payWay('PARKINGCARD')" class="fs h120 pd40-x" >
						<view class="fst">
							<img :src="'/static/img/cardPayIcon.png'" style="width:50rpx;height:50rpx;" />
							<view class="ft30 mgl30 fst" :style="isDisableCard ? 'color:#ccc' : ''" style="width:400rpx;">
								{{ isDisableCard ? '停车卡余额不足' : '停车卡抵扣' }}&nbsp;({{ (cardBalance * 1).toFixed(2) }}元)
								<view class="tipIcon" @click="toggleTipShow">
									<image src="/static/img/question.png" mode=""></image>
								</view>
							</view>
						</view>
						<img v-if="payType == 'PARKINGCARD'" :src="staticImg + 'static/img/payType.png'" style="width:30rpx;height:30rpx;" />
						<img v-else :src="staticImg + 'static/img/unChecked.png'" style="width:30rpx;height:30rpx;" />
					</view>
					<view class="tip" v-show="tipShow">
						停车卡抵扣不与平台内其他优惠叠加使用
					</view>
				</view>
				<view @click="payWay('BALANCE')" class="fs h120 pd40-x">
					<view class="fst">
						<img :src="staticImg + 'static/img/gold.png'" style="width:50rpx;height:50rpx;" />
						<view class="ft30 mgl30" :style="isDisableBalance ? 'color:#ccc' : ''" style="width:400rpx;">
							{{ isDisableBalance ? '钱包余额不足' : '余额支付' }}&nbsp;({{ (amount * 1).toFixed(2) }}元)
						</view>
					</view>
					<img v-if="payType == 'BALANCE'" :src="staticImg + 'static/img/payType.png'" style="width:30rpx;height:30rpx;" />
					<img v-else :src="staticImg + 'static/img/unChecked.png'" style="width:30rpx;height:30rpx;" />
				</view>
				<!-- #ifdef MP-WEIXIN -->
				<view @click="payWay('JSAPI')" class="fs h120 pd40-x">
					<view class="fst">
						<img :src="staticImg + 'static/img/pay_wechat.png'" style="width:50rpx;height:50rpx;" />
						<view class="ft30 mgl30">微信支付&emsp;&emsp;</view>
					</view>
					<img v-if="payType == 'JSAPI'" :src="staticImg + 'static/img/payType.png'" style="width:30rpx;height:30rpx;" />
					<img v-else :src="staticImg + 'static/img/unChecked.png'" style="width:30rpx;height:30rpx;" />
				</view>
				<!-- #endif -->
				<!-- #ifdef MP-ALIPAY -->
				<view @click="payWay('AL_MY')" class="fs h120 pd40-x">
					<view class="fst">
						<image :src="staticImg + 'static/img/pay_ali.png'" style="width:50rpx;height:50rpx;" />
						<view class="ft30 mgl30">支付宝支付</view>
					</view>
					<img v-if="payType == 'AL_MY'" :src="staticImg + 'static/img/payType.png'" style="width:30rpx;height:30rpx;" />
					<img v-else :src="staticImg + 'static/img/unChecked.png'" style="width:30rpx;height:30rpx;" />
				</view>
				<!-- #endif -->
				<view class="mg40-y pd40-x"><view @click="_lazyClick" :disabled="clickbtn" class="ftweight ft30 payBtn">确认支付</view></view>
			</view>
		</view>
	</view>
</template>

<script>
import store from '@/store';
import { debounce } from '@/utils/miniLodash';
export default {
	props: {
		visible: {
			type: Boolean,
			default: false
		},
		amount: {
			default: '0.00'
			// type:Number
		},
		cardBalance:{
			default: null
		},
		payamount: {
			// type:String
		},
		money: {
			// type:String
		},
		disabled: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			isDisableCard:false,
			isDisableBalance: false, // 是否禁用余额支付
			payType: 'PARKINGCARD' ,// 支付方式 1、BALANCE 余额支付 2、JSAPI 微信支付 3、AL_MY 支付宝支付   默认选用余额支付
			tipShow:false
		};
	},
	computed:{
		staticImg() { return store.state.staticImg },
	},
	watch:{
		cardBalance(val){
			if(val == null){
				this.payType = 'BALANCE'
			}
		},
		visible(val){
			if(val){
				this.setPayType()
			}
		}
	},
	mounted() {
		this._lazyClick = debounce(this.enterPay, 1500, true);
	},
	methods: {
		// 选择付款方式
		payWay(str) {
			if (str == 'PARKINGCARD' && this.isDisableCard) {
				return false;
			}
			if (str == 'BALANCE' && this.isDisableBalance) {
				return false;
			}
			this.payType = str;
		},
		setPayType(){
			this.payType = 'PARKINGCARD'
			this.isDisableCard = false
			this.isDisableBalance = false
			if(!this.money || this.cardBalance * 1 < this.money * 1){
				this.isDisableCard = true;
				this.payType = 'BALANCE'
			}
			if (this.amount * 1 < this.payamount * 1) {
				this.isDisableBalance = true;
				this.payType = 'JSAPI'
			} 
		},
		// 取消支付
		cancel() {
			this.$emit('cancel');
		},
		// 确认支付订单
		enterPay() {
			this.$emit('enterPay', this.payType);
		},
		toggleTipShow(){
			this.tipShow = !this.tipShow 
		}
	}
};
</script>

<style scoped lang="less">
.pfb {
	position: absolute;
	left: 0;
	right: 0;
	bottom: 0;
	background: #fff;
	border-radius: 20px 20px 0px 0px;
}
.h120 {
	height: 120rpx;
	line-height: 120rpx;
}
.payBtn {
	width: 100%;
	height: 100rpx;
	background: #f33535;
	border-radius: 20rpx;
	text-align: center;
	line-height: 100rpx;
	color: #fefefe;
	box-sizing: border-box;
}
.tip{
	height: 60rpx;
	line-height: 60rpx;
	font-size: 20rpx;
	padding-left: 120rpx;
	background: #f6f8fb;
	color: #303133;
}
.tipIcon{
	margin-left: 10rpx;
	image{
		width:20rpx;
		height:20rpx;
	}
}
</style>
