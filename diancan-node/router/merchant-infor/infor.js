const router = require('koa-router')()//实例化new路由
// 引入统一给前端返回的body响应
const result = require('../../config/result.js')
// 操作数据库的接口
const {getToken,Addurl,Tripurl,Updateurl} = require('../../config/databaseapi.js')
// 校验
const {shopinfor,catecheck} = require('../../config/checking.js')
// 验证token合法性
const {Auth} = require('../../token/auth.js')
// 图片上传
const {upload,cosfun} = require('../../cos/cos')
// 时间模块
const moment = require('moment')
moment.locale('zh-cn')

// 图片上传接口name:'file'
router.post('/uploadres', upload.single('file'), async ctx=>{
	// console.log(ctx.file)//接收前端上传的静态资源文件：ctx.file
	try{
		const res = await cosfun(ctx.file.filename,ctx.file.path)
		new result(ctx,'SUCCESS',200,'https://' + res).answer()
	}catch(e){
		new result(ctx,'上传失败,服务器发生错误',500).answer()
	}
})

// 商家信息上传
router.post('/uploadshop', new Auth().m, async ctx=>{
	const {id,name,address,startTime,endTime,logo} = ctx.request.body
	new shopinfor(ctx,name,address,startTime,endTime,logo).start()
	let bus_hours = JSON.stringify({startTime,endTime})
	// 提交到数据库
	// 数组类型不需要这样：'${}'
	let query = `db.collection('shop-infor').add({data:{name:'${name}',address:'${address}',
	bus_hours:${bus_hours},
	logo:${logo}}})`
	try{
		await new getToken().posteve(Addurl,query)
		new result(ctx,'提交成功').answer()
	}catch(e){
		console.log(e)
		new result(ctx,'提交失败,服务器发生错误',500).answer()
	}
})

// 获取商家信息接口
router.get('/obtainshop', new Auth().m, async ctx=>{
	const query = `db.collection('shop-infor').get()`
	try{
		let res = await new getToken().posteve(Tripurl,query)
		const data = res.data.map(item=>{return JSON.parse(item)})
		new result(ctx,'SUCCESS',200,data).answer()
	}catch(e){
		new result(ctx,'服务器发生错误',500).answer()
	}
})

// 更新修改商家信息
router.post('/modifyshop', new Auth().m, async ctx=>{
	const {id,name,address,startTime,endTime,logo} = ctx.request.body
	new shopinfor(ctx,name,address,startTime,endTime,logo).start()
	let bus_hours = JSON.stringify({startTime,endTime})
	// 提交到数据库修改
	let query = `db.collection('shop-infor').doc('${id}').update({data:{name:'${name}',address:'${address}',
	bus_hours:${bus_hours},
	logo:${logo}}})`
	try{
		await new getToken().posteve(Updateurl,query)
		new result(ctx,'修改成功').answer()
	}catch(e){
		new result(ctx,'修改失败,服务器发生错误',500).answer()
	}
})

// 添加菜品类目
router.post('/addcategory', new Auth().m, async ctx=>{
	const {category} = ctx.request.body
	// 校验
	new catecheck(ctx,category).start()
	// 时间戳生成分类id:Date().getTime():1970年1月1日0时0分0秒到现在的毫秒数
	const cid = 'a' +  new Date().getTime()
	// 查询数据库是否已存在该类目
	const query = `db.collection('dishes-category').where({label:'${category}'}).get()`
	const cate = `db.collection('dishes-category').add({data:{value:'${category}',label:'${category}',cid:'${cid}',count:0,sele_quantity:0}})`
	try{
		const res = await new getToken().posteve(Tripurl,query)
		if(res.data.length > 0){
			// 该类目已经存在
			new result(ctx,'该类目已经存在',202).answer()
		}else{
			// 该类目不存在
			await new getToken().posteve(Addurl,cate)
			new result(ctx,'添加成功').answer()
		}
	}catch(e){
		new result(ctx,'添加失败,服务器发生错误',500).answer()
	}
	
})

// 获取菜品类目
router.get('/obtaincate', new Auth().m, async ctx=>{
	// get路径携带前端传来的分页数
	// ctx.query:获取get路径携带的值：www.baidu.com?page=1
	// 关于分页：小程序一次性返回20条数据。nodejs端一次性返回10条；云函数端一次性返回100条
	const {page} = ctx.query
	const sk = page * 10
	const query = `db.collection('dishes-category').orderBy('cid', 'desc').limit(10).skip(${sk}).get()`
	try{
		const res = await new getToken().posteve(Tripurl,query)
		const data = res.data.map(item=>{return JSON.parse(item)})
		const tatal = {tatal:res.pager.Total}
		const array = {...{result:data},...tatal}
		new result(ctx,'SUCCESS',200,array).answer()
	}catch(e){
		new result(ctx,'服务器发生错误',500).answer()
	}
})





module.exports = router.routes()