<template>
<!-- 单个商品弹出 -->
<view class="details-back">
	<view class="goods-details coup-anim details-bottom">
		<view class="goods-image">
			<image :src="new_data.res_data.itemgood.image[0].url" mode="aspectFill"></image>
			<image src="/static/tab/guanbi.png" mode="widthFix" @click="cLose()"></image>
		</view>
		<view class="details-padd">
			<view class="details-name">{{new_data.res_data.itemgood.name}}</view>
			<view class="details-Thinning">已售 {{new_data.res_data.itemgood.monthlysale}}</view>
			<view class="describe">
				<view class="details-unit-price">
					<text>¥</text>
					<text>{{new_data.res_data.itemgood.unitprice}}</text>
					<text>/{{new_data.res_data.itemgood.unit}}</text>
				</view>
				<view class="details-quantity" v-if="new_data.res_data.itemgood.in_stock > 0">
					<view><image v-if="new_data.res_data.itemgood.quantity > 0" src="/static/tab/jianhao.png" @click="reduce(new_data.res_data)"></image></view>
					<view><text v-if="new_data.res_data.itemgood.quantity > 0">{{new_data.res_data.itemgood.quantity}}</text></view>
					<view><image src="/static/tab/jia.png" @click="plus(new_data.res_data)"></image></view>
				</view>
				<!-- 已售罄 -->
				<view class="specs-qing" v-if="new_data.res_data.itemgood.in_stock <= 0 && new_data.res_data.itemgood.att_hide == false">
					已售罄
				</view>
			</view>
		</view>
		<!-- 有规格 -->
		<view class="details-padd specs-goods" v-if="new_data.res_data.itemgood.att_hide">
			<text class="specs-goods-text">{{new_data.res_data.itemgood.att_name}}</text>
			<view class="specs-goods-flex">
				<block v-for="(item,index) in new_data.res_data.itemgood.specs" :key="index">
				<text @click="menubtn(item.attribute,item.unitprice,new_data.res_data,item.specs_id)" :class="[item.in_stock <= 0 ? 'prevent_style' : '',{'attr-back' : index == new_data.res_index}]">{{item.attribute}}</text>
				</block>
			</view>
		</view>
		<view style="height: 120rpx;"></view>
	</view>
</view>
</template>

<script>
export default{
	props:{pro_details:Object},
	data() {
		return {
			num: -1,
			specs_id:'',//选中哪个规格id
		}
	},
	methods:{
		// 关闭弹窗
		cLose(){
			this.$parent.popup_item(false)
		},
		// 选中规格
		menubtn(attribute,unitprice,res_data,specs_id){
			this.specs_id = specs_id
			this.$set(this.pro_details.itemgood,'unitprice',unitprice)
			this.$set(this.pro_details.itemgood,'good_specs',attribute)
			// console.log(this.pro_details)
			let {good_index,itemgood} = res_data
			this.$parent.plus(good_index,specs_id,itemgood,'002')
		},
		
		// -
		reduce(pro_details){
			this.pubLic(pro_details,'RE')
		},
		// +
		plus(pro_details){
			this.pubLic(pro_details,'PL')
		},
		// 加减公用
		pubLic(pro_details,value){
			// console.log(pro_details)
			let {good_index,itemgood} = pro_details
			if(itemgood.good_specs == '' && itemgood.att_hide){
				wx.showToast({
					title: '请选择' + itemgood.att_name,
					icon: 'none',
					duration: 1000
				})
				return false
			}
			let specs_id = this.specs_id == '' ? itemgood.specs_id : this.specs_id
			if(value == 'RE'){
				this.$parent.reduce(good_index,specs_id,itemgood)
			}else{
				this.$parent.plus(good_index,specs_id,itemgood,'001')
			}
		}
	},
	computed:{
		new_data(){
			let data = this.pro_details.itemgood
			let itemindex = data.specs.findIndex(item => item.attribute == data.good_specs)
			// console.log(this.pro_details)
			let PRICE = itemindex < 0 ? data.unitprice : data.specs[itemindex].unitprice
			// console.log(itemindex + '------' + PRICE)
			this.$set(this.pro_details.itemgood,'unitprice',PRICE)
			return{res_data:this.pro_details,res_index:itemindex}
		}
	},
	
}
</script>

<style scoped>
@import '@/style/shadow.css';
@import '@/style/pop-ups.css'
</style>
