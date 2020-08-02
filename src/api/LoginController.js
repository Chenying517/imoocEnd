import send from '../config/MailConfig'
import moment from 'moment'
import jsonwebtoken from 'jsonwebtoken'
import bcrypt from 'bcrypt'


import config from '../config'
import { checkCode } from '../common/utils'
import UserModel from '../model/user'

class LoginController {
  constructor() { }
  // 忘记密码
  async forget (ctx) {
    const { body } = ctx.request
    console.log(body)
    try {
      // body.username -> database -> email
      let result = await send({
        code: '1234',
        expire: moment()
          .add(30, 'minutes')
          .format('YYYY-MM-DD HH:mm:ss'),
        email: body.username,
        user: 'Brian',
      })
      ctx.body = {
        code: 200,
        data: result,
        msg: '邮件发送成功',
      }
    } catch (e) {
      console.log(e)
    }
  }
  // 登录
  async login (ctx) {

    // 接收用户的数据
    const { body } = ctx.request
    let sid = body.sid
    let code = body.code;
    //验证图片验证码的时效性/正确性
    let result = await checkCode(sid, code)
    if (result==true) {
      // 验证用户名密码是否正确
      console.log('checkCode ok!')
      // 查询mongodb 数据库
      let checkUserPassword = false
      let user = await UserModel.findOne({ username: body.username })
      console.log(user)
      if (await bcrypt.compare(body.password, user.password)  ) {
        checkUserPassword = true
      }

      if (checkUserPassword) {
        //验证通过 返回token
        let token = jsonwebtoken.sign({ _id: 'cy' }, config.JWT_SECRET, {
          expiresIn: '1d'
        })
        ctx.body = {
          code: 200,
          token: token
        }
        console.log('hello login ')
      } else {
        // 用户名密码验证失败，返回提示
        ctx.body = {
          code: '401',
          msg: '用户名密码错误，请检查！'
        }
      }

    } else {
      ctx.body = {
        code: 401,
        msg: '图片验证码不正确，请检查！'
      }
    }




  }

  // 注册
  async register (ctx) {
    // 接收用户数据
    const { body } = ctx.request;
    let username = body.username,
      name = body.name,
      password =await bcrypt.hash( body.password,5),
      code = body.code,
      sid = body.sid,
      check = true;
    debugger
    var msg = {};

    // 第一步验证验证码是否正确活着超时 
    let result = await checkCode(sid, code)
    if (result) {
      debugger
      // 查询mongodb数据库  判断邮箱是否已被注册
      let user1 =await UserModel.findOne({ username: username })
      if (user1 !=null&&typeof user1.username != 'undefind') {
        msg.username = '邮箱已被注册，可以用邮箱找回密码'
        check=false
      }
      // 查询mongodb数据库，判断用户名是否已被注册
      let user2 = await UserModel.findOne({ name: username })
      if (user2 != null &&typeof user2.name != 'undefind') {
        msg.name = '用户名已被注册，请更换用户名重试'
        check = false
      }

      if (check) {
      // 写入数据到数据库
        let user = new UserModel({
          username: username,
          name: name,
          password: password,
          createtime:moment().format('YYYY-MM-DD HH:mm:ss')
        })
        let createuserresule = await user.save()
        ctx.body = {
          code: 200,
          data: createuserresule,
          msg:'注册成功'
        }
        return

      }

    } else {
      debugger
      msg.code = "图片验证码不正确，请检查"
    }
    ctx.body = {
      code: 500,
      msg
    }
  }
}

export default new LoginController()
