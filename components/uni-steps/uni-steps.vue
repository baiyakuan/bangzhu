<template>
	<view class="uni-steps">
		<view :class="[direction==='column'?'uni-steps__column':'uni-steps__row']">
			
			
			<!-- 文字 -->
			<view :class="[direction==='column'?'uni-steps__column-text-container':'uni-steps__row-text-container']">
				<view v-for="(item,index) in options" :key="index" :class="[direction==='column'?index==active?index==options.length -1 ?'uni-steps__column-text3':'uni-steps__column-text2':index==options.length -1?'uni-steps__column-text4':'uni-steps__column-text':'uni-steps__row-text']">
					<text 
					:style="{color:index==active?activeColor:deactiveColor}" 
					:class="[direction==='column'?'uni-steps__column-title':'uni-steps__row-title',
					index==active?'ftweight':''
					]">{{item.title}}</text>
					<text 
					:style="{color:index==active?activeColor:deactiveColor}" 
					:class="[direction==='column'?'uni-steps__column-desc':'uni-steps__row-desc']">{{item.desc}}</text>
				</view>
			</view>
			
			
			<!-- 圆点 -->
			<view :class="[direction==='column'?'uni-steps__column-container':'uni-steps__row-container']">
				<view :class="[direction==='column'?'uni-steps__column-line-item':'uni-steps__row-line-item']" v-for="(item,index) in options"
				 :key="index">
				 
					<view :class="[direction==='column'?'uni-steps__column-line':'uni-steps__row-line',direction==='column'?'uni-steps__column-line--before':'uni-steps__row-line--before']"
					 :style="{backgroundColor:index<=active&&index!==0?cicleActiveColor:index===0?'transparent':cicleDeactiveColor}">
					 </view>
					 
					<view :class="[direction==='column'?'uni-steps__column-check':'uni-steps__row-check']" 
					class="iconSuccess"
					style="width: 70rpx;height: 70rpx;"
					v-if="index === active">
						<image :src="iconSrc" style="width: 70rpx;height: 70rpx;" mode=""></image>
						<!-- <uni-icons :color="cicleActiveColor" type="checkbox-filled" size="14"></uni-icons> -->
					</view>
					
					<view :class="[direction==='column'?'uni-steps__column-circle':'uni-steps__row-circle']" v-else :style="{backgroundColor:index<active?cicleActiveColor:cicleDeactiveColor}"></view>
					
					<view :class="[direction==='column'?'uni-steps__column-line':'uni-steps__row-line',direction==='column'?'uni-steps__column-line--after':'uni-steps__row-line--after']"
					 :style="{backgroundColor:index<active&&index!==options.length-1?cicleActiveColor:index===options.length-1?'transparent':cicleDeactiveColor}">
					 </view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import uniIcons from '../uni-icons/uni-icons.vue'
	export default {
		name: 'UniSteps',
		components: {
			uniIcons
		},
		props: {
			direction: {
				// 排列方向 row column
				type: String,
				default: 'row'
			},
			activeColor: {
				// 激活状态颜色
				type: String,
				default: '#333333'
			},
			deactiveColor: {
				// 未激活状态颜色
				type: String,
				default: '#777777'
			},
			cicleActiveColor: {
				// 激活状态颜色
				type: String,
				default: '#F33535'
			},
			cicleDeactiveColor: {
				// 未激活状态颜色
				type: String,
				default: '#AAAAAA'
			},
			active: {
				// 当前步骤
				type: Number,
				default: 0
			},
			options: {
				type: Array,
				default () {
					return []
				}
			}, // 数据
			iconSrc:{
				type: String,
			}
		},
		data() {
			return {}
		},
		onShow(){
			console.log(this.active)
		}
	}
</script>

<style lang="scss" scoped>
	.uni-steps {
		/* #ifndef APP-NVUE */
		display: flex;
		width: 100%;
		/* #endif */
		/* #ifdef APP-NVUE */
		flex: 1;
		/* #endif */
		flex-direction: column;
		align-items: center;
	}

	.uni-steps__row {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
	}

	.uni-steps__column {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row-reverse;
	}

	.uni-steps__row-text-container {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
	}

	.uni-steps__column-text-container {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		flex: 1;
	}

	.uni-steps__row-text {
		/* #ifndef APP-NVUE */
		display: inline-flex;
		/* #endif */
		flex: 1;
		flex-direction: column;
	}

	.uni-steps__column-text {
		padding: 10rpx 0px 70rpx 60rpx;
		// border-bottom-style: solid;
		// border-bottom-width: 1px;
		// border-bottom-color: $uni-border-color;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
	}
	.uni-steps__column-text2 {
		padding: 40rpx 0px 70rpx 60rpx;
		// border-bottom-style: solid;
		// border-bottom-width: 1px;
		// border-bottom-color: $uni-border-color;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
	}
	.uni-steps__column-text3 {
		padding: 40rpx 0px 50rpx 60rpx;
		// border-bottom-style: solid;
		// border-bottom-width: 1px;
		// border-bottom-color: $uni-border-color;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
	}
	.uni-steps__column-text4 {
		padding: 0rpx 0px 100rpx 60rpx;
		// border-bottom-style: solid;
		// border-bottom-width: 1px;
		// border-bottom-color: $uni-border-color;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
	}

	.uni-steps__row-title {
		font-size: $uni-font-size-base;
		line-height: 16px;
		text-align: center;
	}

	.uni-steps__column-title {
		font-size: 30rpx;
		text-align: left;
		line-height: 18px;
	}

	.uni-steps__row-desc {
		font-size: 12px;
		line-height: 14px;
		text-align: center;
	}

	.uni-steps__column-desc {
		font-size: $uni-font-size-sm;
		text-align: left;
		line-height: 18px;
	}

	.uni-steps__row-container {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
	}

	.uni-steps__column-container {
		/* #ifndef APP-NVUE */
		display: inline-flex;
		/* #endif */
		width: 30px;
		flex-direction: column;
	}

	.uni-steps__row-line-item {
		/* #ifndef APP-NVUE */
		display: inline-flex;
		/* #endif */
		flex-direction: row;
		flex: 1;
		height: 14px;
		line-height: 14px;
		align-items: center;
		justify-content: center;
	}

	.uni-steps__column-line-item {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		flex: 1;
		align-items: center;
		justify-content: center;
	}

	.uni-steps__row-line {
		flex: 1;
		height: 1px;
		background-color: $uni-text-color-grey;
	}

	.uni-steps__column-line {
		width: 1px;
		background-color: $uni-text-color-grey;
	}

	.uni-steps__row-line--after {
		transform: translateX(1px);
	}

	.uni-steps__column-line--after {
		flex: 1;
		transform: translate(0px, 1px);
	}

	.uni-steps__row-line--before {
		transform: translateX(-1px);
	}

	.uni-steps__column-line--before {
		height: 6px;
		transform: translate(0px, -1px);
	}

	.uni-steps__row-circle {
		width: 30rpx;
		height: 30rpx;
		border-radius: 100%;
		background-color: $uni-text-color-grey;
		margin: 0px 3px;
	}

	.uni-steps__column-circle {
		width: 30rpx;
		height: 30rpx;
		border-radius: 100%;
		background-color: $uni-text-color-grey;
		// margin: 4px 0px 5px 0px;
	}

	.uni-steps__row-check {
		margin: 0px 6px;
	}

	.uni-steps__column-check {
		height: 14px;
		line-height: 14px;
		margin: 2px 0px;
	}
	.ftweight{
		font-weight: bold;
	}
	.iconSuccess{
		// background: '@/static/img/withdrawSuccess.png';
	}
</style>
