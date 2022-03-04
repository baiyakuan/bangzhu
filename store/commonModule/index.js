	import { selectByManage,getAdvertPutingList,saveAdvertClickRecord} from '@/api'
	import { isValidResponse } from '@/utils'
	export default {
		namespaced: true,
		state: () => ({
			advertisement:'', //项目中配置的广告
			advList:[],//adv_swiper项目中配置的广告
		}),
		actions: {
			async getAdvertisement ({commit, state, rootState}, {type}) {
				const {data} = await selectByManage({ type,requestType: "miniprogram",version: rootState.version,istrue:true})
				if(isValidResponse(data)) {
					if(data.obj){
						commit("updateAdvertisement",data.obj.list[0])
					}else{
						commit("updateAdvertisement",'')
					}
				}else{
					commit("updateAdvertisement",'')
				}		
			},
			async getAdvList ({commit, state, rootState}, {type}) {
				const {data} = await getAdvertPutingList({ 
					type,
					requestType: "miniprogram",
					version: rootState.version,
					areaId:rootState.address.adcode ?rootState.address.adcode : 0 ,
					longitude:rootState.location.longitude ?rootState.location.longitude : 0 ,
					latitude:rootState.location.latitude ?rootState.location.latitude : 0 ,
					istrue:true})
				if(isValidResponse(data)) {
					if(data.obj){
						commit("updateAdvList",data.obj.advertPutingList)
					}else{
						commit("updateAdvList",[])
					}
				}else{
					commit("updateAdvList",[])
				}	
				return new Promise((res,rej) => {
					isValidResponse(data) && res(data.obj)
				})
			},
			async saveAdvertClickRecord ({commit, state, rootState}, {advId,putRecordId}) {
				const {data} = await saveAdvertClickRecord({ 
					requestType: "miniprogram",
					advId,
					putRecordId,
					istrue:true })	
			},
		},
		mutations:{
			updateAdvertisement(state, advertisement) {
				state.advertisement = advertisement
			},
			updateAdvList(state, list) {
				state.advList = list
			},
		}
	}