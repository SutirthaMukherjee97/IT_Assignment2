const jwt = require('jsonwebtoken')

const adminAuthorizationMiddleware = (req,res,next)=>{
    const token = req.cookies.admin_access_token;
    if(!token)
    {
        console.log('Not authorized');
        return res.status(403).redirect('/admin/login');
    }
    try{
        const adminObj = jwt.verify(token, process.env.ADMIN_SECRET);
        const {username, password} = adminObj;
        if(username !== process.env.ADMIN_USERNAME || password !== process.env.ADMIN_PASSWORD){
            res.status(401).send('Invalid Credentials');
        }
        req.adminUsername = username;
        return next();
    } catch {
        console.log('Not authorized');
        res.status(403).redirect('/admin/login');
    }
}

module.exports = {adminAuthorizationMiddleware}