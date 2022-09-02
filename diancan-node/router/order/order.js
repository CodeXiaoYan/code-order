const router = require('koa-router')()//实例化new路由
// 引入统一给前端返回的body响应
const result = require('../../config/result.js')
// 操作数据库的接口
const {getToken,Addurl,Tripurl,Updateurl} = require('../../config/databaseapi.js')
// 校验
const {shopinfor,catecheck,unitcheck,putoncheck} = require('../../config/checking.js')
// 验证token合法性
const {Auth} = require('../../token/auth.js')
// 图片上传
const {upload,cosfun} = require('../../cos/cos')
// 时间模块
const moment = require('moment')
moment.locale('zh-cn')
// 价格补零
const Price = require('e-commerce_price')


// 获取订单
router.get('/obtainorder', new Auth().m, async ctx=>{
	let {page,transac_status} = ctx.query
	let sk = Number(page) * 10
	let param = {}
	if(transac_status != ''){
		param['transac_status'] = transac_status
	}else{
		delete param.transac_status
	}
	let OBJ = JSON.stringify(param)
	const query = `db.collection('order-data').where(${OBJ}).orderBy('order_time', 'desc').field({menu:false}).limit(10).skip(${sk}).get()`
	try{
		const res = await new getToken().posteve(Tripurl,query)
		const data = res.data.map(item=>{return JSON.parse(item)})
		const tatal = {tatal:res.pager.Total}
		const array = {...{result:data},...tatal}
		new result(ctx,'SUCCESS',200,array).answer()
	}catch(e){
		console.log(e)
		new result(ctx,'服务器发生错误',500).answer()
	}
})

// 查看详细菜单
router.get('/vieworder',new Auth().m, async ctx=>{
	let {id} = ctx.query
	const query = `db.collection('order-data').doc('${id}').field({menu:true}).get()`
	try{
		const res = await new getToken().posteve(Tripurl,query)
		const data = res.data.map(item=>{return JSON.parse(item)})
		new result(ctx,'SUCCESS',200,data[0].menu).answer()
	}catch(e){
		new result(ctx,'服务器发生错误',500).answer()
	}
})

// 接单
router.get('/receiving',new Auth().m, async ctx=>{
	let {id} = ctx.query
	const query = `db.collection('order-data').doc('${id}').update({data:{order_receiving:'rec_order'}})`
	try{
		await new getToken().posteve(Updateurl,query)
		new result(ctx,'已接单,快上菜吧').answer()
	}catch(e){
		new result(ctx,'服务器发生错误',500).answer()
	}
})

// 结账以及推送订阅消息new Auth().m,
// 订阅消息小程序端用户允许几次商家可以发送几次
router.get('/checkout', new Auth().m, async ctx=>{
	let {id,openid,sett_amount,order_no} = ctx.query
	let newmoney = Price(Number(sett_amount))
	// 订阅消息字段组合
	let time = moment().utcOffset(8).format('YYYY-MM-DD HH:mm:ss')
	let subscribe = {'amount1':{'value':newmoney},'time2':{'value':time},'character_string3':{'value':order_no}}
	const query = `db.collection('order-data').doc('${id}').update({data:{transac_status:'success'}})`
	try{
		await new getToken().subscribe(openid,subscribe)
		await new getToken().posteve(Updateurl,query)
		new result(ctx,'结账成功').answer()
	}catch(e){
		new result(ctx,'服务器发生错误',500).answer()
	}

})










module.exports = router.routes()