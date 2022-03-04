<template>
	<view>
		<view class="box fs">
			<view class="fst left">
				<view class="image1">
					<image :src="Imgpath + station.imgPath"></image>
				</view>
				<view class="fcy text">
					<view class="ft30 ftweight title">
						{{station.stationName}}
					</view>
					<view class="ft22 address">
						{{station.stationAddress}}
					</view>
					<view class="fst price">
						<view class="ft22 ftweight mgr40">￥{{station.bzMoney}}/L</view>
						<view class="ft20 lineThrough fst">油站价￥{{station.gasPrice}}/L</view>
					</view>
				</view>
			</view>
			<view class="fcy right">
				<view class="distance">
					{{excuteFormatDistance(station.distance)}}
				</view>
				<view class="nav" @click="nav">
					<image :src="staticImg + 'static/img/parking-09.png'" class="image2"></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		formatDistance
	} from '@/utils'
	import store from '@/store'
	import {
		mapState,
		mapActions,
		mapMutations,
		mapGetters
	} from 'vuex'
	export default {
		props: {
			station: {
				type: Object
			}
		},
		computed: {
			...mapState('addOilModule', ['nearStation', 'stationList', 'gasList']),
			Imgpath() {
				return store.state.Imgpath
			},
			staticImg() {
				return store.state.staticImg
			},
		},
		methods: {
			excuteFormatDistance(distance) {
				return formatDistance(parseFloat(distance))
			},
			nav() {
				uni.openLocation({
					longitude: this.station.longitude,
					latitude: this.station.latitude,
					name:this.station.stationName,
					address:this.station.stationAddress
				})
			}
		}
	}
</script>

<style lang="scss">
	.box {
		background: $main-white;
		padding: 40rpx;
		border-radius: 50rpx;
		margin-bottom: 40rpx;

		.left {
			width: 75%;

			.image1 {
				width: 120rpx;
				height: 120rpx;
				margin-right: 20rpx;

				image {
					width: 120rpx;
					height: 120rpx;
					border-radius: 20rpx;
				}
			}

			.text {
				width: 75%;
				align-items: flex-start;

				.title {
					color: $card-title;
					line-height: 40rpx;
					margin-bottom: 6rpx;
				}

				.address {
					width: 100%;
					color: $card-info;
					line-height: 32rpx;
					margin-bottom: 8rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}

				.price {
					line-height: 32rpx;

					.ft22 {
						color: $main-red;
						margin-right: 40rpx;
					}

					.ft20 {
						color: $card-info;
					}

					.lineThrough {
						text-decoration: line-through;
						line-height: 28rpx;
					}
				}
			}

		}

		.right {
			height: 120rpx;
			justify-content: space-between;

			.distance {
				font-size: 20rpx;
				font-weight: bold;
				padding: 0 10rpx;
				border: 2rpx solid $main-red;
				border-radius: 20rpx;
				color: $main-red;
			}

			.nav {
				width: 50rpx;
				height: 50rpx;

				image {
					width: 50rpx;
					height: 50rpx;
				}
			}
		}
	}
</style>
