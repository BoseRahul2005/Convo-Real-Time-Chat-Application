const jwt=require("jsonwebtoken");


const userAuth=(req, res, next) => {
    const {token}=req.cookies;
    if(!token){
        return res.json({success:false, message:"Access denied. Login again."});
    }
    //Hello normalized files

    try{
        const tokenDecoded=jwt.verify(token, process.env.JWT_SECRET);
        if(tokenDecoded.id){
            req.userId=tokenDecoded.id;
        }else{
            return res.json({success:false, message:"Access denied. Login again."});
        }
        next();
    }catch(err){
        console.log(err);
        res.json({success:false, message:"Invalid token."});
    }
}

module.exports=userAuth;
