<!-- 本机要安装node -->

cnpm install koa --save //koa框架
cnpm install koa-json --save//返回给前端的json对象
cnpm install koa-bodyparser --save//post提交的对象
cnpm install koa-router --save//路由
cnpm install koa2-cors --save//解决跨区
cnpm install nodemon --save//启动服务器端
cnpm install axios --save//Ajax请求模块
cnpm install jsonwebtoken --save //token
cnpm install basic-auth --save //解析前端在header中传来的token
cnpm install --save @koa/multer multer //静态资源上传：img，video，
cnpm install cos-nodejs-sdk-v5 --save /腾讯云cos
cnpm install moment --save  //时间模块
cnpm install e-commerce_price --save //价格补零




<!-- 正则 -->
手机号码：
/^1[3456789]\d{9}$/
6到20位数字和字母结合:
/^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,20}$/

1.什么是Token？
在计算机身份认证中是令牌（临时）的意思，在词法分析中是标记的意思。一般我们所说的的token大多是指用于身份验证的token

2.为什么使用token?
我们需要每次都知道当前请求的人是谁，但是又不想每次都让他提交用户名和密码，这时就需要有一个等同于用户名密码也能够标识用户身份的东西，即—token.

3.基于Token的身份验证方法
客户端使用用户名和密码请求登录
服务端收到请求，验证登录是否成功
验证成功后，服务端会返回一个Token给客户端，反之，返回身份验证失败的信息
客户端收到Token后把Token用一种方式存储起来,如( cookie / localstorage / sessionstorage / 其他 )
客户端每次发起请求时都会将Token发给服务端
服务端收到请求后，验证Token的合法性，合法就返回客户端所需数据，反之，返回验证失败的信息

