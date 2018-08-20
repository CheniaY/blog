const express = require('express');
const swig = require('swig');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Cookies = require('cookies');

const User = require('./models/User');

const app = new express();


app.use('/public',express.static(__dirname + '/public'));

//bodyParser设置，设置完后会自动在app.get里req中会有一个body属性,body里保存着post中提交的数据
app.use(bodyParser.urlencoded({extended:true}));

//设置cookies  这相当于一个中间件，所有前台过来的路由的都会过这个再接着往下执行
//将next()写到if判断里 可避免异步问题
app.use((req,res,next) => {
	req.cookies = new Cookies(req,res);
	req.userInfo = {};
	if(req.cookies.get('userInfo')){
		try{
			req.userInfo = JSON.parse( req.cookies.get('userInfo'));
			User.findById(req.userInfo._id).then((userInfo)=>{
				req.userInfo.isAdmin = Boolean( userInfo.isAdmin );
			next();
			});
		}catch(e){
			next();
		}
	}else{
		next();
	}
	
});

app.engine('html',swig.renderFile);
app.set('views','./views');
app.set('view engine','html');

swig.setDefaults({cache:false});

/**
 * 根据不同的功能划分模块
 */
app.use('/admin',require('./routers/admin'));
app.use('/api',require('./routers/api'));
app.use('/',require('./routers/main'));

mongoose.connect('mongodb://localhost:8090/blog',(err) => {
	if(err){
		console.log('连接失败！');
	}else{
		console.log('连接成功！');
		app.listen(8081);
	} 
})



