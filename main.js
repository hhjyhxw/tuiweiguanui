import Vue from 'vue'
import store from './store'
import App from './App'

import * as filters from './filters'
import * as config from './config'

Object.keys(filters).forEach(key => {
	Vue.filter(key, filters[key])
})

//#ifdef H5
/* let jweixin = require('./components/jweixin-module')
let jwx = require('./components/jweixin-module/jwx')
Vue.mixin({
	onShow() {
		jwx.configWeiXin(jwx => {
		})
	}
}) */
//#endif

const defConfig = config.def

const msg = (title, duration = 1500, mask = false, icon = 'none') => {
	//统一提示方便全局修改
	if (Boolean(title) === false) {
		return;
	}
	uni.showToast({
		title,
		duration,
		mask,
		icon
	});
}

let userInfo = undefined

const logout = () => {
	userInfo = undefined
	uni.removeStorage({
		key: 'userInfo'
	})
}

const setUserInfo = (i) => {
	userInfo = i
}

const isVip = () => {
	return userInfo && userInfo.level
}

let loginLock = false

const request = (_gp, _mt, data = {}, failCallback) => {
	//异步请求数据
	return new Promise(resolve => {
		if (!userInfo || !userInfo.accessToken) {
			userInfo = uni.getStorageSync('userInfo')
		}
		let accessToken = userInfo ? userInfo.accessToken : ''
		let baseUrl = config.def().baseUrl
		uni.request({
			url: baseUrl + _gp +'/'+_mt,
			data: {
				...data
			},
			method: 'POST',
			header: {
				'Content-Type': 'application/json; charset=UTF-8',
				'accessToken': accessToken,
				// 'ACCESSTOKEN': accessToken
			},
			success: (res) => {
				if (res.statusCode === 200) {
					if (res.data.code === 0) {
						resolve(res.data);
					} else if (res.data.code === 1000) {
						/* if (failCallback) {
							failCallback(res.data)
						} */
						if (!loginLock) {
							loginLock = true
							uni.showModal({
								title: '登录提示',
								content: '您尚未登录，是否立即登录？',
								showCancel: true,
								confirmText: '登录',
								success: (e) => {
									if (e.confirm) {
										uni.navigateTo({
											url: '/pages/public/login'
										})
									}
								},
								fail: () => {},
								complete: () => {
									loginLock = false
								}
							})
						}

					} else {
						console.log("res.data==="+JSON.stringify(res.data))
						if (failCallback) {
							failCallback(res.data)
						} else {
							console.log("es.data.msg==="+JSON.stringify(res.data.msg))
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							})
						}
					}
				}
			}
		})
	})
}

const requestGet = (_gp, _mt, data = {}, failCallback) => {
	//异步请求数据
	return new Promise(resolve => {
		if (!userInfo || !userInfo.accessToken) {
			userInfo = uni.getStorageSync('userInfo')
		}
		let accessToken = userInfo ? userInfo.accessToken : ''
		let baseUrl = config.def().baseUrl
		uni.request({
			url: baseUrl + _gp +'/'+_mt,
			data: {
				...data
			},
			method: 'GET',
			header: {
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
				'accessToken': accessToken,
				// 'ACCESSTOKEN': accessToken
			},
			success: (res) => {
				if (res.statusCode === 200) {
					if (res.data.code === 0) {
						resolve(res.data);
					} else if (res.data.code === 1000) {
						/* if (failCallback) {
							failCallback(res.data)
						} */
						if (!loginLock) {
							loginLock = true
							uni.showModal({
								title: '登录提示',
								content: '您尚未登录，是否立即登录？',
								showCancel: true,
								confirmText: '登录',
								success: (e) => {
									if (e.confirm) {
										uni.navigateTo({
											url: '/pages/public/login'
										})
									}
								},
								fail: () => {},
								complete: () => {
									loginLock = false
								}
							})
						}

					} else {
						console.log("res.data==="+JSON.stringify(res.data))
						if (failCallback) {
							failCallback(res.data)
						} else {
							console.log("res.data.msg==="+JSON.stringify(res.data.msg))
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							})
						}
					}
				}
			}
		})
	})
}
const requestPost = (_gp, _mt, data = {}, failCallback) => {
	//异步请求数据
	return new Promise(resolve => {
		if (!userInfo || !userInfo.accessToken) {
			userInfo = uni.getStorageSync('userInfo')
		}
		let accessToken = userInfo ? userInfo.accessToken : ''
		let baseUrl = config.def().baseUrl
		uni.request({
			url: baseUrl + _gp +'/'+_mt,
			data: {
				...data
			},
			method: 'POST',
			header: {
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
				'accessToken': accessToken,
				// 'ACCESSTOKEN': accessToken
			},
			success: (res) => {
				if (res.statusCode === 200) {
					if (res.data.code === 0) {
						resolve(res.data);
					} else if (res.data.code === 1000) {
						// if (failCallback) {
						// 	failCallback(res.data)
						// }
						if (!loginLock) {
							loginLock = true
							uni.showModal({
								title: '登录提示',
								content: '您尚未登录，是否立即登录？',
								showCancel: true,
								confirmText: '登录',
								success: (e) => {
									if (e.confirm) {
										uni.navigateTo({
											url: '/pages/public/login'
										})
									}
								},
								fail: () => {},
								complete: () => {
									loginLock = false
								}
							})
						}

					} else {
						console.log("res.data==="+JSON.stringify(res.data))
						if (failCallback) {
							failCallback(res.data)
						} else {
							console.log("res.data.msg==="+JSON.stringify(res.data.msg))
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							})
						}
					}
				}
			}
		})
	})
}

