<template>
	<swiper id="swiper" :previous-margin="leftMargin" :next-margin="rightMargin" display-multiple-items="4" @change="handleChange" @transition="transition">
		<block :data-i="index" v-for="item in clubs" :key="item">
			<swiper-item class="swiper-item" :class="index == 0 ? 'aaa' : ''">
				<image
					:src="item.cardimg"
					class="slide-image"
					:class="[currentIndex + 2 == index ? 'active' : '', currentIndex + 1 == index || currentIndex + 3 == index ? 'set_active' : '']"
				/>
				<!-- <image :src="item.cardimg" class="slide-image" :class="[currentIndex == index ? 'active': '']"/> -->
			</swiper-item>
		</block>
	</swiper>
	<!--<swiper :interval="interval"  :previous-margin="leftMargin" :next-margin="rightMargin" display-multiple-items="4" @change="handleChange">
    <block v-for="item in clubs" :key="item">
      <swiper-item class="swiper-item" >
        <image :src="item.cardimg" class="slide-image" :class="[currentIndex+1 == index ? 'active': '']"/>
         <image :src="item.cardimg" class="slide-image" :class="[currentIndex == index ? 'active': '']"/> 
      </swiper-item>
    </block>
  </swiper>-->
</template>

<script>
import store from '@/store';
import { vipCard, getAllVipCodeByUser } from '@/api';
export default {
	data() {
		return {
			pageIndex: 1,
			clubs: [],
			duration: 2000,
			circular: true,
			leftMargin: '0rpx',
			rightMargin: '0rpx',
			currentIndex: 0,
			img0left: 0
		};
	},
	onShow() {
		this.vipCards();
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
		async vipCards() {
			const { data } = await getAllVipCodeByUser({});
			console.log(data);
			if (data.code == '1') {
				var arr = data.obj.vipIssueRecords;
				arr.unshift({}, {});
				arr.push({});
				console.log(arr);
				this.clubs = data.obj.vipIssueRecords;
			}
		},
		handleChange(e) {
			// this.currentIndex = e.mp.detail.current
		},
		transition(e) {
			// console.log(e)
			var that = this;
			const query = wx.createSelectorQuery();
			query
				.select('.aaa')
				.boundingClientRect(function(res) {
					that.img0left = res.left; // 节点的水平滚动位置
				})
				.exec();
			if (that.img0left > -40 && that.img0left < 0) {
				that.currentIndex = 0;
			} else if (that.img0left > -130 && that.img0left < -40) {
				that.currentIndex = 1;
			} else if (that.img0left > -220 && that.img0left < -130) {
				that.currentIndex = 2;
			} else if (that.img0left > -310 && that.img0left < -220) {
				that.currentIndex = 3;
			} else if (that.img0left > -400 && that.img0left < -310) {
				that.currentIndex = 4;
			} else if (that.img0left > -490 && that.img0left < -400) {
				that.currentIndex = 5;
			} else if (that.img0left > -580 && that.img0left < -490) {
				that.currentIndex = 6;
			} else if (that.img0left > -670 && that.img0left < -580) {
				that.currentIndex = 7;
			} else if (that.img0left > -750 && that.img0left < -670) {
				that.currentIndex = 8;
			} else if (that.img0left > -840 && that.img0left < -750) {
				that.currentIndex = 9;
			} else if (that.img0left > -930 && that.img0left < -840) {
				that.currentIndex = 10;
			}
		}
	}
};
</script>

<style lang="stylus">
.slide-image
	position absolute
	height 220rpx
	width 440rpx
	opacity 0.7
	top 210rpx
	left -200rpx
	transform scale(0.9) rotate(90deg)
	border-radius 30rpx
swiper
	height 500rpx
	width 750rpx
	position fixed
	bottom -20rpx
swiper-item
	// top:50rpx;
	overflow visible !important
.active
	transform scale(1.2) rotate(90deg)
	opacity 1
	// z-index: 10;
	// height: 230rpx;
	// width: 440rpx;
	// top: 20%;
	transition all 0.2s ease-in 0s
.set_active
	transform scale(1) rotate(90deg)
	transition all 0.2s ease-in 0s
	// opacity: 0.8;
	// width : 400rpx;
	// height:190rpx;
</style>
