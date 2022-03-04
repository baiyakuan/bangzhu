<template>
	<div class="page">
		<div id="header" class="header">
			<div class="headerTop pd100-x">
				<!-- <div class="fstst pdt60">
					<div class="fcyst">
						<view class="ft32 ftweight ftw" style="height: 32rpx;line-height: 32rpx;">余额</view>
						<view class="ft20 rgb254" style="opacity: 0.6;">Assets</view>
					</div>
				</div> -->
				<view class="fcx" style="padding-top: 100rpx;">
					<view class="ft28 ftw mgr10" style="height: 32rpx;line-height: 32rpx;">余额:</view>
					<div  class="ftweight  ftw fcx" >
						<!-- style="align-items: flex-end;" -->
						<view class="ft48" style="line-height: 50rpx;">￥</view>
						<view class="ft64" style="line-height: 64rpx;">{{ wallet.amount }}</view>
					</div>
				</view>
				<div class="fcx mgt50">
					<navigator hover-class="none" class="recharge ft30 rgb254 tac" url="/personal/wallet/recharge/index?entryType=1">充值</navigator>
					<!-- <navigator hover-class="none" class="withdraw ft30 rgb254 tac mgl60" url="/personal/wallet/withdraw/index">提现</navigator> -->
				</div>
			</div>
			<div class="ft32 ftweight rgb51 bgw mgt100 pd40-x">账单</div>
		</div>
		<mescroll-uni
			class="mescroll"
			ref="mescrollRef"
			top="554rpx"
			@init="mescrollInit"
			:down="downOption"
			@down="downCallback"
			:up="upOption"
			@up="upCallback"
			:fixed="true"
		>
			<div class="pd40-x" v-for="(item, index) in list" :key="index" @click="goDetail(item)">
				<div class="pdt40 bgw pdb20 bt">
					<div class="fs">
						<div class="rgb51 ft28">{{ item.payTypes }}</div>
						<!-- 无退款 -->
						<div v-if="!item.refundMoney">
							<div class="payMoneyR" v-if="item.payTypes == '充值'">+{{item.amountShow}}</div>
							<div class="payMoney" v-else >-{{item.amountShow}}</div>
						</div>
						<!-- 有退款 -->
						<div v-else>
							<div class="payMoneyR" v-if="isRefound(item.payTypes)">+{{item.refundMoneyShow}}</div>
							<div class="payMoney" v-else >-{{item.amountShow}}</div>
						</div>
					</div>
					<!-- typeFlag == 16加油退款 typeFlag == 15车检退款-->
					<div class="fs mgt10">
						<div class="ft22 rgb175">{{ item.creatTime }}</div>
						<div>
							<!-- 无退款 -->
							<div class="payType" v-if="!item.refundMoney" >{{ item.payType }}</div>
							<!-- 有退款 -->
							<div v-else>
								<div class="payType" v-if="isRefound(item.payTypes)">{{ item.payType }}</div>
								<div class="payTypeR" v-else>已退款 {{item.refundMoneyShow}} 元</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</mescroll-uni>
	</div>
</template>

