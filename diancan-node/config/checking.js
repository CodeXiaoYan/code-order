// 公用参数校验
const result = require('./handle.js')

class checking{
	constructor(ctx,...obj) {//...obj接收不固定参数
	    this.ctx = ctx
		this.obj = obj//接收一个数组字符串
		// console.log(obj)
	}
	
	// 校验前端传来的值为undefined
	Errunder(){
		let bvc = this.obj.indexOf(undefined)
		if(bvc != -1){
			throw new result('参数填写错误',400)
		}
	}
	
	// 校验手机号码格式
	Phone(moblie,num){
		let phone = /^1[3456789]\d{9}$/
		if(!phone.test(this.obj[num])){
			throw new result(moblie,202)
		}
	}

	// 密码校验：6-20位数字和字母结合
	Password(pass,num){
		let reg = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,20}$/
		if(!reg.test(this.obj[num])){
			throw new result(pass,202)
		}
	}
	
	// 校验空数组
	Arrfun(list,num){
		if(JSON.parse(this.obj[num]).length === 0){
			throw new result(list,202)
		}
	}
	
	// 校验为空
	Parameter(list){
		let bvc = this.obj.indexOf('')
		if(bvc != -1){
			throw new result(list[bvc],202)
		}
	}
	
	// 空格符校验
	Blank(list){
		let vbn = this.obj.filter(item=>{
			return item.split(" ").join("").length === 0
		})
		let bvc = this.obj.indexOf(vbn[0])
		if(bvc != -1){
			throw new result(list[bvc],202)
		}
	}
}

// 注册校验
class regcheck extends checking{
	start(){
		super.Errunder()
		super.Phone('请填写正确的手机号码',0)
		super.Password('密码必须由6-20位数字和字母的组合',1)
	}
}

// 商家信息上传的校验
class shopinfor extends checking{
	start(){
		let arr = ['请输入店铺名称','请输入店铺地址','请输入开始时间','请输入结束时间','请上传店铺logo']
		super.Errunder()
		super.Parameter(arr)
		super.Blank(arr)
		super.Arrfun('请上传店铺logo',4)
	}
}

// 类目上传校验
class catecheck extends checking{
	start(){
		let arr = ['请输入菜品类目']
		super.Errunder()
		super.Parameter(arr)
		super.Blank(arr)
	}
}

// 添加菜品单位校验
class unitcheck extends checking{
	start(){
		let arr = ['请输入自定义单位']
		super.Errunder()
		super.Parameter(arr)
		super.Blank(arr)
	}
}

// 上架菜品校验
class putoncheck extends checking{
	start(){
		let arr = ['请选择菜品类目','请输入菜品名称','请上传菜品图片']
		super.Errunder()
		super.Parameter(arr)
		super.Blank(arr)
		super.Arrfun('请上传菜品图片',2)
	}
}

// 上架菜品校验：规格或无规格二选一校验
class newspecs extends checking{
	start(att_hide,att_name,specs){
		let specs_data = JSON.parse(specs)
		if(att_hide == 'true'){
			// 有规格
			if(att_name.split(" ").join("").length == 0){
				throw new result('请输入属性名',202)
			}else{
				let file_data = specs_data.filter(item=>{
					return item.attribute == '' || item.unitprice == '' || item.unit == '' || item.in_stock == ''
				})
				if(file_data.length > 0){
					throw new result('请完善菜品规格',202)
				}
			}
		}else{
			// 无规格
			console.log('无规格')
			let file_data = specs_data.filter(item=>{
				return item.unitprice == '' || item.unit == '' || item.in_stock == ''
			})
			if(file_data.length > 0){
				throw new result('请完善菜品价格或单位或库存',202)
			}
		}
	}
}

//添加桌号
class postcode extends checking{
	start(){
		let arr = ['桌号不能为空']
		super.Errunder()
		super.Parameter(arr)
		super.Blank(arr)
	}
}




module.exports = {regcheck,shopinfor,catecheck,unitcheck,putoncheck,postcode,newspecs}