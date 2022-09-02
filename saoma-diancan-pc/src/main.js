import Vue from 'vue'
import App from './App.vue'
import router from './router'
import qs from "qs";
//全局引入css文件
import '../style/reset.css'
import '../style/headtap.css'
import { Input,Button,Menu,MenuItem,Submenu,Loading,Select,Option,Pagination,
DatePicker,Image,Breadcrumb,BreadcrumbItem,Message,MessageBox,Upload,Dialog,Tag,
Badge,TimePicker,TimeSelect,
 } from 'element-ui';

Vue.use(Button);
Vue.use(Input);
Vue.use(Menu);
Vue.use(MenuItem);
Vue.use(Submenu);
Vue.use(Loading);
Vue.use(Select);
Vue.use(Option);
Vue.use(Pagination);
Vue.use(DatePicker);
Vue.use(Image);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Upload);
Vue.use(Dialog);
Vue.use(Tag);
Vue.use(Badge);
Vue.use(TimeSelect);
Vue.use(TimePicker);
Vue.component(Message.name, Message)
Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;

// 请求地址
import urls from '../api/api.js'
Vue.prototype.Urls = urls

// 请求方法
import request from '../api/request.js'
Vue.prototype.Request = request

// qs转换
Vue.prototype.$qs = qs;

// 全局对象提示框
import Titles from '../config/title.js'
Vue.prototype.mytitle = Titles

// 即时通讯：订单提醒
Vue.prototype.goeasy = GoEasy.getInstance({
    host:"hangzhou.goeasy.io",  //若是新加坡区域：singapore.goeasy.io
    appkey:"BC-bac25de26bdf43b499512bf22681eedd",
    modules:['pubsub']//根据需要，传入‘pubsub’或'im’，或数组方式同时传入
});

// vuex
import store from '../config/store.js'
Vue.prototype.$store = store


Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
