// 交易状态
let staff = function(){
	let options = [
				{
				  value: 'success',
				  label: '已结账'
				}, {
				  value: 'unsettled',
				  label: '待结账'
				}
	]
	return options
}

// 菜品类目：从数据库获取，这个不需要了
let category = function(){
	let options = [
				{
				  value: '001',
				  label: '荤菜类'
				},
				{
				  value: '素菜类',
				  label: '素菜类'
				},
				{
				  value: '酒水类',
				  label: '酒水类'
				},
				{
				  value: '特色小吃',
				  label: '特色小吃'
				}
	]
	return options
}

// 规格：从数据库获取，这个不需要了
let company = function(){
	let options = [
				{
				  value: '份',
				  label: '份'
				},
				{
				  value: '瓶',
				  label: '瓶'
				},
				{
				  value: '箱',
				  label: '箱'
				},
				{
				  value: '支',
				  label: '支'
				},
				{
				  value: '条',
				  label: '条'
				},
				{
				  value: '自定义单位',
				  label: '自定义单位'
				}
	]
	return options
}

export{staff,category,company}