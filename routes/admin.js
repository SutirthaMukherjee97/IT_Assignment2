const express = require('express');
const cookieParser = require('cookie-parser')
const {users} = require('../data/users')
const jwt = require('jsonwebtoken')
const { adminAuthorizationMiddleware } = require('../middleware/AdminMiddleware');


const router = express.Router();
router.use(cookieParser())


router.get('/', adminAuthorizationMiddleware,(req, res)=>{
    let isUserLoggedIn = false;
    const token = req.cookies.access_token
    if(token){
        let loggedIn = true;
        try{
          const user = jwt.verify(token, process.env.SECRET);
          console.log(user)
        } catch {
          console.log('Not authorized');
          loggedIn = false;
        }
        if(loggedIn) isUserLoggedIn = true
    }
    res.render('admin',{ users, adminUsername : req.adminUsername, isAdminLoggedIn : true, isUserLoggedIn })
})

router.get('/login',(req, res)=>{
    let isUserLoggedIn = false;
    const token = req.cookies.access_token
    if(token){
        let loggedIn = true;
        try{
          const user = jwt.verify(token, process.env.SECRET);
          console.log(user)
        } catch {
          console.log('Not authorized');
          loggedIn = false;
        }
        if(loggedIn) isUserLoggedIn = true
    }
    res.render('adminLogin',{isUserLoggedIn})
})

router.post('/login',(req, res)=>{
    const {username, password} = req.body;
    if(username !== process.env.ADMIN_USERNAME || password !== process.env.ADMIN_PASSWORD){
        return res.status(401).redirect('/admin/login');
    }
    const token = jwt.sign({ username, password },process.env.ADMIN_SECRET);
    res.cookie('admin_access_token', token, { httpOnly:true })

    return res.redirect('/admin');
})

router.get('/logout',(req, res)=>{
    if(!req.cookies.admin_access_token) {
        return res.redirect('/admin/login')
      }
      return res.clearCookie('admin_access_token')
                .status(200)
                .redirect('/')
})

module.exports = router;