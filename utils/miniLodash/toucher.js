export default class Toucher {
	constructor(minTime=100, minOffset=20) {
		this.detail = {
			startTime: 0,
			endTime: 0,
			startX: 0,
			startY: 0,
			endX: 0,
			endY: 0,
			minTime,
			touchTime: 0,
			offsetX: 0,
			offsetY: 0,
			minOffset
		}
		this.touchDirection = ''
	}
	
	setStart(x, y) {
		this.detail.startTime = +new Date()
		this.detail.startX = x;
		this.detail.startY = y;
	}
	
	setEnd(x,y) {
		this.detail.endTime = +new Date()
		this.detail.touchTime = this.detail.endTime - this.detail.startTime
		
		this.detail.endX = x;
		this.detail.endY = y;
		this.detail.offsetX = this.detail.endX - this.detail.startX
		this.detail.offsetY = this.detail.endY - this.detail.startY
		
		if (this.detail.touchTime >= this.detail.minTime) {
			if (Math.abs(this.detail.offsetX) >= Math.abs(this.detail.offsetY) && Math.abs(this.detail.offsetX) >= this.detail.minOffset) {
				return
			} else if (Math.abs(this.detail.offsetX) < Math.abs(this.detail.offsetY) && Math.abs(this.detail.offsetY) >= this.detail.minOffset) {
				if (this.detail.offsetY < 0) {
					// 向上滑动
					this.touchDirection = 'top'
				} else {
					this.touchDirection = 'bottom'
				}
			}
		} else {
			return
		}
	}
	
	getTouchDirection() {
		return this.touchDirection
	}
}
