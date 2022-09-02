// 生成订单编号
let Code = function(){
	var orderCode = ''
	for (var i = 0; i < 6; i++){
		orderCode += Math.floor(Math.random() * 10)
	}
	// 时间戳+orderCode
	orderCode = new Date().getTime() + orderCode
	return orderCode
}

export{Code}