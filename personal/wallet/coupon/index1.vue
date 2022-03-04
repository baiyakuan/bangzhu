<template>
	<div>
		<div class="pd40-x bgw"><div class="ft50 ftweight pdt20">优惠券</div></div>
		<div class="fi pd40-x bgw">
			<div class="pdt50 " v-for="(item, index) in tittle" :key="index">
				<div class="mgr50 ft28 pdb16" :class="[item.key == type ? 'bte2 rgb243 ftweight' : 'rgb153']" @click="handleChange(item, index)">{{ item.tittle }}</div>
			</div>
		</div>
		<!-- 可使用优惠券 -->
		<div class="listcoupon pd20" v-if="type == 1" style="padding:0rpx 80rpx 20rpx 80rpx;">
			<div class="no_data" style="width:100%;text-align:center; margin-top:400rpx" v-if="list.length == 0">
				<img :src="staticImg + 'static/img/noCoupons.png'" style="width:300rpx;height:160rpx" />
				<p class="pdt50 rgb74 ft28">暂无可用优惠券</p>
			</div>
			<div class="" v-for="(item, index) in list" :key="index">
				<!-- <div v-if="list.length!=0" class=" mgt50" :class="item.isSpecial==1?'cardcouponPlus':'cardcoupon'"> -->
				<div v-if="list.length != 0" class="mgt50" :class="item.title == 'PLUS会员专享' ? 'cardcouponPlus' : 'cardcoupon'">
					<div class="fi mg40-x">
						<div class="pdr10 pdt10" v-if="item.logo"><img class="logo" :src="Imgpath + item.logo" /></div>
						<div class="ft20 rgb153 pdt10" v-if="item.logo">{{ item.title }}</div>
						<div class="ft20 rgb153 pdt10" v-else>{{ item.title }}</div>
					</div>
					<div class="fs ft36 mg40-x" :class="[!item.logo ? 'mgt40' : 'mgt28']">
						<div class="ft34 rgb27 ftweight">{{ item.distypename }}</div>
						<div class="fi" v-if="item.type == 2 && item.discountType == 2">
							<!-- <div class="ft24" :class="item.isSpecial==1?'gold-word':'main-s'">￥</div>
						  <div class="ft36" :class="item.isSpecial==1?'gold-word':'main-s'">{{item.discountNum}}</div> -->
							<div class="ft42 ftweight rgb243">{{ item.discountNum }}</div>
							<div class="ft24 rgb243 mgl10">h</div>
						</div>
						<div class="fi" v-else>
							<!-- <div class="ft24" :class="item.isSpecial==1?'gold-word':'main-s'">￥</div>
              <div class="ft36" :class="item.isSpecial==1?'gold-word':'main-s'">{{item.discountNum}}</div> -->
							<div class="ft24" :class="item.title == 'PLUS会员专享' ? 'gold-word' : 'rgb243'">￥</div>
							<div class="ft42 ftweight" :class="item.title == 'PLUS会员专享' ? 'gold-word' : 'rgb243'">{{ item.discountNum }}</div>
						</div>
					</div>
					<div class="fs mg40-x mgt55">
						<div class="ft17 rgb51">{{ item.parkintName }}</div>
						<div class="ft17 rgb51">有效期至 {{ item.expiryDate }}</div>
					</div>
				</div>
			</div>
		</div>
		<!-- 已使用优惠券 -->
		<div class="listcoupon pd20" v-if="type == 2" style="padding:0rpx 80rpx 20rpx 80rpx;">
			<div class="no_data" style="width:100%;text-align:center; margin-top:400rpx" v-if="list.length == 0">
				<img :src="staticImg + 'static/img/noCoupons.png'" style="width:300rpx;height:160rpx" />
				<p class="pdt50 rgb74 ft28">暂无已用优惠券</p>
			</div>
			<div class="" v-for="(item, index) in list" :key="index">
				<div v-if="list.length != 0" class="mgt50 usecoupon" :class="item.title == 'PLUS会员专享' ? 'cardcouponPlus' : 'cardcoupon'">
					<div class="fi mg40-x">
						<div class="pdr10 pdt10" v-if="item.logo"><img class="logo" :src="Imgpath + item.logo" /></div>
						<div class="ft22 rgb204 pdt10" v-if="item.logo">{{ item.title }}</div>
						<div class="ft22 rgb204 pdt10" v-else>{{ item.title }}</div>
					</div>
					<div class="fs ft36 mg40-x" :class="[!item.logo ? 'mgt40' : 'mgt28']">
						<div class="ft36 rgb187">{{ item.distypename }}</div>
						<div class="fi" v-if="item.type == 2 && item.discountType == 2">
							<!-- <div class="ft24" :class="item.isSpecial==1?'gold-word':'main-s'">￥</div>
						  <div class="ft36" :class="item.isSpecial==1?'gold-word':'main-s'">{{item.discountNum}}</div> -->
							<div class="ft42 ftweight rgb243">{{ item.discountNum }}</div>
							<div class="ft24 rgb243 mgl10">h</div>
						</div>
						<div class="fi" v-else>
							<!-- <div class="ft24" :class="item.isSpecial==1?'gold-word':'main-s'">￥</div>
						  <div class="ft36" :class="item.isSpecial==1?'gold-word':'main-s'">{{item.discountNum}}</div> -->
							<div class="ft24" :class="item.title == 'PLUS会员专享' ? 'gold-word' : 'rgb243'">￥</div>
							<div class="ft42 ftweight" :class="item.title == 'PLUS会员专享' ? 'gold-word' : 'rgb243'">{{ item.discountNum }}</div>
						</div>
					</div>
					<div class="fs mg40-x mgt55">
						<div class="ft17 rgb187">{{ item.parkintName }}</div>
						<div class="ft17 rgb187">有效期至 {{ item.expiryDate }}</div>
					</div>
				</div>
			</div>
		</div>
		<!-- 已过期优惠券 -->
		<div class="listcoupon pd20" v-if="type == 3" style="padding:0rpx 80rpx 20rpx 80rpx;">
			<div class="no_data" style="width:100%;text-align:center; margin-top:400rpx" v-if="list.length == 0">
				<img :src="staticImg + 'static/img/noCoupons.png'" style="width:300rpx;height:160rpx" />
				<p class="pdt50 rgb74 ft28">暂无过期优惠券</p>
			</div>
			<div class="" v-for="(item, index) in list" :key="index">
				<div v-if="list.length != 0" class="outcoupon mgt50" :class="item.title == 'PLUS会员专享' ? 'cardcouponPlus' : 'cardcoupon'">
					<div class="fi mg40-x">
						<div class="pdr10 pdt10" v-if="item.logo"><img class="logo" :src="Imgpath + item.logo" /></div>
						<div class="ft22 rgb204 pdt10" v-if="item.logo">{{ item.title }}</div>
						<div class="ft22 rgb204 pdt10" v-else>{{ item.title }}</div>
					</div>
					<div class="fs ft36 mg40-x" :class="[!item.logo ? 'mgt40' : 'mgt28']">
						<div class="ft36 rgb187">{{ item.distypename }}</div>
						<div class="fi" v-if="item.type == 2 && item.discountType == 2">
							<!-- <div class="ft24" :class="item.isSpecial==1?'gold-word':'main-s'">￥</div>
						  <div class="ft36" :class="item.isSpecial==1?'gold-word':'main-s'">{{item.discountNum}}</div> -->
							<div class="ft42 ftweight rgb243">{{ item.discountNum }}</div>
							<div class="ft24 rgb243 mgl10">h</div>
						</div>
						<div class="fi" v-else>
							<!-- <div class="ft24" :class="item.isSpecial==1?'gold-word':'main-s'">￥</div>
						  <div class="ft36" :class="item.isSpecial==1?'gold-word':'main-s'">{{item.discountNum}}</div> -->
							<div class="ft24" :class="item.title == 'PLUS会员专享' ? 'gold-word' : 'rgb243'">￥</div>
							<div class="ft42 ftweight" :class="item.title == 'PLUS会员专享' ? 'gold-word' : 'rgb243'">{{ item.discountNum }}</div>
						</div>
					</div>
					<div class="fs mg40-x mgt55">
						<div class="ft17 rgb187">{{ item.parkintName }}</div>
						<div class="ft17 rgb187">有效期至 {{ item.expiryDate }}</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { discountList } from '@/api';
