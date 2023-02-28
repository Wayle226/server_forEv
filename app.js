const express = require('express')
const joi = require('joi')

const app = express()

// cors 配置
const cors = require('cors')
app.use(cors())

// 解析表单数据
app.use(express.urlencoded({ extended: false }))

// 响应数据的中间件
app.use((req, res, next) => {
    res.cc = (err, status=1) => {
        res.send({
            status,
            message: err instanceof Error ? err.message : err,
        })
    }
    next()
})

// 导入并使用用户路由模块
const userRouter = require('./router/user')
app.use('/api', userRouter)

// 定义错误级别的中间件
app.use((err, req, res, next) => {
    if (err instanceof joi.ValidationError) return res.cc(err)
    res.cc(err) // 抛出未知（其他）的错误
    // next()
})

app.listen(6666, () => {
    console.log('api server running at http://127.0.0.1:6666')
})