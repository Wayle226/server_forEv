const joi = require('joi')

// 用户名跟密码的验证规则
const username = joi.string().alphanum().min(1).max(10).required()
const password = joi.string().pattern(/^[\S]{6,12}$/).required()

// 定义验证注册和登录表单数据的规则
exports.reg_login_schema = {
    body: {
        username,
        password,
    }
 }
