<template>
	<div class="ordering" v-loading.fullscreen.lock="loading">
		<div class="heading">菜品管理</div>
		<div class="content-view">
			<div class="button-view">
				<router-link :to="{name:'upload'}">
				<el-button type="success" size="medium">添加菜品</el-button>
				</router-link>
			</div>
			<div v-if="nodatas">
				<!-- 表头 -->
				<div class="tab-list">
					<span v-for="(item,index) in tablist" :key="index">{{item}}</span>
				</div>
				<!-- 表格 -->
				<div class="tab-table" v-for="(goods_item,index) in tabcont" :key="index">
				<div>{{goods_item.time}}</div>
				<div>{{goods_item.category}}</div>
				<div>{{goods_item.name}}</div>
				<div>
					<el-image class="elimg"
					:src="goods_item.image[0].url"
					fit="cover"
					:lazy="true"
					:preview-src-list="[goods_item.image[0].url]">
					</el-image>
				</div>
				<div>{{goods_item.unitprice}}</div>
			  <div>
				  <el-button size="small" @click="edIt(goods_item)" :disabled="goods_item.onsale ? false : true ">编辑</el-button>
				  <el-button v-if="goods_item.onsale" type="danger" size="small" @click="shelf(goods_item._id,index,goods_item.cid)" :loading="index == shelfload ? true : false" :disabled="index == shelfload ? true : false">下架</el-button>
				  <el-button v-else type="warning" size="small" disabled>已下架</el-button>
			  </div>
			  </div>
				<!-- 分页 -->
				<el-pagination
				  background
				  layout="prev, pager, next"
				  :hide-on-single-page="true"
				  :total="total"
				  @current-change="currentchange"
				  >
				</el-pagination>
			</div>
			<!-- 没有数据 -->
			<div class="nodatas" v-if="!nodatas">还没有菜品数据</div>
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
			shelfload:-1,//下架loading
			tablist: ['创建时间','类目','菜品名称','菜品图片','价格(元)','操作'],
			tabcont:[],
			currentnum:1,//当前页数
			total:0,//总条数
			pagenum:0,
		}
	},
	methods:{
		// 分页
		currentchange(e){
			// console.log(e)//0:第一页，1：第二页，2：第三页
			this.pagenum = e - 1
			this.obtaindishes()
		},
		// 获取菜品
		async obtaindishes(){
			try{
				let res = await new this.Request(this.Urls.m().obtaindishes + '?page=' + this.pagenum).modeget()
				this.nodatas = res.data.data.tatal == 0  ? false : true
				this.tabcont = res.data.data.result
				this.total = res.data.data.tatal
				this.loading = false
			}catch(e){
				this.loading = false
				new this.mytitle(this.$message,'error','服务器发生错误,请重试').funtitle()
			}
		},
		// 编辑修改
		edIt(item){
			this.$router.push({name:'upload',params:{item}});
		},
		// 下架
		async shelf(id,index,value){
			this.shelfload = index
			let obj = this.$qs.stringify({id,value})
			try{
				await new this.Request(this.Urls.m().fromsale + '?' + obj).modeget()
				this.$set(this.tabcont[index],'onsale',false)
				this.shelfload = -1
			}catch(e){
				this.shelfload = -1
				new this.mytitle(this.$message,'error','下架失败，重试').funtitle()
			}
		}
	},
	created() {
		this.obtaindishes()
	},
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
