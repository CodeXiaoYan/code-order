
const url = 'http://localhost:5000/api/'

const urls = class{
	static m(){
		// 注册接口
		const register = `${url}register/`
		// 登录接口
		const login = `${url}login/`
		// 获取商家信息
		const obtainshop = `${url}obtainshop/`
		// 上传图片接口
		const uploadres = `${url}uploadres/`
		// 上传商家信息
		const uploadshop = `${url}uploadshop/`
		// 修改商家信息
		const modifyshop = `${url}modifyshop/`
		// 获取菜品类目
		const obtaincate = `${url}obtaincate/`
		// 添加类目
		const addcategory = `${url}addcategory/`
		// 获取菜品
		const obtaindishes = `${url}obtaindishes/`
		// 获取菜品单位
		const obtainunit = `${url}obtainunit/`
		// 添加菜品单位
		const dishunit = `${url}dishunit/`
		// 上架菜品
		const uploaddishes = `${url}uploaddishes/`
		// 修改上架的菜品
		const modifydishes = `${url}modifydishes/`
		// 下架菜品
		const fromsale = `${url}fromsale/`
		// 获取订单
		const obtainorder = `${url}obtainorder/`
		// 查看详细菜单
		const vieworder = `${url}vieworder/`
		// 接单
		const receiving = `${url}receiving/`
		// 结账
		const checkout = `${url}checkout/`
		// 桌号管理
		const qrcode = `${url}qrcode/`
		// 获取桌号
		const getqrcode = `${url}getqrcode/`
		// 数据分析：七天销售额
		const salesvolume = `${url}salesvolume/`
		return{
			register,
			login,
			obtainshop,
			uploadres,
			uploadshop,
			modifyshop,
			obtaincate,
			addcategory,
			obtaindishes,
			obtainunit,
			dishunit,
			uploaddishes,
			modifydishes,
			fromsale,
			obtainorder,
			vieworder,
			receiving,
			checkout,
			qrcode,
			getqrcode,
			salesvolume
		}
	}
}
export default urls