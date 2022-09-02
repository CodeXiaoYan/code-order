const axios = require('axios')
const qs = require('querystring')
const result = require('./handle.js')
// 拼接tokenurl地址
let param = qs.stringify({
	grant_type:'client_credential',
	appid:'wx1efcb8e5f9313dd0',
	secret:'02531aed8b395c5994f47079b10bee92'
})

// 获取token的地址：必须要得到token才有权限操作云开发数据库
let url  ='https://api.weixin.qq.com/cgi-bin/token?' + param

// 云环境id
let env = 'diancan-user-3gta3yw924329a21'

// 数据库插入记录url
let Addurl = 'https://api.weixin.qq.com/tcb/databaseadd?access_token='

// 数据库查询记录url
let Tripurl = 'https://api.weixin.qq.com/tcb/databasequery?access_token='

// 数据库更新记录url
let Updateurl = 'https://api.weixin.qq.com/tcb/databaseupdate?access_token='

// 订阅消息
let Subscribe = 'https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token='

// 小程序码接口
let Qrcode = 'https://api.weixin.qq.com/wxa/getwxacode?access_token='

class getToken{
	constructor() {}
	
	// 获取token
	async gettoken(){
		try{
			let token = await axios.get(url)
			if(token.status == 200){
				return token.data.access_token
			}else{
				throw '获取token错误'
				// 出现throw这个关键词，就会进入到catch里面，并且throw给得值会在catch的参数里
			}
		}catch(e){
			throw new result(e,500)
		}
	}
	
	//调用云开发http api接口
	async posteve(dataurl,query){
		try{
			let token = await this.gettoken()
			let data = await axios.post(dataurl + token, {env,query})
			if(data.data.errcode == 0){
				return data.data
			}else{
				throw '请求出错'
			}
		}catch(e){
			throw new result(e,500)
		}
	}
	
	
	// 订阅消息
	async subscribe(touser,data){
		try{
			let token = await this.gettoken()
			let OBJ = {touser,data,template_id:'填写你的模板消息id',page:'pages/my-order/my-order',miniprogram_state:'developer'}
			let colldata = await axios.post(Subscribe + token,OBJ)
			return 'success'
		}catch(err){
			throw new result(e,500)
		}
	}
	
	// 生成小程序码
	async qrcode(number){
		let token = await this.gettoken()
		let OBJ = JSON.stringify({path:'pages/index/index?number=' + number})
		try{
			let colldata = await axios.post(Qrcode + token,OBJ,{responseType:'arraybuffer'})
			return colldata
		}catch(e){
			throw new result(e,500)
		}
	}
	
}

module.exports = {getToken,Addurl,Tripurl,Updateurl}