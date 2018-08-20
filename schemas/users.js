/**
 * 使用mongoose
 * 定义用户数据结构文件
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * 一个new Schema()对应数据库中的一个表
 * 其中的各个属性对应表中的字段
 */
let user = new Schema({
	//用户名
	username: String,
	//密码
	password: String,
	//是否是管理员
	isAdmin:{
		type: Boolean,
		default: false
	}
});

module.exports = user;
