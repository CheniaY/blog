/**
 * 创建模型类
 * 一般都是通过模型类对数据进行 增 删 改 查
 */
const mongoose = require('mongoose');
const contentSchema = require('../schemas/content');

let content = mongoose.model('Content',contentSchema);

module.exports = content;