<script>
import Modal from '@/components/Modal/index.vue';
import MescrollMixin from '@/components/mescroll-uni/mescroll-mixins.js';
import MescrollBody from '@/components/mescroll-uni/mescroll-body.vue';
import MescrollUni from '@/components/mescroll-uni/mescroll-uni.vue';
import MescrollMoreItemMixin from "@/components/mescroll-uni/mixins/mescroll-more-item.js";
import store from '@/store';
import { counsumpotionList, discountList } from '@/api';
import { mapQuery } from '@/utils/miniLodash';
import { goLink } from '@/utils/link'
export default {
	mixins: [MescrollMixin, MescrollMoreItemMixin], // 使用mixin (在main.js注册全局组件)
	data() {
		return {
			downOption: {
				use: true, // 是否启用下拉刷新; 默认true
				auto: false, // 是否在初始化完毕之后自动执行下拉刷新的回调; 默认true
				native: false, // 是否使用系统自带的下拉刷新; 默认false; 仅mescroll-body生效 (值为true时,还需在pages配置enablePullDownRefresh:true;详请参考mescroll-native的案例)
				autoShowLoading: false, // 如果设置auto=true(在初始化完毕之后自动执行下拉刷新的回调),那么是否显示下拉刷新的进度; 默认false
				isLock: false, // 是否锁定下拉刷新,默认false;
				offset: 80, // 在列表顶部,下拉大于80upx,松手即可触发下拉刷新的回调
				fps: 80, // 下拉节流 (值越大每秒刷新频率越高)
				inOffsetRate: 1, // 在列表顶部,下拉的距离小于offset时,改变下拉区域高度比例;值小于1且越接近0,高度变化越小,表现为越往下越难拉
				outOffsetRate: 0.2, // 在列表顶部,下拉的距离大于offset时,改变下拉区域高度比例;值小于1且越接近0,高度变化越小,表现为越往下越难拉
				bottomOffset: 20, // 当手指touchmove位置在距离body底部20upx范围内的时候结束上拉刷新,避免Webview嵌套导致touchend事件不执行
				minAngle: 45, // 向下滑动最少偏移的角度,取值区间  [0,90];默认45度,即向下滑动的角度大于45度则触发下拉;而小于45度,将不触发下拉,避免与左右滑动的轮播等组件冲突;
				bgColor: 'transparent', // 背景颜色 (建议在pages.json中再设置一下backgroundColorTop)
				textColor: 'gray', // 文本颜色 (当bgColor配置了颜色,而textColor未配置时,则textColor会默认为白色)
				textInOffset: '下拉刷新', // 下拉的距离在offset范围内的提示文本
				textOutOffset: '释放更新', // 下拉的距离大于offset范围的提示文本
				textLoading: '加载中...' // 加载中的提示文本
			},
			upOption: {
				use: true, // 是否启用上拉加载; 默认true
				auto: false, // 是否在初始化完毕之后自动执行上拉加载的回调; 默认true
				isLock: false, // 是否锁定上拉加载,默认false;
				isBoth: true, // 上拉加载时,如果滑动到列表顶部是否可以同时触发下拉刷新;默认true,两者可同时触发;
				isBounce: false, // 默认禁止橡皮筋的回弹效果, 必读事项: http://www.mescroll.com/qa.html?v=190725#q25
				page: {
					num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
					size: 10, // 每页数据的数量
					time: null // 加载第一页数据服务器返回的时间; 防止用户翻页时,后台新增了数据从而导致下一页数据重复;
				},
				noMoreSize: 5, // 如果列表已无数据,可设置列表的总数量要大于等于5条才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看
				offset: 20, // 距底部多远时,触发upCallback
				bgColor: 'transparent', // 背景颜色 (建议在pages.json中再设置一下backgroundColorTop)
				textColor: 'gray', // 文本颜色 (当bgColor配置了颜色,而textColor未配置时,则textColor会默认为白色)
				textLoading: '加载中...', // 加载中的提示文本
				textNoMore: '暂无更多数据', // 没有更多数据的提示文本
				toTop: {
					// 回到顶部按钮,需配置src才显示
					src: '' // 图片路径
				},
				empty: {
					use: true, // 是否显示空布局
					icon: '/static/img/noorders.png', // 图标路径
					tip: '暂时没有账单明细', // 提示
					btnText: '', // 按钮
					fixed: false, // 是否使用fixed定位,默认false; 配置fixed为true,以下的top和zIndex才生效 (transform会使fixed失效,最终会降级为absolute)
					top: '40%', // fixed定位的top值 (完整的单位值,如 "10%"; "100rpx")
					zIndex: 99 // fixed定位z-index值
				},
				onScroll: false // 是否监听滚动事件, 默认false, 仅mescroll-uni生效; mescroll-body直接声明onPageScroll (配置为true时,可@scroll="scroll"获取到滚动条位置和方向; 注意监听列表滚动是非常耗性能的,很容易出现卡顿,非特殊情况不要配置此项)
			},
			list: [], // 账单列表
			isonshow: false // 是否刷新账单
		};
	},
	components: {
		Modal,
		MescrollBody,
		MescrollUni
	},
	computed: {
		wallet() {
			store.state.wallet.amount = parseFloat(store.state.wallet.amount).toFixed(2);
			return store.state.wallet;
		},
		Imgpath() {
			return store.state.Imgpath;
		},
	},
	// #ifdef MP-WEIXIN
	// 微信分享小程序给朋友
	onShareAppMessage() {
		return {
			title: '推荐一个好用的停车工具',
			path: '/pages/index/index'
		};
	},
	// #endif
	methods: {
		isRefound(title){
			if(title.indexOf('-退款') > 0){
				return true
			}else{
				return false
			}
		},
		/*下拉刷新的回调 */
		downCallback() {
			this.mescroll.resetUpScroll();
		},
		/*上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
		async upCallback(page) {
			const { data } = await counsumpotionList({
				pageIndex: page.num,
				istrue: true
			});
			if (data.code == 1) {
				if (data.obj.cousumpotionList.length < 10) {
					this.mescroll.endSuccess(data.obj.cousumpotionList.length, false);
				} else {
					this.mescroll.endSuccess(10, true);
				}
				if (page.num == 1) this.list = []; //如果是第一页需手动制空列表
				var cousumpotionList = data.obj.cousumpotionList.map(item => {
					item.amountShow = (item.amount * 1).toFixed(2);
					item.refundMoneyShow = (item.refundMoney * 1).toFixed(2);
					return item;
				});
				this.list = this.list.concat(cousumpotionList);
			}
		},
		// 去账单详情
		goDetail(item) {
			if (item.payTypes == '临停订单-退款') {
				return
			}
			this.isonshow = true;
			if(!item.refundMoney || this.isRefound(item.payTypes) ){
				goLink( this.$store.state.h5Url, {
					path: '#/pages/billDetails/index',
					token: this.$store.state.token,
					orderId: item.orderId,
					payTypes:item.payTypes,
					pageType:'bill' ,//账单bill or 订单order
				})
			}else{
				goLink( this.$store.state.h5Url, {
					path: '#/pages/billDetails/index',
					token: this.$store.state.token,
					orderId: item.orderId,
					payTypes:item.payTypes + '-退款',
					pageType:'bill' ,//账单bill or 订单order
				})
			}

			// console.log(this.webViewUrl(item))
			// wx.navigateTo({
			// 	url: this.webViewUrl(item)
			// });
			// if (item.payTypes == '帮品消费' || item.payTypes == '餐品消费') {
			// 	wx.navigateTo({
			// 		url: '/personal/wallet/bpdetails/index?ctype=' + item.payTypes + '&code=' + item.orderId
			// 	});
			// } else if (item.payTypes == '提现') {
				
			// 		console.log(1)
			// 	wx.navigateTo({
			// 		url: '/personal/wallet/withdrawdetails/index?payTypes=' + item.payTypes + '&orderId=' + item.orderId
			// 	});
			// } else if (item.payTypes == '停车消费') {
			// 	wx.navigateTo({
			// 		url: '/personal/wallet/parkingdetails/index?payTypes=' + item.payTypes + '&orderId=' + item.orderId
			// 	})
			// } else if (item.payTypes == '道闸停车场消费') {
			// 	wx.navigateTo({
			// 		url: '/personal/wallet/parkingdetails1/index?payTypes=' + item.payTypes + '&orderId=' + item.orderId
			// 	});
			// } else if (item.payTypes == '充值' || item.payTypes == '购买PLUS会员') {
			// 	wx.navigateTo({
			// 		url: '/personal/wallet/rechargedetails/index?payTypes=' + item.payTypes + '&orderId=' + item.orderId
			// 	});
			// } else if (item.payTypes == '租赁订单') {
			// 	wx.navigateTo({
			// 		url: '/personal/wallet/carrentaldetails/index?payTypes=' + item.payTypes + '&orderId=' + item.orderId
			// 	});
			// }
			// else  if (item.payTypes == '加油消费') {
			// 	wx.navigateTo({
			// 		url: '/personal/wallet/addoildetails/index?payTypes=' + item.payTypes + '&orderId=' + item.orderId
			// 	});
			// }else{
			// 	wx.navigateTo({
			// 		url: '/personal/wallet/details/index?payTypes=' + item.payTypes + '&orderId=' + item.orderId
			// 	});
			// }
		},

		//获取账单
		async counsumpotionList() {
			const { data } = await counsumpotionList({
				pageIndex: this.pageIndex,
				istrue: true
			});
			var cousumpotionList = data.obj.cousumpotionList.map(item => {
				item.amount = (item.amount * 1).toFixed(2);
				return item;
			});
			if (data.code == '1') {
				if (cousumpotionList.length) {
					this.list = this.list.concat(cousumpotionList);
				} else {
					this.loadmore = false;
					this.nodata = true;
					setTimeout(() => {
						this.nodata = false;
					}, 1000);
				}
			}
		}
	},
	onLoad() {
		const that = this;
		this.isonshow = false;
	},
	onShow() {
		if (!this.isonshow) {
			store.dispatch('wallet');
			this.pageIndex = 0;
			// this.list = [];
			// this.counsumpotionList();
		}
		this.isonshow = false;
		setTimeout(() => {
			this.mescroll.resetUpScroll();
		}, 500);
	}
};
</script>

<style lang='stylus'>
/* @import '../../styles/color.scss' */
page
  background #fff
.page
  display flex
  flex-direction column
  background #fff
  height 100vh
.header
  height 554rpx
.mescroll
  flex 1
  height 500rpx
.recharge
  width 240rpx
  height 80rpx
  line-height 80rpx
  border:1px solid #ffffff
  border-radius 10rpx
.withdraw
  width 240rpx
  height 80rpx
  line-height 80rpx
  background rgba(255,255,255,0.2)
  border-radius 10rpx
  
.headerTop{
  height 412rpx
  background-image url('~@/assets/walletBck.png')
  background-size 100% 100%
  background-repeat no-repeat
}
.rgb153
  color rgb(153,153,153)
 .rgb175
  color rgb(175,175,175)

.scroll-cantniner
  width 668rpx
  height 100%
  overflow-x hidden

::-webkit-scrollbar
  width 0
  height 0
  color transparent
.iconload 
  animation load 1s ease infinite
@-webkit-keyframes load
  0% {transform:rotate(0)}
  100% {transform:rotate(360deg)}
  
.payMoney
	font-size 28rpx
	font-weight bold
	color #2E2E2E
.payMoneyR
	font-size 28rpx
	font-weight bold
	color #F33535
.payType
	padding-top 10rpx
	font-size 22rpx
	color #B7B7B7
.payTypeR
	font-size 22rpx
	color #F33535

</style>
