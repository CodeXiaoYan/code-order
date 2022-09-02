<template>
	<div class="ordering" v-loading.fullscreen.lock="loading">
		<div class="heading">最近七天销售额</div>
		<div class="house-view">
			<div id="container"></div>
		</div>
	</div>
</template>

<script>
import { Column } from '@antv/g2plot';
export default{
	data() {
		return {
			loading: true,
		}
	},
	methods:{
		async seven_days(){
			try{
				let res = await new this.Request(this.Urls.m().salesvolume).modeget()
				console.log(res)
				this.house(res.data.data)
				this.loading = false
			}catch(e){
				new this.mytitle(this.$message,'error','服务器发生错误,请重试').funtitle()
			}
		},
		house(data){
			// [{'time':'2021-09-18','sales_volume':200},{'time':'2021-09-18','sales_volume':200}]
			const columnPlot = new Column('container', {
			  data,
			  xField: 'time',
			  yField: 'sales_valume',
			  height: 400,
			  padding: [30, 50, 30, 50],
			  label: {
			    // 可手动配置 label 数据标签位置
			    position: 'middle',
			    // 配置样式
			    style: {
			      fill: '#FFFFFF',
			      opacity: 0.6,
			    },
			  },
			  xAxis: {
			    label: {
			      autoHide: true,
			      autoRotate: false,
			    },
			  },
			  meta: {
			      time: {
			        alias: '时间',
			      },
			      sales_valume: {
			        alias: '销售额',
			      },
			 },
			});
			columnPlot.render();
		}
	},
	mounted() {
		this.seven_days()
	}
}
</script>

<style scoped="scoped">
.heading{font-size: 20px;
font-weight: bold;
}
.house-view{background-color: #FFFFFF;
height: 400px;
width: 100%;
border: 1px solid #ebeef5;
border-radius: 3px;
overflow: hidden;
margin-top: 30px;
margin-bottom: 30px;
}
</style>
