const Koa = require('koa')
const app = new Koa()
const json = require('koa-json')
const bodyParser = require('koa-bodyparser')
const router = require('koa-router')()//实例化new路由
const cors = require('koa2-cors')
const abnormal = require('./config/abnormal.js')

app.use(cors())
app.use(json())
app.use(bodyParser())
app.use(abnormal)
// 全局异常处理


// 注册；登录
const login = require('./router/login/login.js')
// 商家设置
const uploadres = require('./router/merchant-infor/infor.js')
// 菜品管理
const dish = require('./router/dish-manage/dish')
// 订单
const oreder = require('./router/order/order.js')
// 桌号管理
const code = require('./router/qr-code/code.js')

// 配置路由接口
router.use('/api',login)
router.use('/api',uploadres)
router.use('/api',dish)
router.use('/api',oreder)
router.use('/api',code)


/* 启动路由 */
app.use(router.routes()).use(router.allowedMethods())

// 自定义启动端口5000：不能跟其他程序的启动端口一样，否则造成端口冲突
app.listen(5000);
console.log('成功')