const uploadImg = (successCallback) => {
	let baseUrl = config.def().baseUrl
	uni.chooseImage({
		sizeType: ['compressed'],
		success: function(res) {
			for (let i = 0; i < res.tempFilePaths.length; i++) {
				uni.request({
					url: baseUrl + '/upload',
					method: 'get',
					success: function(signRes) {
						uni.showLoading({
							title: '图片上传中',
						})
						let fileName = ('imgs/' + random_string(15) + get_suffix(res.tempFilePaths[i]))
						uni.uploadFile({
							url: signRes.data.baseUrl,
							filePath: res.tempFilePaths[i],
							name: 'file',
							formData: {
								name: res.tempFilePaths[i],
								key: fileName,
								policy: signRes.data.policy,
								OSSAccessKeyId: signRes.data.accessid,
								success_action_status: '200',
								signature: signRes.data.signature
							},
							success: function(uploadRes) {
								uni.hideLoading()
								if (uploadRes.statusCode === 200) {
									if (successCallback) {
										successCallback(signRes.data.baseUrl + fileName)
									} else {
										uni.showToast({
											title: '上传成功',
											icon: 'none'
										})
									}
								} else {
									uni.hideLoading()
									uni.showToast({
										title: '网络错误 code=' + uploadRes.statusCode,
										icon: 'none'
									})
								}
							}
						})
					}
				})
			}
		}
	})
}

const uploadfile = (successCallback) => {
	let baseUrl = config.def().baseUrl
	if (!userInfo || !userInfo.accessToken) {
		userInfo = uni.getStorageSync('userInfo')
	}
	let accessToken = userInfo ? userInfo.accessToken : ''
	let _token = {'accessToken': accessToken};
	uni.chooseImage({
		sizeType: ['compressed'],
		count: 3, //默认9
		sourceType: ['camera'],
		success: function(res) {
			for (let i = 0; i < res.tempFilePaths.length; i++) {
					uni.showLoading({
						title: '图片上传中',
					})
					uni.uploadFile({
						url: baseUrl + '/upload/uploadfile',
						filePath: res.tempFilePaths[i],
						name: 'file',
						header:_token,
						formData: {
							
						},
						success: function(uploadRes) {
							uni.hideLoading()
							if (uploadRes.statusCode === 200) {
								if (successCallback) {
									successCallback(uploadRes.data)
								} else {
									uni.showToast({
										title: '上传成功',
										icon: 'none'
									})
								}
							} else {
								uni.hideLoading()
								uni.showToast({
									title: '网络错误 code=' + uploadRes.statusCode,
									icon: 'none'
								})
							}
						},
					})
			
			}
		}
	})
}

function get_suffix(filename) {
	var pos = filename.lastIndexOf('.')
	var suffix = ''
	if (pos != -1) {
		suffix = filename.substring(pos)
	}
	return suffix;
}

function random_string(len) {
	len = len || 32;
	var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
	var maxPos = chars.length;
	var pwd = '';
	for (var i = 0; i < len; i++) {
		pwd += chars.charAt(Math.floor(Math.random() * maxPos));
	}
	return pwd;
}

const prePage = () => {
	let pages = getCurrentPages();
	let prePage = pages[pages.length - 2];
	// #ifdef H5
	return prePage;
	// #endif
	return prePage.$vm;
}

const globalData = {}

Vue.config.productionTip = false
Vue.prototype.$fire = new Vue();
Vue.prototype.$store = store;
Vue.prototype.$api = {
	msg,
	prePage,
	request,
	requestGet,
	requestPost,
	uploadImg,
	uploadfile,
	logout,
	isVip,
	setUserInfo,
	defConfig,
	globalData
};
//#ifdef H5
// Vue.prototype.$jweixin = jweixin;
//#endif

App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()