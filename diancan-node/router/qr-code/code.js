const router = require('koa-router')()//实例化new路由
// 引入统一给前端返回的body响应
const result = require('../../config/result.js')
// 操作数据库的接口
const {getToken,Addurl,Tripurl,Updateurl} = require('../../config/databaseapi.js')
// 校验
const {postcode} = require('../../config/checking.js')
// 验证token合法性
const {Auth} = require('../../token/auth.js')
// 图片上传
const {buffer} = require('../../cos/cos')
// 时间模块
const moment = require('moment')
moment.locale('zh-cn')
// 给二进制图片重新命名
const {Code} = require('../../config/code-img.js')

// 添加桌号
router.post('/qrcode', new Auth().m, async ctx=>{
	let {table} = ctx.request.body
	// 校验
	new postcode(ctx,table).start()
	let time = moment().utcOffset(8).format('YYYY-MM-DD HH:mm:ss')
	try{
		// 查询该桌号是否已存在
		const query = `db.collection('table_qr_code').where({table:'${table}'}).get()`
		const res = await new getToken().posteve(Tripurl,query)
		if(res.data.length > 0){
			new result(ctx,'该桌号已经存在',202).answer()
		}else{
			let res_code = await new getToken().qrcode(table)
			const res_image = await buffer(Code(),res_code.data)
			let code_image = 'https://' + res_image
			let table_data = `db.collection('table_qr_code').add({data:{time:'${time}',table:'${table}',code:'${code_image}'}})`
			await new getToken().posteve(Addurl,table_data)
			new result(ctx,'添加成功').answer()
		}
	}catch(e){
		new result(ctx,'服务器发生错误',500).answer()
	}
})

// 请求所有桌号
router.get('/getqrcode',new Auth().m, async ctx=>{
	let {page} = ctx.query
	let sk = Number(page) * 10
	const query  =`db.collection('table_qr_code').orderBy('time','desc').limit(10).skip(${sk}).get()`
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


// 柱状图;七天销售额
router.get('/salesvolume',new Auth().m, async ctx=>{
	try{
	// 最终得到的数据类型
	// [{time:'2021-09-18',sales_volume:200},{time:'2021-09-17',sales_volume:300}]
	 let arr = [6,5,4,3,2,1,0]
	 let catedays = arr.map((item)=>{
		 return moment().utcOffset(8).subtract(item,'days').format('YYYY-MM-DD')
	 })
	 // console.log(catedays)
	 let str = JSON.stringify(catedays)
	// 查询数据库对应的日期
	const query = `db.collection('seven_day_sales').where({time:db.command.in(${str})}).orderBy('time','asc').field({time:true,sales_valume:true}).get()`
	const res = await new getToken().posteve(Tripurl,query)
	// console.log(res)
	const data = res.data.map(item=>{
		return{
			sales_valume:JSON.parse(item).sales_valume,
			time:JSON.parse(item).time,
			unix:moment(JSON.parse(item).time).unix()//时间戳：为了后面按照日历表排序
		}
	})
	// console.log(data)
	// 取前七天
	let days = catedays.map(item=>{
		return {sales_valume:0,time:item,unix:moment(item).unix()}
	})
	// console.log(days)
	// let res_arr = [...data,...days] 
	// console.log(res_arr)
	// [
	//   { sales_valume: 24, time: '2021-09-15', unix: 1631635200 },
	//   { sales_valume: 13, time: '2021-09-16', unix: 1631721600 },
	//   { sales_valume: 680, time: '2021-09-17', unix: 1631808000 },
	//   { sales_valume: 132, time: '2021-09-18', unix: 1631894400 },
	//   { sales_valume: 0, time: '2021-09-12', unix: 1631376000 },
	//   { sales_valume: 0, time: '2021-09-13', unix: 1631462400 },
	//   { sales_valume: 0, time: '2021-09-14', unix: 1631548800 },
	//   { sales_valume: 0, time: '2021-09-15', unix: 1631635200 },
	//   { sales_valume: 0, time: '2021-09-16', unix: 1631721600 },
	//   { sales_valume: 0, time: '2021-09-17', unix: 1631808000 },
	//   { sales_valume: 0, time: '2021-09-18', unix: 1631894400 }
	// ]
	// 数组对象去重
	// let ab = {}//对象里不能存在相同的key值
	let obj = {}
	let removal = [...data,...days].reduce((prev,item)=>{
		//1.prev第一次遍历接收初始值[],2.可以存储上一次遍历的结果
		if(!obj[item.time]){
			prev.push(item)
			obj[item.time] = true
			// {2021-09-15:true}
		}
		return prev
	},[])//[]1.初始值，2.也可以表示最终返回什么类型的数据
	console.log(removal)
	// 数组对象排序：按照unix来排序：日历表
	let res_sort = removal.sort((A,B)=>{
		return (A.unix - B.unix) //-降序+升序
	})
	console.log(res_sort)
	new result(ctx,'SUCCESS',200,res_sort).answer()
	}catch(e){
		new result(ctx,'服务器发生错误',500).answer()
	}
})




module.exports = router.routes()