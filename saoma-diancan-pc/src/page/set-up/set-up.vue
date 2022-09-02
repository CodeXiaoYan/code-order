<template>
<div class="ordering" v-loading.fullscreen.lock="loading">
	<div class="heading">店铺设置</div>
	<div class="set-up-view">
		<div class="button-view-set">
			<el-button type="success" size="medium" @click="setCl()">修改</el-button>
		</div>
		<!-- 内容 -->
		<div v-for="(item,index) in setdata" :key="index">
			<div class="set-name">
				<div>店铺名称:</div>
				<div>{{item.name}}</div>
			</div>
			<div class="set-name">
				<div>店铺地址:</div>
				<div>{{item.address}}</div>
			</div>
			<div class="set-name">
				<div>营业时间:</div>
				<div>{{item.bus_hours.startTime}}——{{item.bus_hours.endTime}}</div>
			</div>
			<div class="set-up-image">
				<div>店铺logo:</div>
				<div class="set-image">
					<div v-for="(iteming,index) in item.logo" :key="index"><img :src="iteming.url" /></div>
				</div>
			</div>
		</div>
		
	</div>
</div>
</template>

<script>
export default{
	data() {
		return {
			loading:true,
			setdata:[]
		}
	},
	methods:{
		// 跳转修改
		setCl(){
			this.$router.push({name:'modify-infor',params:{data:this.setdata[0]}});
		},
		// 获取商家信息
		async obtainshop(){
			try{
				let res = await new this.Request(this.Urls.m().obtainshop).modeget()
				this.setdata = res.data.data
				this.loading = false
			}catch(e){
				new this.mytitle(this.$message,'error','服务器发生错误,请重试').funtitle()
			}
		}
		
	},
	created() {
		this.obtainshop()
	}
}
</script>

<style scoped="scoped">
.heading{font-size: 20px;
font-weight: bold;
}
.set-up-view{max-width: 900px;
margin-top: 30px;
}
.button-view-set{display: flex;
justify-content: flex-end;
margin-bottom: 30px;
}
.set-name{display: flex;
align-items: center;
margin-bottom: 30px;
}
.set-name div:nth-child(1){width: 100px;}
.set-name div:nth-child(2){flex: 1;}

.set-up-image{margin-bottom: 30px;}
.set-image img{
width: 50%;
height: 100%;
border-radius: 5px;
}
.set-image{
margin-top: 10px;
display: flex;
flex-wrap: wrap;
}
</style>
