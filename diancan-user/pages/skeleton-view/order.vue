<template>
	<!-- 订单详情 -->
	<view  class="skeleton-index">
		<view class="skeleton-order-cont">
			<view class="skeleton-order-title"></view>
			<view class="skeleton-order-label"></view>
		<view style="margin: 40rpx 0;" v-for="(item,index) in order_data" :key="index">
			<view class="skeleton-order-frew">
				<text>{{item}}</text>
				<text>{{item}}</text>
			</view>
			<view class="skeleton-order-flex">
				<view class="skeleton-order-left">{{item}}</view>
				<view class="skeleton-order-zho">
					<text>{{item}}</text>
					<text>{{item}}</text>
				</view>
				<view class="skeleton-order-right">{{item}}</view>
			</view>
		</view>
		<!-- 2 -->
		<view class="skeleton-order-but">
			<text></text>
			<text></text>
			<text></text>
		</view>
		</view>
	</view>
</template>

<script>
export default{
	data() {
		return {
			order_data: ['','','']
		}
	},
}
</script>

<style scoped>
.skeleton-order-cont{
	margin: 20rpx;
}
.skeleton-order-title{
	height: 60rpx;
	background-color: #f3f3f3;
	width: 50%;
	border-radius: 7rpx;
	margin-bottom: 20rpx;
}
.skeleton-order-label{
	height: 50rpx;
	background-color: #f3f3f3;
	width: 30%;
	border-radius: 7rpx;
}
.skeleton-order-frew{
	display: flex;
	justify-content: space-between;
	margin-bottom: 20rpx;
}
.skeleton-order-frew text{
	height: 40rpx;
	border-radius: 7rpx;
	background-color: #f3f3f3;
}
.skeleton-order-frew text:nth-child(1){
	width: 200rpx;
}
.skeleton-order-frew text:nth-child(2){
	width: 50%;
}
.skeleton-order-flex{
	display: flex;
	justify-content: space-between;
	height: 110rpx;
}
.skeleton-order-left{
	height: 110rpx;
	width: 110rpx;
	border-radius: 7rpx;
	background-color: #f3f3f3;
}
.skeleton-order-zho{
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	margin: 0 20rpx;
}
.skeleton-order-zho text{
	height: 40rpx;
	border-radius: 7rpx;
	background-color: #f3f3f3;
	width: 100rpx;
}
.skeleton-order-right{
	align-self: baseline;
	width: 100rpx;
	height: 40rpx;
	border-radius: 7rpx;
	background-color: #f3f3f3;
}
.skeleton-order-but text{
	display: flex;
	flex-direction: column;
	height: 60rpx;
	width: 100%;
	border-radius: 7rpx;
	background-color: #f3f3f3;
	margin: 20rpx 0;
}
</style>
