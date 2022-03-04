<template>
	<view class="">
		<view id="head">
			<view class="pd40-x"><view class="ft50 ftweight pdt20">优惠券</view></view>
			<view class="fi pd40-x bte">
				<view class="pdt50 " v-for="(item, index) in tittle" :key="index">
					<view class="mgr50 ft20 ftweight pdb16" :class="[item.key == type ? 'bte4_2 rgb243 ft24' : 'rgb153']" @click="handleChange(item, index)">
						{{ item.tittle }}
					</view>
				</view>
			</view>
		</view>
		<swiper :style="{ height: height }" :current="tabIndex" @change="swiperChange">
			<!--可用 -->
			<swiper-item>
				<mescroll-uni ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback" :up="upOption">
					<view class="listcoupon bgw pd20" style="padding:0rpx 80rpx 20rpx 80rpx;">
						<view class="mgt20" v-for="(item, index) in list" :key="index">
							<view class="cardcoupon">
								<view class="fi mg40-x">
									<view class="pdr10 pdt10" v-if="item.logo"><img class="logo" :src="Imgpath + item.logo" /></view>
									<view class="ft22 rgb153 pdt10" v-if="item.logo">{{ item.title }}</view>
									<view class="ft22 rgb153" v-else>{{ item.title }}</view>
								</view>
								<view class="fs ft36 mg40-x" :class="[!item.logo ? 'mgt40' : 'mgt28']">
									<view class="ft36 rgb51">{{ item.distypename }}</view>
									<view class="fi">
										<view class="ft24 main-s">￥</view>
										<view class="ft36 main-s">{{ item.discountNum }}</view>
									</view>
								</view>
								<view class="fs mg40-x mgt55">
									<view class="ft17 rgb51">{{ item.parkintName }}</view>
									<view class="ft17 rgb51">有效期至 {{ item.expiryDate }}</view>
								</view>
							</view>
						</view>
					</view>
				</mescroll-uni>
			</swiper-item>

			<!-- 已用 -->
			<swiper-item><!-- <mescroll-item :i="1" :index="tabIndex" :tabs="tabs"></mescroll-item> --></swiper-item>

			<!-- 已过期 -->
			<swiper-item><!-- <mescroll-item :i="2" :index="tabIndex" :tabs="tabs"></mescroll-item> --></swiper-item>
		</swiper>
		<!-- <div style="width:100%">
			<app-tabs  v-model="tabIndex" :fixed="true" :tabs="tabs" @change="tabChange"></app-tabs>
			
			<mescroll-body top="60rpx" ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback" :up="upOption">
				<view class='listcoupon bgw pd20' style="padding:0rpx 80rpx 20rpx 80rpx;">
					<view class="mgt20"  v-for="(item, index) in list" :key="index" >
						<view class="cardcoupon">
							<view class="fi mg40-x">
								<view class="pdr10 pdt10" v-if="item.logo">
									<img class="logo" :src="Imgpath + item.logo "/>
								</view>
								<view class="ft22 rgb153 pdt10" v-if="item.logo">{{item.title}}</view>
								<view class="ft22 rgb153" v-else>{{item.title}}</view>
							</view>
							<view class="fs ft36 mg40-x" :class="[!item.logo ? 'mgt40' : 'mgt28']">
								<view class="ft36 rgb51">{{item.distypename}}</view>
								<view class="fi">
									<view class="ft24 main-s">￥</view>
									<view class="ft36 main-s">{{item.discountNum}}</view>
								</view>
							</view>
							<view class="fs mg40-x mgt55">
								<view class="ft17 rgb51">{{item.parkintName}}</view>
								<view class="ft17 rgb51">有效期至 {{item.expiryDate}}</view>
							</view>
						</view>
					</view>
				</view>
				</view>
			</mescroll-body>
		</div> -->
	</view>
</template>

