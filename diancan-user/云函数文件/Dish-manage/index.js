// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: '改为你自己的环境id'
})


const db = cloud.database()
const _ = db.command

const dishes = db.collection('dishes-data')//菜品所有数据


// 云函数入口函数event:可以接到前端传来的值
exports.main = async (event, context) => {
// 1.请求数据库的菜品类目的数据
// 2.请求所有菜品的数据
  try {
      const res_dis = await dishes.where({onsale:true}).get()
      
      let newdata = {}
      let cate_data = []
      res_dis.data.forEach((item,index)=>{
        let {category,cid,...data} = item
        if(!newdata[cid]){
          newdata[cid]  = {
            category,
            cid,
            good_query:[]
          }
          cate_data.push({
            cid,count:0,sele_quantity:0,value:category,
            label:category,_id:item._id
          })
        }
        newdata[cid].good_query.push(data)
      })
      let list = Object.values(newdata)
      
      return{
        res_cate:cate_data,
        res_dis:list
      }

  } catch (error) {
    return error
  }

}