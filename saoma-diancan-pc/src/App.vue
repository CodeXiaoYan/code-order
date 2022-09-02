<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>

export default {
	created() {
		// 订单数存入本地缓存
		const order_num = localStorage.getItem("order_num")
		if(!order_num || order_num < 1){
			localStorage.setItem('order_num',0)
		}
		//1.建立连接
		this.goeasy.connect({
		    id:"001", //pubsub选填，im必填
		    data:{"avatar":"/www/xxx.png","nickname":"Neo"}, //必须是一个对象，pubsub选填，im必填，用于上下线提醒和查询在线用户列表时，扩展更多的属性
		    onSuccess: ()=>{  //连接成功
		      console.log("连接成功") //连接成功
			  this.sub_message()
		    },
		    onFailed: (error)=>{ //连接失败
		      console.log("连接失败");
		    },
		    onProgress:(attempts)=>{ //连接或自动重连中
		      console.log("连接或自动重连中");
		    }
		});
	},
	methods:{
		// 2.接收订阅消息
		sub_message(){
			var pubsub = this.goeasy.pubsub;
			pubsub.subscribe({
			    channel: "my_channel",//替换为您自己的channel
			    onMessage: (message)=> {
					const order_num_a = localStorage.getItem("order_num")
					localStorage.setItem('order_num',Number(order_num_a) + 1)
					const order_num_b = localStorage.getItem("order_num")
					// console.log(order_num_b)
					this.$store.commit('order_remind',Number(order_num_b))
			        // console.log(message);
			    },
			    onSuccess: ()=> {
			        console.log("Channel订阅成功。");
			    },
			    onFailed: (error)=> {
			        console.log("Channel订阅失败, 错误编码：" + error.code + " 错误信息：" + error.content)
			    }
			});
		}
	}
}
</script>

<style>
.el-loading-mask{left: 200px !important;}
.image-view-title img{object-fit: cover;}
</style>
