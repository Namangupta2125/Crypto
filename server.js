const express = require("express");
const app = express();
const https = require("https");
const cors = require("cors");
const fs = require('fs')
const path = require('path')
require('dotenv').config()

// importing functions and router and scheduler
const {dbConfig} = require(path.join(__dirname,'config','dbConfig.js'));
const coinRouter = require(path.join(__dirname,'Routers','coinRouter'))
const {schedulerInit}  = require(path.join(__dirname,"scheduler.js"))


// builtin middlewares
app.use(cors());
app.use(express.json());


//routers
app.use('/',coinRouter)



// connection
https.createServer(
    {
      key: fs.readFileSync("./key.pem"), 
      cert: fs.readFileSync("./cert.pem"), 
    },
    app
  ).listen(process.env.PORT || 3000, async () => {
    await dbConfig();
    schedulerInit();
    console.log("server is listening....");
  }); 
 