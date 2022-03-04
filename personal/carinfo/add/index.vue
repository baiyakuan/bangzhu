<template>
	<div style="width: 100%;height: 100%;position: fixed;">
		<div class="">
			<div class="title pdl40 pdt60 pdb80 bgw">
				<div class="ft50 ftweight rgb51">{{ pageTitle }}</div>
			</div>
			<div class="pd40-x pdt70">
				<div class="ft24 rgb51 ftweight mgb40">输入车牌号</div>
				<div class="numberBox fs">
					<div class="numbox" v-for="(item, index) in carNumber" :key="index" @click.stop="tap(index)" :class="current == index ? 'active' : ''">
						<!-- <input type="text" :value="item.id"/> -->
						{{ item.id }}
					</div>
					<div class="numbox fcy" @click.stop="tap2" :class="current == 7 && addNewEnergy ? 'active' : ''">
						<!-- <input type="text" :value="" /> -->
						<div v-if="addNewEnergy || newEnergyNum">{{ newEnergyNum }}</div>
						<div class="ft14" v-else>{{ newEnergyText }}</div>
					</div>
				</div>
			</div>
		</div>
		<TypeWriting
			:is-show="isShow"
			:button-border="buttonBorder"
			@ok="inputOk"
			@hide="inputHide"
			@delete="inputDelete"
			@inputchange="inputChange"
			:key-board-type="keyBoardType"
			backgroundColor="rgba(229,229,229,1)"
		></TypeWriting>
		<div class="btn-box"><div class="btn ft30 ftweight tac" @click="addNumber">添加</div></div>
	</div>
</template>

