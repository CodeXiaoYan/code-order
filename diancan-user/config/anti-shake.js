// 防抖封装
function shake(fn, delay){
	let timer = null
	return function(){
		if(timer){
			clearTimeout(timer)
		}
		timer = setTimeout(()=>{
			fn.apply(this,arguments)
		}, delay)
	}
}

export {shake}