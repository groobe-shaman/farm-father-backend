const rateLimit=require('express-rate-limit')


const otpRateLimiter=rateLimit({
    windowMs:10*60*1000,
    max:6,
    message:"Too many otp requests, Please try again after 15 Minutes"
  })

  module.exports={
    otpRateLimiter
  }