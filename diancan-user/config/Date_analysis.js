// // 计算当天的销售额
const db = wx.cloud.database()
const _ = db.command
const seven= db.collection('seven_day_sales')
// seven_day_sales:[{time:'2021-09-15',sales_valume:200}]

class analysis{
	constructor() {}
	// time:当天时间，sales_valume：提交的菜品总价
	async sameday(time,sales_valume){
		try{
			let query = await seven.where({time}).get()
			if(query.data.length == 0){
				await seven.add({data:{time,sales_valume}})
			}else{
				let total_amount = Number(query.data[0].sales_valume) + sales_valume
				// let a = 0.1 + 0.2
				// console.log(a)//0.30000000000000004:js自带的浮点数精度丢失
				let final_data = parseFloat((total_amount).toFixed(10))
				await seven.doc(query.data[0]._id).update({data:{sales_valume:final_data}})
			}
		}catch(e){
			throw '错误'
		}
	}
}

export{analysis}