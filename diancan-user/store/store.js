// vuex存放数据，数据仓库，数据管理中心
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const state = {
	/* 点餐界面加减商品同步到这里，搜索页面搜索商品会从这里取值同步数据 */
	order_data:[],
	/* 搜索加减商品操作了哪个商品的数据，传到这里
	 点餐界面使用侦听器查询出来同步
	 */
	search_data:{
		result:{},
		specs_id:'',
		type:''
	}
}

export default new Vuex.Store({
	// 数据仓库中心
	state,
	mutations:{
		// 点餐页加减商品
		mutaOrder(state,data){
			state.order_data = data
		},
		// 搜索加减商品赋值
		mutaSearch(state,data){
			state.search_data.result = data.result
			state.search_data.specs_id = data.specs_id
			state.search_data.type = data.type
		},
		
	}
})
