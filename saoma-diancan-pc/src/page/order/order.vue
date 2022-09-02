<template>
	<div class="ordering" v-loading.fullscreen.lock="loading">
		<div class="heading">订单管理</div>
		<div class="content-view">
			<!-- 查询 -->
			<div class="query-view">
				<!-- 状态 -->
				<div class="quotation-query">
					<div>交易状态</div>
					<div>
						<el-select v-model="statevalue" placeholder="请选择">
						    <el-option
						      v-for="item in options"
						      :key="item.value"
						      :label="item.label"
						      :value="item.value">
						    </el-option>
						  </el-select>
					</div>
				</div>
				<!-- 按钮 -->
				<div class="quotation-query"><el-button type="success" size="medium" @click="queryFun()">查询</el-button></div>
			</div>
			<div class="button-view">
				<el-badge :value="dingdan" :max="99" class="item" type="warning">
				  <el-button size="small" @click="refresh_order()">刷新订单</el-button>
				</el-badge>
			</div>
			<!-- 是否有数据 -->
			<div v-if="nodatas">
				<!-- 表头 -->
				<div class="tab-list">
					<span v-for="(item,index) in tablist" :key="index">{{item}}</span>
				</div>
				<!-- 表格 -->
				<div class="tab-table-quo" v-for="(item,index) in tabcont" :key="index">
					<div>{{item.order_time}}</div>
					<div>{{item.table_number}}</div>
					<div>{{item.number_of_diners}}</div>
					<div class="remarks-text">
						<el-button type="small" :loading="index == deta_load ? true : false" @click="detailed_menu(index,item._id)">详细菜单</el-button>
						</div>
					<div>{{Price(item.sett_amount)}}</div>
					<div>
						<el-button type="info" size="small" v-if="item.order_receiving == 'mis_orders'" :loading="index == rece_load ? true : false" @click="receiving(index,item._id)">待接单</el-button>
						<el-button size="small" type="success" disabled v-if="item.transac_status == 'success'">已结账</el-button>
						<el-button size="small" type="success" v-if="item.transac_status == 'unsettled'" :loading="index == check_load ? true : false" @click="checkout(index,item._id,item._openid,item.sett_amount,item.order_no)">待结账</el-button>
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
			<div class="nodatas" v-if="!nodatas">{{nodvalue}}</div>
			<!-- 订单详细弹窗 -->
			<el-dialog
			  title="详细菜单"
			  :visible.sync="dialogVisible"
			  width="500px"
			  :center="true"
			  >
			  <div>
				  <div class="menu-padd" v-for="(item,index) in user_menu" :key="index">
					  <div class="Menu-details menu-span">
						  <span>第{{user_menu.length - index}}次下单</span>
						  <!-- <el-button size="mini" type="info">未接单</el-button> -->
					  </div>
					  <div v-for="(item_menu,index_menu) in item.goods_list" :key="index_menu">
						  <div class="Menu-details menu-margin">
							  <span>{{item_menu.name}}</span>
							  <span v-if="item_menu.good_specs != ''">{{item_menu.good_specs}}</span>
							  <span>{{item_menu.quantity}}{{item_menu.unit}}</span>
						  </div>
					  </div>
				  </div>
			  </div>
			</el-dialog>
		</div>
		<div style="height: 120px;"></div>
	</div>
</template>

