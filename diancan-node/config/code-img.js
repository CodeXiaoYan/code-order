// 给二进制图片重新命名786987.jpg
let Code = function(){
	var orderCode = ''
	for (var i = 0; i < 6; i++){
		orderCode += Math.floor(Math.random() * 10)
	}
	// 时间戳+orderCode
	orderCode = new Date().getTime() + orderCode
	return orderCode + '.jpg'
}

let specs_id = function(){
  let chars = 'ABCDEFGHIJKLMNUPQRSTUVWYZabcdefghijklmn2345678'
  let maxPos = chars.length
  let res = ''
  for(let i = 0; i < 12; i++){
    res += chars.charAt(Math.floor(Math.random() * maxPos))
  }
  return res
}

module.exports = {Code,specs_id}