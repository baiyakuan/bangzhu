import { cardTypeCollection } from '@/constants/carRental.js'
import { omit, get, mapQuery } from '@/utils/miniLodash'

const carRentalContinueTypeMap = {
	'1': '连续包周',
	'2': '连续包月',
	'3': '连续包年'
}

export const getSearchValue = (item) => {
	let result = ''
	if (typeof item === 'string') {
		result = item
	} else {
		result = get(item, 'detail.value', '')
	}
	return result.trim()
}

// 进入租赁车场详情
export const nav2parkDetail = (park) => {
	const parkQuery = mapQuery(park)
	uni.navigateTo({
		url:`/personal/carRental/parkDetail/index?${parkQuery}`
	})
}

export const pushParkSearchHistory = (historyArr, item) => {
	let checkedHistory = historyArr.filter((historyItem) => historyItem !== item)
	checkedHistory.unshift(item)
	const length = checkedHistory.length
	checkedHistory.length = length >= 30 ? 30 : length
	return checkedHistory
}

const caculateEndTime = (cardType) => {
	const cardTypeObj = cardTypeCollection.find((item) => item.mark == cardType.cType)
	const endDate = new Date(get(cardType, 'rentEndTime', '2300/12/31').replace(/-/g, '/'))
	endDate.setDate(endDate.getDate() - cardTypeObj.date)
	return endDate
}

// parkingDetail
export const concatImgUrls = (domain, paths) => paths.split(',').map(item => `${domain}${item}`)

export const mapParkingDetailData = (sourceData, rootState) => {
	let typeList = sourceData.data.map((item) => ({
		...item, 
		buyNum: Number(item.buyNum), 
		continueType: carRentalContinueTypeMap[item.cType],
		rentEndTime : caculateEndTime(item),
		rentStartTime: new Date(get(item, 'rentStartTime', '1900/1/1').replace(/-/g, '/'))
	}))
	return {
		...omit(sourceData, 'data'),
		imgUrls: concatImgUrls(rootState.Imgpath, sourceData.parkingImg),
		location: {
			longitude: sourceData.lnt,
			latitude: sourceData.lat,
		},
		typeList
	}
}


const checkCardtypeAndAreaAndLotAndBrand = (source, list, index) => {
	let returnValue
	if (typeof index === 'number' && index >-1) {
		returnValue = list[index] || {}
	} else if ((Array.isArray(source) && source.length > 0 ) || Object.keys(source).length > 0) {
		returnValue = source
	} else {
		returnValue = list[0] || {}
	}
	return returnValue
}

export const getSelectedCardType = (selectedCardType, typeList=[], index) => checkCardtypeAndAreaAndLotAndBrand(selectedCardType, typeList, index)

export const getSelectedArea = (selectedArea, areaList=[], index) => checkCardtypeAndAreaAndLotAndBrand(selectedArea, areaList, index)

export const getSelectedLot = (selectedLot, lotList=[], index) => checkCardtypeAndAreaAndLotAndBrand(selectedLot, lotList, index)

export const getSelectedBrand = (selectedBrand, brandList=[], index) => checkCardtypeAndAreaAndLotAndBrand(selectedBrand, brandList, index)

export const caculatePrice = (price, num) => price * num
