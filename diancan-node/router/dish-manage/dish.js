const router = require('koa-router')()//实例化new路由
// 引入统一给前端返回的body响应
const result = require('../../config/result.js')
// 操作数据库的接口
const {getToken,Addurl,Tripurl,Updateurl} = require('../../config/databaseapi.js')
// 校验
const {shopinfor,catecheck,unitcheck,putoncheck,newspecs} = require('../../config/checking.js')
// 验证token合法性
const {Auth} = require('../../token/auth.js')
// 图片上传
const {upload,cosfun} = require('../../cos/cos')
// 生成规格id
const {specs_id} = require('../../config/code-img')
// 时间模块
const moment = require('moment')
moment.locale('zh-cn')

// 获取菜品单位
router.get('/obtainunit', new Auth().m, async ctx=>{
	const query = `db.collection('dishunit').get()`
	try{
		const res = await new getToken().posteve(Tripurl,query)
		const data = res.data.map(item=>{return JSON.parse(item)})
		new result(ctx,'SUCCESS',200,data).answer()
	}catch(e){
		new result(ctx,'服务器发生错误',500).answer()
	}
})

// 添加菜品单位
router.post('/dishunit', new Auth().m, async ctx=>{
	const {unit} = ctx.request.body
	// 校验
	new unitcheck(ctx,unit).start()
	// 查询数据库是否已有
	const unid = new Date().getTime()
	const query = `db.collection('dishunit').where({label:'${unit}'}).get()`
	const cate = `db.collection('dishunit').add({data:{value:'${unit}',label:'${unit}',unid:'${unid}'}})`
	try{
		const res = await new getToken().posteve(Tripurl,query)
		if(res.data.length > 0){
			new result(ctx,'该单位已经存在',202).answer()
		}else{
			await new getToken().posteve(Addurl,cate)
			new result(ctx,'添加成功').answer()
		}
	}catch(e){
		new result(ctx,'添加失败,服务器发生错误',500).answer()
	}
	
})


// 上架菜品uploaddishes
router.post('/uploaddishes', new Auth().m, async ctx=>{
	const {id,category,name,att_hide,att_name,specs,image,value} = ctx.request.body
	// 校验
	new putoncheck(ctx,category,name,image).start()
	new newspecs(ctx).start(att_hide,att_name,specs)
	let specs_data = JSON.parse(specs).map(item=>{
		return {attribute:item.attribute,unitprice:Number(item.unitprice),
				unit:item.unit,in_stock:Number(item.in_stock),
				specs_id:specs_id()
		}
	})
	let str_specs = JSON.stringify(specs_data)
	// 如果无规格，就取所有规格库存的值，否则取数组第一项里的库存
	let NUM = 0
	specs_data.forEach(item=> NUM += item.in_stock)
	let IN_STOCK = att_hide == 'true' ? NUM : specs_data[0].in_stock
	
	// 取价格最小的出来
	let min_data = specs_data.sort((A,B)=>{return (A.unitprice - B.unitprice)})
	// 当前时间---utcOffset(8):东八区:北京时间
	let time = moment().utcOffset(8).format('YYYY-MM-DD HH:mm:ss')
	let query = `db.collection('dishes-data').add({data:
	{
		category:'${category}',name:'${name}',unitprice:${min_data[0].unitprice},unit:'${min_data[0].unit}',
		image:${image},quantity:0,onsale:true,cid:'${value}',time:'${time}',monthlysale:0,
		att_hide:${att_hide},att_name:'${att_name}',specs:${str_specs},good_specs:'',
		in_stock:${IN_STOCK}
	}
	})`
	// 对当前类目下的count字段自增
	let count = `db.collection('dishes-category').where({cid:'${value}'}).update({data:{count:db.command.inc(1)}})`
	try{
		await new getToken().posteve(Addurl,query)
		await new getToken().posteve(Updateurl,count)
		new result(ctx,'提交成功').answer()
	}catch(e){
		new result(ctx,'提交失败,服务器发生错误',500).answer()
	}
})


// 获取菜品数据
router.get('/obtaindishes', new Auth().m, async ctx=>{
	let {page} = ctx.query
	let sk = page * 10
	const query = `db.collection('dishes-data').orderBy('time', 'desc').limit(10).skip(${sk}).get()`
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

// 下架菜品
router.get('/fromsale', new Auth().m, async ctx=>{
	const {id,value} = ctx.query
	// 修改该条菜品的onsale为false
	const query = `db.collection('dishes-data').doc('${id}').update({data:{onsale:false}})`
	// 查询到在哪个类目下将count字段自减
	let count = `db.collection('dishes-category').where({cid:'${value}'}).update({data:{count:db.command.inc(-1)}})`
	try{
		await new getToken().posteve(Updateurl,query)
		await new getToken().posteve(Updateurl,count)
		new result(ctx,'已下架').answer()
	}catch(e){
		console.log(e)
		new result(ctx,'服务器发生错误',500).answer()
	}
})

// 编辑菜品
router.post('/modifydishes', new Auth().m, async ctx=>{
	const {id,category,name,att_hide,att_name,specs,image,value} = ctx.request.body
	// 校验
	new putoncheck(ctx,category,name,image).start()
	new newspecs(ctx).start(att_hide,att_name,specs)
	let specs_data = JSON.parse(specs).map(item=>{
		return {attribute:item.attribute,unitprice:Number(item.unitprice),unit:item.unit}
	})
	let str_specs = JSON.stringify(specs_data)
	// 取价格最小的出来
	let min_data = specs_data.sort((A,B)=>{return (A.unitprice - B.unitprice)})
	// 当前时间---utcOffset(8):东八区:北京时间
	let time = moment().utcOffset(8).format('YYYY-MM-DD HH:mm:ss')
	let query = `db.collection('dishes-data').doc('${id}').update({data:
	{
		category:'${category}',name:'${name}',unitprice:${min_data[0].unitprice},unit:'${min_data[0].unit}',
		image:${image},quantity:0,onsale:true,cid:'${value}',time:'${time}',
		att_hide:${att_hide},att_name:'${att_name}',specs:${str_specs}
	}
	})`
	try{
		await new getToken().posteve(Updateurl,query)
		new result(ctx,'修改成功').answer()
	}catch(e){
		new result(ctx,'服务器发生出错误',500).answer()
	}
})


















module.exports = router.routes()