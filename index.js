const express = require("express");
const PORT = 3000;
const app = express();
const expressLayouts = require('express-ejs-layouts');


// set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');




app.use(expressLayouts);
// extract style and scripts from sub pages into the layout
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);





app.listen(PORT, function (err) {
  
    if(err) {
       console.log("error in starting the server");
       return;
    }

     console.log("server started on port no.", PORT);
});


