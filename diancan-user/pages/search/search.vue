<template>
	<view>
		<!-- 搜索框 -->
		<view class="search-flex">
			<view class="search-input">
				<image src="/static/sousuo.png" mode="widthFix"></image>
				<input type="text" focus placeholder="输入菜品关键词"
				@input="inputFun"
				@focus="focusFun"
				v-model="Key_words"
				>
			</view>
			<view class="search-Cancel">取消</view>
		</view>
		<view :style=" 'height:' + Comm_top + 'px;' "></view>
		<!-- 实时检索结果展示 -->
		<view class="search-list" v-if="key_result.length > 0 && show" 
		v-for="(item,index) in key_result" :key="index"
		@click="listFun(item)"
		>{{item}}</view>
		<!-- 最终搜索结果展示 -->
		<view class="classif-goods" v-if="search_goods.length > 0 && !show" 
			v-for="(itemgood,good_index) in search_goods" :key="good_index"
			@click="popup_item(true,good_index,itemgood.cid,itemgood)">
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
				<view><image v-if="itemgood.quantity > 0" src="/static/tab/jianhao.png" mode="widthFix" @click.stop="reduce(good_index,itemgood.specs[0].specs_id,itemgood)"></image></view>
				<view><text v-if="itemgood.quantity > 0">{{itemgood.quantity}}</text></view>
				<view><image src="/static/tab/jia.png" mode="widthFix" @click.stop="plus(good_index,itemgood.specs[0].specs_id,itemgood)"></image></view>
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
		<!-- 弹出弹窗 -->
		<Details v-if="popupitem" :pro_details="pro_details"></Details>
		<view style="height: 100rpx;"></view>
	</view>
</template>

<script>
// 引入单个商品弹出
import Details from './components/goods-details.vue'
import {shake} from '../../config/anti-shake.js'
export default {
	components: {Details},
	data() {
		return {
			Comm_top: 0,
			goods:[],
			Key_words:'',
			key_goods:[],//存储搜索的所有结果
			key_result:[],//存储搜索文字列表展示
			search_goods:[],//搜索的最终结果，
			show:true,//用于隐藏或展示搜索结果
			popupitem:false,//单个商品弹出框隐藏
			pro_details:{},//单个商品弹出框里的数据
		}
	},
	onLoad(event) {
		// 获取输入框的高度
		const query = wx.createSelectorQuery()
		query.select('.search-flex').boundingClientRect()
		query.exec((res) => {
			// console.log(res)
			this.Comm_top = res[0].height
		})
		
	},

	methods: {
		// 聚焦时触发
		focusFun(){
			// console.log('聚焦时触发')
			this.show = true
		},
		// 输入时触发
		inputFun:shake(async function(){
            // console.log(this.Key_words)
			if(this.Key_words == ''){
				this.key_result = []
				return false
			}
			const res = await wx.cloud.callFunction({name: 'search',data:{Key_words:this.Key_words}})
			// console.log(res)
			this.key_goods = res.result//存储搜索的结果
			let key_arr = []
			res.result.forEach(item=>key_arr.push(item.category,item.name))
			this.key_result = Array.from(new Set(key_arr))//存储搜索结果的列表展示
		},500),
	
		// 点击搜索结果列表时触发，
		listFun(value){
			let res = this.key_goods.filter(item=>item.category == value || item.name == value)
			// console.log(this.$store.state.order_data)
			this.$store.state.order_data.forEach(item_a=>{
				const z_index = res.findIndex(item_b => item_b._id == item_a._id)
				// console.log(z_index)
				if(z_index >=0) {
					// console.log(item_a)
					res[z_index].quantity = item_a.quantity
					res[z_index].good_specs = item_a.good_specs
					res[z_index]['specs_id'] = item_a.specs_id
				}
			})
			// console.log(res)
			this.search_goods = res
			this.show = false
		},
		
		// +商品
		plus(index,specs_id,itemgood,Men='001'){
			const {quantity,good_specs,unitprice} = itemgood
			// console.log(itemgood)
			const QU =  Men == '001' ? quantity + 1 : quantity
			this.$set(this.search_goods[index],'quantity',QU)
			this.$set(this.search_goods[index],'unitprice',unitprice)
			this.$set(this.search_goods[index],'good_specs',good_specs)
			this.$store.commit('mutaSearch',{result:this.search_goods[index],specs_id,type:'PL'})
		},
		// -商品
		reduce(index,specs_id,itemgood){
			const {quantity} = itemgood
			// console.log(itemgood)
			const QU = quantity - 1
			this.$set(this.search_goods[index],'quantity',QU)
			this.$store.commit('mutaSearch',{result:this.search_goods[index],specs_id,type:'RE'})
		},
		
		// 弹出商品详情
		popup_item(value,good_index,cid,itemgood){
			this.popupitem = value
			// 选取最小的值排在第一
			if(value){
				itemgood.specs.sort((A,B)=>{return (A.unitprice - B.unitprice)})
				this.pro_details = {good_index,cid,itemgood}
				// console.log(this.pro_details)
			}
		}
	},
}
</script>

<style scoped>
	.search-flex {
		display: flex;
		align-items: center;
		padding: 20rpx;
		background-color: #ffffff;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
	}

	.search-input {
		background: #f8f8f8;
		border-radius: 10upx;
		display: flex;
		flex: 1;
		position: relative;
		height: 65rpx;
	}

	.search-input input {
		height: 65rpx;
		width: 100%;
		font-size: 30upx;
		color: #b2b2b2;
		padding-left: 80upx;
	}

	.search-input image {
		width: 35upx;
		height: 35upx;
		position: absolute;
		left: 30upx;
		align-self: center;
	}

	.search-Cancel {
		margin-left: 30rpx;
	}
	/* 搜索结果展示 */
	.search-list{
		padding: 20rpx 30rpx;
		color: coral;
		font-weight: bold;
	}
</style>
