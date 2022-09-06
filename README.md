#### 一、安装的工具（准备工作）

该项目部署复杂度偏高（有兴趣学习该技术栈者可以尝试部署）

##### 1. 我们先安装node.js [http://nodejs.cn/download/]

##### 2. win+r 输入cmd 点击确定 打开命令行面板输入 （安装cnpm）

###### `npm install -g cnpm --registry=https://registry.npm.taobao.org` 

##### 3. 运行项目至少需要两个开发工具，一个Hbuildex；一个微信开发者工具

Hbuildex下载地址：[下载app开发版](https://www.dcloud.io/hbuilderx.html)

微信开发者工具：[下载稳定版](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)

##### 4. 打开微信公众平台—注册小程序—获取Appid--开发管理--开发设置中获取Appid

#### **二、云数据库的配置**

###### diancan-user:该套代码包为小程序代码

##### 1.将该套代码包放入Hbuildex中，打开manifest.json文件，微信小程序配置——微信小程序Appid改为你注册的小程序id。

##### 在APP.vue文件中把env改为自己的环境id（环境id在微信开发者工具的云开发中获取）根据提示创建一个云开发和云开发环境。

##### 2.鼠标选中该项目diancan-user，然后点击编辑器顶部运行——运行到小程序模拟器。此时有可能不会打开，那么手动打开微信开发者工具，在设置中的代理设置里点击安全开启服务端口，如果成功运行到开发者工具，此时控制台会报错

##### 3.点击微信开发者工具顶部云开发（如果还没有开通根据提示开通）进入云开发控制台，点击数据库根据以下命名创建每一个集合：

```js
business-acc:商家账号：权限{所有用户可读，仅创建者可读写}
shop-infor:商家信息：同上
dishes-category:菜品类目：同上
dishunit:菜品单位：同上
dishes-data:菜品管理：自定义权限把以下代码粘贴进去{"read": true,"write": true}
order-data：存储订单：权限{仅创建者可读写}
seven_day_sales:存储每一天的销售额：自定义权限把以下代码粘贴覆盖进去
{"read": true,"write": true}
table_qr_code:桌号管理：权限{所有用户可读，仅创建者可读写}
```

##### 4.在微信开发者工具上的资源管理器上创建一个文件夹，文件夹命名为：cloudfunctions鼠标右即点击创建一个nodejs云函数命名为：Dish-manage，然后我们的Dish-manage文件下会生成一些文件，我们只要将文件里的index.js文件替换为diancan-user/云函数文件里的index.js
然后将文件里的env替换成自己的环境id，代码如下：

```
cloud.init({
env: '改为你自己的云环境id'
})
```

##### 接下来在Dish-manage文件上右键：上传并部署（选择不上传node_modules），云端安转依赖，等待上传成，包括文件的search.js文件（步骤同上）

#### 三、代码的修改

##### 1. 回到user代码包中，打开main.js文件15-16行以及pc端的src/main.js，如下：

```js
Vue.prototype.goeasy = GoEasy.getInstance({
host:"改为你自己的区域",  //改为：区域.goeasy.io
appkey:"改为你自己的appkey", //进入详情Common key
modules:['pubsub'] //根据需要，传入‘pubsub’或'im’，或数组方式同时传入
});
```

##### 2.微信公众开发管理中的平台开发设置中配置服务器域名（socket合法域名）wss://wx-hangzhou.goeasy.io

##### 3. 打开diancan-node:该套代码包为接口端

##### 4.打开config/databaseapi.js文件第7第8行如下，将小程序appid和秘钥secret改为你自己的

```js
let param = qs.stringify({
grant_type:'client_credential',
appid:'改为你自己的',
secret:'改为你自己的'（微信公众平台进入开发管理-开发设置生成一个APPsecret）
})
```

##### 5.模板id获取步骤：

##### 5.1打开微信公众平台选择订阅信息，选择公共模板库 搜索模板输入——商家确认订单通知——选上支付金额、支付时间、订单编号，三项。
注：小程序注册的的服务类目必须是餐饮服务中的餐饮信息服务才可以检索到，如果不是餐饮信息可以在我们微信公众平台的设置中找到服务类目进行更改或者添加进去。

##### 5.2选择完模板后，就可以在我的模板中查看模板id了，我们把它复制下来打开config/databaseapi.js文件第70行将订阅消息template_id改为你自己的模板id。

##### 6.打开router/order/order.js文件中更改75行的三个字段名称(amount1,time2,character_string3)。(在我的模板——详情中查看自己的三个字段。看看是否与该字段一样，如果不一样则进行更改)

##### **7.我们再次打开diancan-user中的pages/home-page/page.vue 将121行中template_id改为自己的。**

#### **四、腾讯云存储（cos）的配置**

##### 1.在node代码中打开cos/cos.js文件第4-11行如下：

```
var cos = new COS({
SecretId: '改为你自己的',  （在腾讯云的密钥管理中获取）
SecretKey: '改为你自己的', （同上）
Protocol:'https:'
});
```

##### 打开该链接注册[https://cloud.tencent.com/login?s_url=https%3A%2F%2Fconsole.cloud.tencent.com%2Fcos]进入腾讯云对象存储 我们找到存储桶，选择创建一个存储桶（我们只需要修改权限为：公有读私有写，地域选择离自己最近的）

```
let Bucket = '改为你自己的'  （这个为创建的存储桶名称）
let Region = '改为你自己的'    （这个为所属的地域）
```

##### 2.**进入存储桶中创建一个文件夹用于存放上传的文件。**

##### **第18行和36行：Key: '改为你自己的文件夹名称' + filename,（key为自己创建的文件夹）**

**3.在HbuliderX中右键 diancan-node 使用命令行打开出窗口所在目录 输入npm install --save 成功后会出现一个node_modules包**
**再执行nodemon app.js启动服务器端 如果没有成功就用 npm run test**

#### 五、后台管理端的启动

###### saoma-diancan-pc:该套代码包后台管理端

##### 1.在HbuliderX中右键 saoma-diancan-pc 使用命令行打开出窗口所在目录 输入 npm install --save 

##### 2.再执行npm run serve 启动项目，浏览器打开该地址，注册一个账号再登录进去

##### 3.根据提示创建商家信息，此时可以添加点餐码和上传菜品类目和上架菜品

##### 4.在上一步后台管理添加点餐码和上架菜品后，到微信开发者工具通过你添加的二维码编译进入

#### **六、连接打印机**

###### 1.我们必须购买芯烨云打印机

###### 2.我们根据说明书将打印机连接到wifi

###### 3.进入芯烨云打印机后端管理平台 [https://admin.xpyun.net/#/login?redirect=%2Fpersonal]注册账号， 然后进行认证后即可进入。

###### 4.然后我们选择打印管理中的-设备管理 输入打印机编号也就是打印机身上的sn把打印机添加进我们的设备中。

###### **5.我们打开我们diancan-user文件在printer中打开Xpyun.js文件**
**修改以下代码**

```js
let xpYun = {
user:'在芯烨云后端管理平台中的账号信息把开发者id拷贝过来',  
timestamp:new Date().getTime(),
UserKEY:'这个为开发者密钥在开发者id下面',
sn:'打印机身上的sn',
name:'设置成自己的店铺名称'
}
```

###### 6.如果我们要更改打印机打印的内容我们进入到print_content.js文件中，根据自己的店面，地址，电话，进行更改

#### 七、代码上线（必须在本地测试没有任何问题，能跑通的情况再进行上线部署）

##### 1.diancan-node

###### 我们先打开[https://cloud.weixin.qq.com/cloudrun?utm_source=idecloudconsole] 然后扫码登录然后选择我们所要登录的小程序，在提示面板中往下拉选择koa框架部署(时间可以有点长，耐心等待一下)。等待部署成功之后选择发布，然后选择手动上传代码包选择文件夹，这时候我们先打开我们的编辑器看看我们的diancan-node中有没有node_modules把它删除了，然后再选择我们的diancan-node文件夹。端口改成5000，然后选择发布。发布完成之后我们选择用公共域名访问。

##### 2.saoma-diancan-pc

###### 2.1我们用Hbuildex打开然后在api文件夹中选择api.js 把以下代码const url = 'http://localhost:5000/api/ 修改成我们刚刚在云托管中拿到的域名。

`例如：const url = 'https://koa-bu8u-166122-1309878414.ap-shanghai.run.tcloudbase.com/api/' `

###### **2.2在hbulider中右键 saoma-diancan-pc 使用命令行打开出窗口所在目录输入npm run build 然后saoma-diancan-pc文件夹下面会出现一个dist文件。**

###### 2.3我们再打开微信开发工具然后选择云开发-选择更多选择静态网站，没有开通的需要开通一下，开通完成之后，我们选择上传文件把dist文件夹中的文件全部上传进去，上传完成之后选择网站配置把域名复制下来，就可以直接访问了。

##### 2.4.diancan-user

###### 我们在Hbulid编辑器中选择发行-小程序微信-然后会打开微信开发工具-进入微信开发工具选择发行即可



