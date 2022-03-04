<template>
	<u-popup
		class=""
		:mask="mask"
		:maskCloseAble="maskCloseAble"
		mode="bottom"
		:popup="false"
		v-model="value"
		length="auto"
		:safeAreaInsetBottom="safeAreaInsetBottom"
		@close="popupClose"
	>
		<slot />
		<view class="u-tooltip" v-if="tooltip"><view class="u-tooltip-item u-tooltip-cancel">新增车辆</view></view>

		<view class="numberBox fs pd40-x">
			<view class="numbox" v-for="(item, index) in carNumber" :key="index" @click.stop="tap(index)" :class="current == index ? 'active' : ''">{{ item.id }}</view>
			<view class="numbox fcy" @click.stop="tap2" :class="addNewEnergy ? 'active' : ''">
				<view v-if="addNewEnergy || newEnergyNum">{{ newEnergyNum }}</view>
				<view class="ft14" v-else>新能源</view>
			</view>
		</view>

		<block v-if="mode == 'number' || mode == 'card'">
			<u-number-keyboard :random="random" @backspace="backspace" @change="change" :mode="mode" :dotEnabled="dotEnabled"></u-number-keyboard>
		</block>
		<block v-else>
			<u-car-keyboard
				:random="random"
				:abc="abc"
				@backspace="backspace"
				@change="inputChange"
				@delete="inputDelete"
				@changeCarInputMode="changeCarInputMode"
				:showChangeLan="showChangeLan"
			></u-car-keyboard>
		</block>
		<view class="u-select__footer">
			<view class="u-select__footer__line"></view>
			<view class="u-select__footer__complete" hover-class="u-hover-class" @tap="onConfirm">完成</view>
		</view>
	</u-popup>
</template>

<script>
/**
 * keyboard 键盘
 * @description 此为uViw自定义的键盘面板，内含了数字键盘，车牌号键，身份证号键盘3中模式，都有可以打乱按键顺序的选项。
 * @tutorial https://www.uviewui.com/components/keyboard.html
 * @property {String} mode 键盘类型，见官网基本使用的说明（默认number）
 * @property {Boolean} dot-enabled 是否显示"."按键，只在mode=number时有效（默认true）
 * @property {Boolean} tooltip 是否显示键盘顶部工具条（默认true）
 * @property {String} tips 工具条中间的提示文字，见上方基本使用的说明，如不需要，请传""空字符
 * @property {Boolean} cancel-btn 是否显示工具条左边的"取消"按钮（默认true）
 * @property {Boolean} confirm-btn 是否显示工具条右边的"完成"按钮（默认true）
 * @property {Boolean} mask 是否显示遮罩（默认true）
 * @property {Number String} z-index 弹出键盘的z-index值（默认1075）
 * @property {Boolean} random 是否打乱键盘按键的顺序（默认false）
 * @property {Boolean} safe-area-inset-bottom 是否开启底部安全区适配（默认false）
 * @property {Boolean} mask-close-able 是否允许点击遮罩收起键盘（默认true）
 * @event {Function} change 按键被点击(不包含退格键被点击)
 * @event {Function} cancel 键盘顶部工具条左边的"取消"按钮被点击
 * @event {Function} confirm 键盘顶部工具条右边的"完成"按钮被点击
 * @event {Function} backspace 键盘退格键被点击
 * @example <u-keyboard mode="number" v-model="show"></u-keyboard>
 */
