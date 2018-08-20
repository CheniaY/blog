const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const Content = require('../models/Content');


/**
 * main模块涉及的路由
 * /  				首页
 * /register		用户注册
 * /login			用户登录
 * /comment			评论获取
 * /comment/post	评论提交				
 */

/**
  获取首页
  render 第二个参数是分配给模板（即 页面）使用的数据
 */
router.get('/',function(req,res,next){
	// let categories =[];
	Category.find().then((categories)=>{
		let page = Number(req.query.page || 1);
		let categoryType =req.query.type || '';
		let pages =0;
		let limit = 3;
		let skip = 0;
		let where = {};
		if(categoryType != '') where.category = categoryType;
		Content.where(where).count().then((count)=>{
			pages = Math.ceil(count/limit);
			page = Math.min(page,pages);
			page = Math.max(1,page);
			// let pagePre = page-1;
	  //       let pageNext = page+1;
	        skip = (page-1)*limit;
	        Content.where(where).find().limit(limit).skip(skip)
	        .populate(['category','user']).then((contents)=>{
			    console.log('打印contents');
				console.log(contents);
				res.render('main/index',{
					userInfo: req.userInfo,
					categories: categories,
					contents: contents,
					pages:pages,
					page: page,
					categoryType:categoryType
				});
	        });

		});
	});
});

module.exports = router;