import store from '@/store';
export default {
	data() {
		return {
			list: [],
			status: 'outdata',
			pageIndex: 1,
			tittle: [
				{
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
			type: '1'
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
	async onPullDownRefresh() {
		// to doing..
		// 停止下拉刷新
		this.loadremove();
		wx.stopPullDownRefresh();
	},

	// 上拉加载，拉到底部触发
	async onReachBottom() {
		// 到这底部在这里需要做什么事情
		this.loadmore();
	},
	computed: {
		Imgpath() {
			return store.state.Imgpath;
		},
		staticImg() { return this.$store.state.staticImg } ,
	},
	methods: {
		//上拉加载
		async loadmore() {
			//账单加载
			this.pageIndex += 1;
			const { data } = await discountList({
				pageIndex: this.pageIndex,
				type: this.type,
				couponType:1
			});
			if (data.code == '1') {
				for (var i = 0; i < data.obj.discountList.length; i++) {
					this.list.push(data.obj.discountList[i]);
				}
			}
		},
		//下拉刷新事件
		async loadremove() {
			//账单下拉刷新
			this.pageIndex = 1;
			this.list = [];
			const { data } = await discountList({
				pageIndex: this.pageIndex,
				type: this.type,
				couponType:1
			});
			if (data.code == '1') {
				this.list = data.obj.discountList;
			}
		},
		async discountList() {
			const { data } = await discountList({
				pageIndex: this.pageIndex,
				type: this.type,
				couponType:1
			});
			if (data.code == '1') {
				this.list = data.obj.discountList;
			}
		},
		handleChange(item, index) {
			this.type = item.key;
			this.pageIndex = 1;
			this.discountList();
		}
	},
	onShow() {
		this.discountList();
	}
};
</script>

<style lang="stylus">
.ft48
	font-size 48rpx
.list
	display flex
	flex-wrap wrap
.listcoupon
	display flex
	flex-wrap wrap
.cardcouponPlus
	background url('~@/assets/parking_couponsPlus_bg.png')
	width 590rpx
	/* height 220rpx */
	padding-bottom 10rpx
	background-size 100% 100%
	background-repeat no-repeat
.cardcoupon
	background url('~@/assets/parking_coupons_bg.png')
	width 590rpx
	/* height 220rpx */
	padding-bottom 10rpx
	background-size 100% 100%
	background-repeat no-repeat
.usecoupon
	opacity 0.6
	/* background url('~@/assets/parking_usecard_bg.png')
	width 590rpx
	height 220rpx
	background-size contain
	background-repeat no-repeat */
.outcoupon
	opacity 0.6
	/* background url('~@/assets/parking_outcoupon_bg.png')
	width 590rpx
	height 220rpx
	background-size contain
	background-repeat no-repeat */
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
.bte2
	border-bottom: 2rpx solid #f33535;
</style>
