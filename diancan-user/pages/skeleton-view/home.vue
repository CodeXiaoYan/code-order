<template>
	<!-- 点餐界面 -->
	<view class="skeleton-index">
		<view class="skeleton-home-top">
			<view></view>
			<view></view>
		</view>
		<!-- 左右布局 -->
		<view class="skeleton-home-cont">
			<view class="skeleton-home-left">
				<view v-for="(item,index) in home_left" :key="index">{{item}}</view>
			</view>
			<view class="skeleton-home-right">
				<view class="skeleton-home-root" v-for="(item,index) in home_right" :key="index">
					<view class="skeleton-home-img">{{item}}</view>
					<view class="skeleton-home-position">
						<view>{{item}}</view>
						<view>{{item}}</view>
						<view>{{item}}</view>
					</view>
					<view class="skeleton-home-number">{{item}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default{
	data() {
		return {
			home_left: ['','','','','','','','','','','','','','','',''],
			home_right:['','','','','']
		}
	},
}
</script>

<style scoped>
.skeleton-home-top{
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.skeleton-home-top view{
	background-color: #f3f3f3;
	height: 50rpx;
	border-radius: 7rpx;
	margin: 20rpx;
}
.skeleton-home-top view:nth-child(1){
	width: 65%;
}
.skeleton-home-top view:nth-child(2){
	width: 200rpx;
}
.skeleton-home-cont{
	display: flex;
	margin: 20rpx;
}
/* .skeleton-home-left{
	height: 80rpx;
} */
.skeleton-home-left view{
	height: 50rpx;
	width: 200rpx;
	border-radius: 7rpx;
	background-color: #f3f3f3;
	margin-bottom: 20rpx;
}
.skeleton-home-right{
	flex: 1;
}
.skeleton-home-root{
	display: flex;
	height: 150rpx;
	justify-content: space-between;
	margin-bottom: 45rpx;
}
.skeleton-home-img{
	width: 150rpx;
	height: 150rpx;
	border-radius: 7rpx;
	background-color: #f3f3f3;
	margin: 0 20rpx;
}
.skeleton-home-position view{
	width: 100rpx;
	height: 40rpx;
	border-radius: 7rpx;
	background-color: #f3f3f3;
}
.skeleton-home-position{
	position: relative;
	flex: 1;
}
.skeleton-home-position view:nth-child(1){
	margin-bottom: 10rpx;
}
.skeleton-home-position view:nth-child(3){
	position: absolute;
	bottom: 0;
}
.skeleton-home-number{
	border-radius: 7rpx;
	background-color: #f3f3f3;
	height: 40rpx;
	width: 200rpx;
	align-self: flex-end;
}
</style>
