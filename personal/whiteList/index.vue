<template>
	<div style="width:100%">
		<!-- 头部 -->
		<div class="title pdl40 pdt60 pdb80"><div class="ft50 ftweight rgb51">白名单</div></div>
		<!-- 		<mescroll-uni  
			top="226"  
			ref="mescrollRef" 
			@init="mescrollInit" 
			@down="downCallback" 
			@up="upCallback" 
			:up="upOption"> -->
		<view :class="['box mgt40 mg40-x', {'overdue' : item.isValid != '可用'}]" v-if="list.length" v-for="(item, index) in list" :key="index">
			<view class="fs mgb20">
				<view class="parkingName rgb27 ft32 ftweight">{{ item.parkingName }}</view>
				<view :class="['ft28 ftweight status', {'rgb243' : item.isValid == '可用'}]">{{ item.isValid }}</view>
			</view>
			<div class="mgb20 ft24 rgb74 pdl30 address">{{ item.address }}</div>
			<view class="fs">
				<view class="carNum rgb27 ft24 ftweight">{{ item.plateNum }}</view>
				<view class="time rgb74 ft24">{{ item.startTime }} - {{ item.endTime }}</view>
			</view>
		</view>
		<view v-if="!list.length">
			<view class="fcy">
				<image :src="staticImg + 'static/img/nobank.png'" class="img"></image>
				<view class="ft28 rgb51">没有白名单数据</view>
			</view>
		</view>
		<!-- </mescroll-uni> -->
	</div>
</template>

<script>
import MescrollMixin from '@/components/mescroll-uni/mescroll-mixins.js';
import MescrollUni from '@/components/mescroll-uni/mescroll-uni.vue';
import { getBgWhiteListByUser } from '@/api';
import store from '@/store';
export default {
	mixins: [MescrollMixin], // 使用mixin (在main.js注册全局组件)
	components: {
		MescrollUni
	},
	data() {
		return {
			list: [], // 数据列表
			upOption: {
				use: true, // 是否启用上拉加载; 默认true
				auto: true, // 是否在初始化完毕之后自动执行上拉加载的回调; 默认true
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
			}
		};
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
	computed: {
		Imgpath() {
			return store.state.Imgpath;
		},
		staticImg() { return this.$store.state.staticImg } ,
	},
	methods: {
		/*下拉刷新的回调 */
		downCallback() {
			this.mescroll.resetUpScroll();
		},
		/*上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
		async upCallback(page) {
			//联网加载数据
			const { data } = await getBgWhiteListByUser();
			if (data.code == '1') {
				if (page.num == 1) this.list = []; //如果是第一页需手动制空列表
				this.list = this.list.concat(data.obj.whiteList); //追加新数据
				if (data.obj.whiteList.length < 10) {
					this.mescroll.endSuccess(10, false);
				} else {
					this.mescroll.endSuccess(10, true);
				}
			}
		},
		async getBgWhiteListByUser() {
			const { data } = await getBgWhiteListByUser();
			if (data.code == '1') {
				// if(page.num == 1) this.list = []; //如果是第一页需手动制空列表
				// this.list=this.list.concat(data.obj.whiteList); //追加新数据
				// if(data.obj.whiteList.length<10){
				// 	this.mescroll.endSuccess(10,false);
				// } else {
				// 	this.mescroll.endSuccess(10,true);
				// }
				this.list = data.obj.whiteList;
				this.list.forEach(item => {
					item.startTime = item.startTime.replace(/-/g, '.');
					item.endTime = item.endTime.replace(/-/g, '.');
				});

				// this.list.startTime = data.obj.whiteList.startTime.replace(/-/g,".")
			}
		}
	},
	onShow() {
		let that = this;
		this.getBgWhiteListByUser();
	}
};
</script>

<style lang="stylus">
	
page
	background rgba(246, 248, 251, 1)
.title
	background #FFFFFF
	/* box-shadow 0 0 20rpx 0 rgba(27,25,33,0.2) */
.box
	background #FFFFFF
	border-radius 32rpx
	padding 20rpx 40rpx
.parkingName
	color rgba(26, 25, 33, 1)
.status
	color rgba(243, 53, 53, 1)
.address
	// background url('../../static/img/orderIconAddress.png') no-repeat
	background-size 20rpx 22rpx
	background-position left center
	color rgba(74, 83, 97, 1)
.carNum
	color rgba(27, 26, 34, 1)
.time
	color rgba(74, 83, 97, 1)
.overdue .parkingName, .overdue .status, .overdue .address, .overdue .carNum, .overdue .time
	color rgba(74, 83, 97, 0.5) !important
	opacity 0.5
.img
	margin-top 300rpx
	margin-bottom 50rpx
	width 323rpx
	height 178rpx
</style>
