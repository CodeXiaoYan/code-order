// 提示
const Titles = class{
  constructor(message,info,msg){
      this.info = info
      this.msg = msg
      this.message = message
  }

// 提示
 funtitle(){
      this.message({
        type: this.info,
        message: this.msg,
        duration:1500
      })
  }
  
  // 弹窗提示
  popup(confirm,msg){
	  return new Promise((resolve,reject)=>{
		  confirm(msg, '提示', {
			 confirmButtonText: '确定',
			 cancelButtonText: '取消',
			 type: 'warning',
			 center: true
		  }).then((action) => {
			 resolve('200')
		  }).catch(() => {
		  	 resolve('400')
		  });
	  })
  }
}

export default  Titles
