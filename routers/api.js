const express = require('express');
const router = express.Router();
const User = require('../models/User');

/**
 * api模块涉及的路由
 * /				首页
 * /register		用户注册
 * /login			用户登录
 * /comment			评论获取						
 * /comment/post	评论提交
 */

//统一返回格式
let responseData;
router.use((req,res,next) => {
	responseData = {
		code: 0 ,
		message: ''
	}
	next();
});
/**
 * 用户注册
 	前台
	 	1、用户名不能为空
	 	2、密码不能为空
	 	3、两次密码是否一致
	数据库
 		4、用户名是否被注册过
 */
router.post('/user/register',function(req,res,next){
	let userName = req.body.username;
	let password = req.body.password;
	let repassword = req.body.repassword;

	if(userName == ''){
		responseData.code = 1;
		responseData.message = '用户名为空！';
		res.json(responseData);
	}else if(password == ''){
		responseData.code = 2;
		responseData.message = '密码不能为空！';
		res.json(responseData);
	}else if(password != repassword){
		responseData.code = 3;
		responseData.message = '两次密码不一致';
		res.json(responseData);
	}else{
		User.find({
			username: userName 
		}).then((userInfo) => {
			console.log(userInfo);
			console.log(userInfo.length);
			if(userInfo.length != 0){
				responseData.code = 4;
				responseData.message = '用户名已经注册';
				res.json(responseData);
			}else{
				let user = new User({
					username: userName,
					password: password
				});
				return user.save();
			}
		}).then((newUserInfo) => {
			if(newUserInfo){
				responseData.message = '注册成功';
				req.cookies.set('userInfo', JSON.stringify({
					_id:newUserInfo._id,
					username:newUserInfo.username
				}));
				res.json(responseData);
			}
		}).catch(()=>{
			responseData.code = 5;
			responseData.message = '未知错误';
			res.json(responseData);
		})
	}
	//将responseData对象转换为json格式传给前台
	// res.json(responseData);

});
/**
 * 登录验证
 */
router.post('/user/login',(req,res)=>{
	let {username,password} = req.body;
	if(username == '' || password == ''){
		responseData.code = 6 ;
		responseData.message = '户名或密码不能为空！';
		res.json(responseData);
	}else{
		User.find({
			username:username,
			password:password
		}).then((userInfo)=>{
			if(userInfo.length == 1){
				responseData.message = '登录成功！';
				responseData.userInfo = {
					_id:userInfo[0]._id,
					username:userInfo[0].username
				}
				req.cookies.set('userInfo', JSON.stringify(responseData.userInfo));
				res.json(responseData);
			}else{
				responseData.code = 7;
				responseData.message = '用户名或密码错误';
				res.json(responseData);
			}
		})
	}
});

/**
 * 退出
 */
router.get('/user/loginOut',(req,res)=>{
	req.cookies.set('userInfo',null);
	responseData.message = '退出成功';
	res.json(responseData);
})
module.exports = router;
