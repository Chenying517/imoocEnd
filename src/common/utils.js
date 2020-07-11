
import { getValue } from '../config/ReidsConfig'


const checkCode = async (sid, code) => {
  
  const redisDate = await getValue(sid)
  if (redisDate != null) {
    if (redisDate.toLowerCase() == code.toLowerCase()) {
      return true
    } else {
      return false
    }
    
  } else {
    return false
  }
}

export {
  checkCode
}