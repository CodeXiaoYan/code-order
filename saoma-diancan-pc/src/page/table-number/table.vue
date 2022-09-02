<template>
	<div class="ordering" v-loading.fullscreen.lock="loading">
		<div class="heading">桌号管理</div>
		<div class="content-view">
			<div class="button-view">
				<el-button type="success" size="medium" @click="open">添加桌号</el-button>
			</div>
			<div v-if="nodatas">
				<!-- 表头 -->
				<div class="tab-list">
					<span v-for="(item,index) in tablist" :key="index">{{item}}</span>
				</div>
				<!-- 表格 -->
				<div class="tab-table" v-for="(item,index) in tabcont" :key="index">
					<div>{{item.time}}</div>
					<div>{{item.table}}</div>
					<div>
						<el-image class="elimg"
						:src="item.code"
						fit="cover"
						:lazy="true"
						:preview-src-list="[item.code]">
						</el-image>
					</div>
				</div>
				<!-- 分页 -->
				<el-pagination
				  background
				  layout="prev, pager, next"
				  :hide-on-single-page="true"
				  :total="total"
				  :current-page="currentnum"
				  @current-change="currentchange"
				  >
				</el-pagination>
			</div>
			<!-- 没有数据 -->
			<div class="nodatas" v-if="!nodatas">还没有桌号</div>
		</div>
		<div style="height: 120px;"></div>
	</div>
</template>

<script>
export default{
	data() {
		return {
			loading: true,
			nodatas:true,
			tablist: ['创建时间','桌号','点餐二维码'],
			tabcont:[],
			total:0,//总条数
			pagenum:0,
			currentnum:1,//当前页数
		}
	},
	methods:{
		// 分页
		currentchange(e){
			this.pagenum = e - 1
		},
		// 添加桌号
		open(){
			this.$prompt('请输入桌台号', '提示', {
			  confirmButtonText: '确定',
			  cancelButtonText: '取消',
			  inputPattern: /^[0-9]*$/,
			  inputErrorMessage: '桌号格式不正确,应为数字类型'
			}).then(({ value }) => {
				console.log(value)
				this.add_table(value)
			}).catch((err) => {
				console.log(err)
			});
		},
		// 添加桌号：发起请求
		async add_table(table){
			try{
				let res = await new this.Request(this.Urls.m().qrcode,this.$qs.stringify({table})).modepost()
				if(res.status != 200){
					new this.mytitle(this.$message,'warning',res.data.msg).funtitle()
				}else{
					new this.mytitle(this.$message,'success',res.data.msg).funtitle()
					this.currentnum = 1
					this.pagenum = 0
					this.getqrcode()
				}
			}catch(e){
				new this.mytitle(this.$message,'error','服务器发生错误,请重试').funtitle()
			}
		},
		// 获取桌号
		async getqrcode(){
			try{
				let res = await new this.Request(this.Urls.m().getqrcode + '?page=' + this.pagenum).modeget()
				this.nodatas = res.data.data.tatal == 0  ? false : true
				this.tabcont = res.data.data.result
				this.total = res.data.data.tatal
				this.loading = false
			}catch(e){
				new this.mytitle(this.$message,'error','服务器发生错误,请重试').funtitle()
			}
		}
	},
	created() {
		this.getqrcode()
	}
}
</script>

<style scoped="scoped">
@import url("../../../style/pubiss.css");
::v-deep .el-pagination.is-background .el-pager li:not(.disabled).active {
	background-color: #00be06;
	color: #fff;
}
/* 分页 */
.el-pagination {
	text-align: center;
	margin: 30px 0;
}
</style>
