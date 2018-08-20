/**
 * 使用mongoose
 * 定义用户数据结构文件
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let content = new Schema({
	category: {
		//引用类型
		type: mongoose.Schema.Types.ObjectId,
		//引用自哪个表
		ref: 'category'
	},
	user: {
		type:mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	title: String,
	decription: {
		type: String,
		default: ''
	},
	content: {
		type: String,
		default: ''
	},
	addTime: {
		type: Date,
		default: new Date()
	},
	view: {
		type: Number,
		default:0
	}


});

module.exports = content;
