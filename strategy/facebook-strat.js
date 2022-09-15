const FacebookStrategy=require('passport-facebook');
const User=require('../models/User');
const bcrypt=require('bcryptjs')
opts=
{
    clientID: 1730412367304237,
    clientSecret: '3e5ca655807bcb4a09af5c3966f3fd50',
    callbackURL: "https://cryptic-plains-60700.herokuapp.com/auth/facebook/secrets",
    profileFields: ['id', 'displayName', 'photos', 'email']
    // ,'user_mobile_phone'
}
module.exports=passport=>{passport.use(new FacebookStrategy(opts,
 (accessToken,RefershToken,profile,done)=>
{
//   console.log(profile);
console.log(accessToken)
  User.findOne({username:profile.displayName})
  .then((user)=>
  {

      if(user)
      {
          console.log('User already existed');
      }
      else
      {
          let ee=null;
          ee=profile.emails[0].value;
         const newUser= new User(
              {
                  username:profile.displayName,
                  FbId:profile.id,
                  email:ee,
                  password:'Fb123'
              })
              bcrypt.genSalt(10,(err,slat)=>
              {
                bcrypt.hash(newUser.password,slat,(err,hash)=>
                {
                    if(err)
                            {
                                res.redirect("/");
                            }
                            else
                            {
                                newUser.password=hash;
                                newUser.save()
                                .then((newUser)=>{console.log(`User was succesfully saved`)})
                                .catch((err)=>console.log(err))
                            }
                })
              })

      }
  })
  .catch((err)=>console.log(err));
  return done(null,profile);
}))};