<script>
import TypeWriting from '@/components/TypeWriting/index.vue';
import { addBrand, getBrandInfo, updateBrand } from '@/api';
import { validatePhone, validateEMoji } from '@/utils/validate';
export default {
	components: {
		TypeWriting
	},
	data() {
		return {
			pageTitle: '添加车辆',
			isShow: true,
			buttonBorder: '1px solid #ccc',
			backgroundColor: '#fff',
			keyBoardType: 1,
			carNumber: [],
			current: 0,
			addNewEnergy: false,
			newEnergyNum: '',
			brandType: 0,
			disabled: true,
			brandNumber: '',
			brandInfo: {},
			brandId: '',
			isDefault: 0,
			canTap: true,
			newEnergyText: '新能源'
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
	onLoad(option) {
		if (option.brandId) {
			this.brandId = option.brandId;
			this.isDefault = option.isDefault;
		}
		if (option.back) {
			this.back = 'back';
		}
		if (!option.noFirst) {
			this.isDefault = 1;
		}
	},
	onShow() {
		var that = this;

		if (that.brandId) {
			that.pageTitle = '编辑车辆';
			// 车辆详情
			that.getBrandInfo(that.brandId);
		} else {
			if (that.carNumber.length == 0) {
				for (var i = 0; i < 7; i++) {
					that.carNumber.push({
						id: ''
					});
				}
			}
		}
	},
	methods: {
		// 点击输入框
		tap(index) {
			this.current = index;
			this.addNewEnergy = false;
			if (index < 7) {
				this.carNumber[index].id = '';
				this.disabled = true;
			} else {
				this.newEnergyNum = '';
			}
			if (index == 0) {
				// 显示省份
				this.isShow = true;
				this.keyBoardType = 1;
			} else if (this.current == this.carNumber.length) {
				if (this.newEnergy == 1) {
					this.addNewEnergy = true;
				} else {
					this.isShow = false;
				}
			} else {
				//显示数字和英文
				this.isShow = true;
				this.keyBoardType = 0;
			}
		},
		tap2() {
			this.newEnergyNum = '';
			var flag = this.carNumber.every(item => {
				return item.id == '';
			});
			if (flag) {
				this.current = 0;
				this.keyBoardType = 1;
				this.newEnergy = 1;
				this.newEnergyText = '';
			} else {
				//显示数字和英文
				this.isShow = true;
				this.keyBoardType = 0;
				this.addNewEnergy = true;
				this.current = this.carNumber.length;
			}
		},
		// 输入
		inputChange(value) {
			if(this.current == 0){
				this.keyBoardType = 1;
			}else{
				this.keyBoardType = 0;
			}
			if (!this.addNewEnergy) {
				if(this.current < 7){
					this.carNumber[this.current].id = value;
					this.current++;
					this.isShow = true;
					// this.tap(this.current);
					this.keyBoardType = 0;
					// if(this.current > 6){
					// 	this.isShow = false;
					// }
				}
			} else {
				// 新能源
				this.newEnergyNum = value;
				this.isShow = false;
				this.current++;
			}
			var flag = this.carNumber.every(item => {
				return item.id;
			});
			if (flag) {
				this.disabled = false;
			}
		},
		// 删除
		inputDelete() {
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
						this.isShow = true;
						this.keyBoardType = 1;
					}
				} else if (this.current == 0) {
					if (value) {
						this.carNumber[this.current].id = '';
					}
				}
				this.disabled = true;
			}
		},
		// 添加
		addNumber() {
			if (this.canTap) {
				this.canTap = false;
				this.isShow = false;
				this.addNewEnergy = false;
				this.current = this.carNumber.length + 1;
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
						this.addBrand();
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
		// 隐藏
		inputHide() {
			this.isShow = false;
		},
		async addBrand() {
			if (this.brandId) {
				const { data } = await updateBrand({
					brandId: this.brandId,
					proviceAbbreviation: this.carNumber[0].id,
					firstSpell: this.carNumber[1].id,
					brandNumber: this.brandNumber.slice(2),
					// brandType:this.brandType,
					isDefault: this.isDefault,
					istrue: true
				});
				if (data.code == 1) {
					uni.showToast({
						title: '编辑成功',
						icon: 'none',
						duration: 2000
					});
					setTimeout(() => {
						uni.navigateBack();
					}, 2000);
				} else {
					uni.showToast({
						title: data.msg,
						icon: 'none',
						duration: 2000
					});
				}
				
			} else {
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
					setTimeout(() => {
						if (this.back) {
							uni.navigateBack();
						} else {
							uni.reLaunch({
								url: '/pages/index/index'
							});
						}
					}, 2000);
				} else {
					uni.showToast({
						title: data.msg,
						icon: 'none',
						duration: 2000
					});
				}
			}
		},
		// 获取车牌详情
		async getBrandInfo(brandId) {
			const { data } = await getBrandInfo({
				brandId: brandId,
				istrue: true
			});
			if (data.code == '1') {
				this.brandInfo = data.obj.brand;
				var brandNumber = data.obj.brand.proviceAbbreviation + data.obj.brand.firstSpell + data.obj.brand.brandNumber;
				var len = brandNumber.length;
				// if(this.brandInfo.brandType == 1){
				if (len == 8)
					// 新能源
					len = len - 1;
				this.newEnergyNum = brandNumber.substr(len, 1);
			}
			this.addNewEnergy = false;
			if (this.carNumber.length == 0) {
				for (var i = 0; i < len; i++) {
					this.carNumber.push({
						id: brandNumber[i]
					});
				}
			}
			this.disabled = false;
			// }
		}
	}
};
</script>

<style lang="stylus">
page
	background #F6F8FB
.title
	/* box-shadow:0 0 20rpx 0 rgba(27,25,33,0.2) */
.btn-box
	width 750rpx
	height 150rpx
	margin-top 50rpx
	/* background #fff */
	/* position fixed */
	/* bottom 0 */
.btn
	width 670rpx
	height 100rpx
	line-height 100rpx
	background #f33535
	border-radius 10px
	margin 0 auto
	color #fff
.numbox
	width 72rpx
	height 80rpx
	background rgba(255, 255, 255, 1)
	border-radius 12rpx
	text-align center
	line-height 80rpx
	box-sizing border-box
	input
		width 100%
		height 100%
	/* &:first-child
	width 80rpx */
	&.active
		border 1rpx solid #FA4242
</style>
