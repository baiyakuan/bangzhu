<template>
	<view class="u-select">
		<!-- <view class="u-select__action" :class="{
			'u-select--border': border
		}" @tap.stop="selectHandler">
			<view class="u-select__action__icon" :class="{
				'u-select__action__icon--reverse': value == true
			}">
				<u-icon name="arrow-down-fill" size="26" color="#c0c4cc"></u-icon>
			</view>
		</view> -->
		<u-popup :maskCloseAble="maskCloseAble" mode="bottom" :popup="false" v-model="value" length="auto" :safeAreaInsetBottom="safeAreaInsetBottom" @close="close" :z-index="uZIndex">
			<view class="u-select">
				<view v-if="berth" class="u-select__berth pd40-x">
					<view class="ft30 ftweight mgb40 mgt50">区域</view>
					<view class="square-box">
						<view
						 class="square text-ellipsis"
						 v-for="(item,index) in zone"
						 :key="index" 
						 :class="[zoneCurrent==index?'active':'',index%3===0?'mgt20':'mgl34']"
						 @click="selectZone(index)"
						>
							{{item}}
						</view>
					</view>
				</view>
				<view class="u-select__header" @touchmove.stop.prevent="stop" catchtouchmove="stop">
					<view
						class="u-select__header__cancel u-select__header__btn"
						:style="{ color: cancelColor }"
						:hover-stay-time="150"
					>
						{{cancelText}}
					</view>
					<view
						v-if="showAddPlate"
						class="u-select__header__confirm u-select__header__btn"
						:style="{ color: confirmColor }"
						hover-class="u-hover-class"
						:hover-stay-time="150"
						@touchmove.stop=""
						@tap.stop="addPlate"
					>
						{{confirmText}}
					</view>
				</view>
				<view class="u-select__body pr">
					<image src="/static/img/redArrowRight.png" style="width: 18rpx;height: 20rpx;position: absolute;top: 50%;left: 20%;margin-top: -10rpx;"></image>
					<picker-view @change="columnChange" class="u-select__body__picker-view" :value="defaultSelector" style="position: relative;">
						<picker-view-column v-for="(item, index) in columnData" :key="index">
							<view class="u-select__body__picker-view__item" v-for="(item1, index1) in item" :key="index1">
								<view class="u-line-1">{{ item1[labelName] }}</view>
							</view>
						</picker-view-column>
					</picker-view>
						<image src="/static/img/redArrowLeft.png" style="width: 18rpx;height: 20rpx;position: absolute;top: 50%;right: 20%;margin-top: -10rpx;"></image>
				</view>
				<view class="u-select__footer">
					<view class="u-select__footer__line"></view>
					<view class="u-select__footer__complete" hover-class="u-hover-class" @tap="getResult('confirm')">
						完成
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
export default {
	props: {
		// 列数据
		list: {
			type: Array,
			default() {
				return [];
			}
		},
		// 泊位分区数据
		zone:{
			type: Array,
			default() {
				return [];
			}
		},
		// 当前选择泊位分区
		zoneCurrent:{
			type: Number,
			default: 0
		},
		// 是否显示边框
		border: {
			type: Boolean,
			default: true
		},
		// 通过双向绑定控制组件的弹出与收起
		value: {
			type: Boolean,
			default: false
		},
		// "取消"按钮的颜色
		cancelColor: {
			type: String,
			default: '#606266'
		},
		cancelText:{
			type: String,
			default: '取消'
		},
		// "确定"按钮的颜色
		confirmColor: {
			type: String,
			default: '#4A5361'
		},
		confirmText:{
			type: String,
			default: ''
		},
		// 弹出的z-index值
		zIndex: {
			type: [String, Number],
			default: 0
		},
		safeAreaInsetBottom: {
			type: Boolean,
			default: false
		},
		// 是否允许通过点击遮罩关闭Picker
		maskCloseAble: {
			type: Boolean,
			default: true
		},
		// 提供的默认选中的下标
		defaultValue: {
			type: Array,
			default() {
				return [0];
			}
		},
		// 模式选择，single-column-单列，mutil-column-多列，mutil-column-auto-多列联动
		mode: {
			type: String,
			default: 'single-column'
		},
		// 自定义value属性名
		valueName: {
			type: String,
			default: 'value'
		},
		// 自定义label属性名
		labelName: {
			type: String,
			default: 'label'
		},
		// 自定义多列联动模式的children属性名
		childName: {
			type: String,
			default: 'children'
		},
		// 是否显示泊位分区
		berth:{
			type: Boolean,
			default: false
		},
		showAddPlate: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			// 用于列改变时，保存当前的索引，下一次变化时比较得出是哪一列发生了变化
			defaultSelector: [0],
			// picker-view的数据
			columnData: [],
			// 每次队列发生变化时，保存选择的结果
			selectValue: [],
			// 上一次列变化时的index
			lastSelectIndex: [], 
			// 列数
			columnNum: 0,
		};
	},
	watch: {
		// 在select弹起的时候，重新初始化所有数据
		value: {
			immediate: true,
			handler(val) {
				if(val) setTimeout(() => this.init(), 10);
			}
		},
		list(a,b){
			setTimeout(() => this.init(), 10);
		}
	},
	computed: {
		uZIndex() {
			// 如果用户有传递z-index值，优先使用
			return this.zIndex ? this.zIndex : this.$u.zIndex.popup;
		},
	},
	methods: {
		init() {
			this.setColumnNum();
			this.setDefaultSelector();
			this.setColumnData();
			this.setSelectValue();
		},
		// 获取默认选中列下标
		setDefaultSelector() {
			// 如果没有传入默认选中的值，生成长度为columnNum，用0填充的数组
			this.defaultSelector = this.defaultValue.length == this.columnNum ? this.defaultValue : Array(this.columnNum).fill(0);
			this.lastSelectIndex = this.$u.deepClone(this.defaultSelector);
		},
		// 计算列数
		setColumnNum() {
			// 单列的列数为1
			if(this.mode == 'single-column') this.columnNum = 1;
			// 多列时，this.list数组长度就是列数
			else if(this.mode == 'mutil-column') this.columnNum = this.list.length;
			// 多列联动时，通过历遍this.list的第一个元素，得出有多少列
			else if(this.mode == 'mutil-column-auto') {
				let num = 1;
				let column = this.list;
				// 只要有元素并且第一个元素有children属性，继续历遍
				while(column[0][this.childName]) {
					column = column[0] ? column[0][this.childName] : {};
					num ++;
				}
				this.columnNum = num;
			}
		},
		// 获取需要展示在picker中的列数据
		setColumnData() {
			let data = [];
			this.selectValue = [];
			if(this.mode == 'mutil-column-auto') {
				// 获得所有数据中的第一个元素
				let column = this.list[this.defaultSelector.length ? this.defaultSelector[0] : 0];
				// 通过循环所有的列数，再根据设定列的数组，得出当前需要渲染的整个列数组
				for (let i = 0; i < this.columnNum; i++) {
					// 第一列默认为整个list数组
					if (i == 0) {
						data[i] = this.list;
						column = column[this.childName];
					} else {
						// 大于第一列时，判断是否有默认选中的，如果没有就用该列的第一项
						data[i] = column;
						column = column[this.defaultSelector[i]][this.childName];
					}
				}
			} else if(this.mode == 'single-column') {
				data[0] = this.list;
			} else {
				data = this.list;
			}
			this.columnData = data;
		},
		// 获取默认选中的值，如果没有设置defaultValue，就默认选中每列的第一个
		setSelectValue() {
			let tmp = null;
			for(let i = 0; i < this.columnNum; i++) {
				tmp = this.columnData[i][this.defaultSelector[i]];
				this.selectValue.push({
					value: tmp ? tmp[this.valueName] : null,
					label: tmp ? tmp[this.labelName] : null
				})
				// 判断是否存在额外的参数，如果存在，就返回
				if(tmp && tmp.extra) this.selectValue.extra = tmp.extra;
			}
		},
		// 列选项
		columnChange(e) {
			let index = null;
			let cloumnIndex = e.detail.value;
			// 由于后面是需要push进数组的，所以需要先清空数组
			this.selectValue = [];
			if(this.mode == 'mutil-column-auto') {
				// 对比前后两个数组，寻找变更的是哪一列，如果某一个元素不同，即可判定该列发生了变化
				this.lastSelectIndex.map((val, idx) => {
					if (val != cloumnIndex[idx]) index = idx;
				});
				this.defaultSelector = cloumnIndex;
				for (let i = index + 1; i < this.columnNum; i++) {
					// 当前变化列的下一列的数据，需要获取上一列的数据，同时需要指定是上一列的第几个的children，再往后的
					// 默认是队列的第一个为默认选项
					this.columnData[i] = this.columnData[i - 1][i - 1 == index ? cloumnIndex[index] : 0][this.childName];
					// 改变的列之后的所有列，默认选中第一个
					this.defaultSelector[i] = 0;
				}
				// 在历遍的过程中，可能由于上一步修改this.columnData，导致产生连锁反应，程序触发columnChange，会有多次调用
				// 只有在最后一次数据稳定后的结果是正确的，此前的历遍中，可能会产生undefined，故需要判断
				cloumnIndex.map((item, index) => {
					let data = this.columnData[index][cloumnIndex[index]];
					let tmp = {
						value: data ? data[this.valueName] : null,
						label: data ? data[this.labelName] : null,
					};
					// 判断是否有需要额外携带的参数
					if(data && data.extra) tmp.extra = data.extra;
					this.selectValue.push(tmp);
					
				})
				// 保存这一次的结果，用于下次列发生变化时作比较
				this.lastSelectIndex = cloumnIndex;
			} else if(this.mode == 'single-column') {
				let data = this.columnData[0][cloumnIndex[0]];
				// 初始默认选中值
				let tmp = {
					value: data ? data[this.valueName] : null,
					label: data ? data[this.labelName] : null,
				};
				// 判断是否有需要额外携带的参数
				if(data && data.extra) tmp.extra = data.extra;
				this.selectValue.push(tmp);
			} else if(this.mode == 'mutil-column') {
				// 初始默认选中值
				cloumnIndex.map((item, index) => {
					let data = this.columnData[index][cloumnIndex[index]];
					// 初始默认选中值
					let tmp = {
						value: data ? data[this.valueName] : null,
						label: data ? data[this.labelName] : null,
					};
					// 判断是否有需要额外携带的参数
					if(data && data.extra) tmp.extra = data.extra;
					this.selectValue.push(tmp);
				})
			}
			this.$emit("changeBerth",cloumnIndex[0])
			console.log(cloumnIndex, e)
		},
		close() {
			this.$emit('input', false);
		},
		// 点击确定或者取消
		getResult(event = null) {
			if (event) {
				setTimeout(() => {
					this.$emit(event, this.selectValue);
					this.close();
				}, 800)
			}
		},
		selectHandler() {
			this.$emit('click');
		},
		// 点击新增
		addPlate(){
			if (this.list.length >= 3) {
				uni.showToast({
					title: '最多添加3辆车',
					icon:"none",
				})
			} else {
				this.$emit('addPlate'); 
			}
		},
		// 选择泊位分区
		selectZone(i){
			this.$emit('changeZone',i)
		}
	}
};
</script>

