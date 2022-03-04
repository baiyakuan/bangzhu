<template>
	<scroll-view :style="{ height: windowHeight * rate + 'rpx' }" :scroll-y="true" :scroll-with-animation="true">
		<view class="" style="padding-bottom: 200rpx;">
			<view class="pd50-y pd40-x fs"><view class="ft50 ftweight rgb27">筛选</view></view>
			<view class="f_clear pd40-x">
				<view class="ft30 ftweight mgb40">类型</view>
				<view class="square-box">
					<view
						class="square"
						v-for="(item, index) in type"
						:key="index"
						:class="[cardType == item.mark ? 'active' : '', index == 0 || index == 3 ? '' : 'mgl34', index == 3 ? 'mgt20' : '']"
						@click="selectType(item.mark)"
					>
						{{ item.label }}
					</view>
				</view>
			</view>
			<view class="f_clear pd40-x">
				<view class="ft30 ftweight mg40-y">时段</view>
				<view class="square-box">
					<view
						class="square"
						v-for="(item, index) in time"
						:key="index"
						:class="[timeInterval == item.mark ? 'active' : '', index == 0 || index == 3 ? '' : 'mgl34', index == 3 ? 'mgt20' : '']"
						@click="selectTime(item.mark)"
					>
						{{ item.label }}
					</view>
				</view>
			</view>
			<view class="f_clear pd40-x">
				<view class="ft30 ftweight mg40-y">停放规则</view>
				<view class="square-box">
					<view
						class="square"
						v-for="(item, index) in rule"
						:key="index"
						:class="[dayParkRule == index ? 'active' : '', index == 0 || index == 3 ? '' : 'mgl34', index == 3 ? 'mgt20' : '']"
						@click="selectRule(index)"
					>
						{{ item }}
					</view>
				</view>
			</view>
			<view class="f_clear pd40-x">
				<view class="ft30 ftweight mg40-y">租赁区域</view>
				<view class="square-box">
					<view
						class="square"
						v-for="(item, index) in area"
						:key="index"
						:class="[rentArea == item.mark ? 'active' : '', index == 0 || index == 3 ? '' : 'mgl34', index == 3 ? 'mgt20' : '']"
						@click="selectArea(item.mark)"
					>
						{{ item.label }}
					</view>
				</view>
			</view>
			<view class="footer pd40-x">
				<view class="cancel ft26 ftweight tac" @click="cancel">重置</view>
				<view class="enter ft26 ftweight tac" @click="getFilterInfo">确定</view>
			</view>
		</view>
	</scroll-view>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

import { getFilterInfo } from '@/utils';

const { mapState, mapActions } = createNamespacedHelpers('carRentalModule');

export default {
	data() {
		return {
			type: [{ label: '全部', mark: 0 }, { label: '年卡', mark: 3 }, { label: '月卡', mark: 2 }, { label: '周卡', mark: 1 }],
			time: [{ label: '全部', mark: 0 }, { label: '白天', mark: 2 }, { label: '夜间', mark: 3 }, { label: '全天', mark: 1 }],
			rule: ['全部', '工作日', '节假日', '每天'],
			area: [{ label: '全场', mark: 1 }, { label: '分区', mark: 2 }]
		};
	},
	computed: {
		...mapState({
			filterRule: state => state.parkingFilter.filterRule
		}),
		windowHeight() {
			return this.$store.state.screen.windowHeight;
		},
		rate() {
			return this.$store.state.screen.rate;
		},
		cardType: {
			get() {
				return this.filterRule.cardType;
			},
			set(cardType) {
				this.filterRule.cardType = cardType;
			}
		},
		timeInterval: {
			get() {
				return this.filterRule.timeInterval;
			},
			set(timeInterval) {
				this.filterRule.timeInterval = timeInterval;
			}
		},
		dayParkRule: {
			get(dayParkRule) {
				return this.filterRule.dayParkRule;
			},
			set(dayParkRule) {
				this.filterRule.dayParkRule = dayParkRule;
			}
		},
		rentArea: {
			get() {
				return this.filterRule.rentArea;
			},
			set(rentArea) {
				this.filterRule.rentArea = rentArea;
			}
		}
	},
	onShow() {
		this.$store.commit('carRentalModule/resetFilterParkings');
	},
	methods: {
		selectType(i) {
			this.cardType = i;
		},
		selectTime(i) {
			this.timeInterval = i;
		},
		selectRule(i) {
			this.dayParkRule = i;
		},
		selectArea(i) {
			this.rentArea = i;
		},
		cancel() {
			this.$store.commit('carRentalModule/resetFilterParkings');
		},
		getFilterInfo() {
			this.$store.commit('carRentalModule/updateFilterParkings', {
				cardType: this.cardType,
				timeInterval: this.timeInterval,
				dayParkRule: this.dayParkRule,
				rentArea: this.rentArea
			});
			uni.navigateBack({
				delta: 1
			});
		}
	}
};
</script>

<style lang="scss">
.f_clear::after {
	display: block;
	content: '';
	clear: both;
}
.square-box {
	display: flex;
	flex-wrap: wrap;
	justify-content: flex-start;
	align-items: center;
}
.square {
	width: 200rpx;
	height: 80rpx;
	line-height: 80rpx;
	text-align: center;
	background: #fff;
	font-size: 26rpx;
	color: #4a5361;
	border-radius: 20rpx;
	border: 1px solid #fff;
	box-sizing: border-box;
}
.active {
	border: 1px solid #f33535;
	color: #f33535;
	font-weight: bold;
}
.footer {
	position: fixed;
	bottom: 0;
	width: 100%;
	height: 160rpx;
	line-height: 160rpx;
	background: #fff;
	.cancel {
		display: inline-block;
		width: 200rpx;
		height: 80rpx;
		line-height: 80rpx;
		margin-right: 36rpx;
		background: rgba(74, 83, 97, 0.5);
		border-radius: 20rpx;
		color: #fefefe;
	}
	.enter {
		display: inline-block;
		width: 434rpx;
		height: 80rpx;
		line-height: 80rpx;
		background: #f33535;
		border-radius: 20rpx;
		color: #fefefe;
	}
}
</style>
