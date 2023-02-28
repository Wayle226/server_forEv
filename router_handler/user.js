const db = require('../db/index')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../config')

// 注册接口
exports.regUser = (req, res) => {
    // 获取客户端提交的用户信息
    const userinfo = req.body

    // 对表单的数据进行校验,当用户名跟密码为空时
    // if (!userinfo.username || !userinfo.password) {
    //     // return res.send({
    //     //     status: 1,
    //     //     message: '用户名或者密码不合法！'
    //     // })
    //     return res.cc('用户名或者密码不合法！')
    // }
    // 查数据库，注册名是否重复
    const sqlStr = 'select * from ev_users where username=?'
    db.query(sqlStr, userinfo.username, (err, results) => {
        if (err) {
            // return res.send({status: 1, message: err.message})
            return res.cc(err)
        }

        if (results.length > 0) {
            // return res.send({
            //     status: 1,
            //     message: '用户名重复！'
            // })
            return res.cc('用户名已存在！')
        }
        
        // 插入新用户
        // 将客户端发过来的密码加密
        userinfo.password = bcrypt.hashSync(userinfo.password, 10)
        const insertNewUser = 'insert into ev_users set ?'
        db.query(insertNewUser, {
            username: userinfo.username,
            password: userinfo.password
        }, (err, results) => {
            if (err) {
                // return res.send({
                //     status: 1, 
                //     message: err.message
                // })
                return res.cc(err)
            }
            if (results.affectedRows !== 1) {
                // res.send({status: 1, message: '用户注册失败！'})
                return res.cc('用户注册失败！')
            }
            // res.send({status: 0, message: '用户注册成功！'})
            res.cc('用户注册成功！', 0) 
        })
    
    })

}

exports.login = (req, res) => {
    const userinfo = req.body
    const sqlSelectUser = 'select * from ev_users where username=?'

    db.query(sqlSelectUser, userinfo.username, (err, results) => {
        if (err) return res.cc(err) //抛出错误
        if (results.length !== 1) return res.cc('登录失败！') //查询结果不是一条
        const compareResult = bcrypt.compareSync(userinfo.password, results[0].password)
        if (!compareResult) return res.cc('密码错误！')
        
        const user = { ...results[0], password: '', user_pic: '' }
        console.log(user)
        // 对用户信息进行加密，生成Token字符串
        const tokenStr = jwt.sign(user, config.jwtSecretKey, config.expiresIn)
        console.log(tokenStr)
        // 将Token响应给客户端
        res.send({
            status: 0,
            message: '登录成功！',
            token: 'Bearer ' + tokenStr,
        })
    })

    // res.send('login success !')
}