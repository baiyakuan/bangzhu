import { getUsersInfo , userLogin , wallet , bindPhone , getOpenId ,getParkingCarBalance} from '@/api/index.js'
export default {
  wallet ({commit}) {
    return new Promise((resolve, reject) => {
      wallet({istrue:true})
      .then(res => {
        commit('set_wallet', res.data.obj)
        resolve(res)
      })
      .catch(err => {
        reject(err)
      })
    })
  },
  getCardBalance ({commit},data) {
	data.istrue=true
    return new Promise((resolve, reject) => {
      getParkingCarBalance(data)
      .then(res => {
        res.data.obj.balance ? commit('set_cardBalance', res.data.obj.balance) : commit('set_cardBalance', null)
        resolve(res)
      })
      .catch(err => {
        reject(err)
      })
    })
  },
  getUsersInfo ({commit}) {
    return new Promise((resolve, reject) => {
      getUsersInfo({istrue:true})
      .then(res => {
        commit('set_userInfo', res.data.obj || {})
        resolve(res)
      })
      .catch(err => {
        reject(err)
      })
    })
  },
  userLogin ({commit, dispatch}, data) {
    data.istrue=true
    return new Promise((resolve, reject) => {
      userLogin(data)
      .then(res => {
        if (res.data.code === '1') {
          wx.login({
            success: async ({ code }) => {
              getOpenId({
                code,
                istrue:true
              })
            }
          })
          commit('set_token', res.data.obj.token)
          commit('set_phone', res.data.obj.phone)
          dispatch('getUsersInfo')
          .then(res => {
            if (res.data.code === '1') {
              commit('set_userInfo', res.data.obj)
            }
            resolve(res.data)
          })
          .catch(err => {
            reject(err)
          })
        }
      })
    })
    .catch(err => {
      reject(err)
    })
  },
  userthirdLogin ({commit, dispatch}, data) {
    return new Promise((resolve, reject) => {
      if (data.code === '1') {
        commit('set_token', data.obj.token)
        dispatch('getUsersInfo')
        .then(res => {
          if (data.code === '1') {
            commit('set_userInfo', data.obj)
          }
          resolve(data)
        })
        .catch(err => {
          reject(err)
        })
      }
    })
    .catch(err => {
      reject(err)
    })
  },

  bindPhone ({commit, dispatch}, data) {
    return new Promise((resolve, reject) => {
      bindPhone(data)
      .then(res => {
        if (res.data.code === '1') {
          commit('set_token', res.data.obj.token)
          dispatch('getUsersInfo')
          .then(res => {
            if (res.data.code === '1') {
              commit('set_userInfo', res.data.obj)
            }
            resolve(res.data)
          })
          .catch(err => {
            reject(err)
          })
        }
      })
    })
    .catch(err => {
      reject(err)
    })
  },

  userLogout ({commit}) {
    commit('remove_token')
    commit('set_userInfo', {})
  },
  
	updataLocation ({commit}) {
	  console.log("重新获取")
	  uni.getLocation({
		type: 'gcj02',
		success: function({ longitude, latitude }) {
			console.log({ longitude, latitude })
			commit('setLocationInfo', { longitude, latitude });
		}
	  })
	}
}
