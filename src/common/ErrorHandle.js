export default (ctx, next) => {
  return next().catch((err) => {
    if (401 == err.status) {
      ctx.status = 401;
      ctx.body = {
        code: 401,
        message:'Protected resource, use Authorization header to get access\n'
      }
    } else {
      debugger
      ctx.status = err.status || 500
      ctx.body = Object.assign({
        code: ctx.status,
        msg: err.message,
        stack: err.stack
      }, process.env.NODE_ENV == 'development' ? {stack:err.stack}:'') 
    }
  });
}