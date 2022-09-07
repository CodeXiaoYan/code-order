<script>
export default {
  globalData: {
    Modelmes: null
  },
  onLaunch() {
    wx.cloud.init({
      env: 'diancan-user-3gta3yw924329a21',
      traceUser: true,
    })
    //建立连接
    this.goeasy.connect({
      id: "", //pubsub选填，im必填
      data: {}, //必须是一个对象，pubsub选填，im必填，用于上下线提醒和查询在线用户列表时，扩展更多的属性
      onSuccess: function () {  //连接成功
        console.log("连接成功") //连接成功
      },
      onFailed: function (error) { //连接失败
        console.log("连接失败");
      },
      onProgress: function (attempts) { //连接或自动重连中
        console.log("连接或自动重连中");
      }
    });
    // 获取设备型号
    wx.getSystemInfo({
      success: (res) => {
        if (res.safeArea.top > 40) {//iphone
          this.globalData.Modelmes = true
        } else {
          this.globalData.Modelmes = false
        }
      }
    })
  },
}
</script>

<style>
/*每个页面公共css */
</style>
