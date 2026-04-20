const express = require('express');
const authJWT = require('../middleware/auth');
const router = express.Router();

const {signUp, signIn, deleteUser, signOut, userInfo, updateUser } = require('../controllers/usersController');

router.post('/signup', signUp);
router.post('/signIn', signIn);
router.delete('/delete', authJWT, deleteUser);
router.post('/signout', authJWT, signOut);
router.get('/me', authJWT, userInfo);
router.put('/update', authJWT, updateUser);


module.exports = router;
