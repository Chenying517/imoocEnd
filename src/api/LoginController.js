import send from '../config/MailConfig'
import moment from 'moment'
import jsonwebtoken from 'jsonwebtoken'
import config from '../config'
import { checkCode } from '../common/utils'
import  UserModel  from '../model/user'

class LoginController {
  constructor() { }
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

  async login (ctx) {

    // 接收用户的数据
    const { body } = ctx.request
    let sid = body.sid
    let code = body.code;
    //验证图片验证码的时效性/正确性
    let result = await checkCode(sid, code)
    if (result) {
      // 验证用户名密码是否正确
      console.log('checkCode ok!')
      // 查询mongodb 数据库
      let checkUserPassword = false
      let user = await UserModel.findOne({ username: body.username })
      console.log(user)
      if (user.password == body.password) {
        checkUserPassword=true
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
}

export default new LoginController()
