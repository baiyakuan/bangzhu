<template>
	<div>
		<div class="mg40-x mgt100" v-for="(item, index) in vipCards" :key="index">
			<div class="bg pr" style="position:relative;" v-if="index == current">
				<img class="show_img pa" style="position:absolute;" :src="baseUrl + '/file/downloadImg?path=' + item.card_show_img" />
				<div class="ft50 bg pd40-x show_box" style="position:absolute;">
					<div class="mgt80 mgl120 ft24 white-t">{{ item.validDate }}到期</div>
					<div class="mgt20 fi">
						<div class="ft30 white-t">{{ item.cardname }}</div>
					</div>
					<div class="mgt110 tac ft30 white-t discountBtn">消费{{ item.discount_num }}</div>
				</div>
			</div>
			<div class="mgt120" v-if="index == current">
				<div class="tac ft36 ftweight mgt40">权益说明</div>
				<div class="tac ft28 mgt30">{{ item.explains }}</div>
			</div>
		</div>
		<!-- <scroll-view class="scrollbox" scroll-x>
      <div class="imgbox pr mgl20" v-for="item in vipCards" :key="item" @click="currentImg(item,index)">
        <img v-if="item.card_show_img" class="img pa" :src="baseUrl+'/file/downloadImg?path=' + item.card_show_img" alt="">
        <img v-else class="img pa" :src="item.show_img" alt="">
        <div v-if="item.discount_num" class="pa footer_box white-t pdr40">
          <div class="ft20 mgt20">{{item.cardname}}</div>
          <div class="ft14 mgt10">{{item.validDate}}到期</div>
          <div class="ft20 mgt15 discount_box fright tac mgr70">{{item.discount_num}}</div>
        </div>
      </div>
    </scroll-view> -->
	</div>
</template>

<script>
import store from '@/store';
import { vipCard, getAllVipCodeByUser } from '@/api';
export default {
	data() {
		return {
			vipCards: [], // 联名卡列表
			current: 0 // 当前显示的卡片
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
		baseUrl() {
			return store.state.BASE_URL;
		},
		staticImg() { return store.state.staticImg },
	},
	methods: {
		async getAllVipCodeByUser() {
			var that = this;
			const { data } = await getAllVipCodeByUser({});
			console.log(data);
			if (data.code == '1') {
				var cards = data.obj.vipIssueRecords.map(item => {
					var str = `${item.discount_num}`;
					return {
						...item,
						discount_num: `${str.substring(0, 1)}.${str.substring(1, str.length)}折`
					};
				});

				if (data.obj.vipIssueRecords.length == 1) {
					cards.push(
						{ show_img: that.staticImg + 'static/img/card_red.png' },
						{ show_img: that.staticImg + 'static/img/card_blue.png' },
						{ show_img: that.staticImg + 'static/img/card_green.png' },
						{ show_img: that.staticImg + 'static/img/card_lightgreen.png' }
					);
				} else if (data.obj.vipIssueRecords.length == 2) {
					cards.push({ show_img: that.staticImg + 'static/img/card_red.png' }, { show_img: that.staticImg + 'static/img/card_blue.png' }, { show_img: that.staticImg + 'static/img/card_green.png' });
				} else if (data.obj.vipIssueRecords.length == 3) {
					cards.push({ show_img: that.staticImg + 'static/img/card_red.png' }, { show_img: that.staticImg + 'static/img/card_blue.png' });
				} else if (data.obj.vipIssueRecords.length == 4) {
					cards.push({ show_img: that.staticImg + 'static/img/card_red.png' });
				}
				that.vipCards = cards;
			}
		},
		currentImg(item, i) {
			var that = this;
			if (item.card_show_img) {
				that.current = i;
			} else {
				return;
			}
		}
	},
	onLoad() {
		this.getAllVipCodeByUser();
	}
};
</script>

<style lang="stylus">
.bg
	width 670rpx
	height 360rpx
.show_img
	transform rotate(90deg)
	width 360rpx
	height 670rpx
	top -135rpx
	left 156rpx
.show_box
	box-sizing border-box
.scrollbox
	height 300rpx
	// width 750rpx
	white-space nowrap
	position fixed
	bottom 0rpx
.imgbox
	width 150rpx
	height 300rpx
	display inline-block
.img
	// width 100%
	height 280rpx
	width 150rpx
	top 20rpx
	box-shadow 8rpx -4rpx 10rpx #ccc
	// height 150rpx
	// transform rotate(270deg)
	// top 65rpx
	// left -65rpx
.discountBtn
	border 1px solid #fff
	border-radius 60rpx
	width 200rpx
	height 60rpx
	line-height 60rpx
.footer_box
	width 280rpx
	height 150rpx
	top 85rpx
	left -65rpx
	transform rotate(270deg)
	text-align right
.discount_box
	width 80rpx
	border 1px solid #ffffff
	border-radius 30rpx
</style>
