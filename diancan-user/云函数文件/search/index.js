// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: '更改为你自己的环境id'
})

const db = cloud.database()
const _ = db.command

const dishes = db.collection('dishes-data')//菜品所有数据

// 云函数入口函数
exports.main = async (event, context) => {
  // 设置模糊字段匹配
  let query = _.or([
    {
      category:db.RegExp({
          regexp: event.Key_words,
          options: 'i',
      })
    },
    {
      name:db.RegExp({
          regexp: event.Key_words,
          options: 'i',
      })
    }
  ])
  const res = await dishes.where(query).get()
  // console.log(res)
  return res.data
}