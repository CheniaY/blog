const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Category = require('../models/Category');
const Content = require('../models/Content');

// router.get('/user', function(req,res,next){
// 	res.send('User');
// })
/**
 * admin 模块涉及的路由
 * 		 /			首页
 * 用户管理
 		 * /user'			用户列表
 * 分类管理
		 * /category		分类列表
		 * /category/add	分类添加
		 * /category/edit	分类修改
		 * /category/delete	分类删除
 * 文章内容管理
		 * /article			内容列表
		 * /article/add		内容添加
		 * /article/edit	内容修改
		 * /article/delete	内容删除
 * 评论内容管理
		 * /comment			评论列表
		 * /comment/delete	评论删除
 */

router.use((req,res,next)=>{
	if(req.userInfo.isAdmin == false || Object.keys(req.userInfo).length == 0){
		res.send('只有管理员可进入该页面！');
		return;
	}else{
		next();
	}
});
router.get('/',(req,res,next)=>{
	res.render('admin/index',{
		userInfo: req.userInfo
	});

});
router.get('/user',(req,res,next)=>{
	/**
     * 读取目前的用户数据
     * limit(Number) : 限制获取的数据条数
     * skip() : 忽略前多少条数据
     * users : 所有的用户信息
     * count : 查询到的总数
     * pages : 总页数
     * limit : 每页显示条数
     * page : 当前页
     */

    let page = Number(req.query.page || 1);
    let limit = 5;
    let skip = 0;
    let pages = 0;
    // User 返回查询的条数
    User.count().then((count)=>{
        pages = Math.ceil( count/limit );
        page = Math.min( page, pages );
        page = Math.max( page, 1 );
        let pagePre = page-1;
        let pageNext = page+1;
        skip = (page-1)*limit;
        User.find().limit( limit ).skip( skip ).then((users)=>{
            res.render('admin/user_index',{
                userInfo: req.userInfo,
                users,
                count,
                pages,
                limit,
                page,
                urlPre:'/admin/user?page='+pagePre,
                urlNext:'/admin/user?page='+pageNext
            });
        }) 
    });   
});

router.get('/category',(req,res,next)=>{
    Category.count().then((count)=>{
        Category.find().then((categorys)=>{
            res.render('admin/category_index',{
                 userInfo: req.userInfo,
                 categorys,
                 count
            });
        });
    });
});

/**
 *获取增加类别页面 get
 */
router.get('/category/add',(req,res,next)=>{
    res.render('admin/category_add');
});

/**
 *保存增加信息页面  post
 */
router.post('/category/add',(req,res,next)=>{
    console.log(req.body);
    if(req.body.name == ''){
        res.render('admin/err',{
                message:'类别名不能为空'
        });
        return;
    }else{
        Category.find({
        name: req.body.name 
        }).then((category)=>{
            if(category.length !== 0){
                res.render('admin/err',{
                    message: '该类别已经存在'
                });
                return;
            }else{
                return new Category({
                    name: req.body.name
                }).save();
            }
        }).then((newCategory)=>{
            res.render('admin/success',{
                userInfo: req.userInfo,
                message:'类别增加成功!',
                url: '/admin/category'
            });
        })
    }
});
/*
获取分类修改页面  get
 */
router.get('/category/edit',(req,res,next)=>{
    res.render('admin/category_edit');
});
/*
对分类进行修改  post
 */
router.post('/category/edit',(req,res,next)=>{
    let id = req.query.id;
    let name = req.body.name;
    if(name == ''){
        res.render('admin/err',{
            userInfo: req.userInfo,
            message: '修改的分类名称不能为空',
        })
        return;
    }else{
        Category.find({
            _id: id
        }).then((category)=>{
            if(category.name == name){
                res.render('admin/success',{
                    userInfo: req.userInfo,
                    message: '修改成功！',
                    url:'/admin/category'
                });
                return Promise.reject();
            }else{
                return Category.findOne({_id: {$ne: id}, name});
            }
        }).then((sameCategory)=>{
            if(sameCategory){
                res.render('admin/err',{
                    userInfo: req.userInfo,
                    message: '存在同名的分类！',
                });
                return Promise.reject();
            }else{
               return Category.update({_id: id},{name:name});
            }
        }).then(()=>{
            res.render('admin/success',{
                userInfo: req.userInfo,
                message: '分类修改成功',
                url: '/admin/category'
            });
        }).catch((ex)=>{
            console.log('出现错误！')
        });
    }
});

/*
删除分类
 */
router.get('/category/delete',(req,res,next)=>{
    let _id = req.query.id;
    Category.remove({_id}).then((delCategory)=>{
        res.render('admin/success',{
            userInfo: req.userInfo,
            message: '删除分类成功',
            url: '/admin/category'
        }); 
    });
});

/*
 获取所有博客内容首页 get
 */
router.get('/content',(req,res,next)=>{
    let page = Number(req.query.page || 1);
    let limit = 5;
    let skip = 0;
    let pages = 0;
    // Content 返回查询的条数
    Content.count().then((count)=>{
        pages = Math.ceil( count/limit );
        page = Math.min( page, pages );
        page = Math.max( page, 1 );
        let pagePre = page-1;
        let pageNext = page+1;
        skip = (page-1)*limit;
        Content.find().sort({addTime: -1}).limit( limit ).skip( skip ).populate(['category','user']).then((contents)=>{
            res.render('admin/content_index',{
                userInfo: req.userInfo,
                contents,
                count,
                pages,
                limit,
                page,
                urlPre:'/admin/content?page='+pagePre,
                urlNext: '/admin/content?page='+pageNext,
            });
        }); 
    });   
});

/*
获取添加内容首页 get
 */
router.get('/content/add',(req,res,next)=>{
    Category.find().then((categories)=>{
        res.render('admin/content_add',{
             categories
        })
    });
});

/*
提交添加的内容 post
 */
router.post('/content/add',(req,res,next)=>{
    let {category,title,description,content} = req.body;
    if(title == ''){
        res.render('admin/err',{
            userInfo: req.userInfo,
            message:'标题不能为空'
        });
    }else if(category == ''){
        res.render('admin/err',{
            userInfo:req.userInfo,
            message:'所属栏目不能为空'
        })
    }else{
        new Content({
        category: category,
        user: req.userInfo._id.toString(),
        title: title,
        decription: description,
        content: content,
        addTime: new Date()
        }).save().then((newContent)=>{
                console.log(newContent);
                res.render('admin/success',{
                message:'提交成功！',
                url:'/admin/content'
             })
        });
    }
});

/*
    获取编辑内容页面 -get
 */
router.get('/content/edit',(req,res,next)=>{
    let id = req.query.id;
    Category.find().then((categories)=>{
         Content.findOne({
            _id: id
        }).populate(['category','user']).then((content)=>{
            res.render('admin/content_edit',{
                 userInfo: req.userInfo,
                 content: content,
                 categories: categories
            });
        });
    });

});

/*
    提交编辑内容 -post
 */
router.post('/content/edit',(req,res,next)=>{
    let id = req.query.id;
    let updateContent = req.body;
    console.log(updateContent);

    Content.update({_id:id},{
            category: updateContent.category,
            title: updateContent.title,
            decription: updateContent.description,
            content: updateContent.content,
            addTime: new Date()
    }).then(()=>{
        res.render('admin/success',{
            userInfo: req.userInfo,
            message:'修改成功',
            url:'/admin/content'
    });

    })
  
})
module.exports = router;