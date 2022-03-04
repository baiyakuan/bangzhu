<template>
	<view @click="toggle" class="evan-switch" 
	
	:class="{'evan-switch--disabled':disabled}" 
	:style="{backgroundColor:currentValue===activeValue?activeColor:inactiveColor}">
	
		<view class="evan-switch__circle" 
		:style="{
		transform:currentValue===activeValue?`translateX(24rpx)`:`translateX(2rpx)`
		}">
		
		</view>
	</view>
</template>

<script>
	export default {
		name: 'EvanSwitch',
		props: {
			value: {
				type: [String, Number, Boolean],
				default: false
			},
			activeColor: {
				type: String,
				default: '#108ee9'
			},
			inactiveColor: {
				type: String,
				default: '#fff'
			},
			size: {
				type: [String, Number],
				default: 30
			},
			disabled: {
				type: Boolean,
				default: false
			},
			activeValue: {
				type: [String, Number, Boolean],
				default: true
			},
			inactiveValue: {
				type: [String, Number, Boolean],
				default: false
			},
			beforeChange: {
				type: Function,
				default: null
			}
		},
		computed: {
			switchHeight() {
				return (this.size /1.6) *2  + 'rpx'
			}
		},
		watch: {
			value: {
				immediate: true,
				handler(value) {
					this.currentValue = value
				}
			},
		},
		data() {
			return {
				currentValue: false
			}
		},
		methods: {
			toggle() {
				this.$emit('aaa')
			},
			toggleValue() {
				this.currentValue = this.currentValue === this.activeValue ? this.inactiveValue : this.activeValue
				this.$emit('input', this.currentValue)
				this.$emit('change', this.currentValue)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.evan-switch {
		position: relative;
		width: 60rpx;
		height: 36rpx;
		border-radius: 36rpx;
		box-sizing: border-box;
		padding: 2rpx;
		transition: background-color 0.3s;
	}

	.evan-switch--disabled {
		opacity: 0.3;
	}

	.evan-switch__circle {
		width: 32rpx;
		height: 32rpx;
		background-color: #fff;
		border-radius: 50%;
		transition: transform 0.3s;
	}
</style>
