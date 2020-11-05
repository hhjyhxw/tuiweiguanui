/**
 * dev 开发
 * pro 正式
 * shenhe
 */
const active = 'dev';

const dev = {
	// baseUrl: 'http://127.0.0.1:8080',
	// baseUrl: 'https://zl.haiyunzy.com/tuweiguan/api/',
	baseUrl: 'https://www.scrol.top/tuweiguan/api/',
	appid: 'wx83f2242000525551',
	debug: true
}

const pro = {
	// baseUrl: 'http://127.0.0.1:8080',
	baseUrl: 'https://laimai.yunhu168.com/laimaiapi/api/',
	h5Appid: 'wxb66b599f7f61b46f',
	// debug: true
}

const shenhe = {
	// baseUrl: 'http://127.0.0.1:8080',
	baseUrl: 'https://shenhe.yunhu168.com/shenheapi/api/',
	h5Appid: 'wx83f2242000525551',
	// debug: true
}

export function def() {
	return active === 'dev' ? dev : (active === 'pro' ? pro : shenhe)
}
