/**
 * 创建模型类
 * 一般都是通过模型类对数据进行 增 删 改 查
 */
const mongoose = require('mongoose');
const userSchema = require('../schemas/users');

let user = mongoose.model('User',userSchema);

module.exports = user;
