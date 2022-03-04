<!-- 横向滑动的tab 列表 -->
<template>
	<view>
		<scroll-view :scroll-x="true" :scroll-with-animation="false" :style="{ borderColor: tabViewBorderColor }"
		 :scroll-left="scrollLeft" @scroll="scroll" @scrolltoupper="scrolltoupper" @scrolltolower="scrolltolower">
			<view :class="tabbarNum > 5 || tabbarNum == 1? 'scroll-h' : 'scroll-h2'">
				<view v-for="(tab, index) in tabBars" :key="tab.id" class="uni-tab-item" :id="'tabNum' + index" :data-current="index"
				 @click="onTabTap">
					<view class="item" v-if="tab.isShow">
						<image :src="tabIndex == index ? staticImg + 'static/img/'+ tab.icon+'_red.png' :staticImg+  'static/img/'+ tab.icon+'.png'"
						 class="icon"></image>
						<text class="uni-tab-item-title" :class="tabIndex == index ? 'uni-tab-item-title-active' : ''" :style="[tabIndex == index ? { color: tabItemTitleActiveColor, borderColor: tabItemTitleActiveBorderColor } : { color: tabItemTitleColor }]">
							{{ tab.name }}
						</text>
					</view>

				</view>
			</view>
		</scroll-view>
		<view class="wrapContent" v-if="tabbarNum > 5">
			<view class="wrap">
				<!-- <view class="bar" :style="{ left: left + 'rpx' }"></view> -->
				<view :class="classname == 'barLeft' ? 'barLeft bar' : classname == 'barRight' ? 'barRight bar' : ''"></view>
			</view>
		</view>
	</view>
</template>
<script>
	export default {
		name: 'scrollHorizontalTab',
		props: {
			// tab列表
			tabBars: {
				type: Array,
				require: true
			},

			// 默认选中的tab 下标
			tabIndexInit: {
				type: Number,
				default: 0
			},

			// tabItem标题文字默认颜色
			tabItemTitleColor: {
				type: String,
				default: '#24282B'
			},
			// tabItem标题文字默认底边颜色
			tabViewBorderColor: {
				type: String,
				default: '#fff'
			},

			// tabItem标题选中文字颜色
			tabItemTitleActiveColor: {
				type: String,
				default: '#F33535'
			},

			// tabItem标题选中文字底边颜色
			tabItemTitleActiveBorderColor: {
				type: String,
				default: '#fff'
			}
		},
		data() {
			return {
				scrollLeft: 0,
				left: 0,
				classname: 'barLeft',
				tabIndex: this.tabIndexInit
			};
		},
		computed: {
			staticImg() {
				return this.$store.state.staticImg
			},
			tabbarNum() {
				return this.tabBars.length
			}
		},
		watch: {
			tabIndexInit(a) {
				this.tabIndex = a
				this.setScrollLeft(this.tabIndex);
			}
		},
		mounted() {

		},
		methods: {
			async setScrollLeft(tabIndex) {
				let leftWidthSum = 0;
				for (var i = 0; i <= tabIndex; i++) {
					let nowElement = await this.getWidth('tabNum' + i);
					leftWidthSum = leftWidthSum + nowElement.width;
				}
				let winWidth = uni.getSystemInfoSync().windowWidth;
				this.scrollLeft = leftWidthSum > winWidth ? (leftWidthSum - winWidth) : 0
			},
			getWidth(id) { //得到元素的宽高
				return new Promise((res, rej) => {
					const query = uni.createSelectorQuery().in(this)
					query.select("#" + id).boundingClientRect(function(data) {
						res(data);
					}).exec()
				})
			},
			onTabTap(e) {
				let index = e.target.dataset.current || e.currentTarget.dataset.current;
				if (this.tabIndex != index) {
					this.tabIndex = index;
					this.$emit('onTabTap', index);
				}
			},
			scroll(e) {
				// this.left = e.detail.scrollLeft * (200 - 100) / (e.detail.scrollWidth - 375)
			},

			scrolltoupper() {
				this.classname = 'barLeft' // 最左边
			},

			scrolltolower() {
				this.classname = 'barRight'
			},

		}
	};
</script>

<style scoped lang="stylus">
	/* 隐藏滚动条，但依旧具备可以滚动的功能 */
	scroll-view ::-webkit-scrollbar {
		width: 0;
		height: 0;
		background-color: transparent;
	}

	.scroll-h {
		display: flex;
		flex-direction: row;
		white-space: nowrap;

		.uni-tab-item-title {
			color: #555;
			font-size: 24rpx;
			padding: 20rpx 40rpx;
		}
	}

	.scroll-h2 {
		display: flex;
		justify-content: space-around;
		flex-direction: row;
		white-space: nowrap;

		.uni-tab-item-title {
			color: #555;
			font-size: 24rpx;
			padding: 20rpx 0;
		}
	}

	.uni-tab-item {
		/* width: 200upx; */
		display: inline-block;
		flex-wrap: nowrap;
	}

	.item {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.icon {
		width: 56rpx;
		height: 56rpx;
	}


	.uni-tab-item-title-active {
		color: #007aff;
		font-size: 24rpx;
		border-color: #007aff;
		border-bottom-style: solid;
		/* font-weight: bold; */
		border-bottom-width: 2rpx;
	}

	.wrapContent {
		padding: 20rpx 0;
	}

	.wrap {
		width: 200rpx;
		height: 10rpx;
		position: relative;
		background: rgba(0, 0, 0, 0.1);
		border-radius: 20rpx;
		margin: 0 auto;
	}

	.bar {
		width: 100rpx;
		height: 10rpx;
		position: absolute;
		background-color: rgba(0, 0, 0, 0.2);
		border-radius: 20rpx;

		&.barLeft {
			left: 0;
		}

		&.barRight {
			right: 0;
		}
	}
</style>
