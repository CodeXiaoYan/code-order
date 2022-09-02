<template>
<div class="max-wid" v-loading.fullscreen.lock="loadmen">
	<div class="heading">
		<p @click="reTurn()" v-if="whether">返回上一页</p>
		<p class="heading-users">{{setup}}</p>
	</div>
	<!-- 店铺名称 -->
	<div class="image-view-title">
		<div class="image-list">店铺名称</div>
		<el-input v-model="name" placeholder="请输入店铺名称"></el-input>
	</div>
	<!-- 店铺地址 -->
	<div class="image-view-title">
		<div class="image-list">店铺地址</div>
		<el-input v-model="address" type="text" placeholder="请输入店铺地址"></el-input>
	</div>
	<!-- 营业时间 -->
	<div class="image-view-title">
		<div class="image-list">营业时间</div>
		<el-time-select
		    placeholder="开始时间"
		    v-model="startTime"
			:editable="false"
		    :picker-options="{
		      start: '08:30',
		      step: '00:15',
		      end: '20:30'
		    }">
		</el-time-select>
		<el-time-select
		    placeholder="结束时间"
		    v-model="endTime"
			:editable="false"
		    :picker-options="{
		      start: '08:30',
		      step: '00:15',
		      end: '20:30',
		      minTime: startTime
		    }">
		</el-time-select>
	</div>
	<!-- 店铺logo -->
	<div class="image-view-title">
		<div class="image-list">店铺logo</div>
		<div>
			<el-upload
			  :action="action"
			  list-type="picture-card"
			  name="file"
			  accept=".jpg,.png,.webp,.jfif"
			  :limit="1"
			  :on-remove="logoRemove"
			  :on-success="logoSuccess"
			  :on-preview="handlepreview"
			  :multiple="false"
			  :on-error="onErr"
			  :before-upload="project"
			  :file-list="logo"
			  >
			  <i class="el-icon-plus"></i>
			</el-upload>
			<!-- 大图展开 -->
			<el-dialog :visible.sync="dialogVisible">
			  <img width="100%" :src="dialogImageUrl" alt="">
			</el-dialog>
		</div>
	</div>
	
	<!-- 提交 -->
	<div class="image-button">
		<el-button type="success" size="medium" @click="bTns(butn)" :loading="load" :disabled="load">{{butn}}</el-button>
	</div>
</div>
</template>

<script>
var {log} = console
export default{
	data() {
		return {
			whether:false,
			setup:'设置店铺信息',
			butn:'提交',
			load:false,
			action:this.Urls.m().uploadres,
			// 上传logoing
			loadmen:false,
			// 上个页面传来的id
			id:'',
			name: '',
			address:'',
			logo:[],
			dialogImageUrl: '',
			dialogVisible: false,
			/* 营业时间 */
			startTime: '',
			endTime: ''
		}
	},
	methods:{
		// 展开大图
		handlepreview(file) {
		  this.dialogImageUrl = file.url;
		  this.dialogVisible = true;
		},
		// 上传失败
		onErr(e){
			this.loadmen = false
			this.$message.error('上传失败,尝试重新上传');
		},
		// 上传时
		project(file){
			this.loadmen = true
		},
		// logo移除文件时的钩子
		logoRemove(file, fileList) {
		  this.logo = []
		},
		// 上传成功：logo
		logoSuccess(res, file, fileList){
			console.log(res)
			console.log(file)
			this.logo.push({url:res.data,uid:file.uid})//element展示图片时需要数组类型的才能展示
			this.loadmen = false
		},
		// 返回上一页
		reTurn(){
			this.$router.push({name:'set-up'});
		},
		// 提交或修改
		bTns(is){
			this.load = true
			const obj = {id:this.id,name:this.name,address:this.address,
			startTime:this.startTime,endTime:this.endTime,
			logo:JSON.stringify(this.logo)}
			if(is == '提交'){
				console.log('提交')
				this.purequest(obj,is,this.Urls.m().uploadshop)
			}else{
				console.log('修改')
				// 提交修改
				this.purequest(obj,is,this.Urls.m().modifyshop)
			}
		},
		// 提交或修改公用请求
		async purequest(obj,is,url){
			try{
				const res = await new this.Request(url,this.$qs.stringify(obj)).modepost()
				if(res.status != 200){
					new this.mytitle(this.$message,'warning',res.data.msg).funtitle()
				}else{
					new this.mytitle(this.$message,'success',res.data.msg).funtitle()
					localStorage.setItem("company", this.name)
					if(is == '提交'){
						this.$router.push({name:'index'})
					}else{
						this.$router.push({name:'set-up'})
					}
				}
				this.load = false
			}catch(e){
				this.load = false
				new this.mytitle(this.$message,'error','服务器发生错误,请重试').funtitle()
			}
		}
	},
	created() {
		let res = this.$route.params.data
		// console.log(res)
		if(res == undefined){
			this.whether = false
			this.setup = '设置店铺信息'
			this.butn = '提交'
		}else{
			this.whether = true
			this.setup = '修改店铺信息'
			this.butn = '提交修改'
			this.id = res._id,
			this.name = res.name,
			this.address = res.address,
			this.logo = res.logo
			this.startTime = res.bus_hours.startTime
			this.endTime = res.bus_hours.endTime
		}
	}
}
</script>

<style scoped="scoped">
.max-wid{
max-width: 800px;
margin: 0 auto;
background-color: #FFFFFF;
padding: 0 40px;
}
.heading{font-size: 20px;
font-weight: bold;
text-align: center;
padding-top: 50px;
display: flex;
}
.heading-users{flex: 1;}
.heading p:nth-child(1){cursor:pointer;}
.image-view-title{max-width: 800px;
margin-bottom: 30px;
margin-top: 30px;
}
.image-view-title img{object-fit: cover;}
.image-list{margin-bottom: 20px;}
.el-textarea>>>.el-textarea__inner{
border: 0 !important;
}
.el-button--success{width: 150px;}
.image-button{max-width: 800px;
text-align: center;
padding: 120px 0;
}
.el-date-editor{
	margin-right: 10px;
}
</style>
