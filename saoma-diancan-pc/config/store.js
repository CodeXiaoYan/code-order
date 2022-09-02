import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

// 即时通讯订单提醒
const remind = {
	num:0
}

const state = {
	remind
}

export default new Vuex.Store({
	state,
	mutations:{
		// 即时通讯订单提醒
		order_remind(state,num){
			// console.log(num)
			state.remind = {num}
		}
	}
})