<script>
// 交易状态
import {staff} from '../../../config/state-type.js'
// 价格补领
const Price = require('e-commerce_price')
export default{
	data() {
		return {
			Price:Price,
			options:staff(),
			loading: true,
			nodatas:true,
			dialogVisible:false,//弹出详细菜单
			deta_load:-1,//查看详细菜单
			rece_load:-1,//接单
			check_load:-1,//结账
			time:'',//交易时间
			statevalue:'',//交易状态
			nodvalue:'没有订单数据',
			total:0,//总条数
			pagenum:0,
			pickerOptions: {
			    disabledDate(time) {return time.getTime() > Date.now();}
			},
			tablist:['交易时间','桌号','用餐人数','菜单详情','交易金额(元)','交易状态'],
			tabcont:[],
			user_menu:[],//用户详细菜单
			dingdan:0,//订单提醒
		}
	},
	methods:{
		// 分页
		currentchange(e){
			this.pagenum = e - 1
			this.obtainorder(0)
		},
		// 获取订单
		async obtainorder(vle){
			const params = this.$qs.stringify({transac_status:this.statevalue,page:this.pagenum})
			try{
				let res = await new this.Request(this.Urls.m().obtainorder + '?' + params).modeget()
				console.log(res)
				this.nodatas = res.data.data.tatal == 0  ? false : true
				this.tabcont = res.data.data.result
				this.total = res.data.data.tatal
				this.loading = false
				if(vle == 1){
					localStorage.setItem('order_num',0)
					this.$store.commit('order_remind',0)
				}
			}catch(e){
				new this.mytitle(this.$message,'error','服务器发生错误,请重试').funtitle()
			}
		},
		// 查看详细菜单
		async detailed_menu(index,id){
			this.deta_load = index
			try{
				let res = await new this.Request(this.Urls.m().vieworder + '?id=' + id).modeget()
				console.log(res)
				this.user_menu = res.data.data
				this.deta_load = -1
				this.dialogVisible = true
			}catch(e){
				this.deta_load = -1
				new this.mytitle(this.$message,'error','服务器发生错误,请重试').funtitle()
			}
		},
		// 接单
		async receiving(index,id){
			this.rece_load = index
			try{
				let res = await new this.Request(this.Urls.m().receiving + '?id=' + id).modeget()
				this.$set(this.tabcont[index],'order_receiving','rec_order')
				new this.mytitle(this.$message,'success',res.data.msg).funtitle()
			}catch(e){
				new this.mytitle(this.$message,'error','服务器发生错误,请重试').funtitle()
			}
		},
		// 结账
		async checkout(index,id,openid,sett_amount,order_no){
			this.check_load = index
			let obj = this.$qs.stringify({id,openid,sett_amount,order_no})
			try{
				let res = await new this.Request(this.Urls.m().checkout + '?' + obj).modeget()
				console.log(res)
				this.$set(this.tabcont[index],'transac_status','success')
				new this.mytitle(this.$message,'success',res.data.msg).funtitle()
			}catch(e){
				new this.mytitle(this.$message,'error','服务器发生错误,请重试').funtitle()
			}
		},
		// 刷新订单
		refresh_order(){
			this.loading = true
			this.deta_load = -1,//查看详细菜单
			this.rece_load = -1,//接单
			this.check_load = -1,//结账
			this.obtainorder(1)
		},
		// 查询订单
		queryFun(){
			this.pagenum = 0
			this.obtainorder(0)
		}
	},
	created() {
		// 获取订单
		this.obtainorder(0)
		// 订单提醒
		this.dingdan = localStorage.getItem("order_num")
	},
	watch: {
		// 监听订单提醒
		"$store.state.remind"(newValue, oldValue) {
			this.dingdan = newValue.num
		}
	},
}
</script>

<style scoped="scoped">
@import url("../../../style/pubiss.css");
@import url("../../../style/popup.css");
::v-deep .el-pagination.is-background .el-pager li:not(.disabled).active {
	background-color: #00be06;
	color: #fff;
}
::v-deep .el-badge{
	margin-right: 5px;
}
.menu-padd{
	border-bottom: 1px solid #f8f8f8;
}
.Menu-details{
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 50px;
}
.menu-margin{margin: 20px 0;}
.menu-span{
	font-weight: bold;
	font-size: 15px;
	padding-top: 20px;
}
::v-deep .el-dialog{
	height: 600px;
	overflow-y: auto;
	border-radius: 5px !important;
}
</style>