<style scoped lang="scss">
.u-select {
	
	&__berth{
		.square-box{
			display: flex;
			flex-wrap: wrap;
			justify-content: flex-start;
			align-items: center;
		}
		.square{
			width:200rpx;
			height:80rpx;
			line-height: 80rpx;
			text-align: center;
			background: #F6F8FB;
			font-size: 26rpx;
			color:#4A5361;
			border-radius:20rpx;
			border:1px solid #fff;
			box-sizing: border-box;
		}
		.active{
			border:1px solid #F33535;
			color:#F33535;
			font-weight: bold;
		}
	}
	
	
	&__action {
		position: relative;
		line-height: $u-form-item-height;
		height: $u-form-item-height;
		
		&__icon {
			position: absolute;
			right: 20rpx;
			top: 50%;
			transition: transform .4s;
			transform: translateY(-50%);
			z-index: 1;
			
			&--reverse {
				transform: rotate(-180deg) translateY(50%);
			}
		}
	}
	
	&--border {
		border-radius: 6rpx;
		border-radius: 4px;
		border: 1px solid $u-form-item-border-color;
	}
	
	&__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 80rpx;
		padding: 0 40rpx;
		.u-select__header__cancel{
			font-size: 28rpx;
			font-weight: bold;
			color: #1B1A22;
		}
		.u-select__header__confirm{
			font-size: 28rpx;
			font-weight: bold;
			color: #4A5361;
		}
	}

	&__body {
		width: 100%;
		height: 300rpx;
		overflow: hidden;
		background-color: #FFF;

		&__picker-view {
			height: 100%;
			box-sizing: border-box;
			
			&__item {
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 32rpx;
				color: $u-main-color;
				padding: 0 8rpx;
			}
		}
	}
	
	&__footer{
		&__line{
			height: 1px;
			width: 100%;
			background: #F6F8FB;
		}
		&__complete{
			width: 100%;
			height: 100rpx;
			line-height: 100rpx;
			text-align: center;
			font-size: 34rpx;
			font-weight: bold;
			color: #1A1921;
		}
	}
}
</style>
