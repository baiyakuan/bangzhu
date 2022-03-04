export const mapOrderListData = (sourceData,boolenValue) => {
	let orderList = sourceData.map((item) => ({...item,checked:boolenValue}))
	return orderList
}
