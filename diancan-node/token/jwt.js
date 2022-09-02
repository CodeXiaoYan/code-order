const jwt = require('jsonwebtoken')

const security = require('./tokentime.js').security

// token加密生成
function gentoken(uid,scope = 2){
	const secretkey = security.secretkey
	const expiresIn = security.expiresIn
	const token = jwt.sign({uid,scope},secretkey,{expiresIn})
	return token
}

module.exports = {gentoken}