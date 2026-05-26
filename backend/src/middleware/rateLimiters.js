const rateLimit = require('express-rate-limit')

// Limiting all requests to 100 per 15 minutes for rate limiting purposes only
// Trust Proxy is specifically for Render so all requests aren't seen as coming from render's proxy.
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100,    
  trustProxy: 1,              
  message: { error: 'Too many requests, please try again later.' }
})
// Limiting sign up and login attempts to 10 per 15 minutes to prevent brute-force attacks
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,     
  trustProxy: 1,              // only 10 attempts per 15 minutes
  message: { error: 'Too many login attempts, please try again later.' }
})
module.exports = {
  generalLimiter,
  authLimiter,
}