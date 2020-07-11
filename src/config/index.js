/**
 * 项目的配置文件
 */

 //mongodb 配置
const DB_URL = 'mongodb://test:123456@localhost:27017/testdb'


//redis缓存配置
const REDIS = {
  host: 'localhost',
  port: 15001,
  password: '123456',
}


//jw密钥
const JWT_SECRET='hkahfh800q@#80d'

export default {
  DB_URL,
  REDIS,
  JWT_SECRET
}