const express = require('express')
const expressJoi = require('@escook/express-joi')

const router = express.Router()

const user_handler = require('../router_handler/user')

// 导入验证数据中间件
const { reg_login_schema } = require('../schema/user')

// 注册新用户接口
router.post('/reguser', expressJoi(reg_login_schema), user_handler.regUser)
// 登录接口
router.post('/login', expressJoi(reg_login_schema), user_handler.login)


module.exports =  router