<script>
import MescrollMixin from '@/components/mescroll-uni/mescroll-mixins.js';
import MescrollMoreItemMixin from '@/components/mescroll-uni/mixins/mescroll-more-item.js';
// import AppTabs from "@/components/tabs/app-tabs.vue";
import { discountList } from '@/api';
import store from '@/store';
export default {
	mixins: [MescrollMixin, MescrollMoreItemMixin], // 使用mixin (在main.js注册全局组件)
	data() {
		return {
			type: 1,
			list: [], // 数据列表
			tittle: [
				{
					// 菜单列表
					tittle: '可用',
					key: '1'
				},
				{
					tittle: '已用',
					key: '2'
				},
				{
					tittle: '过期',
					key: '3'
				}
			],
			height: '', // swiper高度
			// 下拉刷新
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
				textLoading: '加载中 ...' // 加载中的提示文本
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
				noMoreSize: 7, // 如果列表已无数据,可设置列表的总数量要大于等于5条才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看
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
					icon: '/static/img/nocoupon.png', // 图标路径
					tip: '暂无优惠券', // 提示
					btnText: '', // 按钮
					fixed: false, // 是否使用fixed定位,默认false; 配置fixed为true,以下的top和zIndex才生效 (transform会使fixed失效,最终会降级为absolute)
					top: '40%', // fixed定位的top值 (完整的单位值,如 "10%"; "100rpx")
					zIndex: 99 // fixed定位z-index值
				},
				onScroll: false // 是否监听滚动事件, 默认false, 仅mescroll-uni生效; mescroll-body直接声明onPageScroll (配置为true时,可@scroll="scroll"获取到滚动条位置和方向; 注意监听列表滚动是非常耗性能的,很容易出现卡顿,非特殊情况不要配置此项)
			},
			tabIndex: 0 // tab下标
		};
	},
	computed: {
		Imgpath() {
			return store.state.Imgpath;
		}
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
		/*下拉刷新的回调 */
		downCallback() {
			this.mescroll.resetUpScroll();
		},
		/*上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
		async upCallback(page) {
			//联网加载数据
			if (this.isChangeTab) {
				this.mescroll.hideUpScroll(); // 切换菜单,不显示mescroll进度, 显示系统进度条
				uni.showLoading();
			}
			const { data } = await discountList({
				pageIndex: page.num,
				type: this.type
			});
			if (data.code == '1') {
				if (page.num == 1) this.list = []; //如果是第一页需手动制空列表
				this.list = this.list.concat(data.obj.discountList); //追加新数据
				if (data.obj.discountList.length < 10) {
					this.mescroll.endSuccess(10, false);
				} else {
					this.mescroll.endSuccess(10, true);
				}
			}
		},
		// 切换菜单
		tabChange(i) {
			this.isChangeTab = true;
			this.type = i + 1;
			this.mescroll.resetUpScroll();
		}
	},
	onShow() {
		let that = this;
		const query = uni.createSelectorQuery();
		query
			.select('#head')
			.boundingClientRect(data => {
				var height = data.height;
				this.height = uni.getSystemInfoSync().windowHeight - height + 'px';
			})
			.exec();
		this.mescroll.resetUpScroll();
		if (that.$root.$mp.query.type) {
			that.type = that.$root.$mp.query.type;
			if (that.type == 1) {
				that.status = 'notuse';
			} else if (that.type == 2) {
				that.status = 'alreadyuse';
			} else if (that.type == 3) {
				that.status = 'outdata';
			}
		} else {
			(that.status = 'notuse'), (that.type = 1);
		}
		that.pageIndex = 1;
		// that.discountList()
	}
};
</script>

<style lang="stylus">
page
	background-color #fff
.ft48
	font-size 48rpx
.list
	display flex
	flex-wrap wrap
.listcoupon
	display flex
	flex-wrap wrap
.cardcoupon
	background url('~@/assets/parking_coupons_bg.png')
	width 590rpx
	/* height 220rpx */
	padding-bottom 10rpx
	background-size 100% 100%
	background-repeat no-repeat
.usecoupon
	background url('~@/assets/parking_usecard_bg.png')
	width 590rpx
	/* height 220rpx */
	padding-bottom 10rpx
	background-size 100% 100%
	background-repeat no-repeat
.outcoupon
	background url('~@/assets/parking_outcoupon_bg.png')
	width 590rpx
	/* height 220rpx */
	padding-bottom 10rpx
	background-size 100% 100%
	background-repeat no-repeat
.cardcoupon_a
	float left
	position absolute
	width 430rpx
	margin-top 20rpx
	padding-left 65rpx
	padding-top 15rpx
	padding-bottom 15rpx
.cardcoupon_b
	position absolute
	right 65rpx
	color #f44a3e
	padding-top 40rpx
	width 190rpx
	height 120rpx
	text-align center
.logo
	width 50rpx
	height 36rpx
.rgb204
	color rgb(204, 204, 204)
.rgb187
	color rgb(187, 187, 187)
.rgb154
	color rgb(250, 154, 155)
.rgb153
	color rgb(153, 153, 153)
.rgb51
	color rgb(51, 51, 51)
</style>