import { addBrand } from '@/api';
import store from '@/store';
export default {
	name: 'u-keyboard',
	props: {
		// 键盘的类型，number-数字键盘，card-身份证键盘，car-车牌号键盘
		mode: {
			type: String,
			default: 'number'
		},
		// carNumber:{
		// 	type: Array,
		// 	default: [{id:''},{id:''},{id:''},{id:''},{id:''},{id:''},{id:''}]
		// },
		// 是否显示键盘的"."符号
		dotEnabled: {
			type: Boolean,
			default: true
		},
		// 是否显示顶部工具条
		tooltip: {
			type: Boolean,
			default: true
		},
		// 是否显示工具条中间的提示
		showTips: {
			type: Boolean,
			default: true
		},
		// 工具条中间的提示文字
		tips: {
			type: String,
			default: ''
		},
		// 是否显示工具条左边的"取消"按钮
		cancelBtn: {
			type: Boolean,
			default: true
		},
		// 是否显示工具条右边的"完成"按钮
		confirmBtn: {
			type: Boolean,
			default: true
		},
		// 是否打乱键盘按键的顺序
		random: {
			type: Boolean,
			default: false
		},
		// 是否开启底部安全区适配，开启的话，会在iPhoneX机型底部添加一定的内边距
		safeAreaInsetBottom: {
			type: Boolean,
			default: false
		},
		// 是否允许通过点击遮罩关闭键盘
		maskCloseAble: {
			type: Boolean,
			default: true
		},
		// 通过双向绑定控制键盘的弹出与收起
		value: {
			type: Boolean,
			default: false
		},
		// 是否显示遮罩，某些时候数字键盘时，用户希望看到自己的数值，所以可能不想要遮罩
		mask: {
			type: Boolean,
			default: true
		},
		// z-index值
		zIndex: {
			type: [Number, String],
			default: ''
		},
		autoAddBrand: {
			type: Boolean,
			default: false
		},
		isDefault: {
			type: Number,
			default: 1
		},
		showChangeLan: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			//show: false
			current: 0, // 当前输入框
			addNewEnergy: false, // 是否添加新能源
			newEnergyNum: '', // 新能源车牌号
			abc: false, // 中英文键盘切换
			carNumber: [{ id: '' }, { id: '' }, { id: '' }, { id: '' }, { id: '' }, { id: '' }, { id: '' }], // 车牌号码
			canTap: true, // 完成按钮是否可点击
			disabled: true, // 车牌号位数是否正确

			brandType: 0, // 车牌类型 0:普通; 1:新能源
			brandNumber: '' // 车牌号码
		};
	},
	computed: {
		uZIndex() {
			return this.zIndex ? this.zIndex : this.$u.zIndex.popup;
		}
	},
	methods: {
		// 点击输入框
		tap(index) {
			this.current = index;
			this.addNewEnergy = false;
			if (index == 0) {
				// 显示省份
				// this.isShow = true;
				this.abc = false;
			} else if (this.current == this.carNumber.length) {
				// this.isShow = false;
				this.current--;
				return;
			} else {
				//显示数字和英文
				// this.isShow = true;
				this.abc = true;
			}
		},
		// 输入新能源车牌号
		tap2() {
			this.abc = true;
			this.addNewEnergy = true;
			this.current = this.carNumber.length + 1;
		},
		// 输入
		inputChange(value) {
			if (value == 'I' || value == 'O') {
				return;
			}
			if (!this.addNewEnergy) {
				this.carNumber[this.current].id = value;
				this.current++;
				this.tap(this.current);
			} else {
				// 新能源
				this.newEnergyNum = value;
			}
			var flag = this.carNumber.every(item => {
				return item.id;
			});
			if (flag) {
				this.disabled = false;
			}
		},
		// 中英文键盘切换
		changeCarInputMode() {
			this.abc = !this.abc;
		},
		// 键盘关闭
		popupClose() {
			// 通过发送input这个特殊的事件名，可以修改父组件传给props的value的变量，也即双向绑定
			this.current = 0;
			this.abc = false;
			this.carNumber = [{ id: '' }, { id: '' }, { id: '' }, { id: '' }, { id: '' }, { id: '' }, { id: '' }];
			this.addNewEnergy = false;
			this.newEnergyNum = '';
			this.$emit('input', false);
		},
		// 输入完成
		async onConfirm() {
			// this.popupClose();
			// this.$emit('confirm');
			if (this.canTap) {
				this.canTap = false;
				this.addNewEnergy = false;
				var str = '';
				if (!this.disabled) {
					this.carNumber.forEach(item => {
						str += item.id;
					});
					if (this.newEnergyNum) {
						this.brandType = 1;
						str += this.newEnergyNum;
					}
					this.brandNumber = str;
					var reg = /^[A-Za-z]/;
					if (reg.test(this.carNumber[1].id)) {
						this.autoAddBrand && (await this.addBrand());
					} else {
						uni.showToast({
							title: '车牌第二位应为城市代码',
							icon: 'none',
							duration: 2000
						});
					}
				} else {
					uni.showToast({
						title: '请正确输入车牌号',
						icon: 'none',
						duration: 2000
					});
				}
				setTimeout(() => {
					this.canTap = true;
				}, 3000);
			}
		},
		// 取消输入
		onCancel() {
			// this.popupClose();
			// this.$emit('cancel');
		},
		// 退格键
		backspace() {
			if (this.addNewEnergy) {
				this.newEnergyNum = '';
				this.addNewEnergy = false;
				this.current = this.carNumber.length - 1;
			} else {
				let value = this.carNumber[this.current].id;
				if (this.current > 0) {
					if (!value) {
						this.current--;
					}
					this.carNumber[this.current].id = '';
					if (this.current == 0) {
						// 显示省份
						// this.isShow = true;
						this.abc = false;
					}
				} else if (this.current == 0) {
					if (value) {
						this.carNumber[this.current].id = '';
					}
				}
				this.disabled = true;
			}
		},
		// 添加新车牌
		async addBrand() {
			const { data } = await addBrand({
				proviceAbbreviation: this.carNumber[0].id,
				firstSpell: this.carNumber[1].id,
				brandNumber: this.brandNumber.slice(2),
				brandType: this.brandType,
				isDefault: this.isDefault,
				istrue: true
			});
			if (data.code == 1) {
				uni.showToast({
					title: '添加成功',
					icon: 'none',
					duration: 2000
				});
				store.commit('updateBrandNumber', store.state.userInfo.brandNum + 1);
				setTimeout(() => {
					this.popupClose();
					this.$emit('finish', this.brandNumber);
				}, 800);
			} else {
				uni.showToast({
					title: data.msg,
					icon: 'none',
					duration: 2000
				});
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.u-keyboard {
	position: relative;
	z-index: 1003;
}

.u-tooltip {
	background: #f6f8fb;
	display: flex;
	justify-content: space-between;
}

.u-tooltip-item {
	color: #333333;
	flex: 0 0 33.333333%;
	text-align: center;
	padding: 20rpx 10rpx;
	font-size: 28rpx;
}

.u-tooltips-submit {
	text-align: right;
	flex-grow: 1;
	flex-wrap: 0;
	padding-right: 40rpx;
	color: $u-type-primary;
}

.u-tooltip-cancel {
	text-align: left;
	flex-grow: 1;
	flex-wrap: 0;
	padding-left: 40rpx;
	color: #1b1a22;
	font-size: 28rpx;
	font-weight: bold;
}

.u-tooltips-submit-hover {
	color: $u-type-success;
}

.u-tooltip-cancel-hover {
	color: #333333;
}
.numberBox {
	background: #f6f8fb;
	.numbox {
		width: 72rpx;
		height: 80rpx;
		background: rgba(255, 255, 255, 1);
		border-radius: 12rpx;
		text-align: center;
		line-height: 80rpx;
		box-sizing: border-box;
		// input{
		// 	width: 100%;
		// 	height: 100%;
		// }
		&.active {
			border: 1rpx solid #fa4242;
		}
	}
}
.u-select {
	&__footer {
		background: #f6f8fb;
		&__line {
			height: 1px;
			width: 100%;
			background: #fff;
		}
		&__complete {
			width: 100%;
			height: 100rpx;
			line-height: 100rpx;
			text-align: center;
			font-size: 34rpx;
			font-weight: bold;
			color: #1a1921;
		}
	}
}
</style>
