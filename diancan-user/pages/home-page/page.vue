<template>
	<view>
		<view class="search-view">
			<!-- 自定义导航栏 -->
			<view :style=" 'height:' + Custom_height + 'px;' ">
				<view :style=" 'height:' + S_top + 'px;' "></view>
				<view class="search-input" :style="{'height': S_height + 'px;','lineHeight': S_height + 'px;','margin-right': S_left + 'px;'}" @click="seArch">
					<image src="/static/sousuo.png" mode="widthFix"></image>
					<input type="text" :style=" 'height:' + S_height + 'px;' " placeholder="搜索菜品" disabled>
				</view>
			</view>
			<view class="top-name">
				<view class="top-address">
					<text>{{shop_infor.name}}</text>
					<text>{{shop_infor.address}}</text>
				</view>
				<view class="top-view">
					<view>{{number_people}}人就餐</view>
					<view class="top-view-flex">
						<image src="/static/tab/fenxiang.svg" mode="widthFix"  class="top-search"></image>
						<image src="/static/tab/dingdan.svg" mode="widthFix" @click="my_order()"></image>
					</view>
				</view>
			</view>
		</view>
		<view class="order-view">
			<view class="commodity" :style=" 'top:' + Comm_top + 'px;' ">
				<!-- 左 -->
				<view class="order-left">
					<scroll-view scroll-y="true" class="scroll-Hei" :scroll-with-animation="true" :enhanced="true" :show-scrollbar="false">
						<block v-for="(item,index) in itemize" :key="index">
							<view class="itemize-text" :class="{active: index == trigger}" @click="itemIze(index,item.cid)">
								<text>{{item.value}}</text>
								<text v-if="item.sele_quantity > 0">{{item.sele_quantity}}</text>
							</view>
						</block>
					</scroll-view>
				</view>
				<!-- 右 -->
				<view class="order-right">
					<scroll-view scroll-y="true" class="scroll-Hei"  :scroll-with-animation="true" :enhanced="true" :show-scrollbar="false" :scroll-into-view="scroll_into" @scroll="scroLl">
						<block v-for="(item,index) in goods" :key="index">
						<view :id="item.cid" class="rig-height">
							<view class="classif">{{item.category}}</view>
							<view class="classif-goods" v-for="(itemgood,good_index) in item.good_query" :key="good_index" @click="popup_item(true,index,good_index,item.cid,itemgood)">
								<view class="goods-image"><image :src="itemgood.image[0].url" mode="aspectFill"></image></view>
								<view class="goods-Price">
									<view class="goods-name">
										<text class="Bold over-name">{{itemgood.name}}</text>
										<text class="Thinning">已售 {{itemgood.monthlysale}}</text>
									</view>
									<view class="unit-price">
										<text class="Symbol">¥</text>
										<text class="Bold">{{itemgood.unitprice}}</text>
										<text class="Thinning">/{{itemgood.unit}}</text>
									</view>
								</view>
								
								<!-- 无规格 -->
								<view class="quantity" v-if="!itemgood.att_hide && itemgood.in_stock > 0">
									<view><image v-if="itemgood.quantity > 0" src="/static/tab/jianhao.png" mode="widthFix" @click.stop="reduce(index,good_index,item.cid,itemgood,itemgood.specs[0].specs_id)"></image></view>
									<view><text v-if="itemgood.quantity > 0">{{itemgood.quantity}}</text></view>
									<view><image src="/static/tab/jia.png" mode="widthFix" @click.stop="plus(index,good_index,item.cid,itemgood,itemgood.specs[0].specs_id)"></image></view>
								</view>
								<!-- 已售罄 -->
								<view class="quantity specs-view specs-qing" v-if="itemgood.in_stock <= 0">
									<text>已售罄</text>
								</view>
								<!-- 有规格 -->
								<view class="quantity specs-view" v-if="itemgood.att_hide  && itemgood.in_stock > 0">
									<text>选规格</text>
									<text v-if="itemgood.quantity > 0">{{itemgood.quantity}}</text>
								</view>
								
							</view>
						</view>
						</block>
						<view style="height: 800rpx;"></view>
					</scroll-view>
				</view>
			</view>
			<!-- 底部 -->
			<view class="order-bottom" @click="total_quantity <= 0 ? false : true && pop_Shopping()" :style="{'padding-bottom': Modelmes ? '68rpx' : ''}">
				<view class="Shopping" style="width: 115rpx;">
					<view class="Shopping-left">
						<image src="/static/tab/gouwuche.png" mode="widthFix"></image>
					</view>
					<view class="Shopping-number" v-if="total_quantity > 0">{{total_quantity}}</view>
				</view>
				<view class="Shopping-title" v-if="total_quantity > 0">已点{{total_quantity}}份菜品</view>
				<!-- 已打烊 -->
				<view v-if="closed" class="place-order">
					<button plain="true" open-type="getUserInfo">商家已打烊</button>
				</view>
				<view v-else class="place-order" :class="[total_quantity <= 0 ? 'prevent_style_bu' : '']" @click.stop="total_quantity <= 0 ? false : true && placean_order()">
					<button plain="true" open-type="getUserInfo">选好了</button>
				</view>
			</view>
		</view>
	
	<!-- 购物车 -->
	<Cart v-if="card" :shopping_card="shopping_card"></Cart>
	<!-- 引入单个商品弹出 -->
	<Details v-if="popupitem" :pro_details="pro_details"></Details>
	<!-- 骨架屏 -->
	<Home v-if="exist"></Home>
	</view>
