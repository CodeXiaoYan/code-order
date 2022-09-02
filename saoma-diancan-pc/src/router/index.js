import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
	{
		path: '/',
		name: 'login',
		component: resolve => require(['@/page/login/login'], resolve),
	},
	{
		path: '/index',
		name: 'index',
		component: resolve => require(['@/page/index/index'], resolve),
		//默认指向
		redirect:'/analysis',
		//二级路由
		children:[
			{//数据分析
			path:'/analysis',
			name:'analysis',
			component:resolve => require(['@/page/analysis/analysis'],resolve)
			},
			{//订单管理
			path:'/order',
			name:'order',
			component:resolve => require(['@/page/order/order'],resolve)
			},
			{//商品列表
			path:'/dishes',
			name:'dishes',
			component:resolve => require(['@/page/dish-management/dishes-list'],resolve)
			},
			{//桌号管理
			path:'/table',
			name:'table',
			component:resolve => require(['@/page/table-number/table'],resolve)
			},
			{//上传商品
			path:'/upload',
			name:'upload',
			component:resolve => require(['@/page/dish-management/upload-dishes'],resolve)
			},
			{//菜品类目
			path:'/category',
			name:'category',
			component:resolve => require(['@/page/category/category'],resolve)
			},
			{//店铺设置
			path:'/set-up',
			name:'set-up',
			component:resolve => require(['@/page/set-up/set-up'],resolve)
			}
		]
	},
	{//修改店铺
	path:'/modify-infor',
	name:'modify-infor',
	component:resolve => require(['@/page/set-up/modify-infor'],resolve)
	}
]

const router = new VueRouter({
	routes
})

export default router
