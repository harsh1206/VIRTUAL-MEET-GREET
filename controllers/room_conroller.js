const {getRoomUsers} = require('../utils/user');

module.exports.room = function(req,res){
    
    console.log(req.query);

   return res.render('room',{
          
       title:"Room",
       
   })

   
}

module.exports.split = function(req,res){
        
    const users = getRoomUsers(req.query.room);


}