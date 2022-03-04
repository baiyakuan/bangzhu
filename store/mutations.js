import { setToken, removeToken, getStorage, setStorage} from '@/utils/auth'
export default {
  set_token (state, token) {
    state.token = token;
    setToken(token);
  },
	set_openid(state , openid){
		state.openid = openid;
		setStorage('openid',openid);
	},
  set_phoneNumber (state, phoneNumber) {
    state.phoneNumber = phoneNumber;
  },
  set_Scanres (state, scanres) {
    state.scanres = scanres
    set_Scanres(scanres)
  },
  set_phone (state, phone) {
    state.phone = phone
  },
  set_dataact (state, dataact) {
    state.dataact = dataact
  },
  set_datanotice (state, datanotice) {
    state.datanotice = datanotice
  },
  set_userInfo (state, userInfo) {
	setStorage('userInfo',userInfo)
    state.userInfo = userInfo
  },
  set_wallet (state, wallet) {
    state.wallet = wallet
  },
  set_cardBalance (state, balance) {
    state.cardBalance = balance
  },
  set_code (state, code) {
    state.code = code
  },
  set_address (state, address) {
    state.address = address
  },
  set_applyOrderId (state, applyOrderId) {
    state.applyOrderId = applyOrderId
  },
  set_invoice (state, invoice) {
    state.invoice = invoice
  },
  set_orderIdDetail (state, orderIdDetail) {
    state.orderIdDetail = orderIdDetail
  },
	set_discountOrder(state,discountOrder){
		state.discountOrder = discountOrder
	},
  set_carId (state, carId) {
    state.carId = carId
  },
  set_discount (state, discount) {
    state.discount = discount
  },
  set_search (state, search) {
    state.search = search
  },
  set_memberuserInfo (state,memberuserInfo){
    state.memberuserInfo = memberuserInfo
  },
  set_headInfo (state,headInfo){
    state.headInfo = headInfo
  },
  remove_token (state) {
    state.token = null
    removeToken()
  },
  setLocationInfo(state, { longitude , latitude  }) {
	  state.location.longitude = longitude
	  state.location.latitude = latitude
  },
  setSystemInfo(state, system) {
	  state.system = system
		state.screen.windowHeight = system.windowHeight
		state.screen.rate = 750 / system.windowWidth
  },
  updateBrandNumber(state, brandNum) {
	  state.userInfo.brandNum = brandNum
  },
  setAdv(state,value){
	   state.isShowAdv = value
  },
  saveOutOrderInfo(state,value){
  	   state.outOrderInfo = value
  }
}