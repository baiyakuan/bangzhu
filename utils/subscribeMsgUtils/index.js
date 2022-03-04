import store from '@/store'
import {
	addUserSubscribeMsg
} from '@/api'
const open = true; // 是否开启消息订阅

// 去除已经长期允许或拒绝的订阅
export function getSetting(ids, callback) {
	let tmplIds = []
	wx.getSetting({
		withSubscriptions: true,
		success: res => {
			console.log(res);
			for (let i = 0; i < ids.length; i++) {
				let templateId = ids[i];
				if (!res.subscriptionsSetting[templateId]) {
					tmplIds.push(templateId);
				}
			}
			console.log(tmplIds)
			if (!open) {
				tmplIds = []
			}
			if (callback) {
				callback(tmplIds)
			}
		}
	});
}

// 弹出订阅确认框
export function requestSubscribeMessage(tmplIds, callback) {
	if (!open) {
		callback()
	}
	if (!tmplIds || tmplIds.length == 0) {
		callback()
	}
	wx.requestSubscribeMessage({
		tmplIds,
		success: res => {
			console.log(res);
			wx.getSetting({
				withSubscriptions: true,
				success(data) {
					console.log(data);
					for (let i = 0; i < tmplIds.length; i++) {
						let templateId = tmplIds[i];
						let isSub = res[templateId] == 'accept' ? true : false;
						let isLongSub = 2;
						if (data.subscriptionsSetting[templateId] == 'accept') {
							isLongSub = 0;
						} else if (data.subscriptionsSetting[templateId] == 'reject') {
							isLongSub = 1;
						}
						subscribeMsg(templateId, isSub, isLongSub);
					}
					if (callback) {
						callback()
					}
				}
			});
		},
		fail: err => {
			console.log(err);
		}
	});
}

async function subscribeMsg(templateId, isSub, isLongSub) {
	const {
		data
	} = await addUserSubscribeMsg({
		openid: store.state.openid,
		templateId,
		subTime: new Date(),
		isSub,
		isLongSub
	});
	console.log('data:', data)
}