</template>

<script>
const app = getApp()
const {Modelmes} = app.globalData
// 骨架屏
import Home from '../skeleton-view/home.vue'
// 小程序端一次性只返回20条数据；云函数段100条；外部nodejs，java返回10条
// 引入购物车子组件
import Cart from './components/shopping-cart.vue'
// 引入单个商品弹出
import Details from './components/goods-details.vue'
// 订单编号
import {Code} from '../../config/order.js'
// 计算当天的销售额
import {analysis} from '../../config/Date_analysis.js'
const db = wx.cloud.database()
const _ = db.command
const good_collect= db.collection('order-data')
const dishes_data = db.collection('dishes-data')
export default{
	components:{Cart,Details,Home},
	data() {
		return {
			exist:false,
			Modelmes,
			itemize:[],//类目
			trigger:0,//类目选中的值
			goods:[],//所有菜品
			heightset:[],//存储右边每一个分类菜品的高度
			tophei:0,//滚动时距离顶部的高度
			scroll_into:'',
			card:false,//购物车隐藏
			shopping_card:[],//购物车里的数据
			popupitem:false,//单个商品弹出框隐藏
			pro_details:{},//单个商品弹出框里的数据
			tmplIds:'LDn4QK1kQbrVDTCjrU6bYFIksJkC9epp2F5XbCpk56c',//模板id
			number_people:0,//用餐人数
			shop_infor:{},//商家信息
			S_top:0,//胶囊按钮距离顶部的高度
			S_height:0,//胶囊按钮的高度
			Custom_height:0,//自定义导航的高度
			S_left:0,
			Comm_top:0,
			closed:false,//是否已打烊
		}
	},
	methods:{
		// 点击类目加上背景色
		itemIze(index,cid){
			this.trigger = index
			this.scroll_into = cid
			setTimeout(()=>{
				this.scroll_into = ''
			},200)
		},
		// 右边菜品滚动时触发
		scroLl(event){
			// console.log(event.detail.scrollTop)
			let scrollTop = event.detail.scrollTop
			if(scrollTop >= this.tophei){//上拉
				// 当前分类商品的高度小于滚动高度时跳转下一个分类
				if(scrollTop >= this.heightset[this.trigger]){
					this.trigger += 1
				}
			}else{//下拉
				// 当前分类商品的高度大于滚动高度时跳转下一个分类
				if(scrollTop < this.heightset[this.trigger - 1]){
					this.trigger -= 1
				}
			}
			this.tophei = scrollTop
		},
		
		// 单个商品+
		plus(index,good_index,cid,itemgood,specs_id,Men='001'){//specs_id：库存
			const {quantity,image,name,unitprice,unit,_id,good_specs,specs} = itemgood
			const QU =  Men == '001' ? quantity + 1 : quantity
			this.$set(this.goods[index].good_query[good_index],'quantity',QU)
			this.$set(this.goods[index].good_query[good_index],'good_specs',good_specs)
			this.$set(this.goods[index].good_query[good_index],'unitprice',unitprice)
			this.$set(this.goods[index].good_query[good_index],'specs_id',specs_id)
			const arr = {image,name,good_specs,unitprice,quantity:QU,unit,total_price:parseFloat((unitprice * QU).toFixed(10)),_id,cid,good_index,specs_id}
			this.shopping_Cart(arr)
		},
		
		// 单个商品-
		reduce(index,good_index,cid,itemgood,specs_id,Men='001'){
			const {quantity,image,name,unitprice,unit,_id,good_specs,specs} = itemgood
			const QU =  Men == '001' ? quantity - 1 : quantity
			this.$set(this.goods[index].good_query[good_index],'quantity',QU)
			const arr = {image,name,good_specs,unitprice,quantity:QU,unit,total_price:parseFloat((unitprice * QU).toFixed(10)),_id,cid,good_index,specs_id}
			this.shopping_Cart(arr)
		},
		
		// 添加进购物车的商品
		shopping_Cart(arr){
			// 一：购物车没有数据，空数组：
				// 直接添加进数据
			// 二：购物车里有数据
				// 1.没有相同的菜品存在
				// 2.有相同的菜品存在
			if(this.shopping_card.length == 0){
				// 一：购物车没有数据，空数组：
				this.shopping_card.push(arr)
			}else{
				// 二：购物车里有数据
				let itemindex = this.shopping_card.findIndex(item => item._id == arr._id)
				if(itemindex == -1){
					// 没有相同的菜品存在
					this.shopping_card.unshift(arr)
				}else{
					this.$set(this.shopping_card[itemindex],'quantity',arr.quantity)
					this.$set(this.shopping_card[itemindex],'total_price',arr.total_price)
					this.$set(this.shopping_card[itemindex],'good_specs',arr.good_specs)
					this.$set(this.shopping_card[itemindex],'unitprice',arr.unitprice)
					this.$set(this.shopping_card[itemindex],'specs_id',arr.specs_id)
				}
			}
			// console.log(this.shopping_card)
			this.qunint_of_goods()
		},
		
		// 计算左边各分类下添加了多少菜品
		qunint_of_goods(){
			let array = this.shopping_card
			let res = {}
			array.forEach(item=>{
				if(res[item.cid]){
					res[item.cid] += item.quantity
				}else{
					res[item.cid] = item.quantity
				}
			})
			let M = []
			for(let k in res){
				M.push({cid:k,value:res[k]})
			}
			M.forEach(item=>{
				let res_index = this.itemize.findIndex(iteming => iteming.cid == item.cid)
				this.$set(this.itemize[res_index],'sele_quantity', item.value)
			})
			// console.log(this.shopping_card)
		},
		
		
		//购物车商品加减数量
		shopping_Cart_add_sub(index,QU,_id,cid,good_index,unitprice){
			this.$set(this.shopping_card[index],'quantity',QU)
			this.$set(this.shopping_card[index],'total_price', parseFloat((QU * unitprice).toFixed(10)))
			// 根据_id唯一标识查询商品的数量做到商品加减同步
			const itemcid = this.goods.findIndex(item=> item.cid == cid)
			this.$set(this.goods[itemcid].good_query[good_index],'quantity',QU)
			this.qunint_of_goods()
			// 如果总价为0，隐藏购物车界面
			let NUM = 0
			this.shopping_card.forEach(item => NUM += item.total_price)
			if(NUM === 0){this.card = false}
		},
		
		// 清空已点：被子组件调用
		empty_data(){
			this.shopping_card = []
			this.itemize.forEach(item=>{item.sele_quantity = 0})
			this.goods.forEach(item=>{
				item.good_query.forEach(T=>{
					T.quantity = 0
				})
			})
			this.pop_Shopping(false)
		},
		
		// 弹出或隐藏单个商品弹出框
		popup_item(value = true,index,good_index,cid,itemgood){
			this.popupitem = value
			// 选取最小的值排在第一
			if(value){
				itemgood.specs.sort((A,B)=>{return (A.unitprice - B.unitprice)})
				this.pro_details = {index,good_index,cid,itemgood}
				// console.log(this.pro_details)
			}
		},
		// 显示购物车组件
		pop_Shopping(value = true){
			this.popupitem = false
			this.card = value
		},

		// 请求数据
		async dishEs(){
			// 请求云函数获取分类和菜品数据
			const res = await wx.cloud.callFunction({name: 'Dish-manage',data:{}})
			this.itemize = res.result.res_cate//类目
			this.goods = res.result.res_dis//所有菜品
			console.log(res.result.res_dis)
			this.$nextTick(()=>{
				this.goods_height()
			})
		},
		// 计算右边每个分类菜品的高度
		goods_height(){
			this.heightset = []
			let cate_height = 0
			const query = wx.createSelectorQuery()
			query.selectAll('.rig-height').boundingClientRect()
			query.exec((res)=>{
				res[0].forEach((item)=>{
					cate_height += item.height
					this.heightset.push(cate_height)
				})
				this.exist = false
			})
		},
		
		// 弹出订阅消息弹窗
		placean_order(){
			// 消息弹窗
			wx.requestSubscribeMessage({
			  tmplIds: [this.tmplIds],
			  success:(res)=>{
				  this.sub_database()
			  },
			  fail:(err)=>{
				  this.sub_database()
			  }
			})
		},
		
		
		// 提交订单
		async sub_database(){
			// wx.showLoading({title: '正在下单',mask:true})
			// 1.过滤掉总价为0的购物车里的菜品;filter:过滤
			let res = this.shopping_card.filter(item => item.total_price != 0)
			console.log(res)
			// return false
			// 2.计算总价
			let sett_amount = 0
			res.forEach(item => {sett_amount += item.total_price})
			// 取出本地缓存的桌号和用餐人数
			let table_number = wx.getStorageSync('table_num')
			let number_of_diners = wx.getStorageSync('number_of_diners')
			
			let order = {
				table_number,//桌号
				number_of_diners,//用餐人数
				order_time:this.$Time().utcOffset(8).format('YYYY-MM-DD HH:mm:ss'),
				sett_amount,
				order_no:Code(),
				transac_status:'unsettled',//结账状态
				order_receiving:'mis_orders',//接单状态
				menu:[{backup_data:'备用字段', goods_list:res}]
			}
			// 加菜
			let add_goods = {backup_data:'备用字段', goods_list:res}
			try{
				// 提交订单要考虑加菜，依据transac_status结账状态还有table_number当前桌号判断
				let query = await good_collect.where({table_number,transac_status:'unsettled'}).field({_id:true,sett_amount:true}).get()
				if(query.data.length == 0){
					// 1.客户初次来店里下单；2.之前吃过了已经都结账了
					await good_collect.add({data:order})
				}else{
					// 002号桌没有结账，就是加菜
					let total_amount = Number(query.data[0].sett_amount) + sett_amount
					await good_collect.doc(query.data[0]._id).update({
						data:{
							sett_amount:total_amount,
							order_receiving:'mis_orders',
							menu:_.unshift(add_goods)
						}
					})
				}
				
				// 批量自增售出数量
				// 批量自减总库存
				// 批量自减specs有规格的库存，这里对数组对象更新
				res.forEach(async item=>{
					await dishes_data.doc(item._id).update({data:{monthlysale:_.inc(item.quantity)}})
					await dishes_data.doc(item._id).update({data:{in_stock:_.inc(-item.quantity)}})
					await dishes_data.where({_id:item._id,'specs.specs_id':item.specs_id}).update({data:{'specs.$.in_stock':_.inc(-item.quantity)}})
				})
				// 计算当天的销售额
				const time_data = this.$Time().utcOffset(8).format('YYYY-MM-DD')
				await new analysis().sameday(time_data,sett_amount)
				this.push_message()
				// 跳转订单详情界面
				wx.redirectTo({
				  url: '/pages/order-details/details'
				})
				wx.hideLoading()
			}catch(e){
				wx.showToast({title: '发生错误',icon: 'error'})
			}
		},
		
		
		// 推送订单提醒
		push_message(){
			var pubsub = this.goeasy.pubsub;
			pubsub.publish({
			    channel: "my_channel",//替换为您自己的channel
			    message: "小程序端来的",//替换为您想要发送的消息内容
			    onSuccess:()=>{
			        console.log("消息发布成功。");
			    },
			    onFailed:(error)=> {
			        console.log("消息发送失败，错误编码："+error.code+" 错误信息："+error.content);
			    }
			});
		},
		
		// 我的订单
		my_order(){
			wx.navigateTo({
				url:'/pages/my-order/my-order'
			})
		},
		// 搜索商品
		seArch(){
			wx.navigateTo({
				url:'/pages/search/search'
			})
		}
	},
	onLoad() {
		// 获取用餐人数
		this.number_people = wx.getStorageSync('number_of_diners') || 3
		// 获取商家信息
		this.shop_infor = wx.getStorageSync('shop_infor')
		// 计算是否已打烊
		let current_time = this.$Time().format('HH:mm')//当前时分
		let convert_time = this.$Time(current_time,'HH:mm'),
			beforeTime = this.$Time(this.shop_infor.bus_hours.startTime, 'HH:mm'),//起始时间
			afterTime = this.$Time(this.shop_infor.bus_hours.endTime, 'HH:mm');//结束时间
		if(convert_time.isBetween(beforeTime, afterTime)) {
		  console.log('在')
		  this.closed = false
		} else {
		  console.log('不在')
		  this.closed = true
		}
		// 获取胶囊按钮位置
		const tab_data = wx.getMenuButtonBoundingClientRect()
		// console.log(tab_data)
		this.S_top = tab_data.top
		this.S_height = tab_data.height
		this.Custom_height = tab_data.top + tab_data.height
		this.S_left = tab_data.width + 15
		// 计算自定义导航栏的高度
		setTimeout(()=>{
			const query = wx.createSelectorQuery()
			query.select('.search-view').boundingClientRect()
			query.exec((res)=>{
				// console.log(res)
				this.Comm_top = res[0].height
			})
		},300)
		
		this.dishEs()
	},
	
	computed:{
		// 计算购物车的菜品总数
		total_quantity(){
			let quantity = 0
			this.shopping_card.forEach(item=>{
				quantity += item.quantity
			})
			return quantity
		}
	},
	
	watch:{
		// 监听点餐页加减商品goods的变化
		goods:{
			deep: true,
			handler(newVal,oldVal){
				let arr = []
				newVal.forEach(item=>{arr = [...arr,...item.good_query]})
				const K_data = arr.filter(item=>item.quantity > 0)
				// console.log(K_data)
				const N_data = K_data.map(item=>{
					return{_id:item._id,quantity:item.quantity,good_specs:item.good_specs,specs_id:item.specs_id}
				})
				this.$store.commit('mutaOrder',N_data)
				// console.log(N_data)
			}
		},
		// 监听搜索商品，数据同步
		'$store.state.search_data':{
			deep: true,
			handler(newVal,oldVal){
				// console.log(newVal)
				// 查找父级下标
				const cid = this.goods.findIndex(item => item.cid == newVal.result.cid)
				// console.log(cid)
				// 查找子级下标
				var z_id = ''
				this.goods.forEach((item_a)=>{
					const _id = item_a.good_query.findIndex(item => item._id == newVal.result._id)
					if(_id >= 0){
						z_id = _id
						return
					}
				})
				// console.log(z_id)
				// console.log(newVal)
				// 同步当前页面的商品+-和购物车
				if(newVal.type == 'PL'){//+
					this.plus(cid,z_id,newVal.result.cid,newVal.result,newVal.specs_id,'002')
				}else{//-
					this.reduce(cid,z_id,newVal.result.cid,newVal.result,newVal.specs_id,'002')
				}
			}
		},
	}
}
</script>

