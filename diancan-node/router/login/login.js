// -----------------------------注册-登录-接口----------------------
const router = require('koa-router')()//实例化new路由
// 引入统一给前端返回的body响应
const result = require('../../config/result.js')
// 操作数据库的接口
const {getToken,Addurl,Tripurl} = require('../../config/databaseapi.js')
// 校验
const {regcheck} = require('../../config/checking.js')
// 生成token
const {gentoken} = require('../../token/jwt.js')
// 验证token合法性
const {Auth} = require('../../token/auth.js')

// 注册接口
router.post('/register', async ctx=>{
	// post提交的值在：ctx.request.body
	let {account,password} = ctx.request.body
	// 1:校验前端传来的值是否合法
	new regcheck(ctx,account,password).start()
	console.log('1234')
	// 2.查询手机号码之前是否已经注册过
	const query = `db.collection('business-acc').where({account:'${account}'}).get()`
	try{
		const user = await new getToken().posteve(Tripurl,query)
		if(user.data.length > 0){
			// 已经注册过
			new result(ctx,'已经注册过',202).answer()
		}else{
			// 没有注册过
			// [账号，密码，uid：商家唯一标识]
			// 生成商家唯一标识uid1630929117237
			const uid = new Date().getTime()
			const struid = JSON.stringify(uid)
			const OBJ = {account,password,uid:struid}
			const STR = JSON.stringify(OBJ)
			const addquery = `db.collection('business-acc').add({data:${STR}})`
			await new getToken().posteve(Addurl,addquery)
			new result(ctx,'注册成功').answer()
		}
	}catch(e){
		console.log(e)
		new result(ctx,'注册失败,服务器发生错误',500).answer()
	}
})


// 登录接口
router.post('/login', async ctx=>{
	let {account,password} = ctx.request.body
	const query = `db.collection('business-acc').where({account:'${account}',password:'${password}'}).get()`
	try{
		const user = await new getToken().posteve(Tripurl,query)
		if(user.data.length == 0){
			new result(ctx,'账号或密码错误',202).answer()
		}else{
			const OBJ = JSON.parse(user.data[0])
			new result(ctx,'登录成功',200,{token:gentoken(OBJ.uid)}).answer()
		}
	}catch(e){
		console.log(e)
		new result(ctx,'登录失败,服务器发生错误',500).answer()
	}
})





module.exports = router.routes()