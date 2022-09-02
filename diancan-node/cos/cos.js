const multer = require('@koa/multer')
const COS = require('cos-nodejs-sdk-v5');

var cos = new COS({
   SecretId: 'AKIDufBUZOyX6XmocCZhcJp8F8oHXbR3RbXF',
   SecretKey: 'aw4ye9SYSAeuwkMkvsb5LNBl7FAqIWYM',
   Protocol:'https:'
});

let Bucket = 'diancan-1313227358'
let Region = 'ap-guangzhou'

let cosfun = function(filename,path){
	return new Promise((resolve,reject)=>{
		cos.uploadFile({
			Bucket,
			Region,
			Key: 'diancan-img/' + filename,              /* 必须 */
			FilePath: path,  
		})
		.then(res=>{
			resolve(res.Location)
		})
		.catch(err=>{
			reject(err)
		})
	})
}

// 二进制上传
let buffer = function(filename,path){
	return new Promise((resolve,reject)=>{
		cos.putObject({
			Bucket,
			Region,
			Key: 'diancan-img/' + filename,              /* 必须 */
			Body: Buffer.from(path),  
		})
		.then(res=>{
			resolve(res.Location)
		})
		.catch(err=>{
			reject(err)
		})
	})
}



// 配置上传文件1.所在的目录和2.更改文件名
const storage = multer.diskStorage({//磁盘存储引擎方法
	destination:(req, file, cb)=> {//存储前端传来的文件
	    cb(null, 'upload/image')
	},
	filename:(req, file, cb)=> {
	   // 防止文件重名更改前缀
	   let fileFormat = (file.originalname).split(".")
	   // 5678345321-890mnhj.jfif;.png.jpg
	   // Date.numw()时间戳6789045678889
	   // 6789045678889-4567.jpg
	   let num = `${Date.now()}-${Math.floor(Math.random(0,1) * 10000000)}${"."}${fileFormat[fileFormat.length - 1]}`
	   cb(null,num)
	 }
})

const upload = multer({ storage})

module.exports = {upload,cosfun,buffer}