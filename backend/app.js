const express = require("express");
const session = require('express-session');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(session({
  secret: 'lalala',  
  resave: false,             
  saveUninitialized: false,  
  cookie: { 
    secure: false,           
    maxAge: 1000 * 60 * 60    
  }
}));


app.use(cors({
  origin: ['http://localhost:3000'],
  credentials: true}));




const router = require("./routes");
app.use('/api/v1', router);
app.listen(3001, () => {
  console.log("server is running at http://localhost:3001");
});

