const express = require('express');
const authJWT = require('../middleware/auth');
const {authLimiter} = require('../middleware/rateLimiters');
const router = express.Router();

const {signUp, signIn, deleteUser, signOut, userInfo, updateUser, loggedIn } = require('../controllers/usersController');

router.post('/signup', authLimiter, signUp);
router.post('/signIn', authLimiter, signIn);
router.delete('/delete', authJWT, deleteUser);
router.post('/signout', authJWT, signOut);
router.get('/me', authJWT, userInfo);
router.get('/loggedIn', loggedIn);
router.put('/update', authJWT, updateUser);


module.exports = router;
