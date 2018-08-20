/**
 * 应用程序的启动（入口）文件
 */

const express = require('express');
//加载模板处理模块
const swig = require('swig');
/**
 * 创建应用
 * 类似于node中的http模块
 */
const app = express();

/**
 * 设置静态文件托管
 * 当用户访问的url以/public开始，那么直接返回对应__dirname+'/public'下的文件
 * 一般用于前端请求js或者css文件时
 */
app.use('/public',express.static(__dirname + '/public'));

/**
 * 配置应用模板
 * 相当于加载动态页面的方式
 * 定义当前应用使用的模板引擎
 * 参数一：模板引擎的名称，同时也是模板文件的后缀
 * 参数二：用于解析处理模板内容的方法（即用来解析.html页面的方法）
 */
app.engine('html',swig.renderFile);

/**
 *设置模板文件存放的目录
 *第一个参数必须是views
 *第二个参数是目录 
 */
app.set('views','./views');

/**
 * 注册所使用的模板引擎
 * 参数一：必须是view engine
 * 参数二:与app.engine方法中定义的模板引擎的名称（第一参数）一致
 */
app.set('view engine','html');

/**
 *在开发过程中,取消模板缓存
 *catch默认是true
 */
swig.setDefaults({cache:false});

/*
 首页的登录路由
 动态文件的处理
 */
app.get('/',function(req,res,next){

	/**
	 * 读取views目录下的指定文件，解析并返回给客户端
	 * 参数一：表示模板的文件，相对于app.set方法中配置的目录，可以不加后缀
	 * 参数二：传递给模板使用的数据
	 */
	res.render('index');
	
})


//监听端口
app.listen(8080);
