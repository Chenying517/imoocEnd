import svgCaptcha from 'svg-captcha'
import { setValue, getValue, getHValue, delValue } from '../config/ReidsConfig'


class PublicController {
  constructor() { }
  // 获取验证码
  async getCaptcha (ctx) {
    const body = ctx.request.query
    console.log(body)
    const newCaptca = svgCaptcha.create({
      size: 4,
      ignoreChars: '0o1il',
      color: true,
      noise: Math.floor(Math.random() * 5),
      width: 100,
      height: 38,
    })
    // 设置图片验证码的超时时间是一天
    setValue(body.sid, newCaptca.text,60*10*24);
    // console.log(newCaptca)
    ctx.body = {
      code: 200,
      data: newCaptca.data,
    }
  }
  async login () {
    //接收用户的数据
    //验证验证码的时效性/正确行
    //验证用户名密码是否正确
  }
} 

export default new PublicController()
