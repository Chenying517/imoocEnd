import redis from 'redis'
import { promisifyAll } from 'bluebird'
import config from './index'

const options = {
  host: config.REDIS.host,
  port: config.REDIS.port,
  password: config.REDIS.password,
  detect_buffers: true,
  retry_strategy: function(options) {
    if (options.error && options.error.code === "ECONNREFUSED") {
      // End reconnecting on a specific error and flush all commands with
      // a individual error
      return new Error("The server refused the connection");
    }
    if (options.total_retry_time > 1000 * 60 * 60) {
      // End reconnecting after a specific timeout and flush all commands
      // with a individual error
      return new Error("Retry time exhausted");
    }
    if (options.attempt > 10) {
      // End reconnecting with built in error
      return undefined;
    }
    // reconnect after 
    return Math.min(options.attempt * 100, 3000);
  }
}

// const client = redis.createClient(options)
const client = promisifyAll(redis.createClient(options))

// 监听redis错误
client.on('error', (err) => {
   console.log('Redis clent errir:'+err)
})

const setValue = (key, value,time) => {
  if (typeof value === 'undefined' || value == '', value == null) {
    return
  }
  if (typeof value === 'string') {
    if (time !== 'nudefinde') {
       client.set(key,value,'EX',time,redis.print)
      
    } else {
      client.set(key, value, redis.print)
    }
    
  } else if (typeof value === 'object') {
    Object.keys(value).forEach((item) => {
      console.log(key, item, value[item])
      client.hset(key, item, value[item], redis.print)
      
    })
  }
  
}

// const { promisify } = require("util");
// const getAsync = promisify(client.get).bind(client);

const getValue = (key) => {
  return client.getAsync(key)
}

const getHValue = (key) => {
  // v8 promisify method use util,must node>v8
  // return promisify(client.hgetall).bind(client)(key)

  // use bluebird async method
  return client.hgetallAsync(key)
}

const delValue = (key) => {
  client.del(key, (err, res) => {
    if (res === 1) {
      console.log('delete successfuly')
    } else {
      console.log('delete redis key error:'+err)
    }
    
  })
  return client.delAsync(key)
}

export {
  client,
  setValue,
  getValue,
  getHValue,
  delValue
}