<style scoped>
.search-view{
	background:linear-gradient(to bottom, #f7d45f,#f7d562,#f8d561,#f9db76, #f9de80);
	position: fixed;
	top: 0;
	right: 0;
	left: 0;
}
.search-input{
	background: #FFFFFF;
	border-radius: 10upx;
	display: flex;
	flex: 1;
	position: relative;
	margin-left: 20rpx;
}
.search-input input{
	width: 100%;
	font-size: 30upx;
	color: #b2b2b2;
	padding-left: 80upx;
}
.search-input image{
	width: 35upx;
	height: 35upx;
	position: absolute;
	left: 30upx;
	align-self: center;
}
.top-name{
	padding: 20rpx;
}
.top-address{
	display: flex;
	flex-direction: column;
}
.top-address text:nth-child(2){
	font-size: 26rpx;
	padding: 20rpx 0;
}
.top-view{
	font-size: 26rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.top-view image{
	display: block;
	width: 35rpx;
	height: 35rpx;
}
.top-view-flex{
	display: flex;
	align-items: center;
}
.top-search{padding-right: 50rpx;}
/* 点餐界面 */
/* .order-view{margin-top: 300rpx;} */
.commodity{
	display: flex;
	position: fixed;
	/* top: 300rpx; */
	left: 0;
	right: 0;
	}
.order-left{
	background-color: #fafafa;
	width: 150rpx;
	overflow-y: auto;
}
.itemize-text{
	font-size: 27rpx;
	padding: 30rpx 10rpx;
	display: flex;
	align-items: center;
	color: #797979;
}
.itemize-text text:nth-child(1){flex: 1;}
.itemize-text text:nth-child(2){
	background-color: #eb5941;
	border-radius: 50%;
	font-size: 20rpx;
	color: #FFFFFF;
	width: 30rpx;
	height: 30rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-left: 2rpx;
}
/* 点击分类列表加上背景色 */
.active{
	background-color: #FFFFFF;
	color: #000000 !important;
}
.scroll-Hei{
	height: 100vh;
	/* white-space: nowrap; */
}
.order-right{
	background-color: #FFFFFF;
	flex: 1;
	overflow-y: auto;
	
}
.classif{
	font-size: 27rpx;
	padding: 30rpx 20rpx;
	color: #797979;
}
/* 底部购物车 */

.order-bottom{
	background-color: #fefefe;
	height: 120rpx;
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	box-shadow: 0rpx -1.9rpx 1rpx 1rpx #f9f9f9;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 20rpx;
	z-index: 9;
}
.Shopping image{width: 75rpx; height: 75rpx; display: block;}
.Shopping-left{width: 75rpx; height: 75rpx;}
.Shopping{
	display: flex;
	align-items: center;
	/* height: 120rpx; */
}
.Shopping-number{
	align-self: flex-start;
	background: #eb5941;
	color: #ffff;
	width: 40rpx;
	border-radius: 50rpx;
	text-align: center;
	font-size: 20rpx;
	/* margin-top: 15rpx; */
}
.Shopping-title{
	flex: 1;
	padding: 0 25rpx;
	color: #999999;
	/* height: 120rpx;
	line-height: 120rpx; */
}
.place-order button{
	border: none;
	background:linear-gradient(to right,#f8da81,#f8d771,#f7d362,#f6cb4a);
	/* width: 200rpx; */
	height: 75rpx;
	line-height: 75rpx;
	border-radius: 30rpx;
	font-weight: bold;
	z-index: 9;
}

/* 阻止点击 */
.prevent_style_bu{
	opacity: 0.4;
}
</style>
