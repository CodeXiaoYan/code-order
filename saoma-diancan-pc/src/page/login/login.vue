<template>
	<div id="backcont">
		<!-- logo -->
		<div class="meituan-content">
			<div class="login-cont">
				<div class="meituan-title">扫码点餐商户端</div>
				<div class="meituan-user">
					<p>账号</p>
					<el-input class="inptflex" v-model="account" placeholder="请输入账号"></el-input>
				</div>
				<div class="meituan-user">
					<p>密码</p>
					<el-input class="inptflex" v-model="password" placeholder="请输入密码" show-password></el-input>
				</div>
				<!-- 注册 -->
				<div class="reg-view" @click="regiBtn()">{{regi}}</div>
				<!-- 登录或注册 -->
				<el-button v-if="regi == '注册'" type="success" class="meituan-btn" @click="signin()" :loading="load" :disabled="load">登录</el-button>
				<el-button v-else type="success" class="meituan-btn" @click="register()" :loading="load" :disabled="load">注册</el-button>
			</div>
		</div>
	</div>
</template>

<script>
export default{
	data() {
		return {
			regi:'注册',
			load:false,
			account: '',
			password:''
		}
	},
	methods:{
		// 切换登录注册
		regiBtn(){
			this.regi = this.regi == '登录' ? '注册' : '登录'
		},
		// 注册
		async register(){
			this.load = true
			let obj = {account:this.account,password:this.password}
			try{
				let res = await new this.Request(this.Urls.m().register,this.$qs.stringify(obj)).modepost()
				if(res.status != 200){
					new this.mytitle(this.$message,'warning',res.data.msg).funtitle()
				}else if(res.status == 200){
					this.regi = '注册'
				}
				this.load = false
			}catch(e){
				this.load = false
				new this.mytitle(this.$message,'info','发生错误,重试').funtitle()
			}
		},
		// 登录
		async signin(){
			this.load = true
			let obj = {account:this.account,password:this.password}
			try{
				let res = await new this.Request(this.Urls.m().login,this.$qs.stringify(obj)).modepost()
				if(res.status != 200){
					console.log('123')
					new this.mytitle(this.$message,'warning',res.data.msg).funtitle()
				}else if(res.status == 200){
					let ids = '1'
					localStorage.setItem("nuvmenuid", JSON.stringify(ids))
					localStorage.setItem("token", res.data.data.token)
					// 查询商家信息数据库
					// 登录成功之后查询商家信息数据库，是否有还商家信息
					// 有的话就跳转到index主界面。
					// 否则的话跳转到商家信息上传界面
					let infor = await new this.Request(this.Urls.m().obtainshop).modeget()
					if(infor.data.data.length == 0){
						this.$router.push({name:'modify-infor'})
					}else{
						localStorage.setItem("company", infor.data.data[0].name)
						this.$router.push({name:'index'})
					}
				}
				this.load = false
			}catch(e){
				console.log(e)
				this.load = false
				new this.mytitle(this.$message,'info','发生错误,重试').funtitle()
			}
		}
	}
}
</script>

<style scoped="scoped">
#backcont {
	background-image: url(../../../static/login/beijing.jpg);
	background-attachment: fixed;
	background-repeat: no-repeat;
	background-size: cover;
	-webkit-background-size: cover;
	moz-background-size: cover;
	min-height: 100vh;
}
.meituan-content {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
}
.login-cont {
	width: 500px;
	height: 300px;
	background: #f9de80;
	border-radius: 5px;
}
.meituan-title {
	text-align: center;
	color: #000000;
	font-size: 30px;
	padding-top: 30px;
	font-family: Arial, Helvetica, sans-serif;
}
.meituan-user {
	width: 400px;
	margin: 0 auto;
	padding-top: 30px;
	height: 40px;
	display: flex;
	align-items: center;
}

.meituan-user p{width: 50px; color: #000000;
font-size:16px;
}

.inptflex{flex: 1;}

.reg-view{
	width: 400px;
	display: flex;
	justify-content: flex-end;
	margin: 0 auto;
	padding-top: 10px;
	cursor:pointer;
}

.meituan-btn {
	width: 200px;
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 20px auto 0 auto;
	font-size: 16px;
}
</style>
