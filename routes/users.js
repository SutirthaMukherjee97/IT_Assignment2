var express = require('express');
const fileUpload = require('express-fileupload')
var router = express.Router();
const {users, files} = require('../data/users')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken');
const { authorizationMiddleware } = require('../middleware/AuthMiddleware');

router.use(fileUpload())
router.use(cookieParser());


/* GET users listing. */
router.get('/signup', function(req, res, next) {
  let isAdminLoggedIn = false;
  if(req.cookies.admin_access_token) isAdminLoggedIn = true
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
        if(loggedIn) return res.send('Already Logged In')
    }
  res.render('signup',{ isAdminLoggedIn : true, isUserLoggedIn : false })
});
router.get('/login', function(req, res, next) {
  let isAdminLoggedIn = false;
  if(req.cookies.admin_access_token) isAdminLoggedIn = true
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
        if(loggedIn) return res.send('Already Logged In')
    }
  
  res.render('login',{ isAdminLoggedIn : true, isUserLoggedIn : false })
});

router.get('/logout',(req, res)=>{
  if(!req.cookies.access_token) {
    return res.redirect('/users/login')
  }
  return res.clearCookie('access_token')
            .status(200)
            .redirect('/')
})

router.post('/signup', (req, res)=>{
  const { user_name, password } = req.body;
  console.log(user_name,password);
  if(!user_name){
    return res.redirect('/users/signup')
  } else if(!password) {
    return res.redirect('/users/signup')
  }
  const newUser = {
    username : user_name,
    password,
    files : []
  }
  const token = jwt.sign(user_name, process.env.SECRET);
  users.push(newUser);
  console.log(users);
  res
  .cookie("access_token", token, {
    httpOnly: true,
  })
  res.redirect(`/users/${user_name}`)
  
})

router.post('/login',  (req, res)=>{
  const { user_name, password } = req.body;
  console.log(user_name,password);
  if(!user_name){
    return res.redirect('/users/signup')
  } else if(!password) {
    return res.redirect('/users/signup')
  }
  const user = users.find((user)=>{return user.username === user_name})
  if(!user) res.redirect('/users/signup')
  if(user.password !== password) res.redirect('users/login')
  const token = jwt.sign(user_name, process.env.SECRET);
  res.cookie("access_token", token, {
    httpOnly: true,
  })

  return res.redirect(`/users/${user_name}`)
  
})

router.get('/:username',authorizationMiddleware,(req, res)=>{
  const {username} = req.params;
  if(username !== req.username){
    // console.log(req)
    // console.log(username, req.username);
    return res.status(403).json('Wrong username')
  }
  const user = users.find((user)=>{
    return user.username === username;
  })
  if(!user){
    return res.redirect('/users/signup');
  }
  let isAdminLoggedIn = false;
  if(req.cookies.admin_access_token) isAdminLoggedIn = true

  return res.render('user',{ user, isAdminLoggedIn, isUserLoggedIn : true })
})
router.get('/:username/upload',authorizationMiddleware,(req, res)=>{
  const { username } = req.params;
  console.log(users);
  const user = users.find((user)=>{
    return user.username === username
  })
  if(!user){
    return res.redirect('/users/signup')
  }
  let isAdminLoggedIn = false;
  if(req.cookies.admin_access_token) isAdminLoggedIn = true
  return res.render('upload', { user :  user, isAdminLoggedIn, isUserLoggedIn : true});
})

router.post('/:username/upload',authorizationMiddleware,(req, res)=>{
  const {username} = req.params;
  const user = users.find((user)=>{
    return user.username === username
  })
  if(!user){
    return res.redirect('/users/signup')
  }
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }
  const file = req.files.uploadedFile;
  const uploadPath = appRoute + '/public/files/' + file.name;
  console.log(file)
  file.mv(uploadPath, function(err) {
    if (err)
      return res.status(500).send(err);

    user.files.push(file)
    files.push(file)
    return res.redirect('/users/'+username);
  });

})


// router.get('/files/:file', function(req, res, next){
//   res.download(req.params.file, { root: FILES_DIR }, function (err) {
//     if (!err) return; // file sent
//     if (err.status !== 404) return next(err); // non-404 error
//     // file for download not found
//     res.statusCode = 404;
//     res.send('Cant find that file, sorry!');
//   });
//   res.send('file downloaded')
// });



module.exports = router;
