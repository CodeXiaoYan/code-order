<template>
	<div style="position: relative;">
		<!-- 顶部 -->
		<div class="sidebar-top">
			<div>{{company}}</div>
			<div @click="signOut()">退出</div>
		</div>
		<div class="sidebar-cont">
			<el-menu :default-active="activeIndex" class="el-menu-demo" mode="vertical" @select="handleSelect">
				<div v-for="(item,index) in sidebar" :key="index">
					<router-link :to="{path:item.router,query:{item:item.id}}">
						<el-menu-item :index="item.id" v-if="item.Subclass.length === 0">
							<i :class="item.icon"></i>
							<span slot="title">{{item.title}}</span>
							<span slot="title" class="span-tips" style="margin-left: 2.6875rem;"
							v-if="item.tip == 'dingdan' && dingdan > 0 ">{{dingdan}}</span>
						</el-menu-item>
					</router-link>
					<!-- 如果有二级三级菜单展开，此项目没有 -->
					<el-submenu v-if="item.Subclass.length > 0" :index="item.id">
						<template slot="title">
							<i :class="item.icon"></i>
							<span>{{item.title}}</span>
						</template>

						<div v-for="(iteming,indexs) in item.Subclass" :key="indexs">
							<router-link :to="{path:iteming.router,query:{item:iteming.id}}">
								<el-menu-item :index="iteming.id">{{iteming.title}}</el-menu-item>
							</router-link>
						</div>
					</el-submenu>
				</div>
				<div style="height: 50px;"></div>
			</el-menu>
		</div>
		<div>
			<audio src="https://diancan-1252107261.cos.accelerate.myqcloud.com/mp3/dingdantixing.mp3" ref="audio"></audio>
		</div>
		<!--二级路由渲染-->
		<router-view></router-view>
	</div>
</template>

<script>
export default {
		data() {
			return {
				company: '',
				activeIndex: '1',
				dingdan: 0,
				sidebar: [{
						id: '1',
						icon: 'el-icon-s-data',
						title: '数据分析',
						router: 'index',
						tip: 'shuju',
						Subclass: []
					},
					{
						id: '2',
						icon: 'el-icon-bank-card',
						title: '订单管理',
						router: 'order',
						tip: 'dingdan',
						Subclass: []
					},
					{
						id: '3',
						icon: 'el-icon-tableware',
						title: '菜品管理',
						router: 'dishes',
						tip: 'caiping',
						Subclass: []
					},
					{
						id: '4',
						icon: 'el-icon-menu',
						title: '菜品类目',
						router: 'category',
						tip: 'leimu',
						Subclass: []
					},
					{
						id: '5',
						icon: 'el-icon-takeaway-box',
						title: '桌号管理',
						router: 'table',
						tip: 'zhuohao',
						Subclass: []
					},
					{
						id: '6',
						icon: 'el-icon-setting',
						title: '店铺设置',
						router: 'set-up',
						tip: 'shezhi',
						Subclass: []
					}
				]
			}
		},

		methods: {
			handleSelect(key, keyPath) {
				localStorage.setItem("nuvmenuid", JSON.stringify(key))
			},
			// 播放音频
			plays() {
				this.$nextTick(()=>{
					let Audio = this.$refs.audio
					Audio.play()
				})
			},
			// 退出登录
			async signOut() {
				localStorage.clear()
				//跳转页面
				this.$router.push({
					name: 'login'
				});
			},
		},
		created() {
			// 菜单栏和商户名称
			let name = localStorage.getItem("company")
			this.activeIndex = JSON.parse(localStorage.getItem("nuvmenuid"))
			if (name) {
				this.company = name
			}
			// 订单提醒
			const order_num = localStorage.getItem("order_num")
			this.dingdan = order_num > 99 ? '99+' : order_num
		},
		watch: {
			// 监听订单提醒
			"$store.state.remind"(newValue, oldValue) {
				if (newValue.num > 0) {
					this.plays()
				}
				this.dingdan = newValue.num > 99 ? '99+' : newValue.num
			}
		},
	};
</script>

<style scoped="scoped">
.sidebar-top {
	width: 100%;
	background: #FFFFFF;
	height: 50px;
	color: #333333;
	display: flex;
	justify-content: space-between;
	align-items: center;
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	z-index: 50;
}
.sidebar-top div:nth-child(1) {
	padding-left: 22px;
	font-size: 18px;
}
.sidebar-top div:nth-child(2) {
	padding-right: 22px;
	cursor: pointer;
}
.sidebar-cont {
	position: fixed;
	top: 50px;
	left: 0;
	bottom: 50px;
	background: #FFFFFF;
	width: 200px;
	height: 100vh;
	color: #000000 !important;
	font-size: 16px;
	overflow-y: auto;
}
/*  */
.el-menu-item {
	font-size: 15px !important;
}
.el-submenu__title {
	font-size: 15px !important;
}
.span-tips {
	background-color: coral;
	width: 22px !important;
	height: 22px !important;
	border-radius: 50%;
	display: inline-table;
	line-height: 22px;
	text-align: center;
	font-size: 12px;
	color: #ffff;
}
